

import { Heart } from "lucide-react";
import { IconButton } from "./IconButton";
import styles from "./NewCommentCard.module.scss";
import { likeComment, postComment, type Comment } from "../../models/comments";
import { getLoggedInUserId } from "../../models/users";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { type Post, addComment } from "../../models/posts";
import { Input } from "./Input";
import { GeneralButton } from "./GeneralButton";
import { useAddComment } from "../../hooks/usePosts";
import { ErrorMsg } from "./ErrorMsg";

type CommentProps = {
    post: Post;
    onCommentPosted: () => void;
}
export function NewCommentCard({post, onCommentPosted}: CommentProps){  

    const currUserId = useRef<string>(getLoggedInUserId());
    console.log(`CommentCard rendered for comment: ${post._id} by user: ${currUserId.current}`);
    const likeIconColor = useRef<string>("var(--primary-blue)");
    const [disable,setDisable] = useState<boolean>(false);    
   
    function handlePostComment(event: React.FormEvent<HTMLFormElement>) {
        console.log(`NCC: Post comment button clicked on post: ${post._id}`);
        event.preventDefault();
        setDisable(true);
        const formData = new FormData(event.currentTarget);
        const commentContent = formData.get("commentContent") as string;    
        console.log(`NCC: commentContent = ${commentContent}`); 
        if (!currUserId.current) {
            console.log("NCC: No user logged in, cannot post comment");
            return;
        }
        
        doAddComment(commentContent, post._id);
    }
    const { error, loading, doAddComment } = useAddComment(() => {
        onCommentPosted();}
    );
      
    const [showError, setShowError] = useState(false);
    useEffect(() => {
        if (error) {
            console.error("Error during posting comment:", error);
            setShowError(true);
        }
    }, [error]);


      
    return (
        <>
            <form className={styles.newCommentCard} onSubmit={handlePostComment}>            
                <label htmlFor="commentContent">New Comment</label>
                <textarea id="commentContent" name="commentContent" placeholder="Write your comment here..."
                    rows={5} required className={styles.commentTtext}/>
                <section className={styles.buttonsSection}>
                    <GeneralButton label="Post Comment" disabled={disable}/>            
                    <GeneralButton label="Cancel" disabled={disable} onClick={onCommentPosted}/>
                </section>                
            </form> 
            {loading && <Spinner />}
            {showError && error && <ErrorMsg message={error} onOk={() => {setShowError(false)}} />}
        </>
               
    );
}

