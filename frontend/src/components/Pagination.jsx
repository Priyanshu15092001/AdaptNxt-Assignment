import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className={styles.wrapper}>
      <button className={styles.btn} onClick={onPrev} disabled={page <= 1}>Prev</button>
      <span className={styles.pageInfo}>Page {page} of {Math.max(totalPages, 1)}</span>
      <button className={styles.btn} onClick={onNext} disabled={page >= totalPages}>Next</button>
    </div>
  );
}
