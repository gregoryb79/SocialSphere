/**
 * A comment card component displaying a comment, like button, and statistics.
 *
 * @param comment The comment object to display.
 * @example
 * <CommentCard comment={comment} />
 *
 * Features:
 * - Shows author, content, like count, and age.
 * - Like button is disabled for unauthenticated users and the comment author.
 * - Spinner is shown while like action is pending.
 * - Filled heart icon if current user liked the comment.
 */

import { Heart } from "lucide-react";
import { IconButton } from "./IconButton";
import styles from "./CommentCard.module.scss";
// import { likeComment, type Comment } from "../../models/comments";
import { getLoggedInUserId } from "../../models/users";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";

type CommentProps = {
    comment: Comment;
}
export function CommentCard({comment}: CommentProps){  

    // const currUserId = useRef<string>(getLoggedInUserId());
    // console.log(`CommentCard rendered for comment: ${comment._id} by user: ${currUserId.current}`);
    // const likeIconColor = useRef<string>("var(--primary-blue)");
    // const [disable,setDisable] = useState<boolean>(false);
    // const [loading, setLoading] = useState<boolean>(false);
    // const filled = (comment.likes.includes(currUserId.current) ? "var(--primary-blue)" : "none");
    // console.log(`CommentCard filled color: ${filled}, comment likes: ${comment.likes.length}`);
    // useEffect(() => {
    //     if (!currUserId.current) {
    //         console.log("No user logged in, setting like icon color to light text");
    //         likeIconColor.current = "var(--light-text)";
    //         setDisable(true);
    //     }
    //     else if (currUserId.current === comment.author) {
    //         console.log("User is the author of the comment, setting like icon color to light text");
    //         likeIconColor.current = "var(--light-text)";
    //         setDisable(true);
    //     }
    // }, []);

    
    // async function handleLikeComment(commentId: string) {
    //     console.log(`Like comment with ID: ${commentId}`);
    //     if (!currUserId.current) {
    //         console.log("No user logged in, cannot like comment");
    //         return;
    //     }
    //     if (currUserId.current === comment.author) {
    //         console.log("Cannot like own comment");
    //         return;
    //     }
    //     setDisable(true); 
    //     setLoading(true);
    //     try {
    //         const result = await likeComment(commentId);
    //         if (result) {
    //             console.log(`Comment ${commentId} like toggled successfully`);
    //             comment.likes = result.likes;
    //             console.log("Comment likes", comment.likes);                
    //             comment.updatedAt = result.updatedAt;                
    //         }else {
    //             console.log(`Failed to like toggle comment ${commentId}`);
    //         }
    //     }catch(error) {
    //         console.error(`Error like toggling comment ${commentId}:`, error);
    //     }finally {
    //         console.log(`Like toggle operation for comment ${commentId} completed`);
    //         setDisable(false);
    //         setLoading(false);
    //     }

    // }
      
    return (
        <></>
        // <li key={comment._id} className={styles.commentCard}>
        //     {loading && <Spinner/>} 
        //     <p><strong>{comment.authorName}:</strong></p>
        //     <p>{comment.content}</p>
        //     <section className={styles.commentStatistics}>
        //         <span><Heart className={styles.lucideIconComment} color="var(--primary-blue)"/> {comment.likes.length}</span>
        //         <span>{commentAge(comment.createdAt)}</span>
        //     </section>
        //     <section className={styles.commentActions}>           
        //         <IconButton title="Like" disabled = {disable} ariaLabel= "Like comment" icon={<Heart className={styles.lucideIconCommentAction} color={likeIconColor.current} fill={filled}/>}
        //                     onClick={() => handleLikeComment(comment._id)} />
        //     </section>
            
        // </li>
    );
}

function commentAge(createdAt: string): string {
    const now = new Date();
    const commentDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds} s`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} m`;
    } else if (diffInSeconds < 3600*24) {
        return `${Math.floor(diffInSeconds / 3600)} H`;
    } else if (diffInSeconds < 3600*24*365){
        return `${Math.floor(diffInSeconds / 3600*24)} d`;
    } else {
        return `${Math.floor(diffInSeconds / (3600*24*7))} W`;
    }

}