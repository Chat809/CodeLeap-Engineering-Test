"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/lib/api";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  onDeleted: () => void;
}

export function DeleteConfirmModal({ isOpen, onClose, postId, onDeleted }: DeleteConfirmModalProps) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onDeleted();
      onClose();
      toast({ title: "Post deleted", status: "success", duration: 2000, isClosable: true });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, status: "error", isClosable: true });
    },
  });

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
          Are you sure you want to delete this item?
        </ModalHeader>
        <ModalBody fontFamily="signin" fontSize="signinLabel" color="signin.labelColor">
          This action cannot be undone.
        </ModalBody>
        <ModalFooter gap={2} flexWrap="wrap" justifyContent="flex-end">
          <Button
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
            bg="red.500"
            color="#FFFFFF"
            {...buttonCommon}
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
            _hover={{ opacity: 0.9 }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
