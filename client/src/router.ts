import { createBrowserRouter, redirect } from "react-router";
import { App } from "./App";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { getUsers } from "./models/users";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [            
            { path: "*", Component: NotFound },   
            { path: "/",
                Component: Home,                
                loader: () => {
                    return getUsers();
                }
             },      
           
        ],
    },
]);
