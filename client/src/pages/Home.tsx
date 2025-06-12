import React from "react";
import styles from "./Home.module.scss";
import { useLoaderData } from "react-router";


export function Home() {
    console.log("Home component rendered");
    const message = useLoaderData<string>();
    console.log(`${message} retured from server`);   
        
    return (
    <main className={styles.homeMain}>
        <h1>SocialSphere</h1>
        <p>Server message: {message}</p>
    </main>
    );
}