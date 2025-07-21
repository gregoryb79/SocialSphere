import { createBrowserRouter, redirect } from "react-router";
import { App } from "./App";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { getUsers, getCurrentUserId, fetchUser, fetchLoggedInUser, getLoggedInUserName, getLoggedInUserId } from "./models/users";
import { fetchOwnPosts, fetchPosts, getPost } from "./models/posts";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Search } from "./pages/Search";
import { NewPost } from "./pages/NewPost";
import { LogIn } from "./pages/LogIn";
import { Register } from "./pages/Register";
import { Notifications } from "./pages/Notifications";
import { fetchNotifications } from "./models/notifications";
import { PauseOctagon } from "lucide-react";
import { getComments } from "./models/comments";
import { Chat } from "./pages/Chat";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,        
        children: [            
            { path: "*", Component: NotFound },   
            { index: true,
                Component: Home,                
                loader: async () => {
                    console.log("Fetching posts for home page");
                    const loggedInUser = await fetchLoggedInUser();
                    console.log("Loader: logged in user:", loggedInUser.username);
                    const userId = loggedInUser._id;                    
                    const posts = await fetchPosts(userId);
                    return {
                        loggedInUser,
                        posts: Array.isArray(posts) ? posts : []
                      };
                }
             },      
           { path: "/profile/:userId",
                Component: Profile,                
                loader: async ({ params }) => {
                    const userId = params.userId ? params.userId : getCurrentUserId();
                    const user = await fetchUser(userId);
                    const posts = await fetchOwnPosts(userId);
                    return {user, posts};
                }
             },
            { path: "/settings",
                Component: Settings,
                loader: async () => {                    
                    return await fetchLoggedInUser();
                }
            },
            { path: "/search",
                Component: Search,
                loader: async () => {   
                    return null;
                } 
            },
            { path: "/new-post",
                Component: NewPost,
                loader: async () => {                    
                    return await fetchLoggedInUser();
                }
            },
            { path: "/login",
                Component: LogIn,
                loader: () => {                    
                    return getLoggedInUserName();
                }
            },
            { path: "/register",
                Component: Register,
                loader: () => {                    
                    return getLoggedInUserName();
                }
            },
            { path: "/notifications",
                Component: Notifications,
                loader: async () => {
                    const userId = getLoggedInUserId();
                    console.log("Loading notifications for userId:", userId);

                    if (!userId || userId === "Guest") {
                        console.warn("No valid userId was found. Moving to login")
                        return redirect("/login");
                    }

                    try {
                        const notifications = await fetchNotifications(userId);
                        return notifications;
                    } catch (error) {
                        console.error("Failed to load notifications:", error);
                        throw new Response("Failed to load notifications", {status: 500});
                    }
                }
            },
            { path: "/chat", 
                Component: Chat,
                loader: async () => {
                    const userId = getLoggedInUserId();;
                    const username = getLoggedInUserName();

                    if (!userId || !username || userId === "Guest") {
                        console.warn("User is not logged in. Redirecting to login");
                        return redirect("/login");
                    }

                    try {
                        const API_BASE_URL = import.meta.env.VITE_API_VASE_URL;
                        const res = await fetch(`${API_BASE_URL}:/chat/friends/${userId}`);
                        const friends = await res.json();
                
                        return { userId, username, friends };
                    } catch (error) {
                        console.error("Failed to load friends:", error);
                        throw new Response("Failed to load friends", { status: 500 });
                    }
                }
            }    
        ]
    }
]);