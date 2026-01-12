import React from 'react';
import styled from 'styled-components';

const SubmitButton = ({ onClick, disabled, loading }) => {
  return (
    <StyledWrapper>
      <button 
        className={`animated-button ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {/* Shimmer effect */}
        <span className="shimmer" />
        
        {/* Arrow icons */}
        <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        
        <span className="text">{loading ? 'Processing...' : 'Submit'}</span>
        
        <span className="circle" />
        
        <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        
        {/* Loading spinner */}
        {loading && <span className="spinner" />}
        
        {/* Ripple container */}
        <span className="ripple-container" />
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .animated-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 18px 44px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
    background-size: 200% 200%;
    border-radius: 50px;
    color: #fff;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .animated-button:hover {
    background-position: 100% 100%;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(5, 150, 105, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  .animated-button:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 10px rgba(5, 150, 105, 0.3);
  }

  .animated-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  .animated-button.loading {
    pointer-events: none;
  }

  /* Shimmer effect */
  .shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: none;
  }

  .animated-button:hover .shimmer {
    left: 100%;
    transition: left 0.6s ease;
  }

  /* Arrow animations */
  .animated-button svg {
    position: absolute;
    width: 24px;
    height: 24px;
    fill: currentColor;
    z-index: 9;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .arr-1 {
    right: 20px;
    opacity: 1;
  }

  .animated-button .arr-2 {
    left: -30px;
    opacity: 0;
  }

  .animated-button:hover .arr-1 {
    right: -30px;
    opacity: 0;
  }

  .animated-button:hover .arr-2 {
    left: 20px;
    opacity: 1;
  }

  /* Text animation */
  .text {
    position: relative;
    z-index: 2;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    letter-spacing: 0.5px;
  }

  .animated-button:hover .text {
    transform: translateX(10px);
  }

  /* Circle expansion */
  .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
  }

  .animated-button:hover .circle {
    width: 300px;
    height: 300px;
    opacity: 1;
  }

  /* Loading spinner */
  .spinner {
    position: absolute;
    right: 20px;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    z-index: 10;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Ripple effect container */
  .ripple-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 50px;
    z-index: 0;
  }

  /* Focus state */
  .animated-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.4),
                0 8px 25px rgba(5, 150, 105, 0.5);
  }

  /* Loading state text shift */
  .animated-button.loading .text {
    transform: translateX(-10px);
  }

  .animated-button.loading .arr-1,
  .animated-button.loading .arr-2 {
    opacity: 0;
  }
`;

export default SubmitButton;
