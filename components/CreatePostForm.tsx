"use client";

import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, useToast } from "@chakra-ui/react";
import { layout } from "@/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { z } from "zod";
import { createPost } from "@/lib/api";
import { useUsername } from "@/contexts/UsernameContext";
import { setMediaForPost } from "@/lib/localStoragePosts";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").transform((s) => s.trim()),
  content: z.string().min(1, "Content is required").transform((s) => s.trim()),
});

export function CreatePostForm() {
  const { username } = useUsername();
  const queryClient = useQueryClient();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const isDisabled = !trimmedTitle || !trimmedContent;

  const mutation = useMutation({
    mutationFn: () => createPost(username!, trimmedTitle, trimmedContent),
    onSuccess: (created) => {
      if (imageDataUrl) {
        setMediaForPost(created.id, imageDataUrl);
        setImageDataUrl(null);
      }
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setTitle("");
      setContent("");
      toast({ title: "Post created", status: "success", duration: 2000, isClosable: true });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create post", description: err.message, status: "error", isClosable: true });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: "Image too large", description: "Max 2MB", status: "warning", isClosable: true });
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createSchema.safeParse({ title: trimmedTitle, content: trimmedContent });
    if (!parsed.success || !username) return;
    mutation.mutate();
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      w="100%"
      bg="signin.cardBg"
      borderWidth="1px"
      borderColor="signin.cardBorder"
      borderRadius="signinCard"
      boxShadow="signin.cardShadow"
      p={layout.cardPadding}
      transition="box-shadow 0.2s ease, border-color 0.2s ease"
      _hover={{ boxShadow: "0 6px 14px -2px rgba(0, 0, 0, 0.1), 0 4px 8px -3px rgba(0, 0, 0, 0.08)" }}
      _focusWithin={{ borderColor: "signin.buttonBg", boxShadow: "0 0 0 1px var(--chakra-colors-signin-buttonBg)" }}
    >
      <VStack align="stretch" gap={layout.gap} spacing={0}>
        <Box
          as="h2"
          fontFamily="signin"
          fontSize="signinTitle"
          fontWeight="signinTitle"
          color="signin.titleColor"
        >
          What&apos;s on your mind?
        </Box>
        <FormControl>
          <FormLabel
            fontFamily="signin"
            fontSize="signinLabel"
            fontWeight="signinLabel"
            color="signin.labelColor"
            mb="0.25rem"
          >
            Title
          </FormLabel>
          <Input
            placeholder="Hello world"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            bg="signin.inputBg"
            borderWidth="1px"
            borderColor="signin.inputBorder"
            borderRadius="signinInput"
            fontSize="signinLabel"
            fontFamily="signin"
            color="signin.titleColor"
            _placeholder={{
              color: "signin.placeholderColor",
              fontSize: "signinPlaceholder",
              fontFamily: "signin",
              fontWeight: "signinLabel",
            }}
            _focus={{ borderColor: "signin.inputBorder", boxShadow: "0 0 0 1px var(--chakra-colors-signin-inputBorder)" }}
            h="2.5rem"
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontFamily="signin"
            fontSize="signinLabel"
            fontWeight="signinLabel"
            color="signin.labelColor"
            mb="0.25rem"
          >
            Content
          </FormLabel>
          <Textarea
            placeholder="Content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            bg="signin.inputBg"
            borderWidth="1px"
            borderColor="signin.inputBorder"
            borderRadius="signinInput"
            fontSize="signinLabel"
            fontFamily="signin"
            color="signin.titleColor"
            _placeholder={{
              color: "signin.placeholderColor",
              fontSize: "signinPlaceholder",
              fontFamily: "signin",
              fontWeight: "signinLabel",
            }}
            _focus={{ borderColor: "signin.inputBorder", boxShadow: "0 0 0 1px var(--chakra-colors-signin-inputBorder)" }}
            rows={4}
          />
        </FormControl>
          <FormControl>
          <FormLabel
            fontFamily="signin"
            fontSize="signinLabel"
            fontWeight="signinLabel"
            color="signin.labelColor"
            mb="0.25rem"
          >
            Image (optional)
          </FormLabel>
          <Box
            as="label"
            htmlFor="create-post-file"
            display="flex"
            alignItems="center"
            gap={2}
            w="100%"
            bg="signin.buttonBg"
            color="signin.buttonText"
            cursor="pointer"
            borderRadius="signinInput"
            px={3}
            py={2}
            fontFamily="signin"
            fontSize="signinLabel"
            _hover={{ opacity: 0.9 }}
          >
            <input
              id="create-post-file"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ position: "absolute", width: 0, height: 0, opacity: 0, overflow: "hidden" }}
              tabIndex={0}
            />
            <span>Choose File</span>
            <Box as="span" flex={1} noOfLines={1} title={fileName || "No file chosen"}>
              {fileName || "No file chosen"}
            </Box>
          </Box>
          {imageDataUrl && (
            <Box mt="0.5rem" position="relative" display="inline-block">
              <Box
                as="img"
                src={imageDataUrl}
                alt="Preview"
                maxH="120px"
                maxW="200px"
                borderRadius="signinInput"
                borderWidth="1px"
                borderColor="signin.cardBorder"
                objectFit="cover"
              />
              <Button
                size="xs"
                position="absolute"
                top="4px"
                right="4px"
                fontFamily="signin"
                fontSize="signinPlaceholder"
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: "blackAlpha.800" }}
                onClick={() => {
                  setImageDataUrl(null);
                  setFileName("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Remove
              </Button>
            </Box>
          )}
        </FormControl>
        <Box display="flex" justifyContent="flex-end" w="100%">
          <Button
            type="submit"
            fontFamily="signin"
            fontSize="signinButton"
            fontWeight="signinButton"
            bg={isDisabled ? "signin.buttonDisabledBg" : "signin.buttonBg"}
            color="signin.buttonText"
            transition="opacity 0.2s, transform 0.15s"
            _hover={isDisabled ? {} : { opacity: 0.9, transform: "translateY(-1px)" }}
            _active={isDisabled ? {} : { opacity: 0.85, transform: "translateY(0)" }}
            isDisabled={isDisabled}
            isLoading={mutation.isPending}
            borderRadius="signinButton"
            px="1.5rem"
            h="2.5rem"
          >
            Create
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
