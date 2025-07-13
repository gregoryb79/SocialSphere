import { useRef, useEffect, useState } from "react";
import { putLogIn, postRegister } from "../models/users";

export function useDoLogIn(onSuccess: () => void) {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);  
    const isCanceled = useRef(false);
    isCanceled.current = false;
    console.log("useDoLogIn initialized, isCanceled =", isCanceled.current);

    async function doLogIn(username: string, password: string) {
        setError(undefined);
        setLoading(true);

        try {
            console.log("checking credentials"); 
            const loggedUser = await putLogIn(username, password);                               
            console.log("isCanceled =", isCanceled.current, "loggedUser =", loggedUser);
            if (!isCanceled.current && loggedUser) {                                      
                console.log("credentials are correct");
                onSuccess();                                    
            }else {
                setError("Wrong credentials");
                console.log("Wrong credentials");
            }
        } catch (error) {
            if (!isCanceled.current) {
                setError(error as string);
                console.error("Error logging in:", error);                    
            }
        } finally {
            if (!isCanceled.current) {
                setLoading(false);
            }
        }
    }

    useEffect(() => {       
        return () => {
            console.log("Cleanup: setting isCanceled.current = true");
            isCanceled.current = true;
        };
    }, []);

    return { error, loading, doLogIn};

}

export function useDoRegister(onSuccess: () => void) {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);  
    
    const isCanceled = useRef(false);
    isCanceled.current = false;

        async function doRegister(email: string, username: string, password: string, repeatPassword: string, avatarURL: string, bio: string) {
            setError(undefined);
            setLoading(true);

            if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
                console.log("Password doesn't fit the rules");
                setError("Password doesn't fit the rules!");
                setLoading(false);
                return;
            }

            if (password !== repeatPassword) {
                console.log("Passwords do not match");
                setError("Passwords do not match!");
                setLoading(false);
                return;
            }

            try {
                console.log("registering user"); 
                const registered = await postRegister(email, username, password, avatarURL, bio);               
                if (!isCanceled.current && registered) {                                      
                    console.log("user registered");
                    onSuccess();                    
                }else {
                    setError("Error registering user");
                    console.log("Error registering user");                    
                }
            } catch (error) {
                if (!isCanceled.current) {
                    setError(error as string);
                    console.error("Error registering:", error);                    
                }
            } finally {
                if (!isCanceled.current) {
                    setLoading(false);
                }
            }
        }

    useEffect(() => {       
        return () => {
            isCanceled.current = true;
        };
    }, []);

    return { error, loading, doRegister};

}