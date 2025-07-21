import { useLoaderData, useNavigate } from "react-router";
import styles from "./Profile.module.scss";
import type { User } from "../models/users";
import type { Comment } from "../models/comments";
import { PostCard } from "./components/PostCard";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { IconButton } from "./components/IconButton";
import Follow from "./components/Follow";
import Followers from "./components/Followers";
import Following from "./components/Following";
import { getLoggedInUserId } from "../models/users";
import { getToken } from "../models/apiClient";


export function Profile() {

  const {user, posts} = useLoaderData() as {user: User, posts: Comment[]};
  const [showFollowers, setShowFollowers] = useState<boolean>(false);
  const [showFollowing, setShowFollowing] = useState<boolean>(false);
  console.log(`User:`, user);
  console.log(`Posts:`, posts);

  const navigate = useNavigate();
  const noResults = 'no-users-found';

  const isOwnProfile = user._id === getLoggedInUserId();

  return (
    <main className={styles.profileMain}>
      <section className={styles.profileHeader}>
         <div className={styles.userInfo}>
            {user.avatar && (<img src={user.avatar} alt={`${user.username}'s profile`} />)}
            <div  className={styles.nameBio}>
              <h1>{user.username}</h1>
              {user.bio && <p>{user.bio}</p>}
              {!isOwnProfile && <Follow targetUserId={user._id} initialIsFollowing={ user.followers?.includes(getLoggedInUserId()) ?? false } token={getToken() || ""}/>}
            </div>
         </div>
         <div className={styles.followStats}>

            <h3 className={styles.followerCount} onClick={() => { setShowFollowers(true); setShowFollowing(false); }}>
              Followers: {user.followers?.length ?? 0}
            </h3>

            <h3 className={styles.followingCount} onClick={() => { setShowFollowers(false); setShowFollowing(true); }}>
              Following: {user.following?.length ?? 0}
            </h3>
            <IconButton title="Bookmark" ariaLabel= "Saved Bookmarks" icon={<Bookmark className={styles.lucideIconPost} color="var(--primary-blue)"/>} onClick={() => navigate("/Bookmarks")}/>

         </div>
      </section>
      {showFollowers ? (
        <Followers userId={user._id} token={getToken() || ""} />
      ) : showFollowing ? (
        <Following userId={user._id} token={getToken() || ""}/>
      ) : (
        <ul className={styles.userPosts}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} postInput={post} />
            ))
          ) : (
            <li key={noResults}>No posts found.</li>
          )}
        </ul>
      )}
    </main>
  );
}