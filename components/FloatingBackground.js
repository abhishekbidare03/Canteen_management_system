import iconStyles from './FloatingBackground.module.css'; // Changed import path

const FloatingBackground = () => {
  return (
    <div className={iconStyles.iconContainer}>
      {/* Even More Icons for denser background */}
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat1}`} style={{ top: '10%', left: '15%', fontSize: '2.5rem' }}>🍕</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat2}`} style={{ top: '25%', left: '75%', fontSize: '2rem' }}>🍔</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat3}`} style={{ top: '65%', left: '10%', fontSize: '3rem' }}>☕</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat1}`} style={{ top: '80%', left: '55%', fontSize: '1.8rem' }}>🥕</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat2}`} style={{ top: '45%', left: '35%', fontSize: '3.5rem' }}>🍟</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat3}`} style={{ top: '5%', left: '45%', fontSize: '2.8rem' }}>🧁</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat1}`} style={{ top: '15%', left: '90%', fontSize: '2.2rem' }}>🍗</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat2}`} style={{ top: '60%', left: '85%', fontSize: '3.2rem' }}>🌭</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat3}`} style={{ top: '90%', left: '25%', fontSize: '2.5rem' }}>🍳</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat1}`} style={{ top: '35%', left: '5%', fontSize: '3rem' }}>🥤</span>
      {/* Added More */}
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat2}`} style={{ top: '5%', left: '80%', fontSize: '2.7rem' }}>🍦</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat3}`} style={{ top: '50%', left: '95%', fontSize: '2.1rem' }}>🍩</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat1}`} style={{ top: '75%', left: '40%', fontSize: '3.3rem' }}>🍎</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat2}`} style={{ top: '95%', left: '70%', fontSize: '2.4rem' }}>🍓</span>
      <span className={`${iconStyles.icon} ${iconStyles.iconFloat3}`} style={{ top: '20%', left: '30%', fontSize: '2.9rem' }}>🥦</span>
    </div>
  );
};

export default FloatingBackground;