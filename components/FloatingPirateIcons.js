"use client";

import React, { useEffect, useState } from 'react';
import styles from './FloatingPirateIcons.module.css';

const icons = ['🏴‍☠️', '⚓', '⚔️', '🗺️', '🧭', '💰', '💎', '☠️', '⛵', '🌊']; // Base pirate icons
const numberOfSets = 2; // Reduce the number of sets for lower density
const totalIcons = icons.length * numberOfSets;
const maxDuration = 30; // Increase max duration for delay calculation to spread icons out more

const FloatingPirateIcons = () => {
  const [iconElements, setIconElements] = useState([]);

  useEffect(() => {
    const generateIcons = () => {
      const newIcons = [];
      for (let i = 0; i < totalIcons; i++) {
        const icon = icons[i % icons.length]; // Cycle through base icons
        const style = {
          /* Use percentage for horizontal position relative to container */
          left: `${Math.random() * 95}%`, 
          /* Start slightly below screen */
          top: `${100 + Math.random() * 5}vh`,
          /* Distribute delay across max duration */
          animationDelay: `${-(i / totalIcons) * maxDuration}s`,
          animationDuration: `${20 + Math.random() * 15}s`, // Keep slower speed
        };
        newIcons.push(
          <span key={i} className={styles.icon} style={style}>
            {icon}
          </span>
        );
      }
      setIconElements(newIcons);
    };

    generateIcons();
    // No need to regenerate frequently with this approach
  }, []);

  return <div className={styles.iconContainer}>{iconElements}</div>;
};

export default FloatingPirateIcons;