import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import { Sparkles, ArrowRight, Zap, Globe, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden grid-bg">
      <ParticleBackground />

      {/* Navbar */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
             O
           </div>
           <span className="font-bold text-xl tracking-tight">OmniSlide</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium backdrop-blur-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          
          <div className="inline-flex items-center space-x-2 bg-blue-900/10 border border-blue-500/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-blue-300 tracking-wide uppercase">Powered by Vertex AI</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
            Tell your story <br/>
            <span className="gradient-text">Instantaneously.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The Gamma Killer running on Google Cloud. Transform documents into stunning, fluid presentations in seconds using Deep Context understanding.
          </p>

          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center space-x-2">
                <span>Start Building Free</span>
                <ArrowRight size={20} />
              </span>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <FeatureCard 
            icon={<Zap className="text-yellow-400" />}
            title="Liquid Canvas"
            desc="No more pagination. Edit in a fluid, infinite vertical stream designed for modern storytelling."
          />
          <FeatureCard 
            icon={<Globe className="text-blue-400" />}
            title="Deep Context"
            desc="Upload PDFs or Docs. Our RAG engine understands your entire knowledge base before writing a single slide."
          />
          <FeatureCard 
            icon={<Shield className="text-green-400" />}
            title="Enterprise Secure"
            desc="Built on Google Cloud Run. Your data is encrypted, isolated, and never used to train public models."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-600">
            &copy; 2024 OmniSlide. Built with Vertex AI, React, and Google Cloud Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="glass-panel p-8 rounded-2xl hover:translate-y-[-5px] transition-transform duration-300 border border-white/5 group">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-200">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">
      {desc}
    </p>
  </div>
);

export default LandingPage;
