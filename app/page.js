"use client"; // Add this line to enable client-side hooks

import Image from "next/image";
import { useRouter } from 'next/navigation';
import loginStyles from './LoginOptions.module.css';
import FloatingBackground from '../components/FloatingBackground'; // Import the new component

export default function Home() {
  const router = useRouter(); // Initialize useRouter

  const handleLoginClick = (role) => {
    router.push(`/login/${role}`);
  };

  return (
    <div className="relative min-h-screen w-full flex items-stretch overflow-hidden"> {/* Removed bg-white */} 
      <FloatingBackground />
      {/* Doodle ramen and sushi images, animated */}
      {/* Added z-10 */}
      <div className="hidden md:flex w-1/2 relative z-10 items-center justify-center"> 
        {/* Ramen at top left, larger */}
        {/* Kept z-20 for images */}
        <div className="absolute left-0 top-0 z-20" style={{ transform: 'translate(10%, 10%)' }}> 
          <Image
            src="/Ramen.png"
            alt="Ramen bowl"
            width={420}
            height={420}
            className={loginStyles.ramenAnim} // Use loginStyles
            priority
          />
        </div>
        {/* Sushi at bottom right, larger */}
        {/* Kept z-20 for images */}
        <div className="absolute right-0 bottom-0 z-20" style={{ transform: 'translate(0%, 0%)' }}> 
          <Image
            src="/Sushi.png"
            alt="Sushi platter"
            width={320}
            height={320}
            className={loginStyles.sushiAnim} // Use loginStyles
            priority
          />
        </div>
      </div>
      {/* Right column: content and buttons */}
      {/* Added z-10 */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center z-10 relative p-6 md:p-8"> 
        {/* Increased card width, applied font, changed text color */}
        <div className="max-w-xl w-full text-center md:text-left bg-white/40 rounded-3xl shadow-xl p-8 border border-white/30 backdrop-blur-xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg font-pirate" style={{ color: '#db3b25', letterSpacing: '8px' }}>
            THE BARATIE 🏴‍☠️
          </h1>
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-black">Welcome! 🎉 Fuel up 🥂🍕 and connect 🤗 with your colleagues at THE BARATIE! 🌟.</h2>
            <p className="text-base md:text-lg mb-6 text-black">
              &ldquo;Ahoy, foodies! 🏴‍☠️ Get ready to embark on a gastronomic journey! 🗺️ From the fiery flavors of India 🌶️ to the delicate tastes of Japan 🍣, and the bold notes of Korea 🍜 and China 🥡, our menu, influenced by the great Chef Sanji 👨‍🍳, has it all!&rdquo;
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleLoginClick('employee')}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-lg transition-all duration-300 border border-sky-400 hover:scale-105 hover:shadow-lg"
              >
                Employee Login
              </button>
              <button
                onClick={() => handleLoginClick('chef')}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-lg transition-all duration-300 border border-sky-400 hover:scale-105 hover:shadow-lg"
              >
                Chef Login
              </button>
              <button
                onClick={() => handleLoginClick('admin')}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-lg transition-all duration-300 border border-sky-400 hover:scale-105 hover:shadow-lg"
              >
                Admin Login
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} THE BARATIE - A One Piece Themed Restaurant Management System
          </div>
        </div>
      </div>
    </div>
  );
}
