import { useLoaderData } from "react-router";
import styles from "./Notifications.module.scss";
import type { Notification } from "../models/notifications";

export function Notifications() {  

  const notifications = useLoaderData<Notification>();
  console.log(`notifications:`, notifications);

  return (
    <div className={styles.notificationsMain}>
      <h1>Notifications Page</h1>
      <p>This will be a notifications page</p>
    </div>
  );
}