import { useLoaderData } from "react-router";
import type { Notification } from "../models/notifications";

import styles from "./Notifications.module.scss";

export function Notifications() {
  const notifications = useLoaderData() as Notification[];

  return(
    <div className={styles.notificationsMain}>
      <h1 className={styles.title}>Notifications</h1>
      {notifications.length === 0 ? (
        <p className={styles.empty}>No notifications yet</p>
      ) : (
        <ul className={styles.notificationsList}>
          {notifications.map((n) => (
            <li key={n.id} className={`${styles.notificationItem} ${n.seen ? styles.seen : styles.unseen}`}>
              <div className={styles.textLine}>
                <strong>@{n.sender_id}</strong> {renderText(n.type)}
              </div>
              <span className={styles.time}>
                {formatTimeAgo(n.created_at)}
              </span>
              {n.type === "follow" && (
                <button className={styles.asctionButton}>Follow</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function renderText(type: Notification["type"]) {
  switch (type) {
    case "like":
      return "liked your post";
    case "comment":
      return "commented on your post";
    case "follow":
      return "followed you";
    default:
      return "";
  }
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return "Just now";

  if (hours === 1) return "1 hour ago";

  return `${hours} hours ago`;
}

// export function Notifications() {  

//   const notifications = useLoaderData<Notification>();
//   console.log(`notifications:`, notifications);

//   return (
//     <div className={styles.notificationsMain}>
//       <h1>Notifications Page</h1>
//       <p>This will be a notifications page</p>
//     </div>
//   );
// }