import React, { MutableRefObject, useRef } from "react";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { RecoilRoot } from "recoil";

import { AudioPlayer, useInitAlbums } from "./features";
import { Catalogue } from "./routes";

import "./global.css";

const colors = {
  brand: {
    text: "white",
    bg: "#1a44cd",
    darkBg: "#090909",
  },
};

const theme = extendTheme({ colors });

export const AudioContext = React.createContext<{
  audioRef: MutableRefObject<HTMLAudioElement> | undefined;
}>({ audioRef: undefined });

const App = () => {
  const audioRef = useRef(new Audio());

  useInitAlbums();

  return (
    <RecoilRoot>
      <ChakraProvider {...{ theme }}>
        <AudioContext.Provider value={{ audioRef }}>
          <Catalogue />
          <AudioPlayer />
        </AudioContext.Provider>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default App;
