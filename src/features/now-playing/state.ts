import { MutableRefObject } from "react";
import { atom } from "recoil";

import { Track } from "../shared";

export type NowPlaying =
  | {
      path?: string;
      albumID: string;
      albumPath: string;
      track: Track | Partial<Track>;
      trackNumber: number;
      file?: string;
    }
  | undefined;

export type Queue = NowPlaying[];

export type PlayerType = {
  isPlaying: boolean;
  muted: boolean;
  volume: number;
};

const queueState = atom<Queue>({
  key: "queueState",
  default: [],
});

const isPlayingState = atom<boolean>({
  key: "isPlayingState",
  default: false,
});

const audioRefState = atom<MutableRefObject<HTMLAudioElement>>({
  key: "audioRefState",
  default: undefined,
});

const queueIdxState = atom<number>({
  key: "queueIdxState",
  default: 0,
});

const audioSrcState = atom<string>({
  key: "audioSrcState",
  default: "",
});

const playerState = atom<PlayerType>({
  key: "playerState",
  default: {
    isPlaying: false,
    muted: false,
    volume: 1,
  },
});

export {
  queueState,
  queueIdxState,
  playerState,
  audioRefState,
  isPlayingState,
  audioSrcState,
};
