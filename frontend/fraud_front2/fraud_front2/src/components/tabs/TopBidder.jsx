import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { startLoading, stopLoading } from "../../features/loading/loadingSlice";
import { useDispatch } from 'react-redux'
import { llmApi } from "../../api";

export default function TopBidder() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading());
    const fetchData = async () => {
      try {
        const vendorListRes = await llmApi.get('/bidrigging/list-vendors?limit=10');
        const vendors = vendorListRes.data.vendors;

        if (vendors && vendors.length > 0) {
          const sortedVendors = [...vendors].sort((a, b) => b.connection_count - a.connection_count);
          const vendorToAnalyze = sortedVendors[0].vendor_id;
          const res = await llmApi.post('/bidrigging/analyze', { vendor_id: vendorToAnalyze });
          setResult(res.data);
        } else {
          setError("No vendors available in the network");
        }
      } catch (err) {
        console.error("Bid rigging analysis error:", err);
        setError(err.response?.data?.detail || "Failed to analyze bid rigging");
      } finally {
        setIsLoading(false);
        dispatch(stopLoading());
      }
    };
    fetchData();
  }, [dispatch]);

  const chartData = result && {
    labels: result.top_connections.map(v => v.vendor_name),
    datasets: [{
      label: "Collusion Strength",
      data: result.top_connections.map(v => Math.min(100, v.connection_weight * 10)),
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(59, 130, 246, 0.8)",
      borderWidth: 2,
      pointBackgroundColor: "rgba(59, 130, 246, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(59, 130, 246, 1)",
      pointRadius: 4,
      pointHoverRadius: 6
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
      r: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#9ca3af', font: { size: 11 } },
        ticks: { 
          color: '#6b7280',
          backdropColor: 'transparent',
          stepSize: 25
        }
      }
    }
  };

  const getRiskBadge = (level) => {
    const levels = {
      'HIGH': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
      'MEDIUM': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
      'LOW': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' }
    };
    return levels[level] || levels['MEDIUM'];
  };

  return (
    <div className="p-6">
      <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
        {/* Decorative orb */}
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

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
            <div className="h-72 bg-gray-700/50 rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-700/50 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* Chart and results */}
        {!isLoading && chartData && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Radar chart */}
              <div className="flex-1 h-80 p-4 rounded-xl bg-gray-800/50 border border-white/5">
                <Radar data={chartData} options={chartOptions} />
              </div>

              {/* Vendor info panel */}
              <div className="lg:w-80 space-y-4">
                {/* Vendor name card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide">Vendor</p>
                      <p className="text-white font-semibold">{result.vendor_name}</p>
                    </div>
                  </div>
                </div>

                {/* Risk level */}
                <div className={`p-4 rounded-xl ${getRiskBadge(result.risk_level).bg} border ${getRiskBadge(result.risk_level).border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${getRiskBadge(result.risk_level).bg} flex items-center justify-center`}>
                      <svg className={`w-5 h-5 ${getRiskBadge(result.risk_level).text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide">Risk Level</p>
                      <p className={`font-bold ${getRiskBadge(result.risk_level).text}`}>{result.risk_level}</p>
                    </div>
                  </div>
                </div>

                {/* Connections count */}
                <div className="p-4 rounded-xl bg-gray-700/30 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide">Total Connections</p>
                      <p className="text-white font-bold text-xl">{result.total_connections}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
