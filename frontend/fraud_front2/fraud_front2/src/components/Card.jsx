import React from 'react';

const Card = ({number, problem, explanation}) => {
  return (
    <div className="group relative w-72 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 space-y-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 hover:border-emerald-400/50">
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Number badge with glow */}
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-400/70 transition-all duration-500 group-hover:scale-110">
        <span className="absolute bottom-5 left-5 text-white text-2xl font-bold drop-shadow-lg">{number}</span>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping opacity-0 group-hover:opacity-75" style={{animationDuration: '2s'}} />
      </div>
      
      {/* Icon with gradient fill */}
      <div className="relative w-14 h-14 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
        <svg viewBox="0 0 24 24" className="w-full h-full p-3 fill-emerald-400 group-hover:fill-emerald-300 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg">
          <path d="m24,6.928v13.072h-11.5v3h5v1H6.5v-1h5v-3H0V4.5c0-1.379,1.122-2.5,2.5-2.5h12.98c-.253.295-.54.631-.856,1H2.5c-.827,0-1.5.673-1.5,1.5v14.5h22v-10.993l1-1.079Zm-12.749,3.094C19.058.891,19.093.855,19.11.838c1.118-1.115,2.936-1.113,4.052.002,1.114,1.117,1.114,2.936,0,4.052l-8.185,8.828c-.116,1.826-1.623,3.281-3.478,3.281h-5.59l.097-.582c.043-.257,1.086-6.16,5.244-6.396Zm2.749,3.478c0-1.379-1.122-2.5-2.5-2.5-2.834,0-4.018,3.569-4.378,5h4.378c1.378,0,2.5-1.121,2.5-2.5Zm.814-1.073l2.066-2.229c-.332-1.186-1.371-2.057-2.606-2.172-.641.749-1.261,1.475-1.817,2.125,1.117.321,1.998,1.176,2.357,2.277Zm.208-5.276c1.162.313,2.125,1.134,2.617,2.229l4.803-5.18c.737-.741.737-1.925.012-2.653-.724-.725-1.908-.727-2.637,0-.069.08-2.435,2.846-4.795,5.606Z" />
        </svg>
      </div>
      
      {/* Content */}
      <h2 className="relative font-bold text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all duration-300">
        {problem}
      </h2>
      <p className="relative text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
        {explanation}
      </p>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent group-hover:w-3/4 transition-all duration-500" />
    </div>
  );
}

export default Card;
