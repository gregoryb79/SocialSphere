//import { useLoaderData } from "react-router";
import styles from "./Search.module.scss";
import { Input } from "./components/Input";
import { IconButton } from "./components/IconButton";
import { SearchIcon } from "lucide-react";
import { UserInfo } from "./components/UserInfo";

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