# User
{
  _id: ObjectId,
  username: String, // unique
  email: String,    // unique
  password: String, // hashed
  bio: String,
  avatar: String,   // image URL
  followers: [ObjectId], // user IDs
  following: [ObjectId], // user IDs
  createdAt: Date,
  updatedAt: Date
}

# Post/Comment
{
  _id: ObjectId,
  author: ObjectId, // ref to User
  postId: ObjectId,  // ref to Post or comment if coment NULL if post
  content: String,
  image?: String, // optional image URL
  likes: [ObjectId], // user IDs
  comments: [ObjectId], // comment IDs
  createdAt: Date,
  updatedAt: Date
}

# Notification
{
  _id: ObjectId,
  recipient: ObjectId,  // user receiving the notification
  type: String,         // 'like' | 'comment' | 'follow'
  sender: ObjectId,     // user who triggered the action
  postId: ObjectId,     // optional, if related to post
  seen: Boolean,
  createdAt: Date
}

## EXTRA FEATURE
# Chat
{
  _id: ObjectId,
  participants: [ObjectId], // users
  messages: [ObjectId], // message IDs
}

# Message
{   
    _id: ObjectId,
    sender: ObjectId,
    text: String,
    createdAt: Date
}