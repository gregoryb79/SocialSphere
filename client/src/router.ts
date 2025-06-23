import { createBrowserRouter, redirect } from "react-router";
import { App } from "./App";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { getUsers, getCurrentUserId } from "./models/users";
import { fetchPosts } from "./models/posts";

const userId = "user1"; // Simulating a logged-in user

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [            
            { path: "*", Component: NotFound },   
            { path: "/",
                Component: Home,                
                loader: () => {
                    return fetchPosts(getCurrentUserId());
                }
             },      
           
        ],
    },
]);
