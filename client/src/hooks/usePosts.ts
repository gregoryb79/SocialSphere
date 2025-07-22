import { useRef, useEffect, useState } from "react";
import { getLoggedInUserId } from "../models/users";
import { editComment, postComment } from "../models/comments";
// import { addComment } from "../models/posts";

export function useAddComment(onSuccess: (newCommentId: string) => void) {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);  
    const isCanceled = useRef(false);
    isCanceled.current = false;
    const currUserId = useRef<string>(getLoggedInUserId());

    async function doAddComment(commentContent: string, postId: string, avatarURL: string) {
        setError(undefined);
        setLoading(true);

        try {                
            const newCommentId = await postComment(commentContent, postId, avatarURL);
            if (newCommentId) {
                console.log(`uAC Comment posted successfully with ID: ${newCommentId}`); 
                onSuccess(newCommentId);            
            } else {
                console.error("uAC Failed to post comment");
                setError("Failed to post comment");
            }                
                
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

export function useEditComment(onSuccess: (commentId: string) => void) {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);  
    const isCanceled = useRef(false);
    isCanceled.current = false;
    const currUserId = useRef<string>(getLoggedInUserId());

    async function doEditComment(commentContent: string, commentId: string, avatarURL: string) {
        setError(undefined);
        setLoading(true);

        try {                
            const result = await editComment(commentContent, commentId, avatarURL);
            if (result) {
                console.log(`uAC Comment ${commentId} edited successfully.`); 
                onSuccess(commentId);            
            } else {
                console.error("uAC Failed to edit comment");
                setError("Failed to edit comment");
            }                
                    
        } catch (error) {
            if (!isCanceled.current) {
                setError(error as string);
                console.error("uAC Error edditing comment", error);                    
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
    
    return { error, loading, doEditComment};
}