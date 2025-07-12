import styles from "./Home.module.scss";
import { useLoaderData } from "react-router";
import type { Post } from "../models/posts";
import { User } from "lucide-react";
import { PostCard } from "./components/PostCard";


export function Home() {
    console.log("Home component rendered");
    const {username, posts} = useLoaderData() as {username: string, posts: Post[]};
    console.log(posts)
    console.log(`Array of ${posts.length} retured from server`); 
    console.log(`User:`, username);
    
        
    return (
        <main className={styles.homeMain}>
            <section className={styles.userGreeting}>
                <User className={styles.lucideIcon} color={username == "Guest" ? "var(--light-text)" : "var(--primary-blue)"}/>
                <h2>{username}</h2>
            </section>
            <ul className={styles.postsFeed}>
                {posts.map((post) => (<PostCard post={post} />))}
            </ul>
            
        </main>
    );
}

