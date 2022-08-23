import { useEffect, useState } from "react";

import { desktopDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { Image } from "@chakra-ui/react";

import { Page } from "../components";
import { usePlayer } from "../features";

const NowPlaying = () => {
  const { queue, queueIdx } = usePlayer();

  const [cover, setCover] = useState<string>("");

  useEffect(() => {
    async function fetchCover() {
      try {
        const fileDir = await join(
          await desktopDir(),
          "test-albums",
          queue[queueIdx]?.albumPath || "",
          "cover.jpeg"
        );

        const file = convertFileSrc(fileDir, "asset");

        setCover(file);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCover();
  });

  return (
    <Page>
      <Image src={cover} w="full" h="100%" objectFit={"contain"} />
    </Page>
  );
};

export { NowPlaying };
