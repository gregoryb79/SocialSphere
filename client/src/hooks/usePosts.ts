import { useRef, useEffect, useState } from "react";
import { getLoggedInUserId } from "../models/users";
import { postComment } from "../models/comments";
import { addComment } from "../models/posts";

export function useAddComment(onSuccess: (newCommentId: string) => void) {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);  
    const isCanceled = useRef(false);
    isCanceled.current = false;
    const currUserId = useRef<string>(getLoggedInUserId());

    async function doAddComment(commentContent: string, postId: string) {
        setError(undefined);
        setLoading(true);

        try {                
            const newCommentId = await postComment(commentContent, postId);
            if (newCommentId) {
                console.log(`uAC Comment posted successfully with ID: ${newCommentId}`); 
                onSuccess(newCommentId);            
            } else {
                console.error("uAC Failed to post comment");
                setError("Failed to post comment");
            }
                
            // const result = await addComment(newCommentId, postId);
            // if (result) {
            //     console.log(`uAC Comment ${newCommentId} added to post ${postId} successfully`);  
            //     onSuccess();          
            // } else {
            //     console.error(`uAC Failed to add comment ${newCommentId} to post ${postId}`);
            //     setError(`Failed to add comment ${newCommentId} to post ${postId}`);
            // }        
        } catch (error) {
            if (!isCanceled.current) {
                setError(error as string);
                console.error("uAC Error adding comment", error);                    
            }
        } finally {
            if (!isCanceled.current) {
                setLoading(false);
            }
        }
    }
    
    useEffect(() => {       
        return () => {
            console.log("Cleanup: setting isCanceled.current = true");
            isCanceled.current = true;
        };
    }, []);
    
    return { error, loading, doAddComment};
}