"use client";

import { Box, VStack, Spinner } from "@chakra-ui/react";
import { layout } from "@/theme";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useUsername } from "@/contexts/UsernameContext";
import { CreatePostForm } from "@/components/CreatePostForm";
import { Header } from "@/components/Header";
import { PostList } from "@/components/PostList";
import { SignupModal } from "@/components/SignupModal";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { username, setUsername, isReady } = useUsername();
  const [showSignup, setShowSignup] = useState(false);

  const sessionName =
    session?.user
      ? (session.user as { username?: string })?.username ||
        session.user.name ||
        session.user.email ||
        null
      : null;

  const displayUsername = sessionName ?? username;

  useEffect(() => {
    if (!isReady) return;
    if (session?.user) {
      const name =
        (session.user as { username?: string })?.username ||
        session.user.name ||
        session.user.email ||
        "";
      if (name) setUsername(name);
    }
  }, [session, setUsername, isReady]);

  useEffect(() => {
    if (!isReady) return;
    if (!displayUsername) setShowSignup(true);
  }, [isReady, displayUsername]);

  const handleCloseSignup = () => {
    if (displayUsername) setShowSignup(false);
  };

  if (status === "loading" || !isReady) {
    return (
      <Box minH="100vh" bg="signin.bg" display="flex" alignItems="center" justifyContent="center" px="1rem">
        <Box
          bg="signin.cardBg"
          borderWidth="1px"
          borderColor="signin.cardBorder"
          borderRadius="signinCard"
          boxShadow="signin.cardShadow"
          p="1.5rem"
          minW="min(90%, 20rem)"
          maxW="22rem"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="1rem"
        >
          <Box
            as="span"
            fontFamily="signin"
            fontSize="signinLabel"
            fontWeight="signinLabel"
            color="signin.labelColor"
          >
            Loading...
          </Box>
          <Spinner size="md" color="signin.buttonBg" />
        </Box>
      </Box>
    );
  }

  if (!displayUsername) {
    return (
      <Box minH="100vh" bg="signin.bg" display="flex" alignItems="center" justifyContent="center">
        <SignupModal isOpen={showSignup} onClose={handleCloseSignup} />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="signin.bg" display="flex" flexDirection="column" overflowX="hidden" minW={0} w="100%" maxW="100vw">
      <Header username={displayUsername} sessionActive={!!session} />
      <Box
        as="main"
        flex="1"
        w={{ base: "100%", lg: "800px" }}
        maxW={{ base: "100%", lg: "800px" }}
        minW={0}
        mx="auto"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        bg="#FFFFFF"
        py="clamp(1.5rem, 5vw, 2rem)"
        px={{ base: "0", lg: "24px" }}
        overflowX="hidden"
      >
        <Box
          w={{ base: "90%", sm: "80%", lg: "100%" }}
          maxW={{ base: "100%", lg: "752px" }}
          minW={0}
          display="flex"
          flexDirection="column"
          alignItems="stretch"
        >
          <VStack align="stretch" gap={layout.gap} spacing={0}>
            <CreatePostForm />
            <PostList currentUsername={displayUsername} />
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
