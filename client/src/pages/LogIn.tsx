import { GeneralButton } from './components/GeneralButton';
import styles from './LogIn.module.scss';
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router';
import { useDoLogIn } from '../hooks/useLogIn';
import { Spinner } from './components/Spinner';
import { ErrorMsg } from './components/ErrorMsg';
import { useEffect, useState } from 'react';
import { PasswordInput } from './components/PasswordInput';
import { Input } from './components/Input';


export function LogIn() { 

    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const [showError, setShowError] = useState(false);

    const username = useLoaderData<string>();
    useEffect(() => {
        if (username != "Guest") {
            console.log(`User is already logged in as ${username}. Redirecting to home page...`);
            navigate("/");
        }
    }, [username]);  
    
    function handleLogIn(event: React.FormEvent<HTMLFormElement>) {        
        console.log("Log In button clicked");
        event.preventDefault();
        const formData = new FormData(event.currentTarget);        
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;        
        console.log(`email = ${email}, password = ${password}`);
        doLogIn(email, password);
    }
    const { error, loading: loadingLogin, doLogIn } = useDoLogIn(() => {
        revalidate();
        navigate("/");
    });    

    useEffect(() => {
        if (error) {
            console.error("Error during login:", error);
            setShowError(true);
        }
    }, [error]);

    return (
        <main className={styles.loginContainer}>
            <h2>Log In</h2>            
            {loadingLogin && <Spinner/>} 
            <form className={styles.loginForm} onSubmit={handleLogIn}>                
                <Input type="email" id="email" label="Email" name="email" placeholder="Enter your e-mail" required />
                <PasswordInput id="password" label="Password" name="password" placeholder="Enter your password" required />                
                <GeneralButton label="Log In" />
                <p>Don't have an account? <Link to="/register">Register</Link></p>                            
            </form>
            
            {showError && error && <ErrorMsg message={error} onOk={() => {setShowError(false)}} />}
            
        </main>
    );
}