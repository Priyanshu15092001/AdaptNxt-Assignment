import styles from './ProductCard.module.css';

export default function ProductCard({
  product,
  quantity = 0,
  onAddToCart = () => {},
  onIncrease = () => {},
  onDecrease = () => {},
}) {
  const id = product._id || product.id;
  const outOfStock = (typeof product.stock === 'number') ? product.stock <= 0 : false;
  const maxReached = (typeof product.stock === 'number') ? quantity >= product.stock : false;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.category}>{product.category}</div>
      </div>
      <div className={styles.meta}>
        <div className={styles.price}>${Number(product.price).toFixed(2)}</div>
        <div className={product.stock > 0 ? styles.inStock : styles.outStock}>
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </div>
      </div>

      {quantity > 0 ? (
        <div className={styles.qtyCtrl}>
          <button className={styles.qtyBtn} onClick={() => onDecrease(product)} disabled={quantity <= 0}>-</button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button className={styles.qtyBtn} onClick={() => onIncrease(product)} disabled={maxReached}>+</button>
        </div>
      ) : (
        <button
          className={styles.addBtn}
          onClick={() => onAddToCart(product)}
          disabled={outOfStock}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
