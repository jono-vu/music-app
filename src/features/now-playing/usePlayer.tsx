import { useContext, useMemo } from "react";

import { desktopDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { useRecoilState } from "recoil";

import { AudioContext } from "../../App";
import { getAlbum, useAlbums } from "../catalogue";
import {
  audioSrcState,
  playerState,
  Queue,
  queueIdxState,
  queueState,
} from "./state";

const usePlayer = () => {
  const { albums } = useAlbums();

  const [queue, setQueue] = useRecoilState(queueState);
  const [queueIdx, setQueueIdx] = useRecoilState(queueIdxState);
  const [audioSrc, setAudioSrc] = useRecoilState(audioSrcState);
  const [player, setPlayer] = useRecoilState(playerState);

  const { audioRef } = useContext(AudioContext);

  useMemo(() => {
    if (audioRef) {
      audioRef.current.volume = player.volume;
    }
  }, [audioRef, player.volume]);

  async function _playAndLoad(queue: Queue, queueIdx: number) {
    if (!audioRef) return;

    const queueTrack = queue[queueIdx];

    if (!queueTrack) {
      setPlayer({ ...player, isPlaying: false });
      console.log("queue empty");
      return;
    }

    const album = albums.find((album) => album.id === queueTrack.albumID);
    const track = queueTrack.track;

    try {
      const fileDir = await join(
        await desktopDir(),
        "test-albums",
        queueTrack.albumPath,
        track.path
      );

      const file = convertFileSrc(fileDir);

      setAudioSrc(normalisePath(file));
      setPlayer({ ...player, isPlaying: true });

      audioRef.current.load();
      audioRef.current.onended = async function () {
        await next(queue, queueIdx);
      };

      if ("mediaSession" in navigator) {
        let cover = "";

        try {
          const fileDir = await join(
            await desktopDir(),
            "test-albums",
            album?.path || "",
            "cover.jpeg"
          );

          const file = convertFileSrc(fileDir, "asset");
          cover = file;
        } catch (err) {
          console.log(err);
        }

        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.name,
          artist: album?.artist,
          album: album?.name,
          artwork: [{ src: cover }],
        });

        navigator.mediaSession.setActionHandler("play", async () => {
          await playPause();
        });
        navigator.mediaSession.setActionHandler("pause", async () => {
          await playPause();
        });
        navigator.mediaSession.setActionHandler("previoustrack", async () => {
          if (audioRef.current.currentTime > 1) {
            seek(0);
            return;
          }
          await prev(queue, queueIdx);
        });
        navigator.mediaSession.setActionHandler("nexttrack", async () => {
          await next(queue, queueIdx);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function playPause() {
    if (!audioRef) return;

    const isPaused = audioRef.current.paused;

    if (!isPaused) {
      audioRef.current.pause();
      setPlayer({ ...player, isPlaying: false });
    } else {
      audioRef.current.play();
      setPlayer({ ...player, isPlaying: true });
    }
  }

  async function seek(time: number) {
    if (!audioRef) return;

    audioRef.current.currentTime = time;
  }

  async function prev(queue: Queue, queueIdx: number) {
    if (!audioRef) return;

    const prevIdx = queueIdx - 1;
    setQueueIdx(queueIdx - 1);

    await _playAndLoad(queue, prevIdx);
  }

  async function next(queue: Queue, queueIdx: number) {
    if (!audioRef) return;

    const nextIdx = queueIdx + 1;
    setQueueIdx(queueIdx + 1);

    await _playAndLoad(queue, nextIdx);
  }

  async function play(albumID: string, trackNumberInput?: number) {
    const trackNumber = trackNumberInput || 0;
    const album = getAlbum(albums, albumID);

    if (!album) return;

    const albumQueue = album.tracks.map((track, i) => {
      return {
        albumID: album.id,
        albumPath: album.path,
        track,
        trackNumber: i,
        path: track.path,
      };
    });

    setQueue([...albumQueue]);
    setQueueIdx(trackNumber);

    await _playAndLoad(albumQueue, trackNumber);

    return;
  }

  return {
    audioRef,
    queue,
    queueIdx,
    audioSrc,
    muted: player.muted,
    volume: player.volume,
    isPlaying: player.isPlaying,
    setVolume: (percent: number) => {
      setPlayer({ ...player, volume: percent / 100 });
    },
    setMuted: (muted: boolean) => {
      setPlayer({ ...player, muted });
    },
    playPause,
    seek,
    play,
    next,
  };
};

export { usePlayer };

function normalisePath(path: string) {
  return path.replace("%2F", "/");
}
