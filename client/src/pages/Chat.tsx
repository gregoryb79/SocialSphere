/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { socket } from "../socketClient";

import styles from "./Chat.module.scss";
import { getLoggedInUserId, getLoggedInUserName } from "../models/users";

type Message = {
    username: string;
    text: string;
    chat_id: string;
    sender_id: string;
    receiver_id: string;
};

type Friend = {
    id: string;
    username: string;
};

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

    const userId = getLoggedInUserId() || "guest-id";
    const username = getLoggedInUserName() || "Guest";

    const getChatId = (friendId: string) => {
        return [userId, friendId].sort().join("-");
    };

    const fetchFriends = async () => {
        try {
            const res = await fetch(`http://localhost:5050/chat/friends/${userId}`);
            const data = await res.json();
            setFriends(data);
        } catch (error) {
            console.error("Failed to fetch friends", error);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const res = await fetch(`http://localhost:5050/chat/messages/${chatId}`);
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    const sendMessage = () => {
        if (!message.trim() || !selectedFriend) return;

        const chat_id = getChatId(selectedFriend.id);
        const newMessage: Message = {
            username,
            text: message,
            chat_id,
            sender_id: userId,
            receiver_id: selectedFriend.id,
        };

        socket.emit("message", newMessage);
        setMessage("");
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        if (selectedFriend) {
            const chat_id = getChatId(selectedFriend.id);
            fetchMessages(chat_id);
        }
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