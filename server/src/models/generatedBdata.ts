import { dbClient } from "./db";

// Mock data from client
const mockPosts = [
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

const mockUsers = [
  { id: "user1", username: "johnDoe", email: "john@example.com", password: "hashed_password", bio: "Just another SocialSphere user.", avatar: "https://placehold.co/100x100" },
  { id: "user2", username: "janesmith", email: "jane@example.com", password: "hashed_password", bio: "Frontend Engineer, likes cats.", avatar: "https://placehold.co/100x100" },
  { id: "user3", username: "bobjohnson", email: "bob@example.com", password: "hashed_password", bio: "JS | Node | Travel.", avatar: "https://placehold.co/100x100" },
  { id: "user4", username: "alicelee", email: "alice@example.com", password: "hashed_password", bio: "Designer and developer.", avatar: "https://placehold.co/100x100" },
  { id: "user5", username: "charliekim", email: "charlie@example.com", password: "hashed_password", bio: "New to SocialSphere!", avatar: "https://placehold.co/100x100" },
];

const mockComments = [
  {
    _id: "c1",
    author: "user2",
    authorName: "Jane Smith",
    content: "Welcome to SocialSphere! 🚀",
    likes: ["user3"],
    comments: [],
    parent_id: "p1",
    createdAt: "2024-06-01T11:00:00Z",
    updatedAt: "2024-06-01T11:00:00Z",
  },
  {
    _id: "c2",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Glad to see you here!",
    likes: [],
    comments: [],
    parent_id: "p1",
    createdAt: "2024-06-01T12:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
  },
  {
    _id: "c3",
    author: "user1",
    authorName: "johnDoe",
    content: "Thanks for the feedback!",
    likes: ["user2"],
    comments: [],
    parent_id: "p2",
    createdAt: "2024-06-02T13:00:00Z",
    updatedAt: "2024-06-02T13:00:00Z",
  },
  {
    _id: "c4",
    author: "user5",
    authorName: "Charlie Kim",
    content: "I'm up for a chat!",
    likes: [],
    comments: [],
    parent_id: "p4",
    createdAt: "2024-06-04T15:00:00Z",
    updatedAt: "2024-06-04T15:00:00Z",
  },
  {
    _id: "c5",
    author: "user4",
    authorName: "Alice Lee",
    content: "Nice post!",
    likes: ["user1"],
    comments: [],
    parent_id: "p1",
    createdAt: "2024-06-05T09:00:00Z",
    updatedAt: "2024-06-05T09:00:00Z",
  },
  {
    _id: "c11",
    author: "user2",
    authorName: "Jane Smith",
    content: "Nice post!",
    likes: ["user3"],
    comments: [],
    parent_id: "p1",
    createdAt: "2024-06-01T11:10:00Z",
    updatedAt: "2024-06-01T11:10:00Z",
  },
  {
    _id: "c12",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Welcome!",
    likes: [],
    comments: [],
    parent_id: "p1",
    createdAt: "2024-06-01T12:10:00Z",
    updatedAt: "2024-06-01T12:10:00Z",
  },
  {
    _id: "c13",
    author: "user5",
    authorName: "Charlie Kim",
    content: "Great work!",
    likes: ["user1"],
    comments: [],
    parent_id: "p2",
    createdAt: "2024-06-02T13:10:00Z",
    updatedAt: "2024-06-02T13:10:00Z",
  },
  {
    _id: "c14",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Let's chat!",
    likes: [],
    comments: [],
    parent_id: "p4",
    createdAt: "2024-06-04T15:10:00Z",
    updatedAt: "2024-06-04T15:10:00Z",
  },
  {
    _id: "c15",
    author: "user2",
    authorName: "Jane Smith",
    content: "Nice photo!",
    likes: [],
    comments: [],
    parent_id: "p3",
    createdAt: "2024-06-03T10:00:00Z",
    updatedAt: "2024-06-03T10:00:00Z",
  },
  {
    _id: "c16",
    author: "user4",
    authorName: "Alice Lee",
    content: "Cool!",
    likes: [],
    comments: [],
    parent_id: "p3",
    createdAt: "2024-06-03T10:10:00Z",
    updatedAt: "2024-06-03T10:10:00Z",
  },
  {
    _id: "c17",
    author: "user5",
    authorName: "Charlie Kim",
    content: "Love it!",
    likes: ["user1"],
    comments: [],
    parent_id: "p3",
    createdAt: "2024-06-03T10:20:00Z",
    updatedAt: "2024-06-03T10:20:00Z",
  },
  {
    _id: "c18",
    author: "user2",
    authorName: "Jane Smith",
    content: "Congrats on joining!",
    likes: [],
    comments: [],
    parent_id: "p5",
    createdAt: "2024-06-05T09:00:00Z",
    updatedAt: "2024-06-05T09:00:00Z",
  },
  {
    _id: "c19",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Welcome aboard!",
    likes: [],
    comments: [],
    parent_id: "p5",
    createdAt: "2024-06-05T09:10:00Z",
    updatedAt: "2024-06-05T09:10:00Z",
  },
  {
    _id: "p1",
    author: "user1",
    authorName: "johnDoe",
    content: "Hello SocialSphere! 🚀",
    image: "https://placehold.co/400x200",
    likes: ["user2", "user3"],
    comments: ["c1", "c2"],
    parent_id: null,
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    _id: "p2",
    author: "user2",
    authorName: "Jane Smith",
    content: "Enjoying the new platform. Great work! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: undefined,
    likes: ["user1"],
    comments: ["c3"],
    poparent_id: null,
    createdAt: "2024-06-02T12:30:00Z",
    updatedAt: "2024-06-02T12:30:00Z",
  },
  {
    _id: "p3",
    author: "user3",
    authorName: "Bob Johnson",
    content: "Check out this cool photo!",
    image: "https://placehold.co/400x200?text=Photo",
    likes: [],
    comments: [],
    pparent_id: null,
    createdAt: "2024-06-03T09:15:00Z",
    updatedAt: "2024-06-03T09:15:00Z",
  },
  {
    _id: "p4",
    author: "user4",
    authorName: "Alice Lee",
    content: "Anyone up for a chat?",
    image: undefined,
    likes: ["user1", "user3"],
    comments: ["c4"],
    parent_id: null,
    createdAt: "2024-06-04T14:45:00Z",
    updatedAt: "2024-06-04T14:45:00Z",
  },
  {
    _id: "p5",
    author: "user5",
    authorName: "Charlie Kim",
    content: "Just joined SocialSphere! Excited to connect.",
    image: "https://placehold.co/400x200?text=Welcome",
    likes: [],
    comments: [],
    parent_id: null,
    createdAt: "2024-06-05T08:20:00Z",
    updatedAt: "2024-06-05T08:20:00Z",
  },
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if database is already seeded
    const existingUsers = await dbClient.execute("SELECT COUNT(*) as count FROM users");
    const userCount = existingUsers.rows[0].count as number;
    
    if (userCount > 0) {
      console.log("✅ Database already seeded. Skipping...");
      return;
    }

    // 1. Insert users first (posts reference users)
    console.log("📝 Inserting users...");
    for (const user of mockUsers) {
      await dbClient.execute({
        sql: `INSERT OR REPLACE INTO users (id, username, email, password, bio, avatar, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          user.id,
          user.username,
          user.email,
          user.password,
          user.bio,
          user.avatar,
          new Date().toISOString(),
          new Date().toISOString(),
        ],
      });
    }
    console.log(`✅ Inserted ${mockUsers.length} users`);

    // 2. Insert posts
    console.log("📰 Inserting posts...");
    for (const post of mockPosts) {
      await dbClient.execute({
        sql: `INSERT OR REPLACE INTO posts (id, author_id, content, image, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          post._id,
          post.author,
          post.content,
          post.image || null,
          post.createdAt,
          post.updatedAt,
        ],
      });
    }
    console.log(`✅ Inserted ${mockPosts.length} posts`);

    // 3. Insert comments
    console.log("💬 Inserting comments...");
    for (const comment of mockComments) {
      await dbClient.execute({
        sql: `INSERT OR REPLACE INTO comments (id, parent_id, author_id, content, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          comment._id,
          comment.parent_id ?? null,
          comment.author,
          comment.content,
          comment.createdAt,
          comment.updatedAt,
        ],
      });
    }
    console.log(`✅ Inserted ${mockComments.length} comments`);

    // 4. Insert post likes
    console.log("❤️ Inserting post likes...");
    let postLikesCount = 0;
    for (const post of mockPosts) {
      for (const userId of post.likes) {
        await dbClient.execute({
          sql: `INSERT OR REPLACE INTO post_likes (post_id, user_id) VALUES (?, ?)`,
          args: [post._id, userId],
        });
        postLikesCount++;
      }
    }
    console.log(`✅ Inserted ${postLikesCount} post likes`);

    // 5. Insert comment likes
    console.log("💖 Inserting comment likes...");
    let commentLikesCount = 0;
    for (const comment of mockComments) {
      for (const userId of comment.likes) {
        await dbClient.execute({
          sql: `INSERT OR REPLACE INTO comment_likes (comment_id, user_id) VALUES (?, ?)`,
          args: [comment._id, userId],
        });
        commentLikesCount++;
      }
    }
    console.log(`✅ Inserted ${commentLikesCount} comment likes`);

    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Function to clear all data (useful for testing)
export async function clearDatabase() {
  try {
    console.log("🧹 Clearing database...");
    
    const tables = [
      'comment_likes',
      'post_likes', 
      'user_bookmarks',
      'user_following',
      'user_followers',
      'notifications',
      'comments',
      'posts',
      'users',
      'messages',
      'chat_participants',
      'chats'
    ];

    for (const table of tables) {
      await dbClient.execute(`DELETE FROM ${table}`);
    }

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
}

// Run this script directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding script failed:", error);
      process.exit(1);
    });
}