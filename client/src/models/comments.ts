import { apiClient } from "./apiClient";
import { getLoggedInUserId, getLoggedInUserName } from "./users";

export type Comment = {
    _id: string;
    author: string; 
    authorName?: string; 
    parentId?: string; 
    content: string;
    image?: string;
    likes: string[]; 
    comments: string[];
    createdAt: string;
    updatedAt: string;
};

export async function getComments(commentsId: string[]): Promise<Comment[]> {

    console.log("Fetching comments with ids:", commentsId);
    try {
        const response = await apiClient.get(`/comments`,
           {params: { ids: commentsId.join(",") }});

        console.log("Fetched comments:", response.data);
        
        return response.data as Comment[];
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

export async function deleteCommentWithChildren(commentId: string): Promise<void> {
    console.log(`Deleting comment with ID: ${commentId}`);
    try {
        const response = await apiClient.delete(`/comments/${commentId}`);
        console.log(`Comment with ID ${commentId} deleted successfully`, response.data);
    } catch (error) {
        console.error(`Error deleting comment with ID ${commentId}:`, error);
        throw error;
    }
}

// export async function likeComment(commentId: string): Promise<Comment> {
//     const comment = mockComments.find(c => c._id === commentId);
//     const currentUserId = getLoggedInUserId();
//     console.log(`Toggling like for comment with ID: ${commentId}, likes before toggle:`, comment?.likes);
//     if (!comment) {
//         console.error(`Comment with ID ${commentId} not found`);
//         return Promise.reject(new Error(`Comment with ID ${commentId} not found`));
//     }
//     comment.likes = comment.likes.includes(currentUserId) ? comment.likes.filter(like => like !== currentUserId) : [...comment.likes, currentUserId];
//     console.log(`Likes after toggle:`, comment.likes);
//     comment.updatedAt = new Date().toISOString();
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             console.log(`Comment with ID ${commentId} liked`);
//             resolve(comment);
//         }, 1000);
//     });
// }

export async function postComment(commentText: string, parent_id: string, avatarURL: string): Promise<string> {
    console.log(`Posting comment:`, commentText);
    console.log(`Parent ID:`, parent_id);
    if (!commentText || commentText.trim() === "") {
        console.error("Comment text cannot be empty");       
        return Promise.reject(new Error("Comment text cannot be empty"));        
    }
    if (!getLoggedInUserId()) {
        console.error("No user logged in, cannot post comment");
        return Promise.reject(new Error("No user logged in, cannot post comment"));
    }
    try {
        const response = await apiClient.post("/comments", 
            {
                content: commentText,
                parentId: parent_id,
                avatarURL: avatarURL
            });
        console.log(`Comment posted successfully:`, response.data);
        return response.data.id as string;
    } catch (error) {
        console.error(`Error posting comment:`, error);
        return Promise.reject(new Error(`Error posting comment: ${error}`));
    }
    // const comment: Comment = {
    //     _id: `c${mockComments.length + 1}`,
    //     author: getLoggedInUserId(),
    //     authorName: getLoggedInUserName(), // Placeholder, can be fetched from user data
    //     content: commentText,
    //     image: undefined, // No image for this comment
    //     likes: [],
    //     comments: [],
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    // };
    // console.log(`Comment object created:`, comment);
    // mockComments.push(comment);
    // console.log(`Comment added to mockComments:`, mockComments);
    
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         console.log(`Comment posted:`, comment);            
    //         resolve(comment._id);
    //     }, 1000);
    // });
}

export async function editComment(commentText: string, commentId: string, avatarURL: string): Promise<boolean> {
    console.log(`Editing comment:`, commentText);
    console.log(`Comment ID:`, commentId);
    if (!commentText || commentText.trim() === "") {
        console.error("Comment text cannot be empty");       
        return Promise.reject(new Error("Comment text cannot be empty"));        
    }
    if (!getLoggedInUserId()) {
        console.error("No user logged in, cannot post comment");
        return Promise.reject(new Error("No user logged in, cannot post comment"));
    }
    try {
        const response = await apiClient.put("/comments", 
            {
                content: commentText,
                commentId: commentId,
                avatarURL: avatarURL
            });
        if (response.status !== 201) {
            console.error(`Failed to edit comment with ID ${commentId}, status:`, response.status);
            return false;
        }
        console.log(`Comment updated successfully.`);
        return true;
    } catch (error) {
        console.error(`Error editing comment:`, error);
        return Promise.reject(new Error(`Error editing comment: ${error}`));
    }  
}

const mockComments: Comment[] = [];