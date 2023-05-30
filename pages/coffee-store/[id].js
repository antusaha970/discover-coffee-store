import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import coffeeStoreData from "../../data/coffee-stores.json";

export async function getStaticProps(staticProps) {
  const { params } = staticProps;
  return {
    props: {
      coffeeStore: coffeeStoreData.find(
        (coffeeStore) => coffeeStore.id.toString() == params.id
      ),
    },
  };
}

export async function getStaticPaths() {
  const paths = coffeeStoreData.map((coffeeStore) => {
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

const CoffeeStore = (props) => {
  const router = useRouter();
  const { id } = router.query;
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const { name, address, neighbourhood } = props.coffeeStore;
  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <Link href="/">Back to home</Link>
      <h2>{name}</h2>
      <p>{address}</p>
      <p>{neighbourhood}</p>
    </div>
  );
};

export default CoffeeStore;
