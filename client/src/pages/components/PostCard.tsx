/**
 * A post card component displaying post content, actions, and comments.
 *
 * @param post The post object to display.
 * @example
 * <PostCard post={post} />
 *
 * Features:
 * - Shows post content, author, image, creation date, like/bookmark/comment actions.
 * - Truncates content to 2 lines with "See more"/"See less" toggle if clamped.
 * - Shows a spinner while loading comments.
 * - Displays comments section with CommentCard components when expanded.
 */

import { Bookmark, Heart,MessageCircle } from "lucide-react";
import { likePost, type Post } from "../../models/posts";
import { getComments,type Comment} from "../../models/comments";
import { IconButton } from "./IconButton";
import styles from "./PostCard.module.scss";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { CommentCard } from "./CommentCard";
import { getLoggedInUserId } from "../../models/users";
import { NewCommentCard } from "./NewCommentCard";

type PostCardProps = {
    post: Post;    
};
export function PostCard({post}: PostCardProps) {
    const pRef = useRef<HTMLParagraphElement>(null);
    const [clamped, setClamped] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [displayNewComment, setDisplayNewComment] = useState<boolean>(false);  
    console.log(`displayNewComment state: ${displayNewComment}`);
     
    
    const currUserId = useRef<string>(getLoggedInUserId());
    console.log(`PostCard rendered for post: ${post._id} with current user: ${currUserId.current}`);  

    const filled = (post.likes.includes(currUserId.current) ? "var(--primary-blue)" : "none");
    
    useEffect(() => {
        const el = pRef.current;
            if (el) {
                setClamped(el.scrollHeight > el.clientHeight);
            }
    }, [post.content]);

    const likeIconColor = useRef<string>("var(--primary-blue)");
    const commentIconColor = useRef<string>("var(--primary-blue)");
    const [likeDisable,setLikeDisable] = useState<boolean>(false); 
    const [commentDisable,setCommentDisable] = useState<boolean>(false);
    useEffect(() => {
        if (!currUserId.current) {
            console.log("No user logged in, setting like and comment icons color to light text and disabling like and comment actions");
            likeIconColor.current = "var(--light-text)";
            const commentIconColor = "var(--light-text)";
            setLikeDisable(true);
            setCommentDisable(true);
        }
        else if (currUserId.current === post.author) {
            console.log("User is the author of the post, setting like icon color to light text  and disabling like action");
            likeIconColor.current = "var(--light-text)";
            setLikeDisable(true);
        }
    }, []);

    async function displayComments() {
        
        if (!showComments) {
            setShowComments(true);
            console.log(`showComments state is ${showComments}`);
        } else {
            setShowComments(false);                                
            console.log(`showComments state is ${showComments}`);
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
                // filled = filled === "var(--primary-blue)" ? "none" : "var(--primary-blue)";
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

    async function handlePostedComment() {
        console.log(`PC: New comment posted for post ${post._id}`);
        setDisplayNewComment(false);
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

    console.log("RENDER: showComments:", showComments, "comments:", comments);
    return (
        <li key={post._id} className={styles.postCard}> 
            {loading && <Spinner/>}
            <p ref={pRef} className={!showMore ? styles.twoLineClamp : ""}>{post.content}</p>            
            {clamped && !showMore && <button className={styles.textButton} onClick={() => setShowMore(true)}>See more</button>}
            {showMore && <button className={styles.textButton} onClick={() => setShowMore(false)}>See less</button>}
            {post.image && <img src={post.image} alt="Post visual content" className={styles.postImage} />}
            <p><strong>Author:</strong> {post.author}</p>
            <p><strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}</p>
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
                <IconButton title="Bookmark" ariaLabel= "Bookmark post" icon={<Bookmark className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                onClick={() => console.log(`Bookemarked on post ${post._id}`)} />             
            </section>            
            { (showComments && comments && comments.length > 0) && (
                <section className={styles.commentsSection}>
                    <h3>Comments:</h3>
                    {displayNewComment && <NewCommentCard post={post} onCommentPosted={handlePostedComment}/>}
                    <ul className={styles.commentsList}>
                        {comments.map((comment) => (
                            <CommentCard key={comment._id} comment={comment} />
                        ))}
                    </ul>
                </section>
            )}
        </li>
    );
}
