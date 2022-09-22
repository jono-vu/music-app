import React from "react";

import { Grid } from "@chakra-ui/react";

import { Footer } from "../../components";
import { Modal } from "../../features";

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Grid
      w="full"
      h="100vh"
      position="absolute"
      templateRows="1fr auto"
      color="brand.text"
      bg="brand.darkBg"
    >
      {/* <TitleBar /> */}
      <Grid position={"relative"} overflowY="auto">
        {children}
        <Modal />
      </Grid>
      <Footer />
    </Grid>
  );
};

export { Page };
