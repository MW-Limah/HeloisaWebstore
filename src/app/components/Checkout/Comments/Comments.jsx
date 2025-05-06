import styles from './Comments.module.css';

export default function Comments() {
    return (
        <div className={styles.CommentsBox}>
            <div className={styles.commentsT}>
                <h2>Comentários</h2>
            </div>
            <div className={styles.comments}>
                {[1].map((num) => (
                    <div key={num}>
                        <h3>Administrador</h3>
                        <p>Em breve você poderá comnetar sobre os produtos!</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
