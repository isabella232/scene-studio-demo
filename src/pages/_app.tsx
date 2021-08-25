import "./index.css";
import "@vertexvis/viewer/dist/viewer/viewer.css";

import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import { client } from "../lib/graphql";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  React.useEffect(() => {
    function handleRouteChange(url: string) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      });
    }

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Vertex Scene Studio</title>
        <link rel="icon" href="/favicon-512x512.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
