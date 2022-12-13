import React from "react";
import Head from "next/head";
import { TitleProvider } from "../hooks/useTitle";
import { URLStateProvider } from "../hooks/useURLState";
import { ToastProvider } from "../hooks/useToasts";
import { APIProvider } from "../hooks/useAPI";
import type { AppProps } from "next/app";
import "../styles/globals.scss";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <TitleProvider prefix="Kakapo" head={Head}>
      <ToastProvider config={{ timeToLive: 5000 }}>
        <URLStateProvider encoding="base64">
          <APIProvider
            config={{
              baseUrl: process.env.NEXT_PUBLIC_API_BASE
            }}
          >
            <Head>
              <meta name="description" content="Kakapo UI" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </APIProvider>
        </URLStateProvider>
      </ToastProvider>
    </TitleProvider>
  );
};

export default MyApp;
