import React from 'react'
import Card from './Card'
import {features} from '../assets/features'

const Features = () => {
  return (
    <section className='relative min-h-screen w-full bg-gray-900 py-20 overflow-hidden'>
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
      
      {/* Animated title */}
      <div className='relative text-center mb-20'>
        <span className='inline-block text-sm font-semibold tracking-widest text-emerald-400 uppercase mb-4 opacity-80'>
          What We Analyze
        </span>
        <h2 className='text-5xl md:text-6xl lg:text-7xl font-bold'>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 animate-gradient-x'>
            PARAMETERS
          </span>
        </h2>
        <div className='mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full' />
      </div>
      
      {/* Cards grid with staggered animation */}
      <div className='relative max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center'>
          {features.map((feature, index) => (
            <div 
              key={feature.number} 
              className='opacity-0 animate-fade-in-up'
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <Card 
                number={feature.number} 
                problem={feature.problem} 
                explanation={feature.explanation} 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </section>
  )
}

export default Features