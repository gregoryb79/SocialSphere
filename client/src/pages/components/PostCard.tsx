/**
 * A post card component displaying post content, actions, and comments.
 *
 * @param post The post object to display.
 * @param onDelete Optional callback to notify parent when this post/comment is deleted.
 * @example
 * <PostCard post={post} />
 *
 * Features:
 * - Shows post content, author, image, creation date, like/bookmark/comment actions.
 * - Truncates content to 2 lines with "See more"/"See less" toggle if clamped.
 * - Shows a spinner while loading comments.
 * - Displays comments section with CommentCard components when expanded.
 * - Handles like, comment, and delete actions with proper state updates.
 */

import { Bookmark, Delete, Edit, Heart,MessageCircle, Trash } from "lucide-react";
import { likePost} from "../../models/posts";
import { deleteCommentWithChildren, getComments,type Comment} from "../../models/comments";
import { IconButton } from "./IconButton";
import styles from "./PostCard.module.scss";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { getLoggedInUserId } from "../../models/users";
import { NewCommentCard } from "./NewCommentCard";
import { Confirm } from "./Confirm";
import Follow from "./Follow";
import { getToken } from "../../models/apiClient";

type PostCardProps = {
    postInput: Comment; 
    following?: string[];
    onDelete?: (childID: string) => void; 
};
export function PostCard({postInput, following, onDelete}: PostCardProps) {
    const pRef = useRef<HTMLParagraphElement>(null);
    const [clamped, setClamped] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [displayNewComment, setDisplayNewComment] = useState<boolean>(false);  
    const [deleteEnable, setDeleteEnable] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [post, setPost] = useState<Comment>(postInput);
    console.log(`displayNewComment state: ${displayNewComment}`);
     
    
    const currUserId = useRef<string>(getLoggedInUserId());
    console.log(`PostCard rendered for post: ${post._id} with current user: ${currUserId.current}`);  

    const filled = (post.likes.includes(currUserId.current) ? "var(--primary-blue)" : "none");
    const isPost = post.parentId === null || post.parentId === undefined;
    
    useEffect(() => {
        const el = pRef.current;
            if (el) {
                setClamped(el.scrollHeight > el.clientHeight);
            }
    }, [post.content]);

    const likeIconColor = useRef<string>("var(--primary-blue)");
    const commentIconColor = useRef<string>("var(--primary-blue)");
    const deleteIconStyle = useRef<string>("deleteIconDisabled");
    const [likeDisable,setLikeDisable] = useState<boolean>(false); 
    const [commentDisable,setCommentDisable] = useState<boolean>(false);
    useEffect(() => {
        if (!currUserId.current || currUserId.current === "Guest") {
            console.log("No user logged in, setting like and comment icons color to light text and disabling like and comment actions");
            likeIconColor.current = "var(--light-text)";
            commentIconColor.current = "var(--light-text)";
            setLikeDisable(true);
            setCommentDisable(true);
        }
        else if (currUserId.current === post.author) {
            console.log("User is the author of the post, setting like icon color to light text  and disabling like action");
            likeIconColor.current = "var(--light-text)";
            deleteIconStyle.current = "deleteIconEnabled";
            setLikeDisable(true);
            setDeleteEnable(true);
        }
    }, []);



    async function displayComments() {
        
        if (!showComments) {
            setShowComments(true);
            console.log(`Showing comments for post ${post._id}`);
        } else {
            setShowComments(false);                                
            console.log(`Hiding comments for post ${post._id}`);
        }
        console.log(`Clicked to see comments for post ${post._id} with showComments state in now: ${showComments}`);                            
        if (!showComments && comments.length === 0) {
            setLoading(true);
            try{
                console.log(`comment to fetch`, post.comments);
                const postComments = await getComments(post.comments);
                console.log(`Fetched comments for post ${post._id}:`, postComments);
                setComments(postComments);
                console.log(`Comments for post ${post._id}:`, postComments);
            }catch (error) {
                console.error(`Error fetching comments for post ${post._id}:`, error);
            }finally {
                setLoading(false);
            }                                
        }                                         
    }

    async function handleLikePost() {
        console.log(`Like post with ID: ${post._id}`);
        if (!currUserId.current) {
            console.log("No user logged in, cannot like comment");
            return;
        }
        if (currUserId.current === post.author) {
            console.log("Cannot like own comment");
            return;
        }
        setLikeDisable(true); 
        setLoading(true);
        try {
            const result = await likePost(post._id);
            if (result) {
                console.log(`Comment ${post._id} like toggled successfully`);
                post.likes = result.likes;
                console.log("Comment likes", post.likes);                
                post.updatedAt = result.updatedAt;                
            }else {
                console.log(`Failed to like toggle comment ${post._id}`);
            }
        }catch(error) {
            console.error(`Error like toggling comment ${post._id}:`, error);
        }finally {
            console.log(`Like toggle operation for comment ${post._id} completed`);
            setLikeDisable(false);
            setLoading(false);
        }
    }
    
    const [editing, setEditing] = useState<boolean>(false);
    async function handlePostedComment(newCommentId: string) {       
            
        if (newCommentId) {            
            if (newCommentId != post._id) {
                console.log(`PC: New comment ${newCommentId} posted for post ${post._id}`);
                post.comments.push(newCommentId);
            }else {
                console.log(`PC: ${newCommentId} was edited`);
            }
        }else {
            console.log(`PC: New comment posting for ${post._id} was canceled`);
            if (post.comments.length == 0)setShowComments(false);
        }
        if (post.comments.length == 0) setShowComments(false);
        setDisplayNewComment(false);

        if (editing && newCommentId === post._id) {
            console.log(`PC: comment ${newCommentId} was edited`);
            setEditing(false);
            setLoading(true);
            try{
                const updatedPost = await getComments([post._id]);
                setPost(updatedPost[0]);
            }catch (error) {
                console.error(`Error fetching updated post ${post._id}:`, error);
            }finally {
                setLoading(false);
                return;
            }                      
        }
        
        setLoading(true);
        try{
            console.log(`comment to fetch`, post.comments);
            const postComments = await getComments(post.comments);
            console.log(`Fetched comments for post ${post._id}:`, postComments);
            setComments(postComments);
            console.log(`Comments for post ${post._id}:`, postComments);
        }catch (error) {
            console.error(`Error fetching comments for post ${post._id}:`, error);
        }finally {
            setLoading(false);
        }       
    }

    function handleDelete(childID: string) {
        console.log(`Child with ID ${childID} deleted`);
        const updatedComments = comments.filter(comment => comment._id !== childID);
        post.comments = updatedComments.map(comment => comment._id);
        console.log(`Comments length in post ${post._id} before delete:`, comments.length);        
        console.log(`Comments length in post ${post._id} after delete:`, updatedComments.length);        
        setComments(updatedComments);
        setShowComments(updatedComments.length > 0);        
    }

    const [deleted, setDeleted] = useState<boolean>(false);
    async function handleDeleteWithCildren() {
        setShowConfirm(false);
        setLoading(true);
        console.log(`Delete post/comment with ID: ${post._id}`);
        try {
            await deleteCommentWithChildren(post._id);
            console.log(`Post/comment ${post._id} deleted successfully`);                        
            setDeleted(true);            
            if (post.parentId) {
                console.log(`Post/comment ${post._id} is a comment, notifying parent ${post.parentId} to delete`);
                onDelete?.(post._id);
            } else {
                console.log(`Post/comment ${post._id} is a post, no parent to notify`);
            }
        } catch (error) {
            console.error(`Error deleting post/comment ${post._id}:`, error);
            return;
        }finally {
            setLoading(false);
        }        
    }

    async function handleEdit() {
        console.log(`Edit post/comment with ID: ${post._id}`);
        // if (post.parentId) {
            console.log(`Post/comment ${post._id} is a comment`);
            if(!showComments) displayComments();
            setEditing(true);
            setDisplayNewComment(true);
        // }else {
            // console.log(`Post/comment ${post._id} is a post`);
        // }
    }

    
    if (deleted) {
        console.log(`Post/comment ${post._id} is deleted, not rendering`);
        return null;
    }
    return (
       <li key={post._id} className={styles.postCard} > 
            {loading && <Spinner/>}    
            {showConfirm && <Confirm question="Are you sure you want to delete?" onYes={handleDeleteWithCildren} onNo={()=>{setShowConfirm(false)}}/> }                       
            <div className={styles.deleteButtonContainer}>
                <IconButton title="Edit" ariaLabel="edit post/comment" icon={<Edit className={styles.editIcon} />}
                disabled={!deleteEnable}
                onClick={handleEdit} />
                <IconButton title="Delete" ariaLabel="delete post/comment" icon={<Trash className={deleteEnable ? styles.deleteEnable : styles.deleteDisable} />}
                disabled={!deleteEnable}
                onClick={()=>{setShowConfirm(true)}} />
            </div>            
            <p ref={pRef} className={!showMore ? styles.twoLineClamp : ""}>{post.content}</p>                                                              
            {clamped && !showMore && <button className={styles.textButton} onClick={() => setShowMore(true)}>See more</button>}
            {showMore && <button className={styles.textButton} onClick={() => setShowMore(false)}>See less</button>}
            {post.image && <img src={post.image} alt="Post visual content" className={styles.postImage} />}
            <p><strong>Author:</strong> {post.authorName}</p>
            {post.author !== getLoggedInUserId() && (
              <Follow
                targetUserId={post.author}
                initialIsFollowing={following?.includes(post.author) || false}// To add later = postInput.followers?.includes(getLoggedInUserId()) ?? false}
                token={getToken() || ""}
              />
            )}
            {isPost && <p><strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}</p>}
            {!isPost && <p>{commentAge(post.createdAt,post.updatedAt)}</p>}
            <section className={styles.postStatistics}>
                <span><Heart className={styles.lucideIconStats} color="var(--primary-blue)"/> {post.likes.length.toString()}</span>                
                {post.comments.length > 0 && <button className={styles.textButton} 
                    onClick={displayComments} 
                    aria-label="See comments">
                    {post.comments.length.toString()} comments
                </button>}
            </section>                                        
            <section className={styles.postActions}>
                <section className={styles.likeComment}>
                    <IconButton title="Like" ariaLabel= "Like post" icon={<Heart className={styles.lucideIconPost} color={likeIconColor.current} fill={filled}/>}
                        onClick={handleLikePost} disabled={likeDisable}/>
                    <IconButton title="Comment" ariaLabel= "Add comment to post" icon={<MessageCircle className={styles.lucideIconPost} color={commentIconColor.current}/>}
                        onClick={() => {                            
                            if(!showComments) displayComments();
                            setDisplayNewComment(true);
                        }} disabled={commentDisable} /> 
                </section>                        
                {isPost && <IconButton title="Bookmark" ariaLabel= "Bookmark post" icon={<Bookmark className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                onClick={() => console.log(`Bookemarked on post ${post._id}`)} />}             
            </section>            
            { (showComments && comments) && (
                <section className={styles.commentsSection}>
                    <h3>Comments:</h3>
                    {displayNewComment && <NewCommentCard post={post} content={editing ? post.content : ""} onCommentPosted={handlePostedComment}/>}
                    <ul className={styles.commentsList}>
                        {comments.map((comment) => (
                            <PostCard key={comment._id} postInput={comment} onDelete={handleDelete}/>
                        ))}
                    </ul>
                </section>
            )}
        </li>
    );
}

function commentAge(createdAt: string, updatedAt: string): string {
    const now = new Date();
    const commentDate = new Date(Math.max(new Date(createdAt).getTime(),new Date(updatedAt).getTime()));                            
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds} s`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} min`;
    } else if (diffInSeconds < 3600*24) {
        return `${Math.floor(diffInSeconds / 3600)} H`;
    } else if (diffInSeconds < 3600*24*365){
        return `${Math.floor(diffInSeconds / (3600 * 24))} d`;
    } else {
        return `${Math.floor(diffInSeconds / (3600*24*7))} W`;
    }

}