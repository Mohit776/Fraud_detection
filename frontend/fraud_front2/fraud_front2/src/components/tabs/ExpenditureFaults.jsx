import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { analyzeSpending } from "../../services/fraudService";
import { startLoading, stopLoading } from "../../features/loading/loadingSlice";
import { useDispatch } from 'react-redux'

export default function Expenditure() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading());
    const fetchData = async () => {
      try {
        const sampleTransactions = [
          { amount: 15000 },
          { amount: 250000 },
          { amount: 8500 },
          { amount: 500000 },
          { amount: 12000 }
        ];
        const res = await analyzeSpending(sampleTransactions);
        setResult(res);
      } catch (err) {
        console.error("Spending analysis error:", err);
        setError(err.response?.data?.detail || "Failed to analyze spending");
      } finally {
        setIsLoading(false);
        dispatch(stopLoading());
      }
    };
    fetchData();
  }, [dispatch]);

  const chartData = result && {
    labels: result.results.map(r => `TX-${r.index}`),
    datasets: [{
      label: "Risk Score (%)",
      data: result.results.map(r => r.risk_score),
      backgroundColor: result.results.map(r => 
        r.risk_score > 70 ? 'rgba(239, 68, 68, 0.7)' : 
        r.risk_score > 40 ? 'rgba(249, 115, 22, 0.7)' : 
        'rgba(34, 197, 94, 0.7)'
      ),
      borderColor: result.results.map(r => 
        r.risk_score > 70 ? 'rgba(239, 68, 68, 1)' : 
        r.risk_score > 40 ? 'rgba(249, 115, 22, 1)' : 
        'rgba(34, 197, 94, 1)'
      ),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      }
    }
  };

  const getRiskColor = (score) => {
    if (score > 70) return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
    if (score > 40) return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' };
    return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  };

  return (
    <div className="p-6">
      <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
        {/* Decorative orb */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
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
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-700/50 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-700/50 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* Chart and results */}
        {!isLoading && chartData && (
          <div className="space-y-8">
            {/* Chart */}
            <div className="relative h-72 p-4 rounded-xl bg-gray-800/50 border border-white/5">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Transaction cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.results.map(r => {
                const colors = getRiskColor(r.risk_score);
                return (
                  <div key={r.index} className={`p-4 rounded-xl bg-gray-700/30 border ${colors.border} transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-semibold">TX-{r.index}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {r.risk_score}% Risk
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-400 text-sm">₹{r.amount?.toLocaleString()}</span>
                      </div>
                      <p className={`text-sm ${colors.text}`}>{r.status}</p>
                      <p className="text-gray-500 text-xs">{r.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
