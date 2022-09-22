import { Text } from "@chakra-ui/react";

type Any = any;

interface TypographyProps extends Any {
  ellipsis?: boolean;
}

const ellipsisOptions: Partial<TypographyProps> = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "clip",
};

const Serif = ({ ellipsis, ...props }: TypographyProps) => (
  <Text
    fontFamily="alpina"
    letterSpacing={0.3}
    {...(ellipsis && { ...ellipsisOptions })}
    {...props}
  />
);

const Mono = ({ ellipsis, ...props }: TypographyProps) => (
  <Text
    fontFamily="flexa"
    {...(ellipsis && { ...ellipsisOptions })}
    {...props}
  />
);

const Emphasis = ({ ellipsis, ...props }: TypographyProps) => (
  <Text
    fontFamily="manuka"
    fontSize="100pt"
    lineHeight={1.1}
    {...(ellipsis && { ...ellipsisOptions })}
    {...props}
  />
);

export { Serif, Mono, Emphasis };
