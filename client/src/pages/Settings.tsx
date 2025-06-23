import { useLoaderData } from "react-router";
import styles from "./Settings.module.scss";
import type { User } from "../models/users";

export function Settings() {

  const user = useLoaderData<User>();
  console.log(`User:`, user);
  

  return (
    <div className={styles.settingsMain}>
      <h1>Settings Page</h1>
      <p>This will be a settings page</p>
    </div>
  );
}