import { Bookmark, Heart,MessageCircle } from "lucide-react";
import type { Post } from "../../models/posts";
import { getComments,type Comment} from "../../models/comments";
import { IconButton } from "./IconButton";
import styles from "./PostCard.module.scss";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { CommentCard } from "./CommentCard";

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


    useEffect(() => {
    const el = pRef.current;
        if (el) {
            setClamped(el.scrollHeight > el.clientHeight);
        }
    }, [post.content]);

    return (
        <li key={post._id} className={styles.postCard}> 
            {loading && <Spinner/>}
            <p ref={pRef} className={!showMore ? styles.twoLineClamp : ""}>{post.content}</p>
            {/* <p ref={pRef} className={styles.twoLineClamp}>{post.content}</p> */}
            {clamped && !showMore && <button className={styles.textButton} onClick={() => setShowMore(true)}>See more</button>}
            {showMore && <button className={styles.textButton} onClick={() => setShowMore(false)}>See less</button>}
            {post.image && <img src={post.image} alt="Post visual content" className={styles.postImage} />}
            <p><strong>Author:</strong> {post.author}</p>
            <p><strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            <section className={styles.postStatistics}>
                <span><Heart className={styles.lucideIconStats} color="var(--primary-blue)"/> {post.likes.length.toString()}</span>                
                {post.comments.length > 0 && <button className={styles.textButton} 
                    onClick={async () => {
                            if (!showComments) {
                                setShowComments(true);
                            } else {
                                setShowComments(false);                                
                            }
                            console.log(`Clicked to see comments for post ${post._id}`);                            
                            if (!showComments && comments.length === 0) {
                                setLoading(true);
                                try{
                                    const postComments = await getComments(post.comments);
                                    setComments(postComments);
                                    console.log(`Comments for post ${post._id}:`, postComments);
                                }catch (error) {
                                    console.error(`Error fetching comments for post ${post._id}:`, error);
                                }finally {
                                    setLoading(false);
                                }                                
                            }                            
                        }} 
                    aria-label="See comments">
                    {post.comments.length.toString()} comments
                </button>}
            </section>                                        
            <section className={styles.postActions}>
                <section className={styles.likeComment}>
                    <IconButton title="Like" ariaLabel= "Like post" icon={<Heart className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                        onClick={() => console.log(`Liked post ${post._id}`)} />
                    <IconButton title="Comment" ariaLabel= "Add comment to post" icon={<MessageCircle className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                        onClick={() => console.log(`Commented on post ${post._id}`)} /> 
                </section>                        
                <IconButton title="Bookmark" ariaLabel= "Bookmark post" icon={<Bookmark className={styles.lucideIconPost} color="var(--primary-blue)"/>}
                onClick={() => console.log(`Bookemarked on post ${post._id}`)} />             
            </section>
            {showComments && comments && comments.length > 0 && (
                <section className={styles.commentsSection}>
                    <h3>Comments:</h3>
                    <ul className={styles.commentsList}>
                        {comments.map((comment) => (
                            <CommentCard comment={comment} />
                        ))}
                    </ul>
                </section>
            )}
        </li>
    );
}
