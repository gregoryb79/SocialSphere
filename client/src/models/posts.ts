import { apiClient } from "./apiClient";
import { getComments } from "./comments";
import { getLoggedInUserId, getUsers } from "./users";
import { type Comment } from "./comments";

// export type Post = {
//     _id: string;
//     author: string; 
//     authorName?: string; 
//     parentId?: string; 
//     content: string;
//     image?: string;
//     likes: string[]; 
//     comments: string[];
//     createdAt: string;
//     updatedAt: string;
// };


// Fetches feed for the user == all posts of the users in his following list,
// if Guest = latest posts of all users
export async function fetchPosts(userId: string): Promise<Comment[]> {
  console.log("Fetching posts for user:", userId);
   try {
        const response = await apiClient.get(`/posts/${userId}`);
        console.log("Fetched posts:", response.data);
        return response.data as Comment[];
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}
/*
export async function fetchOwnPosts(userId: string): Promise<Comment[]> {
  const message = await getUsers();
  console.log("Verifying connection to server:", message);
    
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(mockMyPosts);
        }, 1000);
    });
}
*/

export async function getPost(postId: string): Promise<Comment> {
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

// export async function addComment(commentId: string, postId: string): Promise<boolean> {
        
//     console.log(`Adding comment ${commentId} to post ${postId}`);
//     const post = mockPosts.find(p => p._id === postId);
//     if (!post) {
//         console.error(`Post with ID ${postId} not found`);
//         return Promise.reject(new Error(`Post with ID ${postId} not found`));
//     }
//     post.comments.push(commentId);    
//     console.log(`Comment ${commentId} added to post ${postId}`);
    
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             console.log(`Comment ${commentId} added to ${postId} successfully`);
//             resolve(true);
//         }, 1000);
//     });
// }

export async function likePost(postId: string): Promise<Comment> {
    // const post = mockPosts.find(p => p._id === postId);
    const currentUserId = getLoggedInUserId();

    try{
      const response = await apiClient.post(`/comments/like`,{
        postId,
        userId: currentUserId
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Failed to like/unlike post: ${response.statusText}`);        
      }

      const updatedPost = await getComments([postId]);      
      return updatedPost[0];
    }catch (error) {
      console.error("Error liking post:", error);
      return Promise.reject(error);
    }  
}


const mockPosts: Comment[] = [
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
/*
const mockMyPosts: Comment[] = [
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

*/

export async function fetchPostsByContent(searchTerm: string): Promise<Comment[]> {
    console.log("Fetching posts by content from backend:", searchTerm);

    if (!searchTerm) {
        return [];
    }

    try {
        const response = await apiClient.get(`/search/posts?q=${encodeURIComponent(searchTerm)}`);

        const backendPosts = response.data;

        if (!backendPosts || backendPosts.length === 0) {
            return [];
        }
        console.log("Fetched posts from backend:", backendPosts);

        const clientPosts = backendPosts.map((backendPost: Comment) => ({
            _id: backendPost._id,
            author: backendPost.author, 
            authorName: backendPost.authorName, 
            content: backendPost.content,
            image: backendPost.image,
            likes: Array.isArray(backendPost.likes) ? backendPost.likes : (backendPost.likes ? JSON.parse(backendPost.likes) : []),
            comments: Array.isArray(backendPost.comments) ? backendPost.comments : (backendPost.comments ? JSON.parse(backendPost.comments) : []),
            createdAt: backendPost.createdAt, 
            updatedAt: backendPost.updatedAt, 
            parentId: backendPost.parentId,
        }));

        console.log("Fetched and mapped posts:", clientPosts);
        return clientPosts;

    } catch (error) {
        console.error("Error fetching posts by content:", error);
        throw error;
    }
};



export async function fetchOwnPosts(userId: string): Promise<Comment[]> {
  try {
    const { data } = await apiClient.get<Comment[]>(`/posts/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching own posts:", error);
    throw error;
  }
}



