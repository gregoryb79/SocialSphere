import React from 'react';
import styles from './CreatePost.module.scss';

const CreatePost = () => {
  return (
    <div className={styles.createPost}>
      <h2>Create a new post</h2>
      <form>
        <textarea placeholder="What's on your mind?" />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
