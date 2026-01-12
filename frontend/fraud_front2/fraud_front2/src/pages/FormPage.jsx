import React, { useEffect } from 'react'
import InputBox from '../components/InputBox'
import ReqInfoIcon from '../components/ReqInfoIcon'
import FileInput from '../components/FileInput'
import SubmitButton from '../components/SubmitButton'
import { Link } from 'react-router-dom'
import { startLoading, stopLoading } from "../features/loading/loadingSlice";
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const FormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading());
    const timer = setTimeout(() => {
      dispatch(stopLoading());
    }, 1500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <StyledWrapper>
      <div className='form-page-container'>
        {/* Animated background gradients */}
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>

        <div className='form-content'>
          {/* Header Section */}
          <div className='header-section animate-fade-in'>
            <div className='header-glow'></div>
            <div className='title-container'>
              <h1 className='title'>
                <span className='title-gradient'>Score Calculator</span>
                <span className='emoji'>🧮</span>
              </h1>
              <ReqInfoIcon />
            </div>
            <p className='subtitle'>
              Almost there! 🚀 Just fill out the details below to get your company's score as a bidder
            </p>
          </div>

          {/* Form Section */}
          <form className='form-container animate-slide-up'>
            {/* Company Information Card */}
            <div className='glass-card info-card'>
              <div className='card-header'>
                <div className='card-icon'>🏢</div>
                <h2 className='card-title'>Company Information</h2>
              </div>
              <div className='input-grid'>
                <InputBox name="Company Name" required={true} />
                <InputBox name="Company Email" required={true} />
                <InputBox name="Registered Bank Account of the Company" required={true} />
              </div>
            </div>

            {/* Document Upload Card */}
            <div className='glass-card document-card'>
              <div className='card-header'>
                <div className='card-icon'>📄</div>
                <h2 className='card-title'>Document Uploads</h2>
              </div>

              <div className='upload-section'>
                {/* Legal Documents */}
                <div className='upload-item featured'>
                  <div className='upload-info'>
                    <h3 className='upload-title'>Legal Documents Package</h3>
                    <p className='upload-description'>
                      Single PDF containing: GST Slip, Company PAN Card, Shareholder Agreement,
                      Founder Agreement, Trademark
                    </p>
                  </div>
                  <FileInput id='legaldocpdf' required={true} />
                </div>

                {/* Other Documents */}
                <div className='upload-grid'>
                  <div className='upload-item'>
                    <div className='upload-info'>
                      <h3 className='upload-title'>Copy of Tender</h3>
                    </div>
                    <FileInput id='tendercopy' required={true} />
                  </div>

                  <div className='upload-item'>
                    <div className='upload-info'>
                      <h3 className='upload-title'>Rules & Regulations</h3>
                    </div>
                    <FileInput id='rul&regcopy' required={true} />
                  </div>

                  <div className='upload-item'>
                    <div className='upload-info'>
                      <h3 className='upload-title'>Company Expenditure</h3>
                      <p className='upload-hint'>Only .csv and excel files</p>
                    </div>
                    <FileInput id='expenditure' required={true} />
                  </div>

                  <div className='upload-item'>
                    <div className='upload-info'>
                      <h3 className='upload-title'>GST Invoice</h3>
                    </div>
                    <FileInput id='gstinvoice' required={true} />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className='submit-section animate-fade-in'>
              <Link to={'/resultpage'}>
                <SubmitButton />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .form-page-container {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    overflow-x: hidden;
    padding: 4rem 2rem;
  }

  /* Animated gradient orbs */
  .gradient-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
    animation: float 20s ease-in-out infinite;
    z-index: 0;
  }

  .orb-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #10b981 0%, transparent 70%);
    top: -100px;
    right: -100px;
    animation-delay: 0s;
  }

  .orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
    animation-delay: 7s;
  }

  .orb-3 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 14s;
  }

  // @keyframes float {
  //   0%, 100% {
  //     transform: translate(0, 0) scale(1);
  //   }
  //   33% {
  //     transform: translate(50px, -50px) scale(1.1);
  //   }
  //   66% {
  //     transform: translate(-50px, 50px) scale(0.9);
  //   }
  // }

  /* Content Container */
  .form-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Header Section */
  .header-section {
    position: relative;
    text-align: center;
    margin-bottom: 4rem;
    padding: 2rem;
  }

  .header-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 200px;
    background: radial-gradient(ellipse, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
    filter: blur(40px);
    z-index: -1;
  }

  .title-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 4rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0;
  }

  .title-gradient {
    background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }

  .emoji {
    font-size: 4rem;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  // @keyframes bounce {
  //   0%, 100% {
  //     transform: translateY(0);
  //   }
  //   50% {
  //     transform: translateY(-10px);
  //   }
  // }

  .subtitle {
    font-size: 1.25rem;
    color: #94a3b8;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.8;
  }

  /* Form Container */
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* Glass Cards */
  .glass-card {
    background: rgba(30, 41, 59, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(16, 185, 129, 0.2);
  }

  /* Card Header */
  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  }

  .card-icon {
    font-size: 2rem;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.1) 100%);
    border-radius: 16px;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .card-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0;
  }

  /* Input Grid */
  .input-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  /* Upload Section */
  .upload-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .upload-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.5rem;
    background: rgba(15, 23, 42, 0.4);
    border-radius: 16px;
    border: 1px solid rgba(148, 163, 184, 0.05);
    transition: all 0.3s ease;
  }

  .upload-item:hover {
    background: rgba(15, 23, 42, 0.6);
    border-color: rgba(16, 185, 129, 0.2);
  }

  .upload-item.featured {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .upload-info {
    flex: 1;
    min-width: 200px;
  }

  .upload-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0 0 0.5rem 0;
  }

  .upload-description {
    font-size: 0.875rem;
    color: #10b981;
    line-height: 1.6;
    margin: 0;
  }

  .upload-hint {
    font-size: 0.875rem;
    color: #10b981;
    margin: 0.25rem 0 0 0;
  }

  .upload-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  /* Submit Section */
  .submit-section {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  // /* Animations */
  // .animate-fade-in {
  //   animation: fadeIn 0.8s ease-out;
  // }

  // .animate-slide-up {
  //   animation: slideUp 0.8s ease-out;
  // }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .title {
      font-size: 3rem;
    }

    .upload-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .form-page-container {
      padding: 2rem 1rem;
    }

    .title {
      font-size: 2.5rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .glass-card {
      padding: 1.5rem;
    }

    .upload-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .input-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default FormPage