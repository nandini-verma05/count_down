'use client';

import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaGithub,
  FaXTwitter,
} from 'react-icons/fa6';

interface SocialIconProps {
  icon: React.ReactNode;
  handle: string;
  url: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, handle, url }) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="w-[60px] h-[60px] flex items-center justify-center border border-white rounded-full cursor-pointer hover:bg-white/10 transition-all"
      onClick={handleClick}
      title={handle}
    >
      <div className="text-white text-xl">{icon}</div>
    </div>
  );
};

const FloatingSocialIcons: React.FC = () => {
  const socialIcons = [
    {
      icon: <FaYoutube />,
      handle: '@vikaasgarh.official',
      url: 'https://www.youtube.com/@VikaasGarh.official',
    },
   
    {
      icon: <FaInstagram />,
      handle: '@vikaasgarh.official',
      url: 'https://www.instagram.com/vikaasgarh.official/',
    },
    {
      icon: <FaLinkedinIn />,
      handle: '@vikaasgarh',
      url: 'https://www.linkedin.com/company/vikaasgarh',
    },
  
    {
      icon: <FaXTwitter />, // X (formerly Twitter)
      handle: '@vikaasgarh',
      url: 'https://x.com/vikaasgarh',
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      {socialIcons.map((social, index) => (
        <SocialIcon
          key={index}
          icon={social.icon}
          handle={social.handle}
          url={social.url}
        />
      ))}
    </div>
  );
};

export default FloatingSocialIcons;
