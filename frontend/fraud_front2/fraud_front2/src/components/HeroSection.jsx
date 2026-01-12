"use client";
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <section className="relative bg-gray-900 min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-600/40 to-emerald-800/20 blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-emerald-500/30 to-emerald-700/10 blur-3xl animate-pulse" style={{animationDuration: '6s'}} />
      
      {/* Floating decorative circles */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{animationDuration: '3s'}} />
      <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-emerald-300 rounded-full animate-bounce opacity-40" style={{animationDuration: '4s', animationDelay: '1s'}} />
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-emerald-500 rounded-full animate-bounce opacity-50" style={{animationDuration: '5s', animationDelay: '2s'}} />
      
      {/* Gradient rings */}
      <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-[40vw] aspect-square">
        <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-spin" style={{animationDuration: '30s'}} />
        <div className="absolute inset-[15%] rounded-full border border-emerald-400/15 animate-spin" style={{animationDuration: '25s', animationDirection: 'reverse'}} />
        <div className="absolute inset-[30%] rounded-full border border-emerald-300/20 animate-spin" style={{animationDuration: '20s'}} />
      </div>
      
      <div className="absolute left-0 bottom-0 -translate-x-1/3 translate-y-1/3 w-[35vw] aspect-square">
        <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-spin" style={{animationDuration: '35s', animationDirection: 'reverse'}} />
        <div className="absolute inset-[20%] rounded-full border border-emerald-400/15 animate-spin" style={{animationDuration: '28s'}} />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-10 lg:px-12">
        <div className="text-center flex flex-col items-center space-y-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-300 tracking-wide">
              AI-Powered Analysis
            </span>
          </span>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white max-w-5xl leading-tight">
            The Ultimate Score for your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500">
              Bidder Value
            </span>
          </h1>
          
          {/* Description */}
          {/* <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            🤔 Want to track your score in government records as a bidder?
            <br />
            <span className="text-emerald-400">Here is a solution ✨</span>
            <br />
            From tracking your performance ⚖ to identifying areas for improvement 📈, our platform has got you covered
          </p> */}
          
          {/* CTA Button */}
          <div className="pt-4">
            <Link 
              to={!isAuthenticated ? '/register' : '/form'} 
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-105"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative z-10">Check your T-Score</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300">
                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
              </svg>
              
              {/* Glow behind button */}
              <div className="absolute inset-0 rounded-full bg-emerald-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
            </Link>
          </div>
          
          {/* Stats or trust indicators */}
          <div className="pt-12 flex flex-wrap justify-center gap-8 text-center">
            <div className="px-6">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-gray-500">Analyses Done</div>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div className="px-6">
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-gray-500">Accuracy Rate</div>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div className="px-6">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}