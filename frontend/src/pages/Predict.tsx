import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  UploadCloud, 
  Info, 
  Search, 
  ShieldAlert,
  ChevronRight,
  Activity,
  ScanLine,
  Loader2,
  Stethoscope,
  Bot
} from 'lucide-react'

export default function Predict() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [bodyPart, setBodyPart] = useState('skin')
  const [notes, setNotes] = useState('')

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/api/predictions/predict', formData, {
        params: { body_part: bodyPart },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (data) => {
      setResult(data)
      toast.success('Analysis complete!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Analysis failed. Please try again.')
    }
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select an image')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)
    if (notes) formData.append('notes', notes)

    mutation.mutate(formData)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <Stethoscope className="text-blue-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
              Multi-Organ Diagnostic AI
            </h1>
            <p className="text-blue-700 text-sm mt-1">AI-powered medical imaging for Skin, Eye, Oral, Bone, and Lungs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <UploadCloud className="text-blue-600" size={24} />
              Diagnostic Telemetry
            </h2>
            
            <div
              {...getRootProps()}
              className={`relative border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="max-h-80 mx-auto rounded-xl shadow-md" />
                  <div className="mt-4">
                    <span className="text-sm font-semibold text-blue-600 underline">Replace Image</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <ScanLine className="text-blue-600" size={40} />
                  </div>
                  <div>
                    <p className="text-blue-900 font-bold text-lg">Drop clinical image here</p>
                    <p className="text-sm text-blue-500 mt-1">Skin, Eye, Oral, X-ray, or Lung Scan</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Target Region</label>
                <select
                  value={bodyPart}
                  onChange={(e) => setBodyPart(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-0 transition-all font-medium text-blue-900"
                >
                  <option value="skin">Skin (Dermatology)</option>
                  <option value="eye">Eye (Ophthalmology)</option>
                  <option value="oral">Oral Cavity</option>
                  <option value="bone">Bone (X-ray)</option>
                  <option value="lungs">Lungs (Pulmonology)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Clinical Context (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe symptoms, duration, or any other relevant medical history..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-0 transition-all font-medium text-blue-900 placeholder:text-blue-300"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || mutation.isPending}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3 text-lg"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processing Telemetry...
                  </>
                ) : (
                  <>
                    <Search size={24} />
                    Run AI Diagnosis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-100 animate-fadeIn">
              <h2 className="text-2xl font-bold text-blue-900 mb-8 flex items-center gap-3">
                <Activity className="text-blue-600" size={28} />
                Diagnostic Report
              </h2>
              
              <div className={`p-6 rounded-2xl mb-8 border-2 ${
                result.priority === 'critical' ? 'bg-red-100 border-red-400' :
                result.priority === 'high' ? 'bg-red-50 border-red-200' :
                result.priority === 'medium' ? 'bg-amber-50 border-amber-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">{result.body_part} Analysis Results</p>
                    <p className="text-3xl font-black text-blue-900 tracking-tight">{result.predicted_name}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="h-3 w-40 bg-blue-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            result.priority === 'critical' ? 'bg-red-600' :
                            result.priority === 'high' ? 'bg-red-500' :
                            result.priority === 'medium' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                      <p className="text-sm font-bold text-blue-700">
                        {(result.confidence * 100).toFixed(1)}% Confidence
                      </p>
                    </div>
                  </div>
                  <div className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md ${
                    result.priority === 'critical' ? 'bg-red-700 text-white' :
                    result.priority === 'high' ? 'bg-red-600 text-white' :
                    result.priority === 'medium' ? 'bg-amber-500 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {result.priority} RISK
                  </div>
                </div>
              </div>

              {result.ai_advice && (
                <div className="bg-white p-6 mb-8 rounded-2xl border-2 border-blue-100 shadow-sm">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Bot className="text-blue-600" size={24} />
                    AI Health Advisor Guidance
                  </h3>
                  <div className="prose prose-blue max-w-none text-blue-800 font-medium">
                    {result.ai_advice}
                  </div>
                </div>
              )}

              {(result.priority === 'high' || result.priority === 'critical') && (
                <div className="bg-red-600 text-white p-6 mb-8 rounded-2xl flex gap-4 shadow-lg animate-pulse">
                  <ShieldAlert className="shrink-0" size={32} />
                  <div>
                    <p className="font-black text-lg">URGENT: SPECIALIST CONSULTATION REQUIRED</p>
                    <p className="text-sm font-medium opacity-90">
                      {result.priority === 'critical' ? 'Pathological features indicate immediate danger.' : 'High-risk pathological features detected.'} Please seek professional medical evaluation immediately.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ChevronRight size={18} className="text-blue-600" />
                  Standard Clinical Protocol
                </h3>
                <ul className="space-y-4 text-sm font-semibold text-blue-800">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    Record archived in biometric history for longitudinal tracking.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    Avoid self-diagnosis or self-medication based solely on AI results.
                  </li>
                  {result.priority === 'high' && (
                    <li className="flex items-start gap-3 text-red-600">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      Seek medical attention within the next 24-48 hours.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white/50 rounded-2xl border-4 border-dashed border-blue-100 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <ScanLine className="text-blue-200" size={48} />
              </div>
              <p className="text-blue-400 font-bold text-xl uppercase">Awaiting Diagnostic Data</p>
              <p className="text-blue-300 text-sm mt-2 max-w-xs mx-auto font-medium">
                Upload a medical image to begin the multi-organ AI analysis protocol.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
