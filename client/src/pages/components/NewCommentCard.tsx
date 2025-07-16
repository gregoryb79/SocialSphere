

import { Heart } from "lucide-react";
import { IconButton } from "./IconButton";
import styles from "./NewCommentCard.module.scss";
// import { likeComment, postComment, type Comment } from "../../models/comments";
import { getLoggedInUserId } from "../../models/users";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { type Comment } from "../../models/comments";
import { Input } from "./Input";
import { GeneralButton } from "./GeneralButton";
import { useAddComment, useEditComment } from "../../hooks/usePosts";
import { ErrorMsg } from "./ErrorMsg";

type CommentProps = {
    post: Comment;
    content?: string;
    onCommentPosted: (newCommentId: string) => void;
}
export function NewCommentCard({post, content, onCommentPosted}: CommentProps){  

    const currUserId = useRef<string>(getLoggedInUserId());
    console.log(`CommentCard rendered for comment: ${post._id} by user: ${currUserId.current}`);
    const likeIconColor = useRef<string>("var(--primary-blue)");
    const [disable,setDisable] = useState<boolean>(false);    
    // const [commentContent, setCommentContent] = useState<string>(content || "");
   
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
        
        if (!content) {
            doAddComment(commentContent, post._id);
        } else {
            doEditComment(commentContent, post._id);
        }

    }
    const { error, loading, doAddComment } = useAddComment((newCommentId: string) => {
        onCommentPosted(newCommentId);}
    );    
    const { error: errorEdit, loading: editLoading, doEditComment } = useEditComment((commentId: string) => {
        onCommentPosted(commentId);}
    ); 
      
    const [showError, setShowError] = useState(false);
    useEffect(() => {
        if (error) {
            console.error("Error during posting comment:", error);
            setShowError(true);
        }
        if (errorEdit) {
            console.error("Error during posting comment:", error);
            setShowError(true);
        }
    }, [error]);


      
    return (
        <>
            <form className={styles.newCommentCard} onSubmit={handlePostComment}>            
                <label htmlFor="commentContent">{!content ? "New Comment" : "Edit Comment"}</label>
                <textarea id="commentContent" name="commentContent" placeholder="Write your comment here..."
                    rows={5} required className={styles.commentTtext} defaultValue={content}/>
                <section className={styles.buttonsSection}>
                    <GeneralButton label={!content ? "Post Comment" : "Update Comment"} disabled={disable}/>            
                    <GeneralButton label="Cancel" disabled={disable} onClick={() => onCommentPosted("")}/>
                </section>                
            </form> 
            {loading || editLoading && <Spinner />}
            {showError && error && <ErrorMsg message={error} onOk={() => {setShowError(false)}} />}
        </>
               
    );
}

