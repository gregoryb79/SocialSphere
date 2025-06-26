import { getLoggedInUserId, getLoggedInUserName } from "./users";

export type Comment = {
    _id: string;
    author: string;
    authorName?: string; // Optional, can be fetched separately
    content: string;
    image?: string;
    likes: string[];
    createdAt: string;
    updatedAt: string;
};

export async function getComments(commentsId: string[]): Promise<Comment[]> {

    const comments = mockComments.filter(comment => commentsId.includes(comment._id))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(comments);
        }, 1000);
    });
}

export async function likeComment(commentId: string): Promise<Comment> {
    const comment = mockComments.find(c => c._id === commentId);
    const currentUserId = getLoggedInUserId();
    console.log(`Toggling like for comment with ID: ${commentId}, likes before toggle:`, comment?.likes);
    if (!comment) {
        console.error(`Comment with ID ${commentId} not found`);
        return Promise.reject(new Error(`Comment with ID ${commentId} not found`));
    }
    comment.likes = comment.likes.includes(currentUserId) ? comment.likes.filter(like => like !== currentUserId) : [...comment.likes, currentUserId];
    console.log(`Likes after toggle:`, comment.likes);
    comment.updatedAt = new Date().toISOString();
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Comment with ID ${commentId} liked`);
            resolve(comment);
        }, 1000);
    });
}

export async function postComment(commentText: string): Promise<string> {
    console.log(`Posting comment:`, commentText);
    if (!commentText || commentText.trim() === "") {
        console.error("Comment text cannot be empty");       
        return Promise.reject(new Error("Comment text cannot be empty"));        
    }
    const comment: Comment = {
        _id: `c${mockComments.length + 1}`,
        author: getLoggedInUserId(),
        authorName: getLoggedInUserName(), // Placeholder, can be fetched from user data
        content: commentText,
        image: undefined, // No image for this comment
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    console.log(`Comment object created:`, comment);
    mockComments.push(comment);
    console.log(`Comment added to mockComments:`, mockComments);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Comment posted:`, comment);            
            resolve(comment._id);
        }, 1000);
    });
}

const mockComments: Comment[] = [
  {
    _id: "c1",
    author: "user2",
    authorName: "Jane Smith",
    content: "Welcome to SocialSphere! 🚀",
    likes: ["user3"],
    createdAt: "2024-06-01T11:00:00Z",
    updatedAt: "2024-06-01T11:00:00Z",
  },
  {
    _id: "c2",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Glad to see you here!",
    likes: [],
    createdAt: "2024-06-01T12:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
  },
  {
    _id: "c3",
    author: "user1",
    authorName: "johnDoe",
    content: "Thanks for the feedback!",
    likes: ["user2"],
    createdAt: "2024-06-02T13:00:00Z",
    updatedAt: "2024-06-02T13:00:00Z",
  },
  {
    _id: "c4",
    author: "user5",
    authorName: "Charlie Kim",
    content: "I'm up for a chat!",
    likes: [],
    createdAt: "2024-06-04T15:00:00Z",
    updatedAt: "2024-06-04T15:00:00Z",
  },
  {
    _id: "c5",
    author: "user4",
    authorName: "Alice Lee",
    content: "Nice post!",
    likes: ["user1"],
    createdAt: "2024-06-05T09:00:00Z",
    updatedAt: "2024-06-05T09:00:00Z",
  },
  {
    _id: "c11",
    author: "user2",
    authorName: "Jane Smith",
    content: "Nice post!",
    likes: ["user3"],
    createdAt: "2024-06-01T11:10:00Z",
    updatedAt: "2024-06-01T11:10:00Z",
  },
  {
    _id: "c12",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Welcome!",
    likes: [],
    createdAt: "2024-06-01T12:10:00Z",
    updatedAt: "2024-06-01T12:10:00Z",
  },
  {
    _id: "c13",
    author: "user5",
    authorName: "Charlie Kim",
    content: "Great work!",
    likes: ["user1"],
    createdAt: "2024-06-02T13:10:00Z",
    updatedAt: "2024-06-02T13:10:00Z",
  },
  {
    _id: "c14",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Let's chat!",
    likes: [],
    createdAt: "2024-06-04T15:10:00Z",
    updatedAt: "2024-06-04T15:10:00Z",
  },
  {
    _id: "c15",
    author: "user2",
    authorName: "Jane Smith",
    content: "Nice photo!",
    likes: [],
    createdAt: "2024-06-03T10:00:00Z",
    updatedAt: "2024-06-03T10:00:00Z",
  },
  {
    _id: "c16",
    author: "user4",
    authorName: "Alice Lee",
    content: "Cool!",
    likes: [],
    createdAt: "2024-06-03T10:10:00Z",
    updatedAt: "2024-06-03T10:10:00Z",
  },
  {
    _id: "c17",
    author: "user5",
    authorName: "Charlie Kim",
    content: "Love it!",
    likes: ["user1"],
    createdAt: "2024-06-03T10:20:00Z",
    updatedAt: "2024-06-03T10:20:00Z",
  },
  {
    _id: "c18",
    author: "user2",
    authorName: "Jane Smith",
    content: "Congrats on joining!",
    likes: [],
    createdAt: "2024-06-05T09:00:00Z",
    updatedAt: "2024-06-05T09:00:00Z",
  },
  {
    _id: "c19",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Welcome aboard!",
    likes: [],
    createdAt: "2024-06-05T09:10:00Z",
    updatedAt: "2024-06-05T09:10:00Z",
  },
];