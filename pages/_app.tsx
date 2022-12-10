import "../styles/globals.scss";
import { TitleProvider } from "../hooks/useTitle";
import { URLStateProvider } from "../hooks/useURLState";
import { ToastProvider } from "../hooks/useToasts";
import Head from "next/head";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <TitleProvider prefix="Kakapo" head={Head}>
      <ToastProvider>
        <URLStateProvider>
          <Head>
            <meta name="description" content="Kakapo UI" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </URLStateProvider>
      </ToastProvider>
    </TitleProvider>
  );
};

export default MyApp;
