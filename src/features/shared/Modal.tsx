import { Box, Grid } from "@chakra-ui/react";

import { useModal } from "../shared";

const Modal = () => {
  const { close, children } = useModal();

  return (
    <Box
      position="absolute"
      w="full"
      h="full"
      pointerEvents="none"
      overflow="hidden"
    >
      <Grid
        gridTemplateColumns="100px 1fr"
        position="absolute"
        top={0}
        left={!children ? "50px" : "0"}
        opacity={children ? 1 : 0}
        transition="all 0.3s ease"
        w="full"
        h="full"
        zIndex={1}
      >
        <Box />
        <Box
          bg="brand.darkBg"
          overflowY="hidden"
          pointerEvents={children ? "auto" : undefined}
        >
          {children}
        </Box>
      </Grid>

      <Box
        bg="black"
        position="absolute"
        w="full"
        h="full"
        onClick={close}
        pointerEvents={children ? "auto" : undefined}
        opacity={children ? 0.7 : 0}
      />
    </Box>
  );
};

export { Modal };
