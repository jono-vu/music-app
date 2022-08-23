import { Box, Icon } from "@chakra-ui/react";
import React, { useState } from "react";

import { usePlayer } from "../features";
import { Pause, Play, SoundBars, SoundBarsAnimated } from "./icons";

interface PlayPauseButtonProps {
  show?: boolean;
  children?: React.ReactNode;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  children,
  ...props
}) => {
  const [show, setShow] = useState<boolean>(false);
  const { isPlaying, playPause } = usePlayer();

  return (
    <Box
      w={7}
      h={7}
      onMouseOver={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
      {...props}
    >
      {show ? (
        <Icon
          as={isPlaying ? Pause : Play}
          w={7}
          h={7}
          onClick={() => {
            playPause();
          }}
        />
      ) : (
        children ?? (
          <Box w={7} h={7}>
            {isPlaying ? <SoundBarsAnimated /> : <SoundBars />}
          </Box>
        )
      )}
    </Box>
  );
};

export { PlayPauseButton };
