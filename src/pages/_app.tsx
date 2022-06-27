import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import "../assets/index.css";
import "react-toastify/dist/ReactToastify.css";
import PageHeader from "../components/PageHeader";

function MyApp({
  Component,
  pageProps: { session, fallback, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fallback: fallback || {},
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <PageHeader />
        <main className="my-8 custom-container">
          <Component {...pageProps} />
        </main>
        <div id="portal-target" />
        <ToastContainer position="bottom-right" />
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
