import type { ReactNode } from "react";
import { apiClient } from "./apiClient";
import { getLoggedInUserId, getUsers } from "./users";

export type Post = {
    _id: string;
    author: string; 
    authorName?: string; // Optional, can be fetched separately
    content: string;
    image?: string;
    likes: string[]; 
    comments: string[];
    createdAt: string;
    updatedAt: string;
};




// Fetches feed for the user == all posts of the users in his following list,
// if Guest = latest posts of all users
export async function fetchPosts(userId: string): Promise<Post[]> {
  console.log("Fetching posts for user:", userId);
   try {
        const response = await apiClient.get(`/posts/${userId}`);
        console.log("Fetched posts:", response.data);
        return response.data as Post[];
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

export async function fetchOwnPosts(userId: string): Promise<Post[]> {
  const message = await getUsers();
  console.log("Verifying connection to server:", message);
    
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(mockMyPosts);
        }, 1000);
    });
}

export async function getPost(postId: string): Promise<Post> {
    const message = await getUsers();
    console.log("Verifying connection to server:", message);
    
    const post = mockPosts.find(p => p._id === postId);
    if (!post) {
        console.log (`Post with ID ${postId} not found`);
        return new Promise((_, reject) => {
        setTimeout(() => {        
          reject(new Error("Post not found"));
        }, 1000);
    });
    }
    return new Promise((resolve) => {
        setTimeout(() => {        
          resolve(post);
        }, 1000);
    });
}

export async function addComment(commentId: string, postId: string): Promise<boolean> {
        
    console.log(`Adding comment ${commentId} to post ${postId}`);
    const post = mockPosts.find(p => p._id === postId);
    if (!post) {
        console.error(`Post with ID ${postId} not found`);
        return Promise.reject(new Error(`Post with ID ${postId} not found`));
    }
    post.comments.push(commentId);    
    console.log(`Comment ${commentId} added to post ${postId}`);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Comment ${commentId} added to ${postId} successfully`);
            resolve(true);
        }, 1000);
    });
}

export async function likePost(postId: string): Promise<Post> {
    const post = mockPosts.find(p => p._id === postId);
    const currentUserId = getLoggedInUserId();
    console.log(`Toggling like for post with ID: ${postId}, likes before toggle:`, post?.likes);
    if (!post) {
        console.error(`Post with ID ${postId} not found`);
        return Promise.reject(new Error(`Post with ID ${postId} not found`));
    }
    post.likes = post.likes.includes(currentUserId) ? post.likes.filter(like => like !== currentUserId) : [...post.likes, currentUserId];
    console.log(`Likes after toggle:`, post.likes);
    post.updatedAt = new Date().toISOString();
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Comment with ID ${postId} liked`);
            resolve(post);
        }, 1000);
    });
}


const mockPosts: Post[] = [
  {
    _id: "1",
    author: "user1",
    authorName: "johnDoe",
    content: "Hello SocialSphere! 🚀",
    image: "https://placehold.co/400x200",
    likes: ["user2", "user3"],
    comments: ["c1", "c2"],
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    _id: "2",
    author: "user2",
    authorName: "Jane Smith",
    content: "Enjoying the new platform. Great work! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: undefined,
    likes: ["user1"],
    comments: ["c3"],
    createdAt: "2024-06-02T12:30:00Z",
    updatedAt: "2024-06-02T12:30:00Z",
  },
  {
    _id: "3",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Check out this cool photo!",
    image: "https://placehold.co/400x200?text=Photo",
    likes: [],
    comments: [],
    createdAt: "2024-06-03T09:15:00Z",
    updatedAt: "2024-06-03T09:15:00Z",
  },
  {
    _id: "4",
    author: "user4",
    authorName: "Alice Lee",
    content: "Anyone up for a chat?",
    image: undefined,
    likes: ["user1", "user3"],
    comments: ["c4"],
    createdAt: "2024-06-04T14:45:00Z",
    updatedAt: "2024-06-04T14:45:00Z",
  },
  {
    _id: "5",
    author: "user5",
    authorName: "Charlie Kim",
    content: "Just joined SocialSphere! Excited to connect.",
    image: "https://placehold.co/400x200?text=Welcome",
    likes: [],
    comments: [],
    createdAt: "2024-06-05T08:20:00Z",
    updatedAt: "2024-06-05T08:20:00Z",
  },
];

const mockMyPosts: Post[] = [
  {
    _id: "11",
    author: "user1",
    content: "Hello SocialSphere! 🚀",
    image: "https://placehold.co/400x200",
    likes: ["user2", "user3"],
    comments: ["c11", "c12"],
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    _id: "12",
    author: "user1",
    content: "Enjoying the new platform. Great work! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: undefined,
    likes: ["user5"],
    comments: ["c13"],
    createdAt: "2024-06-02T12:30:00Z",
    updatedAt: "2024-06-02T12:30:00Z",
  },
  {
    _id: "13",
    author: "user1",
    content: "Check out this cool photo!",
    image: "https://placehold.co/400x200?text=Photo",
    likes: [],
    comments: ["c15","c16","c17"],
    createdAt: "2024-06-03T09:15:00Z",
    updatedAt: "2024-06-03T09:15:00Z",
  },
  {
    _id: "14",
    author: "user1",
    content: "Anyone up for a chat?",
    image: undefined,
    likes: ["user5", "user3"],
    comments: ["c14"],
    createdAt: "2024-06-04T14:45:00Z",
    updatedAt: "2024-06-04T14:45:00Z",
  },
  {
    _id: "15",
    author: "user1",
    content: "Just joined SocialSphere! Excited to connect.",
    image: "https://placehold.co/400x200?text=Welcome",
    likes: ["user2", "user3", "user4", "user5"],
    comments: ["c18", "c19"],
    createdAt: "2024-06-05T08:20:00Z",
    updatedAt: "2024-06-05T08:20:00Z",
  },
];

export async function fetchPostsByContent(searchTerm: string): Promise<Post[]> {
    console.log("fetchPostsByContent called with searchTerm:", searchTerm);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (!searchTerm) {
        return [];
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

    const filteredPosts = mockPosts.filter(post =>
        post.content.toLowerCase().includes(lowerCaseSearchTerm)
    );

    console.log("Filtered posts:", filteredPosts);

    return filteredPosts;
}