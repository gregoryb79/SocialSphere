# Authentication
POST   /api/auth/register — Register a new user
POST   /api/auth/login — Login user
POST   /api/auth/logout — Logout user
GET    /api/auth/me — Get current authenticated user
# User Profile
GET    /api/users/:id — Get user profile
PUT    /api/users/:id — Edit user profile (name, bio, avatar)
POST   /api/users/:id/follow — Follow a user
POST   /api/users/:id/unfollow — Unfollow a user
GET    /api/users/:id/followers — List followers
GET    /api/users/:id/following — List following
# Posts
POST   /api/posts — Create a post (text/image)
GET    /api/posts — Get home feed (posts from followed users)
GET    /api/posts/:id — Get post details (with comments)
PUT    /api/posts/:id — Edit own post
DELETE /api/posts/:id — Delete own post
POST   /api/posts/:id/like — Like a post
POST   /api/posts/:id/unlike — Unlike a post
POST   /api/posts/:id/bookmark — Bookmark a post
POST   /api/posts/:id/unbookmark — Remove bookmark
# Comments
POST   /api/posts/:postId/comments — Add comment to a post
GET    /api/posts/:postId/comments — List comments for a post
PUT    /api/comments/:id — Edit own comment
DELETE /api/comments/:id — Delete own comment
POST   /api/comments/:id/like — Like a comment
POST   /api/comments/:id/unlike — Unlike a comment
# Search
GET    /api/search/users?q=USERNAME — Search users by username
GET    /api/search/posts?q=TEXT — Search posts by content
# Notifications
GET    /api/notifications — List notifications for current user
POST   /api/notifications/:id/seen — Mark notification as seen
# Media
POST   /api/upload/avatar — Upload profile avatar
POST   /api/upload/post-image — Upload post image
# Feed Enhancements
GET    /api/posts/trending — Get trending posts
GET    /api/posts/bookmarks — Get bookmarked posts
# Real-Time (Extra)
GET    /api/chats — List user’s chats
POST   /api/chats — Start new chat
GET    /api/chats/:id/messages — Get messages in a chat
POST   /api/chats/:id/messages — Send a message