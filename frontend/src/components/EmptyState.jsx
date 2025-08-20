import styles from './EmptyState.module.css';

export default function EmptyState({ title = 'Nothing here', subtitle }) {
  return (
    <div className={styles.empty}>
      <div className={styles.title}>{title}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}
