import { apiClient, clearToken } from "./apiClient";

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

export function doLogOut() {
    localStorage.removeItem("user"); 
    clearToken();   
}

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

//returns the username of the logged in user
export function getLoggedInUserName(): string {
    return "";
}

export function getLoggedInUserId(): string {    
    return "";
}

export async function fetchUser(userId: string): Promise<User> {
    const message = await getUsers();
    console.log("Verifying connection to server:", message);
        
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(mockUser);
        }, 1000);
    });
}

export async function fetchLoggedInUser(): Promise<User> {
    const message = await getUsers();
    console.log("Verifying connection to server:", message);
        
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(mockUser);
        }, 1000);
    });
}

export async function putLogIn(username: string, password: string): Promise<boolean> {
    console.log("putLogIn called with username:", username, "and password:", password);
        
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

export async function postRegister(email: string, username: string, password: string): Promise<boolean> {
    console.log("postRegister called with email:", email, "username:", username, "and password:", password);
        
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

export const mockUser: User = {
    _id: "user1",
    username: "johndoe",
    email: "johndoe@example.com",
    profilePicture: "https://placehold.co/100x100",
    bio: "Just another SocialSphere user.",
    followers: ["user2", "user3"],
    following: ["user2"],
    bookmarks: ["post1", "post2"],
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
};

