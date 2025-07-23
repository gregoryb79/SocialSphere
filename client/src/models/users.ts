import { apiClient, clearToken, getToken, setToken } from "./apiClient";
export type User = {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    followers: string[];
    following: string[];
    bookmarks: string[];
    createdAt: string;
    updatedAt: string;
};

export function doLogOut() {
    localStorage.removeItem("loggeduser");
    sessionStorage.removeItem("currentuser");
    console.log("User logged out, clearing session storage and local storage"); 
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
    return sessionStorage.getItem("currentuser")||"guest"; // Placeholder for guest user
}

//returns the username of the logged in user
export function getLoggedInUserName(): string {
    const loggedUser = JSON.parse(localStorage.getItem("loggeduser")!);
    const userId = getLoggedInUserId();

    if (!loggedUser || userId === "Guest") {
        console.warn("No user is logged in, returning 'Guest'");
        return "Guest";
    }
    console.log("Logged in user:", loggedUser.username);
    return loggedUser.username;
}

export function getLoggedInUserId(): string {        
    const token = getToken();
    if (!token) {
        return "Guest";
    }
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    console.log("Decoded token payload:", decoded);
    if (!decoded || !decoded.userId) {
        console.warn("Token does not contain a valid user ID, returning 'Guest'");
        return "Guest";
    }
    console.log("UserId:", decoded.userId);    
    return decoded.userId;    
}

export async function fetchLoggedInUser(): Promise<User> {
  try {
    const userId = getLoggedInUserId();
    if (!userId || userId === "Guest") {
        console.warn("No valid userId was found. Returning Guest user");
        return {
            _id: "guest",
            username: "Guest",
            email: "",
            avatar: "",
            bio: "",
            followers: [],
            following: [],
            bookmarks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    const response = await apiClient.get(`/users/${userId}`);    
    const loggedInUser = response.data as User;    
    return loggedInUser;
  } catch (error) {
    console.error("Error fetching logged in user:", error);
    throw error;
  }
}

export async function putLogIn(email: string, password: string): Promise<boolean> {
    console.log("putLogIn called with email:", email, "and password:", password);
    try {
        const response = await apiClient.post("/auth/login", {
            email,
            password
        });

        if (response.status !== 200) {
            console.error("Login failed with status:", response.status);
            return false; 
        }
        const { token, username } = response.data;
        if (!token || !username) {
            console.error("Login response did not contain a token or username");
            return false; 
        }
        console.log("Token received:", token, "for user:", username);
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        console.log("Decoded token payload:", decoded);
        setToken(token);
        localStorage.setItem("loggeduser", JSON.stringify({ username }));
        console.log("Login successful, token received");
        return true; 
    } catch (error) {
        console.error("Error during login:", error);
        return false; 
    }
}

export async function postRegister(email: string, username: string, password: string, avatarURL: string, bio : string): Promise<boolean> {
    console.log("postRegister called with email:", email, "username:", username, "password:", password, "avatarURL:", avatarURL, "bio:", bio);
    
    try{
        const response = await apiClient.post("/auth/register", {
            email,
            username,
            password,
            avatar: avatarURL,
            bio
        });

        if (response.status !== 201) {
            console.error("Registration failed with status:", response.status);
            return false; 
        }
        const { token } = response.data;
        if (!token) {
            console.error("Registration response did not contain a token");
            return false; 
        }
        console.log("Token received:", token);
        setToken(token);
        console.log("Registration successful, token received");
        localStorage.setItem("loggeduser", JSON.stringify({ username }));
        return true; 
    } catch (error) {
        console.error("Error during registration:", error);
        return false; 
    }    
}

export const mockUser: User = {
    _id: "user1",
    username: "johnDoe",
    email: "johndoe@example.com",
    avatar: "https://placehold.co/100x100",
    bio: "Just another SocialSphere user.",
    followers: ["user2", "user3"],
    following: ["user2"],
    bookmarks: ["post1", "post2"],
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
};


export async function getUserByName(username: string): Promise<User | null>  {
    console.log("Searching user by name from backend:", username);

    if (!username) {
        return null; 
    }

    try {
        const response = await apiClient.get(`/search/users?q=${encodeURIComponent(username)}`);

        const users = response.data;

        if (!users || users.length === 0) {
            return null; 
        }

         const backendUser = users[0];
         const clientUser: User = {
             _id: backendUser.id, 
             username: backendUser.username,
             email: backendUser.email, 
             avatar: backendUser.avatar,
             bio: backendUser.bio,
             followers: backendUser.followers || [], 
             following: backendUser.following || [],
             bookmarks: backendUser.bookmarks || [],
             createdAt: backendUser.created_at, 
             updatedAt: backendUser.updated_at, 
         };
        return clientUser;

    } catch (error) {
        console.error("Error searching user by name:", error);
        throw error;
    }
}




export async function fetchUser(userId: string): Promise<User> {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function deleteUser() {
  try {
    const userId = getCurrentUserId();
    const response = await apiClient.delete(`/users/${userId}`);
    if (response.status === 200) {
      console.log("Account deleted");
      window.location.href = '/register';
      doLogOut();
    } else {
      console.error("Error deleting account:", response);
    }
  } catch (error) {
    console.error("Error deleting account:", error);
  }
}

/*
export async function deleteUser() {
  try {
    const userId = getCurrentUserId();
    await apiClient.delete(`/users/${userId}`);
    console.log("Account deleted");
    window.location.href = '/register';
    doLogOut();
  } catch (error) {
    console.error("Error deleting account:", error);
  }
}



*/