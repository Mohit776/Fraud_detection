import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RESULT_TABS } from "../constants/tabs";
import { setActiveTab } from "../features/resultTab/resultTabSlice";
import { useEffect } from "react";

const ResultTab = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((s) => s.resultTab.activeTab);

  const activeIndex = RESULT_TABS.findIndex(
    (tab) => tab.id === activeTab
  );

  useEffect(() => {
    console.log("Active tab changed →", activeTab);
  }, [activeTab]);

  return (
    <StyledWrapper $tabIndex={activeIndex} $total={RESULT_TABS.length}>
      <div className="tab-container">
        {RESULT_TABS.map((tab, index) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => dispatch(setActiveTab(tab.id))}
          >
            <span className="tab-text">{tab.label}</span>
            {activeTab === tab.id && <span className="tab-glow" />}
          </button>
        ))}
        <div className="indicator" />
        <div className="indicator-glow" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  --index: ${({ $tabIndex }) => $tabIndex};
  --count: ${({ $total }) => $total};

  .tab-container {
    position: relative;
    display: flex;
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.7) 100%);
    border-radius: 16px;
    padding: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  }

  .tab-button {
    flex: 1;
    padding: 14px 20px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    z-index: 2;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border-radius: 12px;
    overflow: hidden;
  }

  .tab-text {
    position: relative;
    z-index: 2;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.02em;
  }

  .tab-button:hover:not(.active) {
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.05);
  }

  .tab-button.active {
    color: #fff;
  }

  .tab-button.active .tab-text {
    text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  }

  .tab-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
    z-index: 1;
  }

  .indicator {
    position: absolute;
    top: 6px;
    left: 6px;
    width: calc((100% - 12px) / var(--count));
    height: calc(100% - 12px);
    background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
    border-radius: 12px;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateX(calc(var(--index) * 100%));
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .indicator-glow {
    position: absolute;
    top: 6px;
    left: 6px;
    width: calc((100% - 12px) / var(--count));
    height: calc(100% - 12px);
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    border-radius: 12px;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateX(calc(var(--index) * 100%));
    filter: blur(15px);
    opacity: 0.5;
    z-index: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .tab-button {
      padding: 12px 12px;
    }
    
    .tab-text {
      font-size: 12px;
    }
  }
`;


export default ResultTab;
