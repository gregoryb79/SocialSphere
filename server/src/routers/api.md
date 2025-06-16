# SocialSphere API

This document describes the main API endpoints, required client input, and expected server output for SocialSphere.

---

## Authentication

### Register
**POST /api/auth/register**

**Input:**
```json
{ "username": "johndoe", "email": "john@example.com", "password": "secret123" }
```
**Output:**
```json
{ "token": "JWT_TOKEN" }
```

---

### Login
**POST /api/auth/login**

**Input:**
```json
{ "email": "john@example.com", "password": "secret123" }
```
**Output:**
```json
{ "token": "JWT_TOKEN" }
```
## User Profile

### Get Profile
**GET /api/users/:id**

**Output:**
```json
{ "_id": "...", "username": "johndoe", "bio": "", "avatar": "", "followers": [ {"_id": "userID", "username": "username"} ...], "following": [{"_id": "userID", "username": "username"} ... ] }
```

---

### Edit Profile
**PUT /api/users/:id**

**Input:**
```json
{ "username": "johnny", "bio": "Hello!", "avatar": "https://..." }
```
**Output:**
```json
{ "message": "Profile updated"}
```

---

### Follow User
**POST /api/users/:id/follow**

**Output:**
```json
{ "message": "Followed user"}
```

---

### Unfollow User
**POST /api/users/:id/unfollow**

**Output:**
```json
{ "message": "Unfollowed user"}
```

---

### Followers List
**GET /api/users/:id/followers**

**Output:**
```json
{ "followers": [ { "_id": "...", "username": "..." }, ... ] }
```

---

### Following List
**GET /api/users/:id/following**

**Output:**
```json
{ "following": [ { "_id": "...", "username": "..." }, ... ] }
```

---

## Posts

### Create Post
**POST /api/posts**

**Input:**
```json
{ "content": "Hello world!", "image": "https://..." }
```
**Output:**
```json
{ "message": "Post created", "post": { "_id": "...", "content": "...", "author": "...", "image": "...", "likes": [], "comments": [] } }
```

---

### Edit Post
**PUT /api/posts/:id**

**Input:**
```json
{ "content": "Updated text", "image": "https://..." }
```
**Output:**
```json
{ "message": "Post updated", "post": { ... } }
```

---

### Delete Post
**DELETE /api/posts/:id**

**Output:**
```json
{ "message": "Post deleted" }
```

---

### Like Post
**POST /api/posts/:id/like**

**Output:**
```json
{ "message": "Post liked", "likes": [ { "_id": "...", "username": "..." }, ... ] }
```

---

### Unlike Post
**POST /api/posts/:id/unlike**

**Output:**
```json
{ "message": "Post unliked", "likes": [ { "_id": "...", "username": "..." }, ... ] }
```

---

### Bookmark Post
**POST /api/posts/:id/bookmark**

**Output:**
```json
{ "message": "Post bookmarked"}
```

---

### Remove Bookmark
**POST /api/posts/:id/unbookmark**

**Output:**
```json
{ "message": "Bookmark removed"}
```

---

### Get Feed
**GET /api/posts**

**Output:**
```json
{ "posts": [ { "_id": "...", "content": "...", "author": { "_id": "...", "username": "..." }, "image": "...", "likes": [ ... ], "comments": [ ... ], "createdAt": "..." }, ... ] } //sorted by newest first
```

---

### Get Post Details
**GET /api/posts/:id**

**Output:**
```json
{ "_id": "...", "content": "...", "author": { "_id": "...", "username": "..." }, "image": "...", "likes": [ ... ], 
"comments": [{ "_id": "...", "content": "...", "author": "...", "likes": [],"createdAt": "..." } ... ], 
"createdAt": "..." }
```

---

## Comments

### Add Comment
**POST /api/posts/:postId/comments**

**Input:**
```json
{ "content": "Nice post!", "image": "https://..." }
```
**Output:**
```json
{ "message": "Comment added" }
```

---

### Edit Comment
**PUT /api/comments/:id**

**Input:**
```json
{ "content": "Edited comment", "image": "https://..." }
```
**Output:**
```json
{ "message": "Comment updated" }
```

---

### Delete Comment
**DELETE /api/comments/:id**

**Output:**
```json
{ "message": "Comment deleted" }
```

---

### Like Comment
**POST /api/comments/:id/like**

**Output:**
```json
{ "message": "Comment liked"}
```

---

### Unlike Comment
**POST /api/comments/:id/unlike**

**Output:**
```json
{ "message": "Comment unliked"}
```

---

### List Comments
**GET /api/posts/:postId/comments**

**Output:**
```json
{ "comments": [ { "_id": "...", "content": "...", "author": { "_id": "...", "username": "..." }, "likes": [ ... ], "createdAt": "..." }, ... ] }
```

---

## Search

### Search Users
**GET /api/search/users?q=USERNAME**

**Output:**
```json
{ "users": [ { "_id": "...", "username": "...", "avatar": "..." }, ... ] }
```

---

### Search Posts
**GET /api/search/posts?q=TEXT**

**Output:**
```json
{ "posts": [ { "_id": "...", "content": "...", "author": { "_id": "...", "username": "..." }, "image": "...", "createdAt": "..." }, ... ] }
```

---
#### EXTRAS: API TBD
## Notifications
# List Notifications
# Mark Notification as Seen

## Media Upload
# Upload Avatar
# Upload Post Image 

## Real-Time (Extra)
# List Chats
# Start New Chat
# Get Messages in a Chat
# Send a Message