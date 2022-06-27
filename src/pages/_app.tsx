import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../assets/index.css";
import PageHeader from "../components/PageHeader";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <PageHeader />
      <main>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}

export default MyApp;
