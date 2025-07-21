import { useLoaderData, useNavigate } from "react-router";
import styles from "./Profile.module.scss";
import type { User } from "../models/users";
import type { Comment } from "../models/comments";
import { PostCard } from "./components/PostCard";
import { Bookmark } from "lucide-react";
import { IconButton } from "./components/IconButton";
import { GeneralButton } from "./components/GeneralButton";


export function Profile() {

  const {user, posts} = useLoaderData() as {user: User, posts: Comment[]};
  console.log(`User:`, user);
  console.log(`Posts:`, posts);

  const navigate = useNavigate();
  const noResults = 'no-users-found';
    const handleBookmarksClick = () => {
    navigate('/bookmarks');
  };


  return (
    <main className={styles.profileMain}>
      <section className={styles.profileHeader}>
         <div className={styles.userInfo}>
            {user.avatar && (<img src={user.avatar} alt={`${user.username}'s profile`} />)}
            <div  className={styles.nameBio}>
              <h1>{user.username}</h1>
              {user.bio && <p>{user.bio}</p>}
            </div>
         </div>
         <div className={styles.followStats}>
            <GeneralButton label="Followers:" count={user.followers?.length ?? 0} />
            <GeneralButton label="Following:" count={user.following?.length ?? 0} />
            <IconButton title="Bookmark" ariaLabel= "Saved Bookmarks" icon={<Bookmark className={styles.lucideIconPost} color="var(--primary-blue)"/>} onClick={handleBookmarksClick}/>
         </div>
      </section>
      <ul className={styles.userPosts}>
          {posts.length > 0 ? (
              posts.map(post => (
                  <PostCard key={post._id} postInput={post}/>
              ))
          ) : (
              <li key={noResults}>No posts found.</li>
          )}
      </ul>
    </main>
  );
}