

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
import { useNavigate } from "react-router";
import { URLorFileUploadInput } from "./URLorFileUploadInput";

type CommentProps = {
    post?: Comment;
    content?: string;
    onCommentPosted: (newCommentId: string) => void;
}
export function NewCommentCard({post, content, onCommentPosted}: CommentProps){  

    const currUserId = useRef<string>(getLoggedInUserId());    
    console.log(`CommentCard rendered for comment: ${post?._id} by user: ${currUserId.current} parentId: ${post?.parentId}`);
    const likeIconColor = useRef<string>("var(--primary-blue)");
    const [disable,setDisable] = useState<boolean>(false);    
    
    
    const commentLabel = useRef<string>(!content ? "New Comment" : "Edit:");
    if (!post) commentLabel.current = "";
    const buttonLabel = useRef<string>(!content ? "Post Comment" : "Update");       
    if (!post) buttonLabel.current = "Create Post";
    const isPost = useRef<boolean>(false);
    // if (post && !post.parentId) isPost.current = true;
    // if (isPost.current) buttonLabel.current = "Update Post";
    

    const [avatarHostURL, setAvatarHostURL] = useState<string>("");
    const [isAvatarUploaded, setIsAvatarUploaded] = useState(false);

   
   
    function handlePostComment(event: React.FormEvent<HTMLFormElement>) {
        console.log(`NCC: Post comment button clicked on post: ${post?._id}`);
        event.preventDefault();
        setDisable(true);
        const formData = new FormData(event.currentTarget);
        const commentContent = formData.get("commentContent") as string;    
        console.log(`NCC: commentContent = ${commentContent}`); 
        const avatarURL = isAvatarUploaded ? avatarHostURL : formData.get("avatarURL") as string;
        console.log(`NCC: avatarURL = ${avatarURL}`);
        if (!currUserId.current) {
            console.log("NCC: No user logged in, cannot post comment");
            return;
        }
        
        if (!content) {
            doAddComment(commentContent, post?._id || "", avatarURL);
        } else {
            doEditComment(commentContent, post?._id || "", avatarURL);
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

    const navigate = useNavigate();
    function onCancelClick() {        
        if (!post) {
            navigate("/"); 
        } else {
            onCommentPosted("");
        }
    }
      
    return (
        <>
            <form className={styles.newCommentCard} onSubmit={handlePostComment} data-is-new-post={!post}>            
                <label htmlFor="commentContent">{commentLabel.current}</label>
                <textarea id="commentContent" name="commentContent" placeholder={!post ? "Enter your text here..." : "Write your comment here..."}
                    rows={!post? 15 : 5} required className={styles.commentTtext} defaultValue={content}/>
                {(!post || isPost.current) && <URLorFileUploadInput 
                                    setImageHostURL={setAvatarHostURL} 
                                    setIsImageUploaded={setIsAvatarUploaded}                                         
                                    type="text" 
                                    id="avatarURL" 
                                    label="Image to attach:" 
                                    name="avatarURL" 
                                    placeholder="put link or upload"/>}    
                <section className={styles.buttonsSection}>
                    <GeneralButton label={buttonLabel.current} type="submit" disabled={disable}/>            
                    <GeneralButton label="Cancel" type="button" disabled={disable} onClick={onCancelClick}/>
                </section>                
            </form> 
            {loading || editLoading && <Spinner />}
            {showError && error && <ErrorMsg message={error} onOk={() => {setShowError(false)}} />}
        </>
               
    );
}

