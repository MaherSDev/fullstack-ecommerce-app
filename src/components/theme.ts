import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        "input-border": {
          value: { _light: "gray.200", _dark: "gray.500" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)