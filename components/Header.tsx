"use client";

import { Box, Button, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, IconButton, VStack } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useUsername } from "@/contexts/UsernameContext";
import { SignOutConfirmModal } from "./SignOutConfirmModal";

const HamburgerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

interface HeaderProps {
  username: string | null;
  sessionActive?: boolean;
}

export function Header({ username, sessionActive = false }: HeaderProps) {
  const { setUsername } = useUsername();
  const queryClient = useQueryClient();
  const signOutModal = useDisclosure();
  const menuDrawer = useDisclosure();

  const handleSignOut = () => {
    signOutModal.onClose();
    setUsername(null);
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
    queryClient.removeQueries({ queryKey: ["posts"] });
    if (sessionActive) {
      signOut({ callbackUrl: "/" });
    } else {
      window.location.href = "/";
    }
  };

  const openSignOutConfirm = () => {
    menuDrawer.onClose();
    signOutModal.onOpen();
  };

  const signOutButtonProps = {
    size: "sm" as const,
    variant: "ghost" as const,
    onClick: openSignOutConfirm,
    color: "signin.buttonText",
    fontFamily: "signin",
    fontSize: "signinLabel",
    fontWeight: "signinLabel",
    borderWidth: "1px",
    borderColor: "signin.buttonText",
    borderRadius: "signinInput",
    _hover: { bg: "whiteAlpha.300", borderColor: "signin.buttonText" },
    _focus: { borderColor: "signin.buttonText", boxShadow: "none" },
  };

  return (
    <>
      <Box
        as="header"
        bg="signin.buttonBg"
        px="clamp(1rem, 4vw, 1.5rem)"
        py="1rem"
      >
        <Box maxW="50rem" w="100%" mx="auto" display="flex" alignItems="center" justifyContent="space-between">
          {/* Desktop: título à esquerda; Mobile: hamburger + título */}
          <Box display="flex" alignItems="center" gap={3}>
            <IconButton
              aria-label="Abrir menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              color="signin.buttonText"
              size="sm"
              onClick={menuDrawer.onOpen}
              display={{ base: "flex", md: "none" }}
              _hover={{ bg: "whiteAlpha.300" }}
            />
            <Box
              as="a"
              href="https://codeleap.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              fontFamily="signin"
              fontSize="signinTitle"
              fontWeight="signinTitle"
              color="signin.buttonText"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              CodeLeap Network
            </Box>
          </Box>
          {/* Desktop: usuário + Sign out visíveis na barra */}
          <Box display={{ base: "none", md: "flex" }} alignItems="center" gap="30px">
            {username && (
              <Box as="span" color="signin.buttonText" fontSize="signinLabel" fontFamily="signin" fontWeight="signinLabel">
                @{username}
              </Box>
            )}
            <Button {...signOutButtonProps}>Sign out</Button>
          </Box>
        </Box>
      </Box>

      <Drawer
        isOpen={menuDrawer.isOpen}
        placement="left"
        onClose={menuDrawer.onClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg="signin.buttonBg" position="relative">
          <IconButton
            aria-label="Fechar menu"
            icon={<ChevronLeftIcon />}
            variant="ghost"
            color="signin.buttonText"
            size="sm"
            position="absolute"
            right={0}
            top="50%"
            transform="translateY(-50%)"
            onClick={menuDrawer.onClose}
            _hover={{ bg: "whiteAlpha.300" }}
            zIndex={1}
          />
          <DrawerHeader pt={6} pb={2} borderBottomWidth="1px" borderColor="whiteAlpha.300">
            <Box fontFamily="signin" fontSize="signinTitle" fontWeight="signinTitle" color="signin.buttonText">
              CodeLeap Network
            </Box>
            {username && (
              <Box mt={2} color="signin.buttonText" fontSize="signinLabel" fontFamily="signin" fontWeight="signinLabel">
                @{username}
              </Box>
            )}
          </DrawerHeader>
          <DrawerBody pt={4}>
            <VStack align="stretch" spacing={3}>
              <Button {...signOutButtonProps} justifyContent="flex-start" w="100%">
                Sign out
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <SignOutConfirmModal
        isOpen={signOutModal.isOpen}
        onClose={signOutModal.onClose}
        onConfirm={handleSignOut}
      />
    </>
  );
}
