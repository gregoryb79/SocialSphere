import { useLoaderData } from "react-router";
import styles from "./Profile.module.scss";
import type { User } from "../models/users";
import type { Post } from "../models/posts";

export function Profile() {

  const {user, posts} = useLoaderData() as {user: User, posts: Post[]};
  console.log(`User:`, user);
  console.log(`Posts:`, posts);

  return (
    <div className={styles.profileMain}>
      <h1>Profile Page</h1>
      <p>This will be a profile page</p>
    </div>
  );
}