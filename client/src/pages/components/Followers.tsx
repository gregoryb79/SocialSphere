import React, { useEffect, useState } from "react";
import styles from "./Followers.module.scss";
import Follow from "./Follow";
import { getLoggedInUserId } from "../../models/users"; 
import { getToken } from "../../models/apiClient";

interface Follower {
  _id: string;
  username: string;
  avatar?: string;
}

interface FollowersProps {
  userId: string;
  token: string;
}

const Followers: React.FC<FollowersProps> = ({ userId, token }) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  token = getToken() || "";
  const loggedInUserId = getLoggedInUserId();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/followers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setFollowers(data.followers);
      } catch (err) {
        console.error("Failed to fetch followers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId, token]);

  if (loading) return <p>Loading followers...</p>;

  return (
    <div className={styles.list}>
      {followers.length === 0 ? (
        <p>No followers yet.</p>
      ) : (
        followers.map((follower) => (
          <div key={follower._id} className={styles.follower}>
            <img src={follower.avatar || "/default-avatar.png"} alt={follower.username} />
            <span>{follower.username}</span>{loggedInUserId !== userId && (
              <Follow
                targetUserId={userId}
                initialIsFollowing={true}
                token={token}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Followers;
