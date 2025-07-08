import { useEffect, useState } from "react";
import { socket } from "../socketClient";

import styles from "./Chat.module.scss";
import { getLoggedInUserName } from "../models/users";

type Messgae = {
    username: string; 
    text: string;
};

export function Chat() {
    const [messages, setMessages] = useState<Messgae[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.on("message", (data: Messgae) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;
        const username = getLoggedInUserName() || "Guest";
        const newMessage = { username, text: message };
        socket.emit("message", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };

    return (
        <div className={styles.chatContainer}>
            <ul className={styles.messages}>
                {messages.map((msg, i) => (
                    <li key={i} className={msg.username === getLoggedInUserName() ? styles.ownMessage : ""}>
                        <strong>{msg.username}</strong> {msg.text}
                    </li>
                ))}
            </ul>
            <div className={styles.inputeArea}>
                <input value={message} onChange={(e) =>setMessage(e.target.value)} placeholder="Type you message..." />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}