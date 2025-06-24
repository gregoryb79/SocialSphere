import { useLoaderData } from "react-router";
import styles from "./Post.module.scss";
import type { Comment } from "../models/comments";
import type { Post } from "../models/posts";

export function Post() {

  const {post, comments} = useLoaderData() as {post: Post, comments: Comment[]};
  console.log(`Post:`, post);
  console.log(`comments:`, comments);

  return (
    <div className={styles.postMain}>
      <h1>Post Page</h1>
      <p>This will be a page that shows a single post with it's comments</p>
    </div>
  );
}