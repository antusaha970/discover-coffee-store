import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import cls from "classnames";
import Image from "next/image";
import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from "../../lib/coffee-store";
import { StoreContext } from "../_app";
import { fetcher, isEmpty } from "../../utils";
import useSWR from "swr";

export async function getStaticProps(staticProps) {
  const coffeeStores = await fetchCoffeeStores();
  const { params } = staticProps;
  const findStore = coffeeStores.find(
    (coffeeStore) => coffeeStore.id.toString() == params.id
  );
  return {
    props: {
      coffeeStore: findStore ? findStore : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );
  const [votingCount, setVotingCount] = useState(0);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStoreCnt) => {
    try {
      const { id, name, address, neighbourhood, imgUrl } = coffeeStoreCnt;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          neighbourhood: neighbourhood || "",
          imgUrl,
          voting: 0,
        }),
      });
      const dbCoffeeStore = await response.json();
    } catch (error) {
      console.error({ error });
    }
  };
  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (coffeeStore) => coffeeStore.id.toString() === id
        );
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps.CoffeeStore]);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0]?.voting);
    }
  }, [data]);

  // const {
  //   name = "",
  //   address = "",
  //   neighbourhood = "",
  //   imgUrl = "",
  // } = coffeeStore;
  const handleUpVote = async () => {
    try {
      const response = await fetch("/api/favoriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore) {
        setVotingCount((prvCnt) => prvCnt + 1);
      }
    } catch (error) {
      console.error({ error });
    }
  };

  if (error) {
    console.error({ error });
  }
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore?.name}</title>
        <meta
          name="description"
          content={`${coffeeStore?.name} coffee store`}
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore?.name}</h1>
          </div>
          <Image
            src={
              coffeeStore?.imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={coffeeStore?.name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {coffeeStore?.address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{coffeeStore?.address}</p>
            </div>
          )}
          {coffeeStore?.neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{coffeeStore?.neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpVote}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
