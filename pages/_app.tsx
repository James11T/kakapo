import "../styles/globals.scss";
import { TitleProvider } from "../hooks/useTitle";
import { URLStateProvider } from "../hooks/useURLState";
import { ToastProvider } from "../hooks/useToasts";
import { APIProvider } from "../hooks/useAPI";
import Head from "next/head";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <TitleProvider prefix="Kakapo" head={Head}>
      <ToastProvider config={{ timeToLive: 5000 }}>
        <URLStateProvider>
          <APIProvider
            config={{
              baseUrl: "http://172.23.119.187:5000/",
              artificialLatency: 500
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
