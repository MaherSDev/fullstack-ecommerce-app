import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        primary: {
          value: "#9f7aea",
        },
        divider: {
          value: { base: "colors.gray.200", _dark: "colors.gray.700" },
        },
        "input-border": {
          value: { base: "colors.gray.200", _dark: "colors.gray.500" },
        },
        "bg-button": {
          value: { base: "#9f7aea", _dark: "#9f7aea" },
        },
        "text--button": {
          value: { base: "#e6f3fd", _dark: "#e6f3fd" },
        },
        "hover-bg-button": {
          value: { base: "#e6f3fd", _dark: "#e6f3fd" },
        },
        "hover-text": {
          value: { base: "#9f7aea", _dark: "#9f7aea" },
        },
        "secondary-text-color": {
          value: { base: "colors.gray.600", _dark: "colors.gray.300" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
