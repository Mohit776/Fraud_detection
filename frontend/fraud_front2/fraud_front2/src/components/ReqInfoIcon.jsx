import React from 'react';
import icon from '../assets/i.png';

const ReqInfoIcon = () => {
  return (
    <div className="relative group">
      {/* Icon container */}
      <div className="relative z-10 p-2 cursor-pointer">
        <div className="relative">
          <img 
            src={icon} 
            className="w-8 h-8 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 filter brightness-0 invert opacity-60 group-hover:opacity-100" 
            alt="Info"
          />
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none">
        <div className="relative px-4 py-3 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-emerald-500/30 backdrop-blur-sm shadow-xl shadow-black/30
                        opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          {/* Content */}
          <p className="text-sm font-medium text-white whitespace-nowrap flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            All fields are mandatory
          </p>
          
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rotate-45 bg-gradient-to-br from-gray-800 to-gray-900 border-r border-b border-emerald-500/30" />
        </div>
      </div>
    </div>
  );
}

export default ReqInfoIcon;
