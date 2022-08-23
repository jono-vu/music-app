import React, { MutableRefObject, useRef } from "react";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AudioPlayerProvider } from "react-use-audio-player";
import { RecoilRoot } from "recoil";

import { Album, Catalogue, NowPlaying } from "./routes";

import "./global.css";
import { AudioPlayer } from "./features";

const colors = {
  brand: {
    text: "white",
    bg: "#212121",
    darkBg: "#121212",
  },
};

const theme = extendTheme({ colors });

export const AudioContext = React.createContext<{
  audioRef: MutableRefObject<HTMLAudioElement> | undefined;
}>({ audioRef: undefined });

const App = () => {
  const audioRef = useRef(new Audio());

  return (
    <RecoilRoot>
      <ChakraProvider {...{ theme }}>
        <AudioPlayerProvider>
          <AudioContext.Provider value={{ audioRef }}>
            <BrowserRouter>
              <Routes>
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/now-playing" element={<NowPlaying />} />
                <Route path="/album/:name" element={<Album />} />
                <Route path="*" element={<Catalogue />} />
              </Routes>
            </BrowserRouter>
            <AudioPlayer />
          </AudioContext.Provider>
        </AudioPlayerProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default App;
