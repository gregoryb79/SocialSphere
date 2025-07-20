import React, { useEffect, useState } from "react";
import styles from "./Following.module.scss";
import Follow from "./Follow";
import { getLoggedInUserId } from "../../models/users"; 
import { getToken } from "../../models/apiClient";

interface FollowingUser {
  _id: string;
  username: string;
  avatar?: string;
}

interface FollowingProps {
  userId: string;
  token: string;
}

const Following: React.FC<FollowingProps> = ({ userId, token }) => {
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(true);
  token = getToken() || "";
  const loggedInUserId = getLoggedInUserId();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/following`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setFollowing(data.following);
      } catch (err) {
        console.error("Failed to fetch following users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId, token]);

  if (loading) return <p>Loading following...</p>;

  return (
    <div className={styles.list}>
      {following.length === 0 ? (
        <p>Not following anyone yet.</p>
      ) : (
        following.map((user) => (
          <div key={user._id} className={styles.follower}>
            <img src={user.avatar || "/default-avatar.png"} alt={user.username} />
            <span>{user.username}</span>
          </div>
        ))
      )}{loggedInUserId !== userId && (
              <Follow
                targetUserId={userId}
                initialIsFollowing={true}
                token={token}
              />
            )}
    </div>
  );
};

export default Following;
