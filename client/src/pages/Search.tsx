import { useLoaderData } from "react-router";
import styles from "./Search.module.scss";
import type { User } from "../models/users";

export function Search() {  

  return (
    <div className={styles.searchMain}>
      <h1>Search Page</h1>
      <p>This will be a search page</p>
    </div>
  );
}