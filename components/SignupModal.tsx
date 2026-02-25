"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  useToast,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useUsername } from "@/contexts/UsernameContext";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const { setUsername } = useUsername();
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const toast = useToast();

  const trimmed = inputValue.trim();
  const isEnterDisabled = !trimmed;

  const handleEnter = () => {
    if (isEnterDisabled) return;
    setIsSubmitting(true);
    setUsername(trimmed);
    onClose();
    toast({ title: "Welcome!", status: "success", duration: 2000, isClosable: true });
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await signIn("google", { redirect: false });
      if (res?.ok && res?.url) {
        window.location.href = res.url;
      } else if (res?.error) {
        toast({ title: "Sign in failed", description: res.error, status: "error", isClosable: true });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="#777777CC" />
      <ModalContent
        bg="signin.cardBg"
        borderWidth="1px"
        borderColor="#999999"
        borderRadius="signinInput"
        boxShadow="signin.cardShadow"
        maxW={{ base: "calc(100vw - 2rem)", sm: "90%", md: "500px" }}
        mx={{ base: 4, md: "auto" }}
      >
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="stretch"
          gap="1rem"
          p="1.5rem"
        >
          <Box
            as="h2"
            fontFamily="signin"
            fontSize="signinTitle"
            fontWeight="signinTitle"
            color="signin.titleColor"
          >
            Welcome to CodeLeap network!
          </Box>
          <FormControl>
            <FormLabel
              fontFamily="signin"
              fontSize="signinLabel"
              fontWeight="signinLabel"
              color="signin.labelColor"
              mb="0.25rem"
            >
              Please enter your username
            </FormLabel>
            <Input
              placeholder="John doe"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnter()}
              bg="signin.inputBg"
              borderWidth="1px"
              borderColor="signin.inputBorder"
              borderRadius="signinInput"
              fontSize="signinLabel"
              fontFamily="signin"
              color="signin.titleColor"
              _placeholder={{ color: "signin.placeholderColor" }}
              _focus={{ borderColor: "signin.inputBorder", boxShadow: "0 0 0 1px var(--chakra-colors-signin-inputBorder)" }}
              h="2.5rem"
            />
          </FormControl>
          <Box display="flex" justifyContent="flex-end" w="100%">
            <Button
              fontFamily="signin"
              fontSize="signinButton"
              fontWeight="signinButton"
              bg={isEnterDisabled ? "signin.buttonDisabledBg" : "signin.buttonBg"}
              color="signin.buttonText"
              _hover={isEnterDisabled ? {} : { opacity: 0.9 }}
              _active={isEnterDisabled ? {} : { opacity: 0.85 }}
              isDisabled={isEnterDisabled}
              isLoading={isSubmitting}
              loadingText="..."
              onClick={handleEnter}
              borderRadius="signinButton"
              px="1.5rem"
              h="2.5rem"
            >
              ENTER
            </Button>
          </Box>
          <Box borderTopWidth="1px" borderColor="signin.cardBorder" my="0.25rem" />
          <Button
            fontFamily="signin"
            fontSize="signinLabel"
            variant="outline"
            borderColor="signin.inputBorder"
            color="signin.labelColor"
            _hover={{ bg: "blackAlpha.50", borderColor: "signin.buttonBg" }}
            leftIcon={
              <svg width="1.125rem" height="1.125rem" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            }
            onClick={handleGoogleSignIn}
            isLoading={isGoogleLoading}
            loadingText="Signing in..."
            w="100%"
            h="2.5rem"
          >
            Sign in with Google
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
