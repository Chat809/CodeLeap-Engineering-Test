"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { layout } from "@/theme";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { fetchPosts, type PaginatedResponse } from "@/lib/api";
import type { Post } from "@/types/post";
import { PostCard } from "./PostCard";

export type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

function sortPosts(posts: Post[], sort: SortOption): Post[] {
  const copy = [...posts];
  switch (sort) {
    case "date-desc":
      return copy.sort(
        (a, b) => new Date(b.created_datetime).getTime() - new Date(a.created_datetime).getTime()
      );
    case "date-asc":
      return copy.sort(
        (a, b) => new Date(a.created_datetime).getTime() - new Date(b.created_datetime).getTime()
      );
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
    case "title-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: "base" }));
    default:
      return copy;
  }
}

interface PostListProps {
  currentUsername: string | null;
}

/** Lists all posts from the server (all users). Edit/delete only for current user (PostCard). */
export function PostList({ currentUsername }: PostListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => fetchPosts(pageParam) as Promise<PaginatedResponse<Post>>,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    initialPageParam: null as string | null,
  });

  useEffect(() => {
    if (data?.pages?.length && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [data?.pages?.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const rawPosts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((p) => p.results);
  }, [data?.pages]);

  const posts = useMemo(() => sortPosts(rawPosts, sortBy), [rawPosts, sortBy]);

  const sortLabels: Record<SortOption, string> = {
    "date-desc": "Newest first",
    "date-asc": "Oldest first",
    "title-asc": "Title A → Z",
    "title-desc": "Title Z → A",
  };

  if (isLoading) {
    return (
      <Box py="2rem" display="flex" justifyContent="center">
        <Spinner color="signin.buttonBg" size="lg" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box py="2rem" textAlign="center" fontFamily="signin" fontSize="signinLabel" color="signin.titleColor">
        Failed to load posts.{" "}
        <Button
          variant="link"
          color="signin.buttonBg"
          fontFamily="signin"
          fontSize="signinLabel"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box py="2rem" textAlign="center" fontFamily="signin" fontSize="signinLabel" color="signin.timestampColor">
        No posts yet. Create the first one!
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={layout.gap} spacing={0} w="100%">
      <FormControl w="100%" maxW="280px">
        <FormLabel
          fontFamily="signin"
          fontSize="signinLabel"
          fontWeight="signinLabel"
          color="signin.labelColor"
          mb="0.25rem"
        >
          Order by
        </FormLabel>
        <Menu>
          <MenuButton
            as={Button}
            variant="outline"
            w="auto"
            minW="0"
            px="1.5rem"
            h="2.5rem"
            justifyContent="space-between"
            fontFamily="signin"
            fontSize="signinLabel"
            fontWeight="signinLabel"
            color="#777777"
            bg="signin.inputBg"
            borderWidth="1px"
            borderColor="signin.inputBorder"
            borderRadius="8px"
            _hover={{ borderColor: "signin.buttonBg" }}
            _expanded={{ borderColor: "signin.buttonBg", boxShadow: "0 0 0 1px var(--chakra-colors-signin-buttonBg)" }}
            transition="border-color 0.2s, box-shadow 0.2s"
            rightIcon={
              <Box as="span" fontSize="0.75rem" aria-hidden>
                ▼
              </Box>
            }
          >
            {sortLabels[sortBy]}
          </MenuButton>
          <MenuList
            bg="signin.buttonBg"
            border="none"
            borderRadius="8px"
            py={0}
            overflow="hidden"
            minW="100%"
          >
            {(["date-desc", "date-asc", "title-asc", "title-desc"] as const).map((option) => (
              <MenuItem
                key={option}
                fontFamily="signin"
                fontSize="signinLabel"
                color="#FFFFFF"
                bg="transparent"
                _hover={{ bg: "whiteAlpha.300" }}
                cursor="pointer"
                onClick={() => setSortBy(option)}
                borderRadius="8px"
                transition="background 0.15s"
              >
                {sortLabels[option]}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>
      {posts.map((post, index) => (
        <Box
          key={post.id}
          w="100%"
          sx={{
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(8px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            animation: "fadeIn 0.35s ease-out backwards",
            animationDelay: `${Math.min(index * 0.04, 0.4)}s`,
          }}
        >
          <PostCard
            post={post}
            currentUsername={currentUsername}
            onDeleted={refetch}
            onUpdated={refetch}
          />
        </Box>
      ))}
      {hasNextPage && (
        <Box py="1rem" display="flex" justifyContent="center">
          <Button
            fontFamily="signin"
            fontSize="signinButton"
            fontWeight="signinButton"
            bg="signin.buttonBg"
            color="signin.buttonText"
            borderRadius="signinButton"
            _hover={{ opacity: 0.9 }}
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Load more
          </Button>
        </Box>
      )}
    </VStack>
  );
}
