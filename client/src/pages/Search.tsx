import { useLoaderData, useNavigate } from "react-router";
import styles from "./Search.module.scss";
import { Input } from "./components/Input";
import { IconButton } from "./components/IconButton";
import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserByName, type User } from "../models/users";
import { Spinner } from "./components/Spinner";


export function Search() {
const UserInfo = useLoaderData<User>();
const [user, setUser] = useState<User | null>(UserInfo || null);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState<string>("");

const navigate = useNavigate();

useEffect(() => {
  if (!searchTerm) {
    setUser(null);
    setError(null);
    setLoading(false);
    return;
  }
  setLoading(true);
  async function fetchUser() {
    try {
      const fetchedUser = await getUserByName(searchTerm.toLowerCase().trim());
      setUser(fetchedUser);
      setError(null);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user information.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const handler = setTimeout(() => {
    fetchUser();
  }, 300);


  return () => {
    clearTimeout(handler);
  };

}, [searchTerm]);

const handleUserClick = () => {
    navigate(`/profile`); 
};


  return (
    <main className={styles.searchMain}>
      <div>
        <h1 className={styles.searchHeader}>
          <Input
            className={styles.SearchInput}
            id="search"
            type="search"
            name="search"
            label=""
            placeholder="Type a Username to search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton
            title="Search"
            ariaLabel="Search"
            icon={<SearchIcon className={styles.lucideIconFooter} color="var(--primary-blue)"/>}
            onClick={() => setSearchTerm((document.getElementById("search") as HTMLInputElement)?.value.trim() || "")}
          />
        </h1>
      </div>
      <ul className={styles.searchResults}>
        {loading && <Spinner />}
        {error && <div>{error}</div>}
        {user && (
          <li
            key={user._id}
            onClick={() => handleUserClick()} //check if can be done before backend
          >
            <h2>{user.username}</h2>
            {user.profilePicture && <img src={user.profilePicture} alt={`${user.username}'s profile`} />}
            {user.bio && <p>{user.bio}</p>}
          </li>
        )}
        {!loading && !error && !user && searchTerm && (
            <li>No user found matching "{searchTerm}"</li>
        )}
      </ul>
    </main>
  );
}


