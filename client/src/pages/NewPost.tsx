import { useLoaderData, useNavigate } from "react-router";
import styles from "./NewPost.module.scss";
import type { User } from "../models/users";
import { NewCommentCard } from "./components/NewCommentCard";
import { useState } from "react";
import { Spinner } from "./components/Spinner";

export function NewPost() {  

  const userId = useLoaderData<string>();
  console.log(`New Post Page for userId:`, userId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleNewPost(newCommentId: string) {
    console.log(`New post created with ID: ${newCommentId}`);
    setLoading(true);
    navigate(`/profile/${userId}`);
  }

  return (
    <div className={styles.newPostMain}>
      <h1 className={styles.newPostHeader}>Create New Post</h1>
      {loading && <Spinner />}
      <NewCommentCard onCommentPosted={handleNewPost}/>
    </div>
  );
}