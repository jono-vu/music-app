import { Grid } from "@chakra-ui/react";
import React from "react";

const Compartment: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Grid
      templateRows="1fr auto"
      height="32vw"
      border="1px"
      borderColor="brand.bg"
      bg="brand.darkBg"
    >
      {children}
    </Grid>
  );
};

export { Compartment };
