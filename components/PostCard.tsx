"use client";

import { Box, Button, IconButton, Input, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { Post } from "@/types/post";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { EditPostModal } from "./EditPostModal";
import { ContentWithMentions } from "./ContentWithMentions";
import {
  getLikes,
  toggleLike,
  getComments,
  addComment,
  getCommentLikes,
  toggleCommentLike,
  getMedia,
  type StoredComment,
} from "@/lib/localStoragePosts";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

interface PostCardProps {
  post: Post;
  currentUsername: string | null;
  onDeleted: () => void;
  onUpdated: () => void;
}

export const PostCard = memo(function PostCard({ post, currentUsername, onDeleted, onUpdated }: PostCardProps) {
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const isOwn =
    currentUsername !== null &&
    post.username.trim().toLowerCase() === currentUsername.trim().toLowerCase();

  const [likeCount, setLikeCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [commentsList, setCommentsList] = useState<StoredComment[]>([]);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentLikesVersion, setCommentLikesVersion] = useState(0);

  useEffect(() => {
    const likes = getLikes()[post.id] ?? [];
    setLikeCount(likes.length);
    setLikedByMe(
      currentUsername !== null && likes.includes(currentUsername.trim())
    );
    setCommentsList(getComments()[post.id] ?? []);
    setMediaUrl(getMedia()[post.id] ?? null);
  }, [post.id, currentUsername]);

  const handleToggleLike = () => {
    if (!currentUsername) return;
    toggleLike(post.id, currentUsername.trim());
    const likes = getLikes()[post.id] ?? [];
    setLikeCount(likes.length);
    setLikedByMe(likes.includes(currentUsername.trim()));
  };

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || !currentUsername) return;
    const comment: StoredComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      username: currentUsername.trim(),
      content: trimmed,
      created_datetime: new Date().toISOString(),
    };
    addComment(post.id, comment);
    setCommentsList(getComments()[post.id] ?? []);
    setCommentText("");
  };

  const handleAddReply = (parentId: string) => {
    const trimmed = replyText.trim();
    if (!trimmed || !currentUsername) return;
    const comment: StoredComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      username: currentUsername.trim(),
      content: trimmed,
      created_datetime: new Date().toISOString(),
      parentId,
    };
    addComment(post.id, comment);
    setCommentsList(getComments()[post.id] ?? []);
    setReplyToId(null);
    setReplyText("");
  };

  const topLevelComments = commentsList.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => commentsList.filter((c) => c.parentId === parentId);

  return (
    <Box
      w="100%"
      bg="signin.cardBg"
      borderWidth="1px"
      borderColor="signin.cardBorder"
      borderRadius="signinCard"
      boxShadow="signin.cardShadow"
      overflow="hidden"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box
        bg="signin.buttonBg"
        px="1rem"
        py="0.75rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          fontFamily="signin"
          fontSize="signinTitle"
          fontWeight="signinTitle"
          color="signin.buttonText"
          flex={1}
          minW={0}
          noOfLines={1}
        >
          {post.title}
        </Text>
        {isOwn && (
          <Box display="flex" justifyContent="space-between" gap="30px" ml={2} alignItems="center" flexShrink={0}>
            <IconButton
              aria-label="Edit post"
              w="31.2px"
              h="30px"
              minW="31.2px"
              minH="30px"
              p={0}
              variant="ghost"
              onClick={editModal.onOpen}
              transition="background 0.2s, transform 0.15s"
              _hover={{ bg: "whiteAlpha.300", transform: "scale(1.08)" }}
              _active={{ transform: "scale(0.96)" }}
              sx={{ "& .chakra-iconbutton__icon": { width: "100%", height: "100%" } }}
              icon={
                <svg width="31.2" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.10107 21.2663L14.8386 21.2475L27.3615 9.3225C27.853 8.85 28.1234 8.2225 28.1234 7.555C28.1234 6.8875 27.853 6.26 27.3615 5.7875L25.2995 3.805C24.3166 2.86 22.6017 2.865 21.6266 3.80125L9.10107 15.7288V21.2663ZM23.4611 5.5725L25.527 7.55125L23.4507 9.52875L21.3887 7.5475L23.4611 5.5725ZM11.7014 16.7713L19.5412 9.305L21.6032 11.2875L13.7647 18.7513L11.7014 18.7575V16.7713Z" fill="white" />
                  <path d="M6.50067 26.25H24.7026C26.1367 26.25 27.3029 25.1287 27.3029 23.75V12.915L24.7026 15.415V23.75H10.6065C10.5727 23.75 10.5376 23.7625 10.5038 23.7625C10.4609 23.7625 10.418 23.7512 10.3738 23.75H6.50067V6.25H15.4027L18.003 3.75H6.50067C5.06661 3.75 3.90039 4.87125 3.90039 6.25V23.75C3.90039 25.1287 5.06661 26.25 6.50067 26.25Z" fill="white" />
                </svg>
              }
            />
            <IconButton
              aria-label="Delete post"
              w="31.2px"
              h="30px"
              minW="31.2px"
              minH="30px"
              p={0}
              variant="ghost"
              onClick={deleteModal.onOpen}
              transition="background 0.2s, transform 0.15s"
              _hover={{ bg: "whiteAlpha.300", transform: "scale(1.08)" }}
              _active={{ transform: "scale(0.96)" }}
              sx={{ "& .chakra-iconbutton__icon": { width: "100%", height: "100%" } }}
              icon={
                <svg width="31.2" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.80087 23.75C7.80087 25.125 8.971 26.25 10.4011 26.25H20.8023C22.2324 26.25 23.4025 25.125 23.4025 23.75V8.75H7.80087V23.75ZM10.9992 14.85L12.8324 13.0875L15.6017 15.7375L18.358 13.0875L20.1912 14.85L17.4349 17.5L20.1912 20.15L18.358 21.9125L15.6017 19.2625L12.8454 21.9125L11.0122 20.15L13.7685 17.5L10.9992 14.85ZM20.1522 5L18.852 3.75H12.3514L11.0512 5H6.50073V7.5H24.7027V5H20.1522Z" fill="white" />
                </svg>
              }
            />
          </Box>
        )}
      </Box>
      <Box p="1rem" pt="0.75rem">
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="0.5rem" mb="0.5rem" flexWrap="wrap">
          <Text
            as="span"
            fontFamily="signin"
            fontSize="signinPostMeta"
            fontWeight="signinTitle"
            color="signin.timestampColor"
          >
            @{post.username}
          </Text>
          <Text
            as="span"
            fontFamily="signin"
            fontSize="signinPostMeta"
            fontWeight="signinLabel"
            color="signin.timestampColor"
            textAlign="right"
          >
            {formatDate(post.created_datetime)}
          </Text>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          mb="0.5rem"
          fontFamily="signin"
          fontSize="signinLabel"
          color="signin.timestampColor"
        >
          <IconButton
            aria-label={likedByMe ? "Unlike" : "Like"}
            size="sm"
            variant="ghost"
            color={likedByMe ? "red.400" : "signin.timestampColor"}
            onClick={handleToggleLike}
            transition="color 0.2s, transform 0.15s"
            _hover={{ transform: "scale(1.1)" }}
            _active={{ transform: "scale(0.95)" }}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill={likedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            }
          />
          <Text as="span" fontWeight="signinLabel">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </Text>
        </Box>
        <Text
          fontFamily="signin"
          fontSize="signinLabel"
          fontWeight="signinLabel"
          color="signin.titleColor"
          mb={mediaUrl ? 3 : 0}
        >
          <ContentWithMentions text={post.content} />
        </Text>
        {mediaUrl && (
          <Box mb="1rem" borderRadius="signinInput" overflow="hidden">
            <Box
              as="img"
              src={mediaUrl}
              alt="Post attachment"
              maxH="280px"
              w="100%"
              objectFit="cover"
              display="block"
            />
          </Box>
        )}
        <Box
          borderTopWidth="1px"
          borderColor="signin.cardBorder"
          pt="0.75rem"
          mt="0.5rem"
        >
          <Text
            fontFamily="signin"
            fontSize="signinLabel"
            fontWeight="signinTitle"
            color="signin.titleColor"
            mb="0.5rem"
          >
            Comments ({commentsList.length})
          </Text>
          {topLevelComments.length > 0 && (
            <VStack align="stretch" spacing={2} mb="0.75rem">
              {topLevelComments.map((c) => {
                const likes = getCommentLikes()[c.id] ?? [];
                const likeCount = likes.length;
                const likedByMe =
                  currentUsername !== null && likes.includes(currentUsername.trim());
                const replies = getReplies(c.id);
                return (
                  <Box key={c.id}>
                    <Box
                      pl="0.75rem"
                      py="0.25rem"
                      borderLeftWidth="3px"
                      borderColor="signin.buttonBg"
                      bg="signin.inputBg"
                      borderRadius="4px"
                    >
                      <Text
                        fontFamily="signin"
                        fontSize="signinPostMeta"
                        fontWeight="signinTitle"
                        color="signin.timestampColor"
                        mb="0.15rem"
                      >
                        @{c.username}
                      </Text>
                      <Text
                        fontFamily="signin"
                        fontSize="signinLabel"
                        fontWeight="signinLabel"
                        color="signin.titleColor"
                      >
                        <ContentWithMentions text={c.content} />
                      </Text>
                      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mt="0.25rem">
                        <Text
                          fontFamily="signin"
                          fontSize="signinPlaceholder"
                          color="signin.timestampColor"
                        >
                          {formatDate(c.created_datetime)}
                        </Text>
                        <IconButton
                          aria-label={likedByMe ? "Unlike comment" : "Like comment"}
                          size="xs"
                          variant="ghost"
                          color={likedByMe ? "red.400" : "signin.timestampColor"}
                          onClick={() => {
                            if (!currentUsername) return;
                            toggleCommentLike(c.id, currentUsername.trim());
                            setCommentLikesVersion((v) => v + 1);
                          }}
                          icon={
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={likedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          }
                        />
                        <Text as="span" fontFamily="signin" fontSize="signinPlaceholder" color="signin.timestampColor">
                          {likeCount} {likeCount === 1 ? "like" : "likes"}
                        </Text>
                        {currentUsername && (
                          <Button
                            size="xs"
                            variant="ghost"
                            fontFamily="signin"
                            fontSize="signinPlaceholder"
                            color="signin.buttonBg"
                            fontWeight="signinLabel"
                            onClick={() => setReplyToId(replyToId === c.id ? null : c.id)}
                            _hover={{ bg: "blackAlpha.50" }}
                          >
                            Reply
                          </Button>
                        )}
                      </Box>
                    </Box>
                    {replyToId === c.id && currentUsername && (
                      <Box display="flex" gap={2} alignItems="center" mt="0.5rem" pl="1rem">
                        <Input
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddReply(c.id)}
                          fontFamily="signin"
                          fontSize="signinLabel"
                          color="signin.titleColor"
                          bg="signin.inputBg"
                          borderColor="signin.inputBorder"
                          borderRadius="signinInput"
                          _placeholder={{
                            color: "signin.placeholderColor",
                            fontSize: "signinPlaceholder",
                            fontFamily: "signin",
                          }}
                          size="sm"
                          flex={1}
                        />
                        <Button
                          size="sm"
                          fontFamily="signin"
                          fontSize="signinButton"
                          fontWeight="signinButton"
                          bg="signin.buttonBg"
                          color="signin.buttonText"
                          borderRadius="signinButton"
                          px="1rem"
                          onClick={() => handleAddReply(c.id)}
                          isDisabled={!replyText.trim()}
                          _hover={{ opacity: 0.9 }}
                        >
                          Reply
                        </Button>
                      </Box>
                    )}
                    {replies.length > 0 && (
                      <VStack align="stretch" spacing={2} pl="1.5rem" mt="0.5rem" borderLeftWidth="2px" borderColor="signin.cardBorder">
                        {replies.map((r) => {
                          const rLikes = getCommentLikes()[r.id] ?? [];
                          const rLikeCount = rLikes.length;
                          const rLikedByMe =
                            currentUsername !== null && rLikes.includes(currentUsername.trim());
                          return (
                            <Box
                              key={r.id}
                              pl="0.5rem"
                              py="0.2rem"
                              borderLeftWidth="2px"
                              borderColor="signin.buttonBg"
                              bg="signin.inputBg"
                              borderRadius="4px"
                            >
                              <Text
                                fontFamily="signin"
                                fontSize="signinPostMeta"
                                fontWeight="signinTitle"
                                color="signin.timestampColor"
                                mb="0.1rem"
                              >
                                @{r.username}
                              </Text>
                              <Text
                                fontFamily="signin"
                                fontSize="signinLabel"
                                fontWeight="signinLabel"
                                color="signin.titleColor"
                              >
                                <ContentWithMentions text={r.content} />
                              </Text>
                              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mt="0.15rem">
                                <Text
                                  fontFamily="signin"
                                  fontSize="signinPlaceholder"
                                  color="signin.timestampColor"
                                >
                                  {formatDate(r.created_datetime)}
                                </Text>
                                <IconButton
                                  aria-label={rLikedByMe ? "Unlike" : "Like"}
                                  size="xs"
                                  variant="ghost"
                                  color={rLikedByMe ? "red.400" : "signin.timestampColor"}
                                  onClick={() => {
                                    if (!currentUsername) return;
                                    toggleCommentLike(r.id, currentUsername.trim());
                                    setCommentLikesVersion((v) => v + 1);
                                  }}
                                  icon={
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={rLikedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                  }
                                />
                                <Text as="span" fontFamily="signin" fontSize="signinPlaceholder" color="signin.timestampColor">
                                  {rLikeCount} {rLikeCount === 1 ? "like" : "likes"}
                                </Text>
                              </Box>
                            </Box>
                          );
                        })}
                      </VStack>
                    )}
                  </Box>
                );
              })}
            </VStack>
          )}
          {currentUsername && (
            <Box display="flex" gap={2} alignItems="center">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                fontFamily="signin"
                fontSize="signinLabel"
                color="signin.titleColor"
                bg="signin.inputBg"
                borderColor="signin.inputBorder"
                borderRadius="signinInput"
                _placeholder={{
                  color: "signin.placeholderColor",
                  fontSize: "signinPlaceholder",
                  fontFamily: "signin",
                  fontWeight: "signinLabel",
                }}
                size="sm"
                flex={1}
              />
              <Button
                size="sm"
                fontFamily="signin"
                fontSize="signinButton"
                fontWeight="signinButton"
                bg="signin.buttonBg"
                color="signin.buttonText"
                borderRadius="signinButton"
                px="1rem"
                onClick={handleAddComment}
                isDisabled={!commentText.trim()}
                _hover={{ opacity: 0.9 }}
              >
                Comment
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        postId={post.id}
        onDeleted={onDeleted}
      />
      <EditPostModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        post={post}
        onUpdated={onUpdated}
        onMediaChange={() => setMediaUrl(getMedia()[post.id] ?? null)}
      />
    </Box>
  );
});
