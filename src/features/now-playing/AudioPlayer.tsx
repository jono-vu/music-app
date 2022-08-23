import { usePlayer } from "./usePlayer";

const AudioPlayer = () => {
  const { audioRef, audioSrc } = usePlayer();

  return (
    <audio ref={audioRef} autoPlay>
      <source type="audio/mp3" src={audioSrc} />
    </audio>
  );
};

export { AudioPlayer };
