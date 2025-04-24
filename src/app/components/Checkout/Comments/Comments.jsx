import styles from './Comments.module.css';

export default function Comments() {
    return (
        <div className={styles.CommentsBox}>
            <div className={styles.commentsT}>
                <h2>Comentários</h2>
            </div>
            <div className={styles.comments}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num}>
                        <h3>Pessoa {num}</h3>
                        <p>este produto é incrível!</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
