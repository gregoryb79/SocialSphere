import styles from "./Home.module.scss";
import { useLoaderData } from "react-router";
import type { Comment } from "../models/comments";
import { User } from "lucide-react";
import { PostCard } from "./components/PostCard";
import type { User as userType } from "../models/users";


export function Home() {
    console.log("Home component rendered");
    const {loggedInUser, posts} = useLoaderData() as {loggedInUser: userType, posts: Comment[]};
    console.log(`User:`, loggedInUser);
    const username = loggedInUser.username;
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
                {posts.map((post) => (<PostCard postInput={post} following={loggedInUser.following}/>))}
                {posts.length === 0 && (
                    <div>
                        <h2>Nothing to display.</h2>
                        <h3>Make some posts or follow some users...</h3>
                    </div>
                    )}
            </ul>
            
        </main>
    );
}

