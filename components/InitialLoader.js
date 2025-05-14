'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion'; // Import useAnimation
import Image from 'next/image';
import styles from './InitialLoader.module.css';

// Re-add Ship Wheel SVG Component
const ShipWheel = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    {/* Outer Ring */}
    <circle cx="50" cy="50" r="45" />
    {/* Inner Ring */}
    <circle cx="50" cy="50" r="15" />
    {/* Spokes */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <line
        key={angle}
        x1="50"
        y1="50"
        x2={50 + 30 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 30 * Math.sin((angle * Math.PI) / 180)}
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    {/* Handles */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <line
        key={`handle-${angle}`}
        x1={50 + 45 * Math.cos((angle * Math.PI) / 180)}
        y1={50 + 45 * Math.sin((angle * Math.PI) / 180)}
        x2={50 + 55 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 55 * Math.sin((angle * Math.PI) / 180)}
        strokeWidth="5"
        strokeLinecap="round"
      />
    ))}
  </svg>
);

// Loader Component
export default function InitialLoader({ type = 'fullscreen', onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const controls = useAnimation(); // Initialize animation controls

  useEffect(() => {
    if (type !== 'fullscreen' || !onLoadingComplete) return;

    const totalDuration = 5000;
    const intervalTime = 50;
    const steps = totalDuration / intervalTime;
    const increment = 100 / steps;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += increment;
      const newProgress = Math.min(currentProgress, 100); // Ensure progress doesn't exceed 100

      setProgress(newProgress); // Update state for the text display
      controls.start({ width: `${newProgress}%` }); // Start animation programmatically

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (onLoadingComplete) onLoadingComplete();
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  // Add controls to dependency array if needed, though likely not necessary here
  }, [type, onLoadingComplete, controls]); 

  if (type === 'inline') {
    return (
      <div className="flex justify-center items-center p-4">
        <motion.div
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ loop: Infinity, ease: 'linear', duration: 1 }}
        />
      </div>
    );
  }

  // Fullscreen Loader
  const text = "WELCOME TO THE BARATIE";
  const words = text.split(' '); // Split text into words for styling
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Main container - Use flex for columns
    <div className="fixed inset-0 z-50 flex items-stretch text-white overflow-hidden">
      {/* Static SVG Sea Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/assets/Background.svg"
          alt="Baratie ship at sea background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 w-full h-full z-10 bg-gradient-to-b from-blue-900/70 to-cyan-900/60 pointer-events-none" />
      {/* Left Column: Sanji Image */}
      <div className="w-1/3 h-screen relative flex-shrink-0 z-20 flex items-end pb-8 pl-4">
        <Image
          src="/Sanji.png"
          alt="Sanji welcoming you to the Baratie"
          width={450}
          height={800}
          objectFit="contain"
          style={{ maxHeight: '95vh', width: 'auto', height: 'auto' }}
          priority
        />
      </div>
      {/* Right Column: Wheel, Text, Progress */}
      <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 z-20">
        {/* Ship Wheel Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ loop: Infinity, ease: 'linear', duration: 10 }}
          >
            <ShipWheel className="w-36 h-36 md:w-56 md:h-56 text-yellow-400 mb-6 md:mb-8 drop-shadow-lg" />
          </motion.div>
        </motion.div>
        {/* Welcome Text */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-8 font-pirate tracking-wider text-center drop-shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mr-2 md:mr-3">
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={`${wordIndex}-${charIndex}`}
                  variants={letterVariants}
                  className={word.toUpperCase() === 'BARATIE' ? 'text-sky-400' : ''}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>
        {/* Progress Bar */}
        <div className="w-72 md:w-96 h-4 bg-gray-700/80 rounded-full overflow-hidden shadow-lg">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            initial={{ width: '0%' }}
            animate={controls} // Use controls for animation
            transition={{ duration: 0.05, ease: 'linear' }} // Keep transition for smoothness between updates
          />
        </div>
        <p className="mt-4 text-lg text-yellow-200 drop-shadow">Setting the tables... {Math.round(progress)}%</p>
      </div>
    </div>
  );
}
