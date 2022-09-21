import { useEffect, useState } from "react";

import { desktopDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { Box, Center, Flex, Grid, Image } from "@chakra-ui/react";

import {
  Clock,
  Icon,
  Mono,
  Page,
  Pause,
  Play,
  SoundBarsAnimated,
} from "../components";
import {
  Album,
  AlbumDetail,
  formatAlbumDuration,
  useAlbums,
  useModal,
  usePlayer,
} from "../features";

const Catalogue = () => {
  const { albums } = useAlbums();

  const sortedAlbums = sortAlbums(albums);

  return (
    <Page>
      <Flex as="section" p={8} gap={8} flexWrap="wrap" overflowY="auto">
        {sortedAlbums.map((album) => {
          return <AlbumThumbnail key={album.id} {...{ album }} />;
        })}
      </Flex>
    </Page>
  );
};

export { Catalogue };

function sortAlbums(data: Album[]) {
  const dataSorted = data.sort((a, b) => a.name.localeCompare(b.name));

  return dataSorted;
}

const AlbumThumbnail = ({ album }: { album: Album }) => {
  const { open } = useModal();
  const { play, isPlaying, queue, queueIdx, playPause } = usePlayer();

  const [cover, setCover] = useState<string | undefined>(undefined);
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCover() {
      if (!album?.path) return;

      try {
        const fileDir = await join(
          await desktopDir(),
          "test-albums",
          album?.path || "",
          "cover.jpeg"
        );

        const file = convertFileSrc(fileDir, "asset");

        setCover(file);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCover();
  }, [album?.path]);

  const isAlbumPlaying = queue[queueIdx]?.albumID === album.id;

  const PlayPauseButton = () => {
    if (!isAlbumPlaying)
      return (
        <Icon
          size={16}
          p={4}
          onClick={() => {
            play(album.id);
          }}
        >
          <Play />
        </Icon>
      );

    return (
      <Icon
        size={16}
        p={4}
        onClick={() => {
          playPause();
        }}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Icon>
    );
  };

  return (
    <Box
      rounded="sm"
      h="fit-content"
      position="relative"
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <Image
        src={cover}
        filter={hovered ? "brightness(0.2) blur(1px)" : undefined}
        transition="all 0.3s ease"
        w={300}
        h={300}
        objectFit={"cover"}
      />

      <Grid
        h="full"
        w="full"
        top={0}
        p={2}
        position="absolute"
        gridTemplateRows="1fr auto"
        opacity={hovered ? 1 : 0}
        transition="opacity 0.1s ease"
        onClick={() => {
          open({ children: <AlbumDetail albumID={album.id} /> });
        }}
      >
        <Grid gridTemplateColumns="1fr auto" gap={2} alignItems="flex-start">
          <Mono lineHeight={1.2} fontSize="xs">
            {album.artist}
          </Mono>
          <Flex gap={1} alignItems="center">
            <Icon size={3}>
              <Clock />
            </Icon>
            <Mono lineHeight={1.2} fontSize="xs">
              {formatAlbumDuration(album)}
            </Mono>
          </Flex>
        </Grid>
        <Mono lineHeight={1.2} fontSize="lg">
          {album.name}
        </Mono>
      </Grid>

      {hovered && (
        <Center
          h="full"
          w="full"
          top={0}
          position="absolute"
          pointerEvents="none"
        >
          <Box pointerEvents="auto">
            <PlayPauseButton />
          </Box>
        </Center>
      )}

      {isAlbumPlaying && !hovered && (
        <Flex
          position="absolute"
          justifyContent="center"
          alignItems="center"
          top={0}
          left={0}
          w="full"
          h="full"
        >
          <Icon size={6}>
            <SoundBarsAnimated />
          </Icon>
        </Flex>
      )}
    </Box>
  );
};
