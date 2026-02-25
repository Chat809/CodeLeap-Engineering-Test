"use client";

import { Box } from "@chakra-ui/react";

/** Renders text with @username segments styled as mentions. */
export function ContentWithMentions({ text }: { text: string }) {
  const parts = text.split(/(@[\w\u00C0-\u024F\u1E00-\u1EFF.-]+)/gi);
  return (
    <Box as="span" whiteSpace="pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith("@")) {
          return (
            <Box
              key={`${i}-${part}`}
              as="span"
              fontFamily="inherit"
              fontWeight="signinTitle"
              color="signin.buttonBg"
            >
              {part}
            </Box>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </Box>
  );
}
