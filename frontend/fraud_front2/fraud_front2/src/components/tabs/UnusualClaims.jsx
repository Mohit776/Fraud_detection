import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { analyzeWelfareClaims } from "../../services/fraudService";
import { startLoading, stopLoading } from "../../features/loading/loadingSlice";
import { useDispatch } from 'react-redux'

export default function UnusualClaims() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading());
    const fetchData = async () => {
      try {
        const sampleClaims = [
          { claim_id: "CLM001", duration_days: 5, total_cost: 8000, insc_claim_amt_reimbursed: 5000, op_annual_reimbursement_amt: 20000, ip_annual_reimbursement_amt: 15000 },
          { claim_id: "CLM002", duration_days: 15, total_cost: 50000, insc_claim_amt_reimbursed: 35000, op_annual_reimbursement_amt: 45000, ip_annual_reimbursement_amt: 60000 },
          { claim_id: "CLM003", duration_days: 3, total_cost: 4500, insc_claim_amt_reimbursed: 3000, op_annual_reimbursement_amt: 12000, ip_annual_reimbursement_amt: 8000 }
        ];
        const res = await analyzeWelfareClaims(sampleClaims);
        setResult(res);
      } catch (err) {
        console.error("Welfare claims analysis error:", err);
        setError(err.response?.data?.detail || "Failed to analyze welfare claims");
      } finally {
        setIsLoading(false);
        dispatch(stopLoading());
      }
    };
    fetchData();
  }, [dispatch]);

  const chartData = result && {
    labels: result.results.map(c => c.claim_id),
    datasets: [{
      label: "Fraud Risk (%)",
      data: result.results.map(c => c.risk_score),
      backgroundColor: result.results.map(c => 
        c.risk_score > 70 ? 'rgba(239, 68, 68, 0.7)' : 
        c.risk_score > 40 ? 'rgba(249, 115, 22, 0.7)' : 
        'rgba(34, 197, 94, 0.7)'
      ),
      borderColor: result.results.map(c => 
        c.risk_score > 70 ? 'rgba(239, 68, 68, 1)' : 
        c.risk_score > 40 ? 'rgba(249, 115, 22, 1)' : 
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
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { weight: '500' } }
      }
    }
  };

  const getRiskIndicator = (score) => {
    if (score > 70) return { 
      bg: 'bg-red-500/20', 
      text: 'text-red-400', 
      border: 'border-red-500/30',
      label: 'High Risk',
      icon: '🚨'
    };
    if (score > 40) return { 
      bg: 'bg-orange-500/20', 
      text: 'text-orange-400', 
      border: 'border-orange-500/30',
      label: 'Medium Risk',
      icon: '⚠️'
    };
    return { 
      bg: 'bg-emerald-500/20', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/30',
      label: 'Low Risk',
      icon: '✅'
    };
  };

  return (
    <div className="p-6">
      <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
        {/* Decorative orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-3xl" />

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
            <div className="h-48 bg-gray-700/50 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-700/50 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* Chart and results */}
        {!isLoading && chartData && (
          <div className="space-y-8">
            {/* Horizontal bar chart */}
            <div className="h-48 p-4 rounded-xl bg-gray-800/50 border border-white/5">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Claim cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.results.map(c => {
                const indicator = getRiskIndicator(c.risk_score);
                return (
                  <div 
                    key={c.claim_id} 
                    className={`group p-5 rounded-xl bg-gradient-to-br from-gray-700/40 to-gray-800/40 border ${indicator.border} transition-all duration-300 hover:scale-102 hover:shadow-xl`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${indicator.bg} flex items-center justify-center text-lg`}>
                          {indicator.icon}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{c.claim_id}</p>
                          <p className={`text-xs ${indicator.text}`}>{indicator.label}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${indicator.bg} ${indicator.text}`}>
                        {c.risk_score}%
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <span className={`text-sm font-medium ${indicator.text}`}>{c.status}</span>
                    </div>

                    {/* Reason */}
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {c.reason}
                    </p>

                    {/* Risk bar */}
                    <div className="mt-4">
                      <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            c.risk_score > 70 ? 'bg-red-500' : 
                            c.risk_score > 40 ? 'bg-orange-500' : 
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${c.risk_score}%` }}
                        />
                      </div>
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
