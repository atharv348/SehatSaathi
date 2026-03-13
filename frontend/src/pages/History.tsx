import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { History as HistoryIcon, Calendar, Activity, ChevronRight, FileText, ExternalLink, Stethoscope } from 'lucide-react'

export default function History() {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: async () => {
      const response = await api.get('/api/predictions/')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-xl mr-4 shadow-sm">
            <HistoryIcon className="text-blue-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Diagnostic Archives</h1>
            <p className="text-blue-700 text-sm mt-1 font-semibold">Review your longitudinal clinical scan history</p>
          </div>
        </div>
        <div className="bg-blue-50 px-6 py-2.5 rounded-2xl border-2 border-blue-100 text-center shadow-inner">
          <p className="text-2xl font-black text-blue-600">{predictions?.length || 0}</p>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Clinical Scans</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-50">
            <thead className="bg-blue-50/50">
              <tr>
                <th className="px-6 py-6 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Temporal Origin</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Diagnostic Result</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">AI Confidence</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Target Region</th>
                <th className="px-6 py-6 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Pathological Risk</th>
                <th className="px-6 py-6 text-right text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {predictions?.map((pred: any) => (
                <tr key={pred.id} className="hover:bg-blue-50/40 transition-all cursor-pointer group">
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3 text-sm font-bold text-blue-900">
                      <Calendar size={16} className="text-blue-400" />
                      {new Date(pred.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-black text-blue-900 group-hover:text-blue-600 transition-colors">{pred.predicted_name}</div>
                      <div className="text-[10px] font-bold text-blue-400 uppercase mt-0.5 tracking-widest">{pred.predicted_class}</div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 shadow-sm" 
                          style={{ width: `${pred.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-blue-700">{(pred.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-xl border border-blue-200">
                      {pred.body_part || 'skin'}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span
                      className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full border-2 shadow-sm ${
                        pred.priority === 'high'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : pred.priority === 'medium'
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-green-50 text-green-600 border-green-200'
                      }`}
                    >
                      {pred.priority} RISK
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-right">
                    <button className="p-2.5 hover:bg-blue-100 rounded-xl text-blue-400 hover:text-blue-600 transition-all shadow-sm border border-transparent hover:border-blue-200">
                      <ExternalLink size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!predictions || predictions.length === 0) && (
          <div className="p-32 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-dashed border-blue-200">
              <Stethoscope className="text-blue-200" size={40} />
            </div>
            <p className="text-blue-400 font-black text-xl uppercase tracking-widest">Diagnostic Archives Empty</p>
            <p className="text-blue-300 text-sm mt-2 font-semibold">Initiate your first clinical scan to populate this database.</p>
          </div>
        )}
      </div>
    </div>
  )
}
