import { useLoaderData, useNavigate } from "react-router";
import styles from "./Search.module.scss";
import { Input } from "./components/Input";
import { IconButton } from "./components/IconButton";
import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserByName, type User } from "../models/users";
import { Spinner } from "./components/Spinner";
import { fetchPostsByContent } from "../models/posts";
import { type Comment } from "../models/comments";
import { PostCard } from "./components/PostCard";


export function Search() {
const UserInfo = useLoaderData<User>();
const [user, setUser] = useState<User | null>(UserInfo || null);
const [userLoading, setUserLoading] = useState<boolean>(false);
const [userError, setUserError] = useState<string | null>(null);

const [postResults, setPostResults] = useState<Comment[]>([]);
const [postLoading, setPostLoading] = useState<boolean>(false);
const [postError, setPostError] = useState<string | null>(null);


const [searchTerm, setSearchTerm] = useState<string>("");

const navigate = useNavigate();


useEffect(() => {
  if (!searchTerm) {
    setUser(null);
    setUserError(null);
    setUserLoading(false);
    return;
  }
  setUserLoading(true);
  setUserError(null); 
  async function fetchUserData() {
    try {
      const fetchedUser = await getUserByName(searchTerm.toLowerCase().trim());
      setUser(fetchedUser);
      setUserError(null);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUserError("Failed to load user information.");
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }
  const userHandler = setTimeout(() => {
    fetchUserData();
  }, 300); 

  return () => {
    clearTimeout(userHandler);
  };
}, [searchTerm]);



useEffect(() => {
    if (!searchTerm) {
        setPostResults([]);
        setPostError(null);
        setPostLoading(false);
        return;
    }
    setPostLoading(true);
    setPostError(null);
    async function fetchPostData() {
        try {
            const fetchedPosts = await fetchPostsByContent(searchTerm.toLowerCase().trim());
            setPostResults(fetchedPosts);
            setPostError(null);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setPostError("Failed to load post information.");
            setPostResults([]);
        } finally {
            setPostLoading(false);
        }
    }
    const postHandler = setTimeout(() => {
        fetchPostData();
    }, 300);

    return () => {
        clearTimeout(postHandler);
    };

}, [searchTerm]); 



const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`); 
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
            placeholder="Search the app for Users or Posts..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <IconButton
            title="Search"
            ariaLabel="Search"
            icon={<SearchIcon className={styles.lucideIconFooter} color="var(--primary-blue)"/>}
            onClick={() => setSearchTerm((document.getElementById("search") as HTMLInputElement)?.value.trim() || "")}
          />
        </h1>
      </div>
      <section className={styles.searchResults}>
      <ul>
        {userLoading && <Spinner />}
        {userError && <div>{userError}</div>}
        {user && (
          <li className={styles.searchResultItem}
            key={user._id}
            onClick={() => handleUserClick(user._id)} 
          >
            {user.avatar && <img src={user.avatar} alt={`${user.username}'s profile`} className={styles.userAvatar}/>}
            <div className={styles.userInfo}>
            <h2 className={styles.userName}>@{user.username}</h2>
            {user.bio && <p className={styles.userBio}>{user.bio}</p>}
            </div>
          </li>
        )}
        {!userLoading && !userError && !user && searchTerm && (
          <div>
             <p className={styles.noResults}>No users found matching "{searchTerm}"</p>
          </div>
        )}
      </ul>
      <ul className={styles.searchResultsPosts}> 
        {postLoading && <Spinner />}
        {postError && <div>{postError}</div>}
        {postResults.map((post) => (
            <PostCard key={post._id} post={post}/>
        ))}
        {!postLoading && !postError && postResults.length === 0 && searchTerm && (
          <div>
            <p className={styles.noResults}>No posts found matching "{searchTerm}"</p>
          </div>
        )}
      </ul>
      </section>
    </main>
  );
}


