import Script from "next/script";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import  SidebarContext  from "../context/SidebarContext";
import { MicrophoneContextProvider } from "../context/MicrophoneContextProvider";
import { DeepgramContextProvider } from "../context/DeepgramContextProvider";
import RootLayout from "../components/layout";
import "../styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Goerli;

function MyApp({ Component, pageProps }) {
  return (
    <MicrophoneContextProvider>
      <DeepgramContextProvider>
        <ThirdwebProvider desiredChainId={activeChainId}>
          <SidebarContext>
            <RootLayout>
              <Component {...pageProps} />
            </RootLayout>
          </SidebarContext>
          <Script src="https://forge.zeke.ai/static/js/main.cfcc4527.js" />
          <chat-widget></chat-widget>
        </ThirdwebProvider>
      </DeepgramContextProvider>
    </MicrophoneContextProvider>
  );
}

export default MyApp;
