'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Share2, Copy, Check, X, MessageCircle, Mail, Link } from 'lucide-react';
import './globals.css';

const FloatingSocialIcons = dynamic(() => import('../components/Floating'), { ssr: false });

const getTimeLeft = () => {
  const target = new Date('2025-07-21T00:00:00+05:30').getTime();
  const diff = Math.max(target - Date.now(), 0);
  const SEC = 1000, MIN = 60 * SEC, HOUR = 60 * MIN, DAY = 24 * HOUR;
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MIN),
    seconds: Math.floor((diff % MIN) / SEC),
  };
};

const CountdownPage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showPrivacyModal || isShareModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPrivacyModal, isShareModalOpen]);

  const handleSubmit = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`/api/notify?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscribed(true);
        setTimeout(() => setSubscribed(false), 3000);
        setEmail('');
      } else {
        setErrorMessage(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate unique invite link (in real app, this would come from your backend)
  const generateInviteLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vikaasgarh.com';
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${baseUrl}/invite/${inviteCode}`;
  };
  
  const inviteLink = generateInviteLink();
  const shareMessage = "Join me on VikaasGarh - a thoughtfully designed platform for the youth of Chhattisgarh bringing together institute, incubator, accelerator, and network forum! Get early access:";
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };
  
  const shareOptions = [
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(inviteLink)}`,
      color: 'hover:bg-gray-800'
    },
    {
      name: 'Facebook',
      icon: '𝑓',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}&quote=${encodeURIComponent(shareMessage)}`,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}&summary=${encodeURIComponent(shareMessage)}`,
      color: 'hover:bg-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      url: `https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + inviteLink)}`,
      color: 'hover:bg-green-600'
    },
    {
      name: 'Email',
      icon: <Mail size={20} />,
      url: `mailto:?subject=Join VikaasGarh - Early Access&body=${encodeURIComponent(shareMessage + '\n\n' + inviteLink)}`,
      color: 'hover:bg-red-600'
    }
  ];

  const PrivacyPolicyModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setShowPrivacyModal(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00b0ff]/20 via-[#00ffff]/30 to-[#00b0ff]/20 rounded-3xl blur-2xl transform scale-110"></div>
        
        <div className="relative bg-black/95 border-2 border-[#00b0ff]/50 rounded-2xl shadow-2xl shadow-[#00b0ff]/20 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="relative border-b border-[#00b0ff]/30 p-6">
            <div className="absolute inset-0 bg-[#00b0ff]/10 blur-lg"></div>
            <div className="relative flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white font-['Orbitron']">
                Privacy Policy
              </h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="relative group"
              >
                <div className="absolute inset-0 bg-[#00b0ff]/20 rounded-full blur-md group-hover:bg-[#00b0ff]/30 transition-all duration-300"></div>
                <div className="relative w-10 h-10 rounded-full border border-[#00b0ff]/50 bg-black/70 flex items-center justify-center text-white hover:border-[#00b0ff] hover:bg-[#00b0ff]/10 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <div className="space-y-6 text-blue-100">
              <div className="relative">
                <div className="absolute inset-0 bg-[#00b0ff]/5 rounded-lg blur-md"></div>
                <div className="relative bg-[#00b0ff]/10 border border-[#00b0ff]/20 rounded-lg p-4">
                  <p className="text-sm text-blue-300 mb-2">Last updated: July 14, 2025</p>
                  <p className="text-blue-200">
                    This Privacy Policy describes how VikaasGarh ("we," "our," or "us") collects, uses, and protects your information when you use our website and services.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00b0ff]/5 rounded-lg blur-sm"></div>
                  <div className="relative bg-black/50 border border-[#00b0ff]/20 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-[#00b0ff] mb-3 font-['Orbitron']">1. Information We Collect</h3>
                    <p className="text-blue-200 mb-2">We collect information you provide directly to us, including:</p>
                    <ul className="list-disc list-inside text-blue-300 space-y-1 ml-4">
                      <li>Email addresses when you subscribe to our waitlist</li>
                      <li>Contact information when you reach out to us</li>
                      <li>Usage data and analytics to improve our services</li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-[#00b0ff]/5 rounded-lg blur-sm"></div>
                  <div className="relative bg-black/50 border border-[#00b0ff]/20 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-[#00b0ff] mb-3 font-['Orbitron']">2. How We Use Your Information</h3>
                    <p className="text-blue-200 mb-2">We use the information we collect to:</p>
                    <ul className="list-disc list-inside text-blue-300 space-y-1 ml-4">
                      <li>Send you updates about our platform launch</li>
                      <li>Respond to your inquiries and provide support</li>
                      <li>Improve our website and services</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-[#00b0ff]/5 rounded-lg blur-sm"></div>
                  <div className="relative bg-black/50 border border-[#00b0ff]/20 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-[#00b0ff] mb-3 font-['Orbitron']">3. Information Sharing</h3>
                    <p className="text-blue-200">
                      We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-[#00b0ff]/5 rounded-lg blur-sm"></div>
                  <div className="relative bg-black/50 border border-[#00b0ff]/20 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-[#00b0ff] mb-3 font-['Orbitron']">4. Data Security</h3>
                    <p className="text-blue-200">
                      We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-[#00b0ff]/5 rounded-lg blur-sm"></div>
                  <div className="relative bg-black/50 border border-[#00b0ff]/20 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-[#00b0ff] mb-3 font-['Orbitron']">5. Your Rights</h3>
                    <p className="text-blue-200 mb-2">You have the right to:</p>
                    <ul className="list-disc list-inside text-blue-300 space-y-1 ml-4">
                      <li>Access your personal information</li>
                      <li>Request correction of inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Unsubscribe from our communications</li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-[#00b0ff]/5 rounded-lg blur-sm"></div>
                  <div className="relative bg-black/50 border border-[#00b0ff]/20 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-[#00b0ff] mb-3 font-['Orbitron']">6. Contact Us</h3>
                    <p className="text-blue-200">
                      If you have any questions about this Privacy Policy, please contact us at{' '}
                      <a href="mailto:privacy@vikaasgarh.com" className="text-[#00b0ff] hover:text-[#33ccff] underline">
                        privacy@vikaasgarh.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative border-t border-[#00b0ff]/30 p-6">
            <div className="absolute inset-0 bg-[#00b0ff]/5 blur-lg"></div>
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00b0ff] to-[#0066ff] rounded-full blur-md opacity-50"></div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="relative px-8 py-3 bg-gradient-to-r from-[#00b0ff] to-[#0066ff] text-black font-semibold rounded-full shadow-lg shadow-[#00b0ff]/30 hover:scale-105 transition-all duration-300 hover:from-[#339dff] hover:to-[#0051cc] hover:shadow-[#00b0ff]/50"
                >
                  Got it, Thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

const Colon = () => (
  <div className="relative flex items-center justify-center mx-1 sm:mx-3">
    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
      {/* glow background dots */}
      <span className="w-3 h-3 rounded-full bg-[#00b0ff]/30 blur-sm"></span>
      <span className="w-3 h-3 rounded-full bg-[#00b0ff]/30 blur-sm"></span>

      {/* solid foreground dots */}
      <span className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#00b0ff]"></span>
      <span className="absolute bottom-0 w-2.5 h-2.5 rounded-full bg-[#00b0ff]"></span>
    </div>
    {/* Empty div to maintain space in layout */}
    <div className="w-16" />
  </div>
);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans">
      {/* NEON HAZE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00b0ff]/10 via-[#00b0ff]/5 to-[#00b0ff]/10 pointer-events-none" />

      {/* Static background glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00b0ff]/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-[#00ffff]/15 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#0099ff]/10 rounded-full blur-[150px]"></div>
      </div>

      {/* VIKAASGARH Wordmark */}
      <div className="absolute inset-0 flex items-center justify-center select-none opacity-5">
        <span className="text-[12rem] font-black tracking-wider text-[rgb(140, 7, 147)] font-['Orbitron']">
          VIKAASGARH
        </span>
      </div>

      {/* Logo Header */}
      <header className="relative z-10 flex justify-center p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#00b0ff]/20 rounded-xl blur-xl"></div>
          <img
            src="/logo/dark.png"
            alt="VikaasGarh logo"
            className="relative w-64 h-16 object-contain drop-shadow-lg"
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Hero Text */}
        <div className="mb-16 text-center space-y-6">
          {/* Tagline */}
            <div className="relative max-w-4xl mx-auto px-4">
            <div className="absolute inset-0 bg-[#00b0ff]/5 rounded-2xl blur-lg"></div>
            <p className="relative text-lg font-light tracking-wide text-blue-200 leading-relaxed">
              We're developing a thoughtfully designed platform that brings together an institute, an incubator, an accelerator, and a network forum, especially for the youth of Chhattisgarh.
            </p>
          </div>

          {/* Hashtag */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#00b0ff]/10 rounded-lg blur-md"></div>
            <p className="relative text-xl font-bold tracking-wide text-[#00b0ff] drop-shadow-lg font-['Orbitron']">
              #MereSathVikaasgarh
            </p>
          </div>

          {/* Join waitlist text with icon */}
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00b0ff]/30 rounded-full blur-sm"></div>
              <div className="relative w-8 h-8 bg-gradient-to-br from-[#00b0ff] to-[#0066ff] rounded-full flex items-center justify-center shadow-lg shadow-[#00b0ff]/30">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5 text-white"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-light tracking-wide text-[#00b0ff] drop-shadow-lg font-['Orbitron']">
              Many people have already joined the wait list
            </p>
          </div>

         
        </div>

        {/* COUNTDOWN with Neon Glow */}
        <div className="relative mb-16">
          {/* Neon glow background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00b0ff]/20 via-[#00ffff]/30 to-[#00b0ff]/20 rounded-3xl blur-2xl transform scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00b0ff]/10 to-transparent rounded-3xl blur-xl"></div>
          
          <div className="relative flex items-center justify-center space-x-8 p-8">
            {(['days', 'hours', 'minutes', 'seconds'] as const).map((k, i) => (
              <React.Fragment key={k}>
                <div className="text-center">
                  <div className="relative">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-[#00b0ff]/30 rounded-8xl blur-sm transform scale-90"></div>
                  
                    <div className="relative rounded-2xl border-2 border-[#00b0ff]/50 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
                      {/* Notebook lines effect */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="h-full w-full bg-gradient-to-b from-transparent via-blue-200 to-transparent bg-[length:100%_20px] bg-repeat-y"></div>
                      </div>
                
                      <span className="relative text-8xl font-light text-black drop-shadow-sm font-['Orbitron']">
                        {String(timeLeft[k]).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <span className="mt-4 block text-lg font-light text-blue-300 capitalize">
                    {k}
                  </span>
                </div>
                    {i < 3 && <Colon />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* EMAIL SIGNUP */}
        <section className="space-y-8 w-full max-w-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00b0ff]/10 rounded-xl blur-lg"></div>
            <h2 className="relative text-center text-5xl font-bold leading-tight text-white font-['Orbitron']">
              Get Notified<br />
              When we Launch
            </h2>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="flex flex-col gap-4 lg:flex-row"
          >
            <div className="relative flex-1">
              <div className="absolute inset-0 bg-[#00b0ff]/20 rounded-full blur-md"></div>
              <input
                type="email"
                required
                aria-label="Email address"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="relative w-full rounded-full border border-[#00b0ff]/30 bg-gray-800/70 px-8 py-4 text-white placeholder-gray-400 shadow-lg shadow-[#00b0ff]/10 focus:border-[#00b0ff] focus:outline-none focus:ring-2 focus:ring-[#00b0ff] focus:shadow-[#00b0ff]/30 disabled:opacity-50"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00b0ff] to-[#0066ff] rounded-full blur-md opacity-50"></div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative whitespace-nowrap rounded-full bg-gradient-to-r from-[#00b0ff] to-[#0066ff] px-8 py-4 font-semibold text-black shadow-lg shadow-[#00b0ff]/30 transition-all duration-300 hover:scale-105 hover:from-[#339dff] hover:to-[#0051cc] hover:shadow-[#00b0ff]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Subscribing...' : isSubscribed ? 'Subscribed!' : 'Notify Me'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-lg blur-md"></div>
              <p className="relative text-center text-sm text-red-400 bg-red-500/20 rounded-lg px-4 py-2 border border-red-500/30">
                {errorMessage}
              </p>
            </div>
          )}

          <p className="text-center text-sm text-blue-300">
            *Don't worry, we won't spam you, we respect your privacy :)
          </p>

          {/* Enhanced Invite Box with Social Sharing */}
          <div className="relative mt-8">
            <div className="absolute inset-0 bg-[#00b0ff]/10 rounded-2xl blur-lg"></div>
            <div className="relative rounded-2xl border border-[#00b0ff]/20 bg-black/70 p-6 shadow-lg shadow-[#00b0ff]/10 backdrop-blur-sm">
              <h3 className="mb-4 text-center text-lg font-semibold text-white font-['Orbitron']">
                Know someone who would benefit from what we're building?
              </h3>
              <p className="text-center text-blue-300">
                Invite <strong>3</strong> friends for early access and a chance to win gifts.
              </p>
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0066ff] to-[#00b0ff] rounded-full blur-md opacity-50"></div>
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="relative rounded-full bg-gradient-to-r from-[#0066ff] to-[#00b0ff] px-6 py-3 font-semibold text-black shadow-lg shadow-blue-400/20 transition-all duration-300 hover:scale-105 hover:from-[#004cb3] hover:to-[#33ccff] hover:shadow-blue-400/40 flex items-center gap-2"
                  >
                    <Share2 size={18} />
                    Start Inviting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 mt-12 pb-6">
        {/* Full-width white stripe */}
        <div className="relative w-full">
          <div className="absolute inset-0 bg-white/10 "></div>
          <div className="relative bg-white/5 border-t border-white/10 py-4">
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-blue-300">
                  © 2025 VikaasGarh. All rights reserved.
                </p>
                <p className="mt-1 text-xs text-blue-400">
                  An initiative by Vigsia Global
                </p>
                <div className="mt-3 flex justify-center space-x-6">
                  <button 
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 underline hover:no-underline"
                  >
                    Privacy Policy
                  </button>
                  <a 
                    href="mailto:connect@vikaasgarh.com" 
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 underline hover:no-underline"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <FloatingSocialIcons />

      {/* Privacy Policy Modal */}
      {showPrivacyModal && <PrivacyPolicyModal />}

      {/* Share Modal */}
   {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-[#00b0ff]/30 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-[#00b0ff]/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white font-['Orbitron']">Share Your Invite</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Invite Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-blue-300 mb-2">Your Invite Link</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="w-full bg-transparent text-white text-sm outline-none"
                  />
                </div>
                <button
                  onClick={handleCopyLink}
                  className="bg-[#00b0ff] hover:bg-[#0088cc] text-black p-2 rounded-lg transition-colors"
                >
                  {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              {copySuccess && (
                <p className="text-green-400 text-sm mt-2">Link copied to clipboard!</p>
              )}
            </div>
            
            {/* Social Media Options */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-300 mb-3">Share on Social Media</label>
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-700 bg-gray-900 text-white transition-all duration-200 ${option.color} hover:border-gray-600 hover:scale-105`}
                  >
                    {typeof option.icon === 'string' ? (
                      <span className="text-lg font-bold">{option.icon}</span>
                    ) : (
                      option.icon
                    )}
                    <span className="text-sm font-medium">{option.name}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Copy Button */}
            <button
              onClick={handleCopyLink}
              className="w-full bg-gradient-to-r from-[#0066ff] to-[#00b0ff] hover:from-[#004cb3] hover:to-[#33ccff] text-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Link size={18} />
              Copy Invite Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default CountdownPage;