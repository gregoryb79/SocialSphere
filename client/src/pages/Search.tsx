//import { useLoaderData } from "react-router";
import styles from "./Search.module.scss";
import { Input } from "./components/Input";
import { IconButton } from "./components/IconButton";
import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserByName } from "../models/users";
import { Spinner } from "./components/Spinner";


export function Search() { 

  return (
    <main className={styles.searchMain}>
      <div>
        <h1 className={styles.searchHeader}>
            <Input className={styles.SearchInput} id="search" type="search" name="search" label="" placeholder="Type a Username to search..."/>
            <IconButton title="Search" ariaLabel="Search" icon={<SearchIcon className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={Search} />
        </h1>
      </div>
      <ul className={styles.searchResults}> 
        <UserInfo username="johnDoe" profilePicture="https://placehold.co/100x100" bio="Just another SocialSphere user." />
      </ul> 
    </main>
  );
}


type UserInfoProps = {
    username: string;
    profilePicture?: string;
    bio?: string;
}

export function UserInfo({ username}: UserInfoProps) {
    const [user, setUser] = useState<UserInfoProps | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const fetchedUser = await getUserByName(username);
                setUser(fetchedUser);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Failed to load user information.");
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [username]);

    if (loading) return <Spinner />;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>{user?.username}</h2>
            {user?.profilePicture && <img src={user.profilePicture} alt={`${user?.username}'s profile`} />}
            {user?.bio && <p>{user.bio}</p>}
        </div>
    );
}