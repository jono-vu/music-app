import { Button, Flex, Grid } from "@chakra-ui/react";
import { open } from "@tauri-apps/api/dialog";
import { useState } from "react";

import { Mono } from "../../components";
import { getStore, setStore, StoreKeys } from "../shared";

const Preferences = () => {
  const [albumDirectory, setAlbumDirectory] = useState<string>(
    getStore<string>(StoreKeys.albumDirectory, "")
  );

  async function handleChangeAlbumDirectory() {
    const selected = (await open({
      directory: true,
    })) as string | null;

    if (!selected) return;

    setStore(StoreKeys.albumDirectory, selected);

    /* effect state update to rerender component */
    setAlbumDirectory(selected);
  }

  const renderAlbumDirectory = () => {
    if (!albumDirectory) return <Mono>No folder selected</Mono>;
    return <Mono>{albumDirectory}</Mono>;
  };

  return (
    <Grid height="full" p={8} gap={8} gridTemplateRows="auto 1fr">
      <Mono>Preferences</Mono>

      <Flex flexDirection="column" gap={4} alignContent="flex-start">
        <Flex justifyContent="space-between">
          <Mono>Album Directory</Mono>
          <Button bg="brand.bg" onClick={handleChangeAlbumDirectory}>
            {renderAlbumDirectory()}
          </Button>
        </Flex>
      </Flex>
    </Grid>
  );
};

export { Preferences };
