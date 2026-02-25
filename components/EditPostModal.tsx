"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { updatePost } from "@/lib/api";
import type { Post } from "@/types/post";
import { getMedia, setMediaForPost } from "@/lib/localStoragePosts";

const editSchema = z.object({
  title: z.string().min(1, "Title is required").transform((s) => s.trim()),
  content: z.string().min(1, "Content is required").transform((s) => s.trim()),
});

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onUpdated: () => void;
  onMediaChange?: () => void;
}

export function EditPostModal({ isOpen, onClose, post, onUpdated, onMediaChange }: EditPostModalProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(post.title);
      setContent(post.content);
      const media = getMedia()[post.id] ?? null;
      setImageDataUrl(media);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen, post.id, post.title, post.content]);

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const isDisabled = !trimmedTitle || !trimmedContent;

  const mutation = useMutation({
    mutationFn: () => updatePost(post.id, trimmedTitle, trimmedContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onUpdated();
      onClose();
      toast({ title: "Post updated", status: "success", duration: 2000, isClosable: true });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, status: "error", isClosable: true });
    },
  });

  const handleRemoveImage = () => {
    setMediaForPost(post.id, null);
    setImageDataUrl(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onMediaChange?.();
  };

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
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setMediaForPost(post.id, dataUrl);
      setImageDataUrl(dataUrl);
      onMediaChange?.();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = editSchema.safeParse({ title: trimmedTitle, content: trimmedContent });
    if (!parsed.success) return;
    mutation.mutate();
  };

  const overlayBg = "#777777CC";
  const modalBorder = "#999999";
  const buttonCommon = {
    fontFamily: "signin",
    fontSize: "16px",
    fontWeight: 700,
    borderRadius: "8px",
    borderWidth: "1px",
    borderColor: modalBorder,
    w: "120px",
    h: "32px",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={overlayBg} />
      <ModalContent
        bg="signin.cardBg"
        borderWidth="1px"
        borderColor={modalBorder}
        borderRadius="signinInput"
        boxShadow="signin.cardShadow"
        maxW={{ base: "calc(100vw - 2rem)", sm: "90%", md: "660px" }}
        mx={{ base: 4, md: "auto" }}
      >
        <ModalHeader
          fontFamily="signin"
          fontSize="signinTitle"
          fontWeight="signinTitle"
          color="signin.titleColor"
        >
          Edit item
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <FormControl>
                <FormLabel
                  fontFamily="signin"
                  fontSize="signinLabel"
                  fontWeight="signinLabel"
                  color="signin.labelColor"
                >
                  Title
                </FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  bg="signin.inputBg"
                  borderWidth="1px"
                  borderColor="signin.inputBorder"
                  borderRadius="signinInput"
                  fontSize="signinLabel"
                  fontFamily="signin"
                  color="signin.titleColor"
                  _focus={{ borderColor: "signin.inputBorder", boxShadow: "0 0 0 1px var(--chakra-colors-signin-inputBorder)" }}
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  fontFamily="signin"
                  fontSize="signinLabel"
                  fontWeight="signinLabel"
                  color="signin.labelColor"
                >
                  Content
                </FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  bg="signin.inputBg"
                  borderWidth="1px"
                  borderColor="signin.inputBorder"
                  borderRadius="signinInput"
                  fontSize="signinLabel"
                  fontFamily="signin"
                  color="signin.titleColor"
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
                >
                  Image (optional)
                </FormLabel>
                {imageDataUrl ? (
                  <Box>
                    <Box
                      as="img"
                      src={imageDataUrl}
                      alt="Attachment"
                      maxH="140px"
                      maxW="100%"
                      borderRadius="8px"
                      borderWidth="1px"
                      borderColor="signin.cardBorder"
                      objectFit="cover"
                      mb="0.5rem"
                    />
                    <Button
                      size="sm"
                      fontFamily="signin"
                      fontSize="signinLabel"
                      variant="outline"
                      borderColor="signin.inputBorder"
                      color="signin.titleColor"
                      onClick={handleRemoveImage}
                      _hover={{ bg: "blackAlpha.50" }}
                    >
                      Remove image
                    </Button>
                  </Box>
                ) : (
                  <Box
                    as="label"
                    htmlFor={`edit-post-file-${post.id}`}
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
                      id={`edit-post-file-${post.id}`}
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ position: "absolute", width: 0, height: 0, opacity: 0, overflow: "hidden" }}
                      tabIndex={0}
                    />
                    <span>Choose File</span>
                    <span flex={1} noOfLines={1} title={fileName || "No file chosen"}>
                      {fileName || "No file chosen"}
                    </span>
                  </Box>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2} flexWrap="wrap" justifyContent="flex-end">
            <Button
              type="button"
              variant="outline"
              bg="transparent"
              color="#000000"
              {...buttonCommon}
              onClick={onClose}
              _hover={{ bg: "blackAlpha.50" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg={isDisabled ? "signin.buttonDisabledBg" : "#47B960"}
              color="#FFFFFF"
              {...buttonCommon}
              isDisabled={isDisabled}
              isLoading={mutation.isPending}
              _hover={isDisabled ? {} : { opacity: 0.9 }}
            >
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
