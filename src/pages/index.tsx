import type { NextPage } from "next";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const session = useSession();

  return <pre className="max-w-full">{JSON.stringify(session, null, 4)}</pre>;
};

export default Home;
