import { useLoaderData, useNavigate } from "react-router";
import styles from "./Profile.module.scss";
import type { User } from "../models/users";
import type { Post } from "../models/posts";
import { PostCard } from "./components/PostCard";
import { Bookmark } from "lucide-react";
import { IconButton } from "./components/IconButton";


export function Profile() {

  const {user, posts} = useLoaderData() as {user: User, posts: Post[]};
  console.log(`User:`, user);
  console.log(`Posts:`, posts);

  const navigate = useNavigate();

  const handleBookmarksClick = () => {
    navigate('/bookmarks');
  };

  return (
    <main className={styles.profileMain}>
      <section className={styles.profileHeader}>
        {user.profilePicture && <img src={user.profilePicture} alt={`${user.username}'s profile`} />}
      <h1>{user.username}</h1>
      <p> {user.bio && <p>{user.bio}</p>}</p>
      <div className={styles.followStats}>
            <p>Followers: {user.followers.length}</p>
            <p>Following: {user.following.length}</p>
            <IconButton title="Bookmark" ariaLabel= "Saved Bookmarks" icon={<Bookmark className={styles.lucideIconPost} color="var(--primary-blue)"/>} onClick={handleBookmarksClick}/>
      </div>
      </section>
      <ul className={styles.userPosts}>
          {posts.length > 0 ? (
              posts.map(post => (
                  <PostCard key={post._id} post={post} />
              ))
          ) : (
              <p>No posts found.</p>
          )}
      </ul>
    </main>
  );
}