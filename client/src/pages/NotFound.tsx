import styles from "./NotFound.module.scss";

export function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}