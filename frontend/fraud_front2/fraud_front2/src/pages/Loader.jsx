import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Loader = () => {
  const loading = useSelector(state => state.loading.active);

  if (!loading) return null;

  return (
    <Overlay>
      <StyledWrapper>
        <div className="main">
          {Array.from({ length: 15 }).map((_, i) => (
            <div className="card" key={i} />
          ))}
        </div>
      </StyledWrapper>
    </Overlay>
  );
};

/* 🔥 FULLSCREEN OVERLAY */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
`;

/* 🎯 YOUR EXISTING LOADER */
const StyledWrapper = styled.div`
  .main {
    display: flex;
    flex-wrap: wrap;
    width: 15em;
    align-items: center;
    justify-content: center;
  }

  .card {
    width: 40px;
    height: 40px;
    margin: 0.2em;
    border-radius: 5px;

    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);

    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);

    animation: loading90 2s infinite;
  }

  .card:nth-child(even) {
    animation-delay: 1s;
  }

  @keyframes loading90 {
    0% {
      background: rgba(255, 255, 255, 0.2);
    }
    50% {
      background: limegreen;
    }
    100% {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export default Loader;
