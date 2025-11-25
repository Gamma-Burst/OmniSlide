import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Sparkles, Clock } from 'lucide-react';
import { useProjectStore } from '../store';
import { generatePresentationContent } from '../services/geminiService';
import { Project, GenerationStatus } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addProject, updateProject } = useProjectStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);

  const handleGenerate = async () => {
    if (!topic) return;
    setStatus(GenerationStatus.GENERATING_STRUCTURE);
    
    try {
      // Create project shell immediately
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: topic,
        topic,
        slides: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'generating'
      };
      
      addProject(newProject);
      
      const slides = await generatePresentationContent(topic, context || "General business context");
      
      updateProject(newProject.id, {
        slides,
        status: 'ready'
      });

      navigate(`/project/${newProject.id}`);
      setIsModalOpen(false);
      setStatus(GenerationStatus.IDLE);
      
    } catch (e) {
      console.error(e);
      setStatus(GenerationStatus.ERROR);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#050505]">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Presentations</h1>
          <p className="text-gray-400">Manage your stories and generated decks.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative h-64 border border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all border-dashed hover:border-blue-500/50"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="text-blue-400" size={24} />
          </div>
          <span className="text-gray-300 font-medium">Create New Deck</span>
        </button>

        {projects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => navigate(`/project/${project.id}`)}
            className="group relative h-64 bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer"
          >
            {/* Thumbnail Placeholder */}
            <div className="h-2/3 w-full bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-500 relative">
               <div className="absolute inset-0 flex items-center justify-center opacity-30">
                 <Sparkles className="text-white" size={48} />
               </div>
            </div>
            
            <div className="absolute bottom-0 inset-x-0 p-5 bg-[#0A0A0A]/90 backdrop-blur border-t border-white/5">
              <h3 className="text-white font-medium truncate">{project.title}</h3>
              <div className="flex items-center text-xs text-gray-500 mt-2 space-x-2">
                <Clock size={12} />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>{project.slides.length} slides</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create New Project</h2>
              <p className="text-gray-400">Powered by Gemini 2.5 Deep Context Engine</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Presentation Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Q3 Financial Review"
                  className="w-full bg-black border border-white/20 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Context / Source Material</label>
                <textarea 
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Paste report text, meeting notes, or data analysis here..."
                  className="w-full bg-black border border-white/20 rounded-lg p-4 h-32 text-gray-300 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={status !== GenerationStatus.IDLE || !topic}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white hover:opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === GenerationStatus.GENERATING_STRUCTURE ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Slides</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;