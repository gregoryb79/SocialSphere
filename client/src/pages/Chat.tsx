/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { socket } from "../socketClient";

import styles from "./Chat.module.scss";
import { getLoggedInUserId, getLoggedInUserName } from "../models/users";
import { useLoaderData, useNavigate } from "react-router";

export type Message = {
    username: string;
    text: string;
    chat_id: string;
    sender_id: string;
    receiver_id: string;
};

export type Friend = {
    id: string;
    username: string;
};

export async function chatLoader() {
    const userId = getLoggedInUserId();;
    const username = getLoggedInUserName();
    const res = await fetch(`http://localhost:5050/chat/friends/${userId}`);
    const friends = await res.json();

    return { userId, username, friends };
}

export function Chat() {
    const navigate = useNavigate();
    const { userId, username, friends } = useLoaderData() as { userId: string; username: string; friends: Friend[]};

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

    const getChatId = (friendId: string) => {
        return [userId, friendId].sort().join("-");
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedFriend) return;
            
            const chat_id = getChatId(selectedFriend.id);

            try {
                const res = await fetch(`http://localhost:5050/chat/messages/${chat_id}`);
                const data = await res.json();
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };
        fetchMessages();
    }, [selectedFriend]);

    useEffect(() => {
        const handleMessage = (data: Message) => {
            if (!selectedFriend) return;
            const chat_id = getChatId(selectedFriend.id);
            if (data.chat_id === chat_id) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.on("message", handleMessage);
        return () => {
            socket.off("message", handleMessage);
        };
    }, [selectedFriend]);

    const sendMessage = () => {
        if (!message.trim() || !selectedFriend) return;

        const chat_id = getChatId(selectedFriend.id);
        const newMessage: Message = { username, text: message, chat_id, sender_id: userId, receiver_id:selectedFriend.id };

        socket.emit("message", newMessage);
        setMessage("");
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.friendsList}>
                <h3>Choose friend to chat:</h3>
                {friends.length === 0 && <p>No friends avialable</p>}
                {friends.map((friend, index) => (
                    <button key={`${friend.id}-${index}`} onClick={() => setSelectedFriend(friend)} className={selectedFriend?.id === friend.id ? styles.selected : ""}>
                        {friend.username}
                    </button>
                ))}
            </div>

            {selectedFriend && (
                <>
                    <div className={styles.chatHeader}>
                        <button onClick={() => setSelectedFriend(null)} className={styles.backButton}>🔙 Back to Friends</button>
                        <h4>Chat with {selectedFriend.username}</h4>
                    </div>
                    <ul className={styles.messages}>
                        {messages.map((msg, i) => (
                        <li key={i} className={msg.sender_id === userId ? styles.ownMessage : ""}>
                            <strong>{msg.username}</strong> {msg.text}
                        </li>
                        ))}
                    </ul>
                    
                    <div className={styles.inputArea}>
                        <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") sendMessage();}} placeholder="Write message here..." />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </>
            )}
        </div>
    )
}