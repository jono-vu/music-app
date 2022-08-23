import { useState } from "react";
import { Link } from "react-router-dom";

import { Grid, HStack, Icon } from "@chakra-ui/react";

import { Mono, Next, PlayPauseButton, Serif } from "../../components";
import { useInterval } from "../../utils";
import { Seeker, usePlayer, VolumeControls } from "../now-playing";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const Player = () => {
  const { audioRef, queue, queueIdx, next } = usePlayer();

  const [isHovered, setHovered] = useState<boolean>(false);
  const [trackPosition, setTrackPosition] = useState<string>("0:00");

  useInterval(() => {
    if (!audioRef) return;

    setTrackPosition(
      dayjs.duration(audioRef.current.currentTime * 1000).format("m:ss")
    );
  }, 1000);

  if (!queue.length) return null;

  const track = queue[queueIdx]?.track;

  return (
    <Grid
      templateColumns="1fr 1fr 1fr"
      alignItems="center"
      bg="brand.bg"
      color="brand.text"
      gap={8}
      py={6}
      px={8}
      width="full"
      bottom={0}
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <Serif _hover={{ textDecoration: "underline" }}>
        <Link to={`/album/${queue[queueIdx]?.albumID}`}>
          {queue[queueIdx]?.trackNumber || 0 + 1}. {track?.name}
        </Link>
      </Serif>

      <Grid templateColumns="auto 1fr" gap={4}>
        <HStack alignItems="center" gap={1}>
          <PlayPauseButton />
          <Mono>{trackPosition}</Mono>
        </HStack>
        <Grid
          opacity={isHovered ? 1 : 0}
          gridTemplateColumns="1fr auto"
          alignItems="center"
          gap={2}
        >
          <Seeker />
          <Icon
            as={Next}
            h={4}
            w={4}
            onClick={async () => {
              await next(queue, queueIdx);
            }}
          />
        </Grid>
      </Grid>

      <VolumeControls show={isHovered} />
    </Grid>
  );
};

export { Player };
