import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface FlipCardProps {
  value: string;
  label: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 300);
    }
  }, [value, displayValue]);

  return (
    <div className="text-center">
      <div className="relative w-24 h-32 mx-auto mb-4">
        {/* Card Container */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden">
          {/* Top Half */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-gray-50 border-b border-gray-300">
            <div className={`flex items-center justify-center h-full text-4xl font-bold text-gray-800 transition-transform duration-300 ${isFlipping ? 'transform -rotate-x-90' : ''}`}>
              {displayValue}
            </div>
          </div>
          
          {/* Bottom Half */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-200 to-gray-100">
            <div className={`flex items-center justify-center h-full text-4xl font-bold text-gray-800 transition-transform duration-300 ${isFlipping ? 'transform rotate-x-90' : ''}`}>
              {displayValue}
            </div>
          </div>
          
          {/* Flip Animation Overlay */}
          {isFlipping && (
            <>
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-gray-50 border-b border-gray-300 transform origin-bottom animate-flip-top">
                <div className="flex items-center justify-center h-full text-4xl font-bold text-gray-800">
                  {displayValue}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-200 to-gray-100 transform origin-top animate-flip-bottom">
                <div className="flex items-center justify-center h-full text-4xl font-bold text-gray-800">
                  {value}
                </div>
              </div>
            </>
          )}
          
          {/* Center Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 transform -translate-y-0.5"></div>
          
          {/* Side Holes */}
          <div className="absolute left-1 top-1/2 w-1 h-1 bg-gray-400 rounded-full transform -translate-y-0.5"></div>
          <div className="absolute right-1 top-1/2 w-1 h-1 bg-gray-400 rounded-full transform -translate-y-0.5"></div>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};

const Timer: React.FC<TimerProps> = ({
  initialTime = { days: 22, hours: 4, minutes: 14, seconds: 11 },
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-white p-12"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="text-center mb-8">
         
        </div>
        
        <div className="flex items-center justify-center space-x-8">
          <FlipCard
            value={timeLeft.days.toString().padStart(2, '0')}
            label="Days"
          />
          
          <div className="text-4xl font-light opacity-50">:</div>
          
          <FlipCard
            value={timeLeft.hours.toString().padStart(2, '0')}
            label="Hours"
          />
          
          <div className="text-4xl font-light opacity-50">:</div>
          
          <FlipCard
            value={timeLeft.minutes.toString().padStart(2, '0')}
            label="Minutes"
          />
          
          <div className="text-4xl font-light opacity-50">:</div>
          
          <FlipCard
            value={timeLeft.seconds.toString().padStart(2, '0')}
            label="Seconds"
          />
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gray-100 bg-opacity-20 backdrop-blur-sm rounded-full border border-gray-300">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-500">Live Countdown</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes flip-top {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(-90deg);
          }
        }
        
        @keyframes flip-bottom {
          0% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
        
        .animate-flip-top {
          animation: flip-top 0.3s ease-in-out;
        }
        
        .animate-flip-bottom {
          animation: flip-bottom 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Timer;