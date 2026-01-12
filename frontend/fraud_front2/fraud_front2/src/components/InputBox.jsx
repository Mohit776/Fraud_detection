import React from 'react';
import styled from 'styled-components';

const InputBox = ({ name, required, value, onChange, type = 'text' }) => {
  return (
    <StyledWrapper>
      <div className="form-control">
        <input 
          type={type} 
          required={required}
          value={value}
          onChange={onChange}
          placeholder=" "
        />
        <label>
          {name.split('').map((Char, index) => (
            <span key={index} style={{transitionDelay: `${index * 50}ms`}}>{Char}</span>
          ))}
        </label>
        <div className="glow-line" />
        <div className="glow-dot" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form-control {
    position: relative;
    margin: 20px 0 40px;
    width: 100%;
    max-width: 400px;
  }

  .form-control input {
    background-color: rgba(17, 24, 39, 0.5);
    border: none;
    border-bottom: 2px solid rgba(5, 150, 105, 0.3);
    border-radius: 8px 8px 0 0;
    display: block;
    width: 100%;
    padding: 20px 16px 12px;
    font-size: 16px;
    color: #fff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .form-control input:hover {
    background-color: rgba(17, 24, 39, 0.7);
    border-bottom-color: rgba(5, 150, 105, 0.5);
  }

  .form-control input:focus {
    outline: none;
    background-color: rgba(17, 24, 39, 0.8);
    border-bottom-color: #10b981;
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
  }

  .form-control label {
    position: absolute;
    top: 16px;
    left: 16px;
    pointer-events: none;
    display: flex;
  }

  .form-control label span {
    display: inline-block;
    font-size: 16px;
    min-width: 5px;
    color: #9ca3af;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control input:focus + label span,
  .form-control input:not(:placeholder-shown) + label span {
    color: #10b981;
    transform: translateY(-28px) scale(0.85);
    font-weight: 500;
  }

  /* Animated glow line */
  .glow-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent);
    transform: translateX(-50%);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
  }

  .form-control input:focus ~ .glow-line {
    width: 100%;
  }

  /* Decorative glow dot */
  .glow-dot {
    position: absolute;
    bottom: -1px;
    left: 50%;
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    transform: translateX(-50%) scale(0);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px #10b981, 0 0 20px rgba(16, 185, 129, 0.5);
  }

  .form-control input:focus ~ .glow-dot {
    transform: translateX(-50%) scale(1);
  }

  /* Valid state styling */
  .form-control input:valid:not(:placeholder-shown) {
    border-bottom-color: #10b981;
  }

  .form-control input:valid:not(:placeholder-shown) ~ .glow-line {
    width: 100%;
    background: linear-gradient(90deg, transparent, #10b981, transparent);
  }
`;

export default InputBox;
