import type { Metadata } from "next";
import { Providers } from "./providers";
import { ColorModeScript } from "@chakra-ui/react";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "CodeLeap Network",
  description: "CodeLeap Engineering Test — CRUD app with signup, posts feed, edit & delete.",
};

const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className} suppressHydrationWarning>
      <body style={{ overflowX: "hidden", maxWidth: "100vw" }}>
        <ColorModeScript initialColorMode="dark" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
