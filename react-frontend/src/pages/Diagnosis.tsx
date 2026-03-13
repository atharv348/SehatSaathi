import { Upload, Image, AlertCircle } from 'lucide-react';
import { useState } from 'react';

function Diagnosis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('skin');

  const categories = [
    { id: 'skin', name: 'Skin Conditions', icon: '🔬' },
    { id: 'eye', name: 'Eye Diseases', icon: '👁️' },
    { id: 'oral', name: 'Oral Health', icon: '🦷' },
    { id: 'bone', name: 'Bone Health', icon: '🦴' },
    { id: 'lung', name: 'Lung Conditions', icon: '🫁' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          AI-Powered Diagnosis
        </h1>
        <p className="text-blue-700 text-lg">Upload an image for instant analysis powered by advanced AI</p>
      </header>

      {/* Alert Banner */}
      <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-amber-800">
          <strong>Medical Disclaimer:</strong> This AI tool provides preliminary analysis only. 
          Always consult with a qualified healthcare professional for proper diagnosis and treatment.
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Select Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-500 shadow-md'
                  : 'bg-white border-blue-200 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-semibold text-blue-900">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Upload Image</h2>
          
          <label className="block">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              selectedImage 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
            }`}>
              {selectedImage ? (
                <div>
                  <img src={selectedImage} alt="Preview" className="max-w-full max-h-64 mx-auto rounded-lg mb-4" />
                  <p className="text-sm text-blue-700 font-semibold">Click to change image</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                  <p className="text-lg font-semibold text-blue-900 mb-2">Upload or drop an image</p>
                  <p className="text-sm text-blue-600">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {selectedImage && (
            <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md">
              Analyze Image
            </button>
          )}
        </div>

        {/* Results Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-cyan-200">
          <h2 className="text-xl font-bold text-cyan-900 mb-4">Analysis Results</h2>
          <div className="text-center py-12 text-cyan-600">
            <Image className="w-20 h-20 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Upload an image to see analysis results</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diagnosis;
