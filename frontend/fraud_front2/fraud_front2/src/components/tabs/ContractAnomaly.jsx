import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { analyzeLegalDocument } from "../../services/fraudService";
import { startLoading, stopLoading } from "../../features/loading/loadingSlice";
import { useDispatch } from 'react-redux'

export default function ContractAnomaly() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading());
    const fetchData = async () => {
      try {
        const sampleText = `This contract is hereby entered into between the Government of India and ABC Corporation 
        for the supply of medical equipment. The total contract value is Rs. 50,00,000. 
        All terms and conditions are subject to verification. The contractor guarantees timely delivery 
        within 30 days of order placement. Any disputes will be resolved under Indian jurisdiction.`;
        const res = await analyzeLegalDocument(sampleText);
        setResult(res);
      } catch (err) {
        console.error("Legal document analysis error:", err);
        setError(err.response?.data?.detail || "Failed to analyze document");
      } finally {
        setIsLoading(false);
        dispatch(stopLoading());
      }
    };
    fetchData();
  }, [dispatch]);

  const chartData = result && {
    labels: ["Risk", "Safe"],
    datasets: [{
      data: [result.risk_score, 100 - result.risk_score],
      backgroundColor: [
        "rgba(239, 68, 68, 0.8)",
        "rgba(34, 197, 94, 0.8)"
      ],
      borderColor: [
        "rgba(239, 68, 68, 1)",
        "rgba(34, 197, 94, 1)"
      ],
      borderWidth: 2,
      hoverOffset: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          padding: 20,
          font: { size: 14, weight: '500' }
        }
      }
    },
    cutout: '65%'
  };

  return (
    <div className="p-6">
      {/* Glass card container */}
      <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl" />
        
        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-red-400 font-medium">Analysis Error</p>
              <p className="text-red-300/70 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="w-64 h-64 rounded-full bg-gray-700/50" />
            <div className="flex gap-4">
              <div className="h-6 w-24 bg-gray-700/50 rounded" />
              <div className="h-6 w-32 bg-gray-700/50 rounded" />
            </div>
          </div>
        )}

        {/* Chart section */}
        {!isLoading && chartData && (
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Doughnut chart */}
            <div className="relative w-72 h-72">
              <Doughnut data={chartData} options={chartOptions} />
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{result.risk_score}%</span>
                <span className="text-sm text-gray-400">Risk Score</span>
              </div>
            </div>

            {/* Results info cards */}
            <div className="flex-1 space-y-4">
              {/* Status card */}
              <div className="p-4 rounded-xl bg-gray-700/30 border border-white/5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  result.risk_score > 50 ? 'bg-red-500/20' : 'bg-emerald-500/20'
                }`}>
                  <svg className={`w-6 h-6 ${result.risk_score > 50 ? 'text-red-400' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className={`font-semibold ${result.risk_score > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.status}
                  </p>
                </div>
              </div>

              {/* Risk score card */}
              <div className="p-4 rounded-xl bg-gray-700/30 border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Risk Level</p>
                  <p className="font-semibold text-white">{result.risk_score}%</p>
                </div>
              </div>

              {/* Excerpt card */}
              <div className="p-4 rounded-xl bg-gray-700/30 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400 text-sm">Analysis Excerpt</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{result.excerpt}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
