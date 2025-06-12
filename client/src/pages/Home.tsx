import React from "react";
import styles from "./Home.module.scss";
import { useLoaderData } from "react-router";


export function Home() {
   
    const message = useLoaderData<string>();
    
    
    return (
    <main className={styles.homeMain}>
        <h1>SocialSphere</h1>
        <p>Server message: {message}</p>
    </main>
    );
}