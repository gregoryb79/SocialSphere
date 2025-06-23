import { GeneralButton } from './components/GeneralButton';
import styles from './Register.module.scss';

import { useLoaderData, useNavigate, useRevalidator } from 'react-router';
import { useDoRegister } from '../hooks/useLogIn';
import { Spinner } from './components/Spinner';
import { useEffect, useState } from 'react';
import { ErrorMsg } from './components/ErrorMsg';

import { PasswordInput } from './components/PasswordInput';
import { Input } from './components/Input';


export function Register() {   

    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const [showError, setShowError] = useState(false);
    
    const username = useLoaderData<string>();
    useEffect(() => {
        if (username) {
            console.log(`User is already logged in as ${username}. Redirecting to home page...`);
            navigate("/");
        }
    }, [username]);

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {                     
        event.preventDefault();
        console.log("Register button clicked");
        const formData = new FormData(event.currentTarget);        
        const email = formData.get("email") as string;
        const username = formData.get("username") as string;
        const password = formData.get("password") as string; 
        const repeatPassword = formData.get("repeatPassword") as string;       
        console.log(`email = ${email}, username = ${username}, password = ${password}, repeatPassword = ${repeatPassword}`);            
        doRegister(email, username, password, repeatPassword);
    }

    const {error,loading: loadingRegister, doRegister } = useDoRegister(() => {
        revalidate();
        navigate("/");
    });

    useEffect(() => {
        if (error) {
            console.error("Error during login:", error);
            setShowError(true);
        }
    }, [error]);

    const [password, setPassword] = useState("");

    return (
        <main className={styles.registerContainer}>
            <h2>Register</h2>            
            {loadingRegister && <Spinner/>} 
            <form className={styles.registerForm} onSubmit={handleRegister}>                
                <Input type="email" id="email" label="Email" name="email" placeholder="Enter your e-mail" required />
                <Input type="username" id="username" label="Username" name="username" placeholder="Select username" required />
                <PasswordInput id="password" label="Password" name="password" placeholder="Enter your password" 
                required minLength={8} onInput={(e) => setPassword(e.currentTarget.value)} value={password}/>
                <PasswordInput id="password" label="Repeat password:" name="repeatPassword" placeholder="Repeat password" required />
                <GeneralButton label="Register"/>     
                <section>
                    <p>Password Rules:</p>
                    <PasswordRules password={password} />  
                </section>                       
            </form>
            
            {showError && error && <ErrorMsg message={error} onOk={() => {setShowError(false)}} />}
            
        </main>
    );
}

type PasswordRulesProps = { password: string };
function PasswordRules({ password }: PasswordRulesProps) {
    return (
        <ul className={styles.passwordRules}>
            <li className={password.length >= 8 ? styles.satisfied : undefined}>8 characters long</li>
            <li className={password.match(/[a-z]/) ? styles.satisfied : undefined}>1 lowercase letter</li>
            <li className={password.match(/[A-Z]/) ? styles.satisfied : undefined}>1 uppercase letter</li>
            <li className={password.match(/[0-9]/) ? styles.satisfied : undefined}>1 digit</li>
        </ul>
    );
}