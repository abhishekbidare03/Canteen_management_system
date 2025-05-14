"use client";

import LoginForm from '../../../components/LoginForm';
import FloatingBackground from '../../../components/FloatingBackground';

export default function EmployeeLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden"> {/* Removed bg-white */} 
      <FloatingBackground />
      {/* Added z-10 to ensure LoginForm is above the background */}
      <div className="relative z-10"> 
        <LoginForm 
          role="employee"
          formTitle="Employee"
          imageSrc="/Luffy.jpg" // Use Luffy image for employee
          imageAlt="Employee Collaboration Illustration"
          welcomeTitle="Welcome, Baratie Crew!"
          welcomeText="Log in to manage your tasks and schedules."
          gradientFrom="from-indigo-500"
          gradientTo="to-blue-600"
          buttonGradientFrom="from-indigo-500"
          buttonGradientTo="to-blue-500"
          buttonHoverFrom="hover:from-indigo-600"
          buttonHoverTo="hover:to-blue-600"
          ringColor="focus:ring-indigo-400"
          subTextColor='text-indigo-100'
          linkColor='text-indigo-600'
          linkHoverColor='hover:text-indigo-800'
        />
      </div>
    </div>
  );
}