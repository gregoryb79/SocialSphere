import { createBrowserRouter, redirect } from "react-router";
import { App } from "./App";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { getUsers, getCurrentUserId, fetchUser, fetchLoggedInUser, getLoggedInUserName, getLoggedInUserId, getUserByName } from "./models/users";
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
                    const userId = getCurrentUserId();
                    const username = getLoggedInUserName() || "Guest";
                    const posts = await fetchPosts(userId);
                    return {username, posts};
                }
             },      
           { path: "/profile",
                Component: Profile,                
                loader: async () => {
                    const userId = getCurrentUserId();
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
                    const username = ""; 
                    return await getUserByName(username);
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
                    const notifications = await fetchNotifications(userId);                    
                    return notifications
                }
            },            
            
        ],
    },
]);
