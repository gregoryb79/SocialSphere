import { useLoaderData } from "react-router";
import styles from "./NewPost.module.scss";
import type { User } from "../models/users";

export function NewPost() {  

  const user = useLoaderData<User>();
  console.log(`User:`, user);

  return (
    <div className={styles.newPostMain}>
      <h1>New Post Page</h1>
      <p>This will be a new post page</p>
    </div>
  );
}