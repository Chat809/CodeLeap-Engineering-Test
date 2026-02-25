"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const modalOverlayBg = "#777777CC";
const modalBorderColor = "#999999";
const modalButtonStyles = {
  fontFamily: "signin",
  fontSize: "16px",
  fontWeight: 700,
  borderRadius: "8px",
  borderWidth: "1px",
  borderColor: modalBorderColor,
  w: "120px",
  h: "32px",
};

export function SignOutConfirmModal({ isOpen, onClose, onConfirm }: SignOutConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={modalOverlayBg} />
      <ModalContent
        bg="signin.cardBg"
        borderWidth="1px"
        borderColor={modalBorderColor}
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
          Are you sure you want to sign out?
        </ModalHeader>
        <ModalBody fontFamily="signin" fontSize="signinLabel" color="signin.labelColor">
          You will need to sign in again to access your account.
        </ModalBody>
        <ModalFooter gap={2} flexWrap="wrap" justifyContent="flex-end">
          <Button
            type="button"
            variant="outline"
            bg="transparent"
            color="#000000"
            {...modalButtonStyles}
            onClick={onClose}
            _hover={{ bg: "blackAlpha.50" }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            bg="red.500"
            color="#FFFFFF"
            {...modalButtonStyles}
            onClick={() => onConfirm()}
            _hover={{ opacity: 0.9 }}
          >
            Sign out
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
