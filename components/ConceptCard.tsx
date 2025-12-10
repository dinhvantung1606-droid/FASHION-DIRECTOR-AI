import React, { useState } from 'react';
import { Copy, Camera, MapPin, Target, Sparkles, UserCheck, Aperture, Loader2, Image as ImageIcon, Eye, Download, X, ChevronRight, Palette, Layers } from 'lucide-react';
import { Concept } from '../types';
import { generateImage } from '../services/geminiService';

interface ConceptCardProps {
  concept: Concept;
  index: number;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ concept, index }) => {
  const [generatingImages, setGeneratingImages] = useState<{ [key: number]: boolean }>({});
  const [generatedImages, setGeneratedImages] = useState<{ [key: number]: string }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: string }>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleGenerateImage = async (poseIndex: number, prompt: string) => {
    setGeneratingImages(prev => ({ ...prev, [poseIndex]: true }));
    setImageErrors(prev => ({ ...prev, [poseIndex]: '' }));
    
    try {
        const imageUrl = await generateImage(prompt);
        setGeneratedImages(prev => ({ ...prev, [poseIndex]: imageUrl }));
    } catch (err) {
        setImageErrors(prev => ({ ...prev, [poseIndex]: 'Không thể tạo ảnh. Vui lòng thử lại.' }));
    } finally {
        setGeneratingImages(prev => ({ ...prev, [poseIndex]: false }));
    }
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white rounded-none md:rounded-lg overflow-hidden border border-zinc-200 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        
        {/* Artistic Header */}
        <div className="bg-zinc-900 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase border border-white/30 px-2 py-1 rounded-sm">
                  Option 0{index + 1}
                </span>
             </div>
             <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-wide leading-tight text-white/95">
                {concept.conceptName}
             </h3>
          </div>
        </div>

        {/* Dashboard Grid - Creative Brief */}
        <div className="grid grid-cols-1 divide-y divide-zinc-100 border-b border-zinc-100">
          
          {/* Strategy Section */}
          <div className="p-6">
             <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-zinc-100 rounded-full text-zinc-700">
                    <Target size={14} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Chiến lược bán hàng</h4>
             </div>
             <div className="grid grid-cols-1 gap-3">
                <div className="bg-zinc-50 p-3 rounded-md border border-zinc-100">
                    <span className="block text-[10px] text-zinc-400 uppercase font-semibold mb-1">Cảm xúc chủ đạo</span>
                    <p className="text-sm text-zinc-800 font-medium">{concept.salesGoal.emotionalTrigger}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-50 p-3 rounded-md border border-zinc-100">
                        <span className="block text-[10px] text-zinc-400 uppercase font-semibold mb-1">USP</span>
                        <p className="text-sm text-zinc-800 leading-snug">{concept.salesGoal.usp}</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-md border border-zinc-100">
                        <span className="block text-[10px] text-zinc-400 uppercase font-semibold mb-1">Giá trị</span>
                        <p className="text-sm text-zinc-800 leading-snug">{concept.salesGoal.perceivedValue}</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Atmosphere & Context */}
          <div className="p-6 bg-white">
             <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-zinc-100 rounded-full text-zinc-700">
                    <MapPin size={14} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Không gian & Mood</h4>
             </div>
             
             <div className="space-y-4">
                 <div className="flex items-start gap-4">
                     <div className="w-1/3 shrink-0">
                         <span className="text-xs text-zinc-400 block mb-0.5">Địa điểm</span>
                         <p className="text-sm font-medium text-zinc-900">{concept.context.location}</p>
                     </div>
                     <div className="w-2/3">
                         <span className="text-xs text-zinc-400 block mb-0.5">Ánh sáng</span>
                         <p className="text-sm font-medium text-zinc-900">{concept.context.lighting}</p>
                     </div>
                 </div>
                 
                 <div className="pt-3 border-t border-zinc-100">
                    <div className="flex items-start gap-2">
                        <Palette size={14} className="mt-0.5 text-zinc-400" />
                        <div>
                            <span className="text-xs text-zinc-400 block mb-0.5">Vibe & Màu sắc</span>
                            <p className="text-sm text-zinc-800">{concept.context.colorPalette} • <span className="italic">{concept.context.vibe}</span></p>
                        </div>
                    </div>
                 </div>
             </div>
          </div>

          {/* Styling */}
          <div className="p-6 bg-zinc-50/50">
             <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white border border-zinc-200 rounded-full text-zinc-700">
                    <UserCheck size={14} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Styling & Makeup</h4>
             </div>
             <p className="text-sm text-zinc-700 leading-relaxed font-serif italic border-l-2 border-zinc-300 pl-4 py-1">
                "{concept.style.makeupAndHair}"
             </p>
          </div>
        </div>

        {/* Shot List (Poses) */}
        <div className="p-6 bg-white flex-grow">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-zinc-900 text-white rounded-full">
                    <Camera size={14} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Shot List (5 Poses)</h4>
             </div>
             <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-1 rounded">Scroll to view</span>
          </div>

          <div className="space-y-6">
            {concept.poses.map((pose, idx) => (
              <div key={idx} className="group relative pl-4 border-l border-zinc-200 hover:border-zinc-900 transition-colors duration-300">
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-200 border-2 border-white group-hover:bg-zinc-900 transition-colors" />
                
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Shot 0{idx + 1}</span>
                            <p className="text-sm text-zinc-800 font-medium leading-snug">{pose.description}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-1 items-start">
                        {/* Prompt Box */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-zinc-900 rounded-md overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800 border-b border-zinc-700">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="ml-2 text-[10px] text-zinc-400 font-mono">prompt.json</span>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(pose.aiPrompt)}
                                        className="text-zinc-400 hover:text-white transition-colors p-1"
                                        title="Copy JSON"
                                    >
                                        <Copy size={12} />
                                    </button>
                                </div>
                                <div className="p-3 overflow-x-auto custom-scrollbar">
                                    <pre className="text-[10px] font-mono text-zinc-300 whitespace-pre-wrap leading-tight max-h-[100px] overflow-y-auto custom-scrollbar opacity-80 hover:opacity-100 transition-opacity">
                                        {pose.aiPrompt}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Image Preview / Button */}
                        <div className="w-24 shrink-0 flex flex-col justify-start">
                             {generatedImages[idx] ? (
                                <div 
                                    className="relative w-full aspect-[3/4] rounded-md overflow-hidden border border-zinc-200 cursor-zoom-in group/img shadow-sm"
                                    onClick={() => setPreviewImage(generatedImages[idx])}
                                >
                                    <img 
                                        src={generatedImages[idx]} 
                                        alt={`Pose ${idx + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <Eye size={16} className="text-white drop-shadow-md" />
                                    </div>
                                </div>
                             ) : (
                                <button
                                    onClick={() => handleGenerateImage(idx, pose.aiPrompt)}
                                    disabled={generatingImages[idx]}
                                    className="w-full aspect-[3/4] bg-zinc-50 border border-dashed border-zinc-300 rounded-md flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                                >
                                    {generatingImages[idx] ? (
                                        <Loader2 size={16} className="animate-spin text-zinc-800" />
                                    ) : (
                                        <>
                                            <ImageIcon size={18} strokeWidth={1.5} />
                                            <span className="text-[9px] font-medium uppercase text-center leading-none">Visualize</span>
                                        </>
                                    )}
                                </button>
                             )}
                        </div>
                    </div>
                    {imageErrors[idx] && <span className="text-[10px] text-red-500">{imageErrors[idx]}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Prompt Footer */}
        <div className="bg-zinc-50 border-t border-zinc-200 p-4">
            <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-zinc-500 hover:text-zinc-900 transition-colors">
                    <div className="flex items-center gap-2">
                        <Layers size={14} />
                        <span className="text-xs font-semibold uppercase tracking-wider">Master Prompt (JSON)</span>
                    </div>
                    <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-3 bg-white border border-zinc-200 rounded p-3">
                    <div className="flex justify-end mb-2">
                        <button 
                          onClick={() => copyToClipboard(concept.finalAiPrompt)}
                          className="flex items-center gap-1 text-[10px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2 py-1 rounded transition-colors"
                        >
                          <Copy size={10} /> Copy All
                        </button>
                    </div>
                    <pre className="text-[10px] font-mono text-zinc-600 whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                        {concept.finalAiPrompt}
                    </pre>
                </div>
            </details>
        </div>
      </div>

      {/* Full Screen Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-zinc-900/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
            onClick={() => setPreviewImage(null)}
          >
            <X size={32} strokeWidth={1} />
          </button>
          
          <div 
            className="relative w-full max-w-4xl max-h-full flex flex-col items-center gap-6"
            onClick={e => e.stopPropagation()}
          >
             <div className="relative bg-black shadow-2xl overflow-hidden rounded-sm ring-1 ring-white/10">
               <img 
                 src={previewImage} 
                 alt="Full Preview" 
                 className="max-h-[80vh] w-auto object-contain"
               />
             </div>
             
             <div className="flex gap-4">
                 <button
                    onClick={() => handleDownload(previewImage, `concept-preview.png`)}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors shadow-lg text-sm tracking-wide"
                 >
                    <Download size={18} /> Download High-Res
                 </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};