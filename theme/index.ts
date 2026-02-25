"use client";

import { defineStyleConfig, extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  bluePurple: {
    bg: "#0a0a12",
    surface: "#12121f",
    border: "#6366f1",
    borderMuted: "#4338ca",
    glow: "rgba(99, 102, 241, 0.4)",
    text: "#f8fafc",
    textMuted: "#94a3b8",
  },
  // Main screen – fundo escuro; área de conteúdo usa signin.bg (#DDDDDD)
  main: {
    bg: "#36454F",
  },
  // Tela de Sign-in / Loading (Figma) – variáveis fixas
  signin: {
    bg: "#DDDDDD",
    cardBg: "#FFFFFF",
    cardBorder: "#CCCCCC",
    titleColor: "#000000",
    labelColor: "#000000",
    inputBorder: "#CCCCCC",
    inputBg: "#FFFFFF",
    placeholderColor: "#CCCCCC",
    timestampColor: "#777777",
    buttonBg: "#7695EC",
    buttonText: "#FFFFFF",
    buttonDisabledBg: "#A7B3E2",
    cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    cardRadius: "16px",
    inputRadius: "8px",
    buttonRadius: "8px",
  },
  modal: {
    overlay: "#777777CC",
    border: "#999999",
    cancelText: "#000000",
    primaryButtonText: "#FFFFFF",
  },
};

const styles = {
  global: {
    body: {
      bg: "bluePurple.bg",
      color: "bluePurple.text",
      cursor: "default",
    },
    "button:not(:disabled), [role='button']:not([aria-disabled='true']), a[href]": { cursor: "pointer" },
  },
};

export const layout = {
  contentMax: "50rem",
  sectionPadding: "clamp(1rem, 4vw, 1.5rem)",
  cardPadding: "clamp(1rem, 3vw, 1.5rem)",
  gap: "1rem",
};

const components = {
  Button: defineStyleConfig({
    baseStyle: {
      borderRadius: "md",
      fontWeight: "semibold",
      cursor: "pointer",
      _disabled: { cursor: "default" },
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: { bg: "brand.600", _disabled: { bg: "whiteAlpha.300" } },
        _disabled: { opacity: 0.6 },
      },
      outline: {
        borderColor: "bluePurple.border",
        color: "bluePurple.text",
        _hover: { bg: "whiteAlpha.100", borderColor: "brand.400" },
      },
      ghost: {
        color: "bluePurple.textMuted",
        _hover: { bg: "whiteAlpha.100", color: "bluePurple.text" },
      },
    },
  }),
  Input: defineStyleConfig({
    variants: {
      outline: {
        field: {
          borderColor: "whiteAlpha.300",
          bg: "bluePurple.surface",
          _focus: { borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" },
          _placeholder: { color: "whiteAlpha.500" },
        },
      },
    },
  }),
  Modal: defineStyleConfig({
    baseStyle: {
      dialog: {
        bg: "bluePurple.surface",
        borderWidth: "1px",
        borderColor: "bluePurple.border",
        borderRadius: "lg",
        boxShadow: "0 0 24px var(--chakra-colors-bluePurple-glow)",
      },
      header: { color: "bluePurple.text" },
      body: { color: "bluePurple.text" },
      closeButton: { color: "bluePurple.textMuted", _hover: { color: "bluePurple.text" } },
    },
  }),
  Card: defineStyleConfig({
    baseStyle: {
      container: {
        bg: "bluePurple.surface",
        borderWidth: "1px",
        borderColor: "bluePurple.borderMuted",
        borderRadius: "lg",
        _hover: { borderColor: "bluePurple.border", boxShadow: "0 0 12px var(--chakra-colors-bluePurple-glow)" },
      } as any,
    },
  }),
};

export const theme = extendTheme({
  colors,
  styles,
  components,
  config: { initialColorMode: "dark", useSystemColorMode: false },
  layout,
  fonts: {
    signin: "Roboto, sans-serif",
  },
  fontSizes: {
    signinTitle: "22px",
    signinLabel: "16px",
    signinButton: "1rem",
    signinPostMeta: "18px",
    signinPlaceholder: "14px",
  },
  fontWeights: {
    signinTitle: 700,
    signinLabel: 400,
    signinButton: 700,
  },
  radii: {
    signinCard: "16px",
    signinInput: "8px",
    signinButton: "8px",
  },
});
