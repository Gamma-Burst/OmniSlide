import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generatePodcastAudio } from '../services/geminiService';
import AudioPlayer from './AudioPlayer';
import { useProjectStore } from '../store';
import { ArrowLeft, Play, Layout, Image as ImageIcon, Type, Sparkles } from 'lucide-react';

const LiquidEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, updateBlock, updateSlide } = useProjectStore();
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [podcastAudio, setPodcastAudio] = useState<string | null>(null);
  
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 bg-[#050505]">
        Project not found.
        <Link to="/dashboard" className="ml-4 text-blue-500">Go Back</Link>
      </div>
    );
  }

  const handleGeneratePodcast = async () => {
    setGeneratingAudio(true);
    try {
      const audio = await generatePodcastAudio(project.slides);
      setPodcastAudio(audio);
    } catch (e) {
      alert("Failed to generate podcast.");
    } finally {
      setGeneratingAudio(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* Editor Sidebar / Toolbar */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-white/5 bg-[#080808] z-20">
        <Link to="/dashboard" className="mb-8 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        
        <div className="space-y-4 flex flex-col items-center">
          <button className="p-3 rounded-xl bg-white/5 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all" title="Add Text Block">
            <Type size={20} />
          </button>
          <button className="p-3 rounded-xl hover:bg-white/10 text-gray-400 transition-all" title="Add Image">
            <ImageIcon size={20} />
          </button>
          <button className="p-3 rounded-xl hover:bg-white/10 text-gray-400 transition-all" title="Change Layout">
            <Layout size={20} />
          </button>
        </div>

        <div className="mt-auto">
          <button 
            onClick={handleGeneratePodcast}
            disabled={generatingAudio}
            className={`p-3 rounded-xl transition-all ${
              generatingAudio ? 'bg-purple-900/50 text-purple-300' : 'bg-gradient-to-br from-purple-600 to-pink-600 hover:scale-105'
            }`}
            title="Generate Audio Overview"
          >
            {generatingAudio ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
               <Play size={20} fill="currentColor" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur z-10 sticky top-0">
          <div>
            <h1 className="font-medium text-lg truncate max-w-md">{project.topic}</h1>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span>Saved</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 text-xs font-mono border border-blue-500/20 flex items-center space-x-1">
              <Sparkles size={12} />
              <span>Gemini 2.5 Pro</span>
            </div>
          </div>
        </header>

        {/* Liquid Canvas */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-8 md:p-12 pb-32">
          <div className="max-w-4xl mx-auto space-y-16">
            {project.slides.map((slide, sIndex) => (
              <div 
                key={slide.id}
                className="group relative"
              >
                {/* Slide Number */}
                <div className="absolute -left-12 top-0 text-gray-700 font-mono text-sm group-hover:text-blue-500 transition-colors">
                  {(sIndex + 1).toString().padStart(2, '0')}
                </div>

                <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className={`grid gap-8 ${slide.layout === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    
                    {/* Content Column */}
                    <div className="space-y-6">
                      <input
                        className="w-full bg-transparent text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 focus:outline-none placeholder-gray-700"
                        value={slide.title}
                        onChange={(e) => updateSlide(project.id, slide.id, { title: e.target.value })}
                      />

                      <div className="space-y-4">
                        {slide.blocks.map((block) => (
                          <div key={block.id} className="relative group/block">
                            {block.type === 'text' && (
                              <div className="flex items-start space-x-3">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 opacity-50"></span>
                                <textarea
                                  className="w-full bg-transparent text-gray-300 leading-relaxed focus:outline-none focus:text-white resize-none overflow-hidden min-h-[1.5em]"
                                  value={block.content}
                                  onChange={(e) => {
                                    updateBlock(project.id, slide.id, block.id, e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                  }}
                                  onInput={(e: any) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      <div className="pt-6 border-t border-white/5 mt-8">
                        <label className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-2 block">Speaker Notes</label>
                        <textarea
                          className="w-full bg-white/5 rounded-lg p-3 text-sm text-gray-400 focus:text-gray-200 focus:bg-white/10 transition-colors outline-none resize-none"
                          value={slide.notes}
                          onChange={(e) => updateSlide(project.id, slide.id, { notes: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Image Column */}
                    <div className={`${slide.layout === 'hero' ? 'row-start-1 mb-8' : ''}`}>
                       <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group/image">
                         <img 
                           src={`https://picsum.photos/seed/${slide.id}/800/600`}
                           className="w-full h-full object-cover opacity-70 group-hover/image:opacity-100 transition-opacity duration-500"
                           alt="Generated"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity flex items-end p-4">
                            <p className="text-xs text-gray-300 line-clamp-2 font-mono">{slide.imagePrompt}</p>
                         </div>
                         <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-mono text-gray-400 border border-white/10">
                           Imagen 3
                         </div>
                       </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AudioPlayer base64Audio={podcastAudio} />
    </div>
  );
};

export default LiquidEditor;
