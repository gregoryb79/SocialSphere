import { createBrowserRouter, redirect } from "react-router";
import { App } from "./App";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { getUsers, getCurrentUserId, fetchUser, getCurrentUserName, fetchLoggedInUser } from "./models/users";
import { fetchOwnPosts, fetchPosts } from "./models/posts";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,        
        children: [            
            { path: "*", Component: NotFound },   
            { path: "/",
                Component: Home,                
                loader: async () => {
                    const userId = getCurrentUserId();
                    const username = getCurrentUserName() || "Guest";
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

            }
        ],
    },
]);
