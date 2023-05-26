import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const CoffeeStore = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router);
  return (
    <div>
      <h1>CoffeeStore {id}</h1>
      <Link href="/">Back to home</Link>
      <Link href="/coffee-store/dynamic">Back to home</Link>
    </div>
  );
};

export default CoffeeStore;
