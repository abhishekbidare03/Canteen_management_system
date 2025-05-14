"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Reusable Login Form Component
export default function LoginForm({ 
  role, 
  formTitle, 
  imageSrc, 
  imageAlt, 
  welcomeTitle, 
  welcomeText, 
  gradientFrom, 
  gradientTo, 
  buttonGradientFrom, 
  buttonGradientTo, 
  buttonHoverFrom, 
  buttonHoverTo, 
  ringColor,
  textColor = 'text-white',
  subTextColor = 'text-gray-200',
  formBgColor = 'bg-white',
  inputBgColor = 'bg-gray-50',
  inputFocusBgColor = 'bg-white',
  inputTextColor = 'text-gray-800',
  inputPlaceholderColor = 'placeholder-gray-400',
  linkColor = 'text-indigo-600',
  linkHoverColor = 'hover:text-indigo-800'
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false); // Default to Login for employee/chef
  const [isRequestingAccess, setIsRequestingAccess] = useState(false); // Default to Login for admin
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const useSignupFlow = role !== 'admin'; // Determine if standard signup/login or admin request/login

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const isActionSignup = useSignupFlow ? isSigningUp : isRequestingAccess;

    if (isActionSignup && !name) {
      setError(`Please enter your name to ${useSignupFlow ? 'sign up' : 'request access'}.`);
      return;
    }
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const endpoint = isActionSignup ? `${baseUrl}/api/auth/signup` : `${baseUrl}/api/auth/login`;
    const body = JSON.stringify({ email, password, role, ...(isActionSignup && { name }) });

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const data = await res.json();

      if (res.ok) {
        if (isActionSignup) {
          setSuccess(useSignupFlow ? 'Signup successful! Please log in.' : 'Access request submitted! Please wait for approval or log in if approved.');
          if (useSignupFlow) setIsSigningUp(false);
          else setIsRequestingAccess(false);
          setName('');
          setEmail('');
          setPassword('');
        } else {
          // Login successful
          localStorage.setItem('userName', data.user.name); 
          localStorage.setItem('userRole', data.user.role); 
          localStorage.setItem('userId', data.user._id); // Store the user ID
          console.log('Login successful:', data.user);
          // Redirect based on role
          const redirectPath = role === 'admin' ? '/admin' : (role === 'chef' ? '/chef/orders' : '/employee');
          router.push(redirectPath);
        }
      } else {
        setError(data.message || `An error occurred during ${isActionSignup ? (useSignupFlow ? 'signup' : 'access request') : 'login'}.`);
      }
    } catch (err) {
      setError(`An error occurred. Please try again. ${err.message}`);
      console.error(`${isActionSignup ? (useSignupFlow ? 'Signup' : 'Access Request') : 'Login'} error:`, err);
    }
  };

  const toggleFormMode = () => {
    if (useSignupFlow) {
      setIsSigningUp(!isSigningUp);
    } else {
      setIsRequestingAccess(!isRequestingAccess);
    }
    setError('');
    setSuccess('');
  };

  const currentModeTitle = useSignupFlow 
    ? (isSigningUp ? `Sign Up` : `Login`) 
    : (isRequestingAccess ? `Request Access` : `Login`);
  const toggleLinkText = useSignupFlow
    ? (isSigningUp ? 'Already registered?' : 'Not registered?')
    : (isRequestingAccess ? 'Already have access?' : 'Need access?');
  const toggleActionText = useSignupFlow
    ? (isSigningUp ? 'Login here' : 'Sign up here')
    : (isRequestingAccess ? 'Login here' : 'Request access here');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      // Centered card with blur/transparency
      className="relative z-10 flex flex-col md:flex-row bg-white/60 rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full backdrop-blur-lg border border-white/30 m-4"
    >
      {/* Image Section - Back to left, image fills width */} 
      <div className={`w-full md:w-1/2 p-6 md:p-10 flex flex-col items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo} ${textColor} rounded-l-3xl`}>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
        >
          {/* Image fills width of this container */}
          <Image 
            src={imageSrc} 
            alt={imageAlt}
            width={0} // Set width/height to 0 and use sizes for responsive filling
            height={0}
            sizes="(max-width: 768px) 100vw, 50vw" // Adjust sizes as needed
            className="w-full h-auto object-contain drop-shadow-lg max-h-[400px]" // Ensure image scales
            priority
          />
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-3xl font-semibold mt-6 text-center"
        >
          {welcomeTitle}
        </motion.h2>
        {/* Welcome text back in image section */}
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`text-center mt-3 ${subTextColor}`}
        >
          {welcomeText}
        </motion.p>
      </div>

      {/* Form Section - Back to right */} 
      <div className={`w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center ${formBgColor} rounded-r-3xl`}>
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-4xl font-bold ${inputTextColor} mb-8 text-center`}
        >
          {formTitle} {currentModeTitle}
        </motion.h1>
        
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onSubmit={handleAuthAction} 
          className="space-y-5"
        >
          {(isSigningUp || isRequestingAccess) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <label htmlFor="name" className={`block text-sm font-medium ${inputTextColor} mb-1`}>Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl ${inputBgColor} ${inputTextColor} ${inputPlaceholderColor} focus:${inputFocusBgColor} focus:ring-2 ${ringColor} focus:border-transparent outline-none transition duration-200 ease-in-out shadow-sm`}
                required
              />
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (isSigningUp || isRequestingAccess) ? 0.2 : 0.1 }}>
            <label htmlFor="email" className={`block text-sm font-medium ${inputTextColor} mb-1`}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`your.${role}.email@baratie.com`}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl ${inputBgColor} ${inputTextColor} ${inputPlaceholderColor} focus:${inputFocusBgColor} focus:ring-2 ${ringColor} focus:border-transparent outline-none transition duration-200 ease-in-out shadow-sm`}
              required
            />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (isSigningUp || isRequestingAccess) ? 0.3 : 0.2 }}>
            <label htmlFor="password" className={`block text-sm font-medium ${inputTextColor} mb-1`}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl ${inputBgColor} ${inputTextColor} ${inputPlaceholderColor} focus:${inputFocusBgColor} focus:ring-2 ${ringColor} focus:border-transparent outline-none transition duration-200 ease-in-out shadow-sm`}
              required
            />
          </motion.div>

          {(error || success) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm text-center p-2 rounded-md ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {error || success}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            type="submit"
            className={`w-full bg-gradient-to-r ${buttonGradientFrom} ${buttonGradientTo} text-white font-bold py-3 px-6 rounded-xl ${buttonHoverFrom} ${buttonHoverTo} focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColor} transition duration-200 ease-in-out shadow-lg`}
          >
            {currentModeTitle}
          </motion.button>
        </motion.form> 

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className={`text-sm ${inputTextColor}`}> 
            {toggleLinkText}{' '}
            <button 
              onClick={toggleFormMode}
              className={`font-semibold ${linkColor} ${linkHoverColor} focus:outline-none`}
            >
              {toggleActionText}
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
// Remove the duplicate export below
// export default LoginForm;