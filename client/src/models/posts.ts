import { apiClient } from "./apiClient";
import { getUsers } from "./users";

export type Post = {
    _id: string;
    author: string; 
    content: string;
    image?: string;
    likes: string[]; 
    comments: string[];
    createdAt: string;
    updatedAt: string;
};

export async function fetchPosts(): Promise<Post[]> {
    const message = getUsers();
    console.log("Verifying connection to server:", message);
    
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(mockPosts);
        }, 1000);
    });
}

const mockPosts: Post[] = [
  {
    _id: "1",
    author: "user1",
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
    content: "Enjoying the new platform. Great work!",
    image: undefined,
    likes: ["user1"],
    comments: ["c3"],
    createdAt: "2024-06-02T12:30:00Z",
    updatedAt: "2024-06-02T12:30:00Z",
  },
  {
    _id: "3",
    author: "user3",
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
    content: "Just joined SocialSphere! Excited to connect.",
    image: "https://placehold.co/400x200?text=Welcome",
    likes: [],
    comments: [],
    createdAt: "2024-06-05T08:20:00Z",
    updatedAt: "2024-06-05T08:20:00Z",
  },
];