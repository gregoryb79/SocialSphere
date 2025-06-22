import React, { useState } from "react";
import styles from "./Home.module.scss";
import { useLoaderData } from "react-router";
import { GeneralButton } from "./components/GeneralButton";
import type { Post } from "../models/posts";


export function Home() {
    console.log("Home component rendered");
    const posts = useLoaderData<Post[]>();
    console.log(`Array of ${posts.length} retured from server`); 
    
        
    return (
        <main className={styles.homeMain}>
            <h1>SocialSphere Homepage</h1>
            <ul className={styles.postsFeed}>
                {posts.map((post) => (
                <li key={post._id} className={styles.postCard}>                     
                    <p>{post.content}</p>
                    <p><strong>Author:</strong> {post.author}</p>
                    <p><strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}</p>                    
                    {post.image && <img src={post.image} alt="Post visual content" className={styles.postImage} />}
                    <section className={styles.postActions}>
                        <GeneralButton label="Like" onClick={() => console.log(`Liked post ${post._id}`)} />
                        <GeneralButton label="Comment" onClick={() => console.log(`Commented on post ${post._id}`)} /> 
                        <GeneralButton label="Bookmark" onClick={() => console.log(`Bookemarked on post ${post._id}`)} />             
                    </section>
                </li>))}
            </ul>
            
        </main>
    );
}