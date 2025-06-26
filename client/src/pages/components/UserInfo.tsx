import { getUserByName } from "../../models/users";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";

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