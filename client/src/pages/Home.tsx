import React, { useState } from "react";
import styles from "./Home.module.scss";
import { useLoaderData } from "react-router";
import { GeneralButton } from "./components/GeneralButton";
import type { Post } from "../models/posts";
import { IconButton } from "./components/IconButton";
import { Bookmark, Heart,MessageCircle, User } from "lucide-react";


export function Home() {
    console.log("Home component rendered");
    const {username, posts} = useLoaderData() as {username: string, posts: Post[]};
    console.log(`Array of ${posts.length} retured from server`); 
    console.log(`User:`, username);
    
        
    return (
        <main className={styles.homeMain}>
            <section className={styles.userGreeting}>
                <User className={styles.lucideIcon} color={username == "Guest" ? "var(--light-text)" : "var(--primary-blue)"}/>
                <h2>{username}</h2>
            </section>
            <ul className={styles.postsFeed}>
                {posts.map((post) => (
                <li key={post._id} className={styles.postCard}>                     
                    <p>{post.content}</p>
                    <p><strong>Author:</strong> {post.author}</p>
                    <p><strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}</p>                    
                    {post.image && <img src={post.image} alt="Post visual content" className={styles.postImage} />}
                    <section className={styles.postActions}>
                        <section className={styles.likeComment}>
                            <IconButton title="Like" label={post.likes.length.toString()} ariaLabel= "Like post" icon={<Heart className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                                onClick={() => console.log(`Liked post ${post._id}`)} />
                            <IconButton title="Comment" label={post.comments.length.toString()} ariaLabel= "Add comment to post" icon={<MessageCircle className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                              onClick={() => console.log(`Commented on post ${post._id}`)} /> 
                        </section>                        
                        <IconButton title="Bookmark" ariaLabel= "Bookmark post" icon={<Bookmark className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                            onClick={() => console.log(`Bookemarked on post ${post._id}`)} />             
                    </section>
                </li>))}
            </ul>
            
        </main>
    );
}