import { useLoaderData, useNavigate } from "react-router";
import styles from "./Profile.module.scss";
import type { User } from "../models/users";
import type { Post } from "../models/posts";
import { PostCard } from "./components/PostCard";

// function PostItem({ post }: { post: Post }) {
//     return (
//         <div className={styles.postItem}>
//             <h3>{post.title}</h3> 
//             <p>{post.content} 
//             {post.image && <img src={post.image} alt="Post" className={styles.postImage} />}
//             </p>
//         </div>
//     );
// }


export function Profile() {

  const {user, posts} = useLoaderData() as {user: User, posts: Post[]};
  console.log(`User:`, user);
  console.log(`Posts:`, posts);

  const navigate = useNavigate();

  const handleBookmarksClick = () => {
    navigate('/bookmarks');
  };

  return (
    <div className={styles.profileMain}>
      <h1>Profile Page</h1>
      <div> 
        username={user.username} profilePicture={user.profilePicture} bio={user.bio}
      </div>

      <div className={styles.followStats}>
          <p>Followers: {user.followers.length}</p>
          <p>Following: {user.following.length}</p>
      </div>

      <button onClick={handleBookmarksClick} className={styles.bookmarksButton}>
          View Bookmarks
      </button>

      <p></p> {/* Add some spacing */}

      <h2>Your Posts</h2>
      <div className={styles.userPosts}>
          {posts.length > 0 ? (
              posts.map(post => (
                  <PostCard key={post._id} post={post} />
              ))
          ) : (
              <p>No posts found.</p>
          )}
      </div>

    </div>
  );
}