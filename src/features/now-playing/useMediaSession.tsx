import { useEffect } from "react";

interface MediaSessionProps {
  title: string;
  artist: string;
  album: string;
  artwork: Array<MediaImage>;

  onPlay: () => void | Promise<void>;
  onPause: () => void | Promise<void>;
  onSeekBackward: () => void | Promise<void>;
  onSeekForward: () => void | Promise<void>;
  onPreviousTrack: () => void | Promise<void>;
  onNextTrack: () => void | Promise<void>;
}

const useMediaSession = ({
  title,
  artist,
  album,
  artwork,

  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward,
  onPreviousTrack,
  onNextTrack,
}: MediaSessionProps) => {
  const { mediaSession } = navigator;

  useEffect(() => {
    mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork,
    });
  }, [title, artist, album, artwork, mediaSession]);

  useEffect(() => {
    if (mediaSession) {
      console.log("logging");

      mediaSession.setActionHandler("play", onPlay);
      mediaSession.setActionHandler("pause", onPause);
      mediaSession.setActionHandler("seekbackward", onSeekBackward);
      mediaSession.setActionHandler("seekforward", onSeekForward);
      mediaSession.setActionHandler("previoustrack", onPreviousTrack);
      mediaSession.setActionHandler("nexttrack", onNextTrack);
    }
  }, [
    mediaSession,
    onNextTrack,
    onPause,
    onPlay,
    onPreviousTrack,
    onSeekBackward,
    onSeekForward,
  ]);
};

export { useMediaSession };
