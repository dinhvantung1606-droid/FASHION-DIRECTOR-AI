import React, { useState } from 'react';
import { UploadCloud, Loader2, Sparkles, RefreshCcw, ArrowLeft, Command } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ConceptCard } from './components/ConceptCard';
import { generateConcepts } from './services/geminiService';
import { Concept, ModelOption } from './types';

const MODEL_OPTIONS: ModelOption[] = [
  'Model Hàn Quốc', 
  'Model Việt Nam', 
  'Model Trung Quốc', 
  'Model Nàng thơ hiện đại'
];

const CONTEXTS: string[] = [
  'Tự do sáng tạo (AI quyết định)',
  'Studio Nền trơn (Clean Studio)',
  'Đường phố hiện đại (Urban Street)',
  'Thiên nhiên / Ngoài trời (Nature)',
  'Kiến trúc sang trọng (Luxury Architecture)',
  'Nội thất tối giản (Minimalist Indoor)',
  'Quán Cafe / Lifestyle',
  'Biển / Resort (Summer Vibe)',
  'Sân khấu / Ánh sáng nghệ thuật'
];

export default function App() {
  const [fullShot, setFullShot] = useState<File | null>(null);
  const [fullShotPreview, setFullShotPreview] = useState<string | null>(null);
  
  const [detailShot, setDetailShot] = useState<File | null>(null);
  const [detailShotPreview, setDetailShotPreview] = useState<string | null>(null);
  
  const [modelShot, setModelShot] = useState<File | null>(null);
  const [modelShotPreview, setModelShotPreview] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState<ModelOption>('Model Hàn Quốc');
  const [selectedContext, setSelectedContext] = useState<string>(CONTEXTS[0]);
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<Concept[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (setter: (f: File | null) => void, previewSetter: (s: string | null) => void) => (file: File) => {
    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const handleRemove = (setter: (f: File | null) => void, previewSetter: (s: string | null) => void) => () => {
    setter(null);
    previewSetter(null);
  };

  const handleSubmit = async () => {
    if (!fullShot) {
      alert("Vui lòng tải ảnh toàn cảnh sản phẩm.");
      return;
    }

    setLoading(true);
    setError(null);
    setConcepts(null);

    try {
      const result = await generateConcepts(fullShot, detailShot, modelShot, selectedModel, selectedContext, description);
      setConcepts(result);
    } catch (err) {
      setError("Đã xảy ra lỗi khi tạo concept. Vui lòng kiểm tra API Key hoặc thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setConcepts(null);
    setError(null);
  };

  const handleReset = () => {
    setConcepts(null);
    setFullShot(null);
    setFullShotPreview(null);
    setDetailShot(null);
    setDetailShotPreview(null);
    setModelShot(null);
    setModelShotPreview(null);
    setDescription('');
    setSelectedContext(CONTEXTS[0]);
    setError(null);
    setSelectedModel('Model Hàn Quốc');
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20 selection:bg-black selection:text-white">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm">
              <Command size={18} />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-tight text-zinc-900 leading-none">
                FASHION DIRECTOR <span className="text-zinc-400 font-light">AI</span>
              </h1>
            </div>
          </div>
          
          {concepts && (
            <div className="flex gap-2">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors px-4 py-2 hover:bg-zinc-100 rounded-full"
              >
                <ArrowLeft size={14} />
                Quay lại
              </button>
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-xs font-medium text-white bg-black hover:bg-zinc-800 transition-colors px-4 py-2 rounded-full"
              >
                <RefreshCcw size={14} />
                Tạo mới
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-screen-2xl mx-auto px-6 py-12">
        
        {/* Hero / Intro */}
        {!concepts && !loading && (
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-block py-1 px-3 border border-zinc-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6 bg-white">
                AI Powered Creative Studio
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-medium mb-6 leading-tight text-zinc-900">
              Biến sản phẩm thành <br/>
              <span className="italic text-zinc-500">tác phẩm nghệ thuật</span>
            </h2>
            <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-xl mx-auto">
              Tải lên hình ảnh sản phẩm. AI Giám đốc Sáng tạo sẽ phân tích và đề xuất 3 concept hình ảnh thương mại đẳng cấp.
            </p>
          </div>
        )}

        {/* Input Form */}
        {!concepts && (
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row">
                
                {/* Left Column: Image Uploads */}
                <div className="w-full md:w-2/3 p-8 border-b md:border-b-0 md:border-r border-zinc-100">
                    <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                        <span className="text-zinc-300 font-sans text-sm font-bold">01.</span>
                        Media Assets
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <ImageUpload 
                            id="fullShot"
                            label="Toàn cảnh SP"
                            required
                            previewUrl={fullShotPreview}
                            onFileSelect={handleFileSelect(setFullShot, setFullShotPreview)}
                            onRemove={handleRemove(setFullShot, setFullShotPreview)}
                        />
                        <ImageUpload 
                            id="detailShot"
                            label="Cận chất liệu"
                            previewUrl={detailShotPreview}
                            onFileSelect={handleFileSelect(setDetailShot, setDetailShotPreview)}
                            onRemove={handleRemove(setDetailShot, setDetailShotPreview)}
                        />
                        <ImageUpload 
                            id="modelShot"
                            label="Model Reference"
                            previewUrl={modelShotPreview}
                            onFileSelect={handleFileSelect(setModelShot, setModelShotPreview)}
                            onRemove={handleRemove(setModelShot, setModelShotPreview)}
                        />
                    </div>
                </div>

                {/* Right Column: Settings */}
                <div className="w-full md:w-1/3 p-8 bg-zinc-50/50">
                    <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                        <span className="text-zinc-300 font-sans text-sm font-bold">02.</span>
                        Cấu hình Concept
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Model Type</label>
                            <div className="relative">
                                <select 
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value as ModelOption)}
                                    className="w-full appearance-none rounded-md border-zinc-300 bg-white py-3 pl-4 pr-10 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
                                >
                                    {MODEL_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Context & Mood</label>
                            <div className="relative">
                                <select 
                                    value={selectedContext}
                                    onChange={(e) => setSelectedContext(e.target.value)}
                                    className="w-full appearance-none rounded-md border-zinc-300 bg-white py-3 pl-4 pr-10 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
                                >
                                    {CONTEXTS.map(ctx => (
                                        <option key={ctx} value={ctx}>{ctx}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Ghi chú thêm</label>
                                <span className="text-[10px] text-zinc-400 italic">Optional</span>
                            </div>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả cụ thể (VD: Chụp ngoài trời lúc hoàng hôn, sang trọng...)"
                                rows={3}
                                className="w-full rounded-md border-zinc-300 bg-white p-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black shadow-sm resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-200">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !fullShot}
                            className={`w-full py-4 rounded-full flex items-center justify-center gap-3 text-sm font-bold tracking-wide transition-all uppercase ${
                                loading || !fullShot 
                                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                                : 'bg-black text-white hover:bg-zinc-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                            }`}
                        >
                            {loading ? (
                                <>
                                <Loader2 className="animate-spin" size={18} />
                                Processing...
                                </>
                            ) : (
                                <>
                                <UploadCloud size={18} />
                                Generate Concepts
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* Loading Visual */}
        {loading && (
          <div className="max-w-2xl mx-auto mt-20 text-center">
             <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 border-t-2 border-black rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-zinc-300 rounded-full animate-spin-reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={24} className="text-black animate-pulse" />
                </div>
             </div>
             <h3 className="font-serif text-2xl text-zinc-900 mb-2">AI Creative Director is working</h3>
             <p className="text-zinc-500 font-light">Phân tích chất liệu • Thiết kế ánh sáng • Soạn thảo Prompt</p>
          </div>
        )}

        {/* Results Grid */}
        {concepts && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h2 className="font-serif text-3xl font-medium text-zinc-900">Concept Proposals</h2>
                    <p className="text-zinc-500 font-light mt-1">3 Unique directions tailored for your product</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {concepts.map((concept, index) => (
                 <ConceptCard key={index} concept={concept} index={index} />
               ))}
             </div>
          </div>
        )}

      </main>
    </div>
  );
}