import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const CoffeeStore = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <Head>
        <title>{id}</title>
      </Head>
      <h1>CoffeeStore {id}</h1>
      <Link href="/">Back to home</Link>
    </div>
  );
};

export default CoffeeStore;
