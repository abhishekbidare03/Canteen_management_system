"use client";

import LoginForm from '../../../components/LoginForm';
import FloatingBackground from '../../../components/FloatingBackground';

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden"> {/* Removed bg-white */} 
      <FloatingBackground />
      {/* Added z-10 to ensure LoginForm is above the background */}
      <div className="relative z-10"> 
        <LoginForm 
          role="admin"
          formTitle="Admin"
          imageSrc="/admin.jpg" // Use admin image
          imageAlt="Admin Control Panel Illustration"
          welcomeTitle="Admin Control Panel"
          welcomeText="Manage the Baratie restaurant system."
          gradientFrom="from-gray-700"
          gradientTo="to-gray-900"
          buttonGradientFrom="from-gray-700"
          buttonGradientTo="to-gray-800"
          buttonHoverFrom="hover:from-gray-800"
          buttonHoverTo="hover:to-black"
          ringColor="focus:ring-gray-400"
          subTextColor='text-gray-300'
          linkColor='text-gray-600'
          linkHoverColor='hover:text-gray-800'
        />
      </div>
    </div>
  );
}