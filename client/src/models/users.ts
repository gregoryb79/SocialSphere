import { apiClient } from "./apiClient";

export type User = {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    followers: string[];
    following: string[];
    bookmarks: string[];
    createdAt: string;
    updatedAt: string;
};

export async function getUsers() {
    try {
        const response = await apiClient.get("/users");
        return response.data.message.toString();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export function getCurrentUserId(): string {
    return "user1";
}