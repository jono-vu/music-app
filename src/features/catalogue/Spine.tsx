import { useState } from "react";
import { Link } from "react-router-dom";

import { Grid, GridProps, HStack } from "@chakra-ui/react";

import { Icon, Mono, Pause, Play, Serif } from "../../components";

import { usePlayer } from "../now-playing";
import { Album } from "../shared";

interface SpineProps extends GridProps {
  active?: boolean;
  data: Album;
}

const Spine = ({ active, data, ...props }: SpineProps) => {
  const { play, isPlaying, queue, queueIdx, playPause } = usePlayer();

  const [hovered, setHovered] = useState<boolean>(false);

  const isAlbumPlaying = queue[queueIdx]?.albumID === data.id;

  const Actions = () => {
    if (!hovered)
      return (
        <HStack alignItems="flex-end">
          <Serif
            fontSize="5pt"
            maxW="60px"
            overflow="hidden"
            textAlign="right"
            lineHeight={1}
            wordWrap="break-word"
            letterSpacing={0.3}
          >
            {data.artist}
          </Serif>
          <Mono lineHeight={0.75}>{data.duration}</Mono>
        </HStack>
      );

    if (!isAlbumPlaying)
      return (
        <Icon
          size={4}
          onClick={() => {
            play(data.id);
          }}
        >
          <Play />
        </Icon>
      );

    return (
      <Icon
        size={4}
        onClick={() => {
          playPause();
        }}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Icon>
    );
  };

  return (
    <Grid
      templateColumns="1fr auto"
      alignItems="end"
      bg={active ? "brand.bg" : "brand.darkBg"}
      color={active ? "brand.text" : "brand.bg"}
      // transition="ease 0.1s"
      gap={2}
      p={2.5}
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      {...props}
    >
      <Serif ellipsis lineHeight={1} _hover={{ textDecoration: "underline" }}>
        <Link to={`/album/${data.id}`}>{data.name}</Link>
      </Serif>
      <Actions />
    </Grid>
  );
};

export { Spine };
