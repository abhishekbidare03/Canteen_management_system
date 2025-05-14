"use client";

import LoginForm from '../../../components/LoginForm';
import FloatingBackground from '../../../components/FloatingBackground';

export default function ChefLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden"> {/* Removed bg-white */} 
      <FloatingBackground />
      {/* Added z-10 to ensure LoginForm is above the background */}
      <div className="relative z-10"> 
        <LoginForm 
          role="chef"
          formTitle="Chef"
          imageSrc="/chefsanji.jpg" // Use Chef Sanji image for chef
          imageAlt="Chef Cooking Illustration"
          welcomeTitle="Ahoy, Chef!"
          welcomeText="Access your kitchen dashboard and recipes."
          gradientFrom="from-red-500"
          gradientTo="to-orange-600"
          buttonGradientFrom="from-red-500"
          buttonGradientTo="to-orange-500"
          buttonHoverFrom="hover:from-red-600"
          buttonHoverTo="hover:to-orange-600"
          ringColor="focus:ring-red-400"
          subTextColor='text-orange-100'
          linkColor='text-red-600'
          linkHoverColor='hover:text-red-800'
        />
      </div>
    </div>
  );
}