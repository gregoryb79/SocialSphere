import React, { useState } from "react";
import styles from "./Home.module.scss";
import { useLoaderData } from "react-router";
import { ErrorMsg } from "./components/ErrorMsg";
import { GeneralButton } from "./components/GeneralButton";
import { Input } from "./components/Input";
import { PasswordInput } from "./components/PasswordInput";


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