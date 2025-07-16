

import { Heart } from "lucide-react";
import { IconButton } from "./IconButton";
import styles from "./EditCommentCard.module.scss";
// import { likeComment, postComment, type Comment } from "../../models/comments";
import { getLoggedInUserId } from "../../models/users";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { type Comment } from "../../models/comments";
import { Input } from "./Input";
import { GeneralButton } from "./GeneralButton";
import { useAddComment } from "../../hooks/usePosts";
import { ErrorMsg } from "./ErrorMsg";

type CommentProps = {
    post: Comment;
    content?: string;
    onCommentPosted: (newCommentId: string) => void;
}
export function EditCommentCard({post, content, onCommentPosted}: CommentProps){  

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
        
        doEditComment(commentContent, post._id);
    }
    const { error, loading, doEditComment } = useEditComment((commentId: string) => {
        onCommentPosted(commentId);}
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
                <label htmlFor="commentContent">{"Edit Comment"}</label>
                <textarea id="commentContent" name="commentContent" placeholder="Write your comment here..."
                    rows={5} required className={styles.commentTtext} value={content}/>
                <section className={styles.buttonsSection}>
                    <GeneralButton label={"Update Comment"} disabled={disable}/>            
                    <GeneralButton label="Cancel" disabled={disable} onClick={() => onCommentPosted("")}/>
                </section>                
            </form> 
            {loading && <Spinner />}
            {showError && error && <ErrorMsg message={error} onOk={() => {setShowError(false)}} />}
        </>
               
    );
}

