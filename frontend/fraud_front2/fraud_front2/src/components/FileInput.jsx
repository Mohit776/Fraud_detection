import React, { useState } from 'react';
import styled from 'styled-components';

const FileInput = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect?.(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect?.(file);
    }
  };

  return (
    <StyledWrapper $isDragging={isDragging}>
      <div 
        className="input-div"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          className="input" 
          name="file" 
          type="file" 
          onChange={handleChange}
        />
        
        {/* Animated rings */}
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        
        {/* Icon */}
        <div className="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon">
            <polyline points="16 16 12 12 8 16" />
            <line y2={21} x2={12} y1={12} x1={12} />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            <polyline points="16 16 12 12 8 16" />
          </svg>
        </div>
        
        {/* Status text */}
        <span className="status-text">
          {fileName || (isDragging ? 'Drop here!' : 'Upload')}
        </span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input-div {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 3px solid transparent;
    background: linear-gradient(#111827, #111827) padding-box,
                linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%) border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: visible;
    cursor: pointer;
    
    
    ${props => props.$isDragging && `
      transform: scale(1.1);
      border-width: 4px;
    `}
  }

  .input-div:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(5, 150, 105, 0.4),
                0 0 60px rgba(5, 150, 105, 0.2),
                inset 0 0 20px rgba(5, 150, 105, 0.1);
  }

  .ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgba(5, 150, 105, 0.3);
    animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .ring-1 {
    width: 100%;
    height: 100%;
    animation-delay: 0s;
  }

  .ring-2 {
    width: 130%;
    height: 130%;
    animation-delay: 1s;
  }

  .ring-3 {
    width: 160%;
    height: 160%;
    animation-delay: 2s;
  }

  @keyframes pulse-ring {
    0%, 100% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.6;
      transform: scale(1);
    }
  }

  .icon-wrapper {
    position: relative;
    z-index: 2;
    animation: float 3s ease-in-out infinite;
  }

  .icon {
    color: #10b981;
    font-size: 2.5rem;
    filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5));
    transition: all 0.3s ease;
  }

  .input-div:hover .icon {
    color: #34d399;
    filter: drop-shadow(0 0 12px rgba(52, 211, 153, 0.7));
    transform: scale(1.1);
  }

  .status-text {
    position: relative;
    z-index: 2;
    margin-top: 8px;
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 1px;
    max-width: 100px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.3s ease;
  }

  .input-div:hover .status-text {
    color: #10b981;
  }

  .input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer !important;
    z-index: 10;
  }

  .input:focus + .icon-wrapper .icon {
    color: #34d399;
    filter: drop-shadow(0 0 15px rgba(52, 211, 153, 0.8));
  }
`;

export default FileInput;
