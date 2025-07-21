import React, { useState } from "react";
import styles from "./Follow.module.scss";

interface FollowProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  token: string;
}

const Follow: React.FC<FollowProps> = ({ targetUserId, initialIsFollowing, token }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggleFollow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${targetUserId}/${isFollowing ? "unfollow" : "follow"}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.error("Error following/unfollowing user", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`${styles.button} ${isFollowing ? styles.unfollow : styles.follow}`}
      onClick={handleToggleFollow}
      disabled={loading}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default Follow;
