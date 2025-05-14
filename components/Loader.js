import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <span className={styles.icon}>🧁</span>
      <span className={styles.icon}>🍕</span>
      <span className={styles.icon}>☕</span>
    </div>
  );
};

export default Loader;