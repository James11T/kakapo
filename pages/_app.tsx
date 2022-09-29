import "../styles/globals.scss";
import { TitleProvider } from "../hooks/useTitle";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <TitleProvider prefix="Kakapo">
      <Component {...pageProps} />
    </TitleProvider>
  );
};

export default MyApp;
