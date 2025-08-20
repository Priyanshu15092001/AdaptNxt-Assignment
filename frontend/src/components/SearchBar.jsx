import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
