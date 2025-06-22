import React, { useState } from "react";
import styles from "./Home.module.scss";
import { useLoaderData } from "react-router";
import { GeneralButton } from "./components/GeneralButton";
import type { Post } from "../models/posts";
import { NavButton } from "./components/NavButton";
import { Bookmark, Heart,MessageCircle } from "lucide-react";


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
                        <section className={styles.likeComment}>
                            <NavButton title="Like" label={post.likes.length.toString()} ariaLabel= "Like post" icon={<Heart className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                                onClick={() => console.log(`Liked post ${post._id}`)} />
                            <NavButton title="Comment" label={post.comments.length.toString()} ariaLabel= "Add comment to post" icon={<MessageCircle className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                              onClick={() => console.log(`Commented on post ${post._id}`)} /> 
                        </section>                        
                        <NavButton title="Bookmark" ariaLabel= "Bookmark post" icon={<Bookmark className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                            onClick={() => console.log(`Bookemarked on post ${post._id}`)} />             
                    </section>
                </li>))}
            </ul>
            
        </main>
    );
}