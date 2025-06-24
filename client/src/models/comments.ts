export type Comment = {
    _id: string;
    author: string;
    content: string;
    image?: string;
    likes: string[];
    createdAt: string;
    updatedAt: string;
};

export async function getComments(commentsId: string[]): Promise<Comment[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockComments.filter(comment => commentsId.includes(comment._id)));
        }, 1000);
    });
}

const mockComments: Comment[] = [
  // Comments for mockPosts
  {
    _id: "c1",
    author: "user2",
    content: "Welcome to SocialSphere! 🚀",
    likes: ["user3"],
    createdAt: "2024-06-01T11:00:00Z",
    updatedAt: "2024-06-01T11:00:00Z",
  },
  {
    _id: "c2",
    author: "user3",
    content: "Glad to see you here!",
    likes: [],
    createdAt: "2024-06-01T12:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
  },
  {
    _id: "c3",
    author: "user1",
    content: "Thanks for the feedback!",
    likes: ["user2"],
    createdAt: "2024-06-02T13:00:00Z",
    updatedAt: "2024-06-02T13:00:00Z",
  },
  {
    _id: "c4",
    author: "user5",
    content: "I'm up for a chat!",
    likes: [],
    createdAt: "2024-06-04T15:00:00Z",
    updatedAt: "2024-06-04T15:00:00Z",
  },

  // Comments for mockMyPosts
  {
    _id: "c11",
    author: "user2",
    content: "Nice post!",
    likes: ["user3"],
    createdAt: "2024-06-01T11:10:00Z",
    updatedAt: "2024-06-01T11:10:00Z",
  },
  {
    _id: "c12",
    author: "user3",
    content: "Welcome!",
    likes: [],
    createdAt: "2024-06-01T12:10:00Z",
    updatedAt: "2024-06-01T12:10:00Z",
  },
  {
    _id: "c13",
    author: "user5",
    content: "Great work!",
    likes: ["user1"],
    createdAt: "2024-06-02T13:10:00Z",
    updatedAt: "2024-06-02T13:10:00Z",
  },
  {
    _id: "c14",
    author: "user3",
    content: "Let's chat!",
    likes: [],
    createdAt: "2024-06-04T15:10:00Z",
    updatedAt: "2024-06-04T15:10:00Z",
  },
  {
    _id: "c15",
    author: "user2",
    content: "Nice photo!",
    likes: [],
    createdAt: "2024-06-03T10:00:00Z",
    updatedAt: "2024-06-03T10:00:00Z",
  },
  {
    _id: "c16",
    author: "user4",
    content: "Cool!",
    likes: [],
    createdAt: "2024-06-03T10:10:00Z",
    updatedAt: "2024-06-03T10:10:00Z",
  },
  {
    _id: "c17",
    author: "user5",
    content: "Love it!",
    likes: ["user1"],
    createdAt: "2024-06-03T10:20:00Z",
    updatedAt: "2024-06-03T10:20:00Z",
  },
  {
    _id: "c18",
    author: "user2",
    content: "Congrats on joining!",
    likes: [],
    createdAt: "2024-06-05T09:00:00Z",
    updatedAt: "2024-06-05T09:00:00Z",
  },
  {
    _id: "c19",
    author: "user3",
    content: "Welcome aboard!",
    likes: [],
    createdAt: "2024-06-05T09:10:00Z",
    updatedAt: "2024-06-05T09:10:00Z",
  },
];