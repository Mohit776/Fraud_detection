import React from 'react'
import Features from '../components/Features'
import { HeroSection } from '../components/HeroSection'
import { startLoading, stopLoading } from "../features/loading/loadingSlice";
import { useDispatch } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch();
  dispatch(startLoading());
  
  setTimeout(() => {
    dispatch(stopLoading());
  }, 1500);
  return (
      <div>
          <HeroSection />
          <Features />
    </div>
  )
}

export default Home