import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import AuthModal from './components/Auth/AuthModal';
import EnhancedDashboard from './pages/EnhancedDashboard';
import './styles/cursor-effects.css';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(!user);

  if (isLoading) {
    return (
      <div className="min-h-screen animated-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin w-16 h-16 border-4 border-cyan-500 rounded-full border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/20 rounded-full mx-auto"></div>
          </div>
          <p className="text-cyan-300 text-xl font-semibold">Loading your AI mind mapping experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen animated-background">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-10 max-w-4xl">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 backdrop-blur-sm">
                <span className="text-4xl">🧠</span>
                <span className="text-cyan-300 font-semibold text-lg">AI-Powered</span>
              </div>
              <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                MindMap AI
              </h1>
              <p className="text-2xl text-blue-200 leading-relaxed max-w-3xl mx-auto">
                Transform your ideas into beautiful, interactive mind maps using the power of artificial intelligence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center space-y-4 p-6 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="font-bold text-white text-xl">AI-Powered</h3>
                <p className="text-blue-200">Advanced AI analyzes your content and creates intelligent mind maps with detailed information</p>
              </div>
              <div className="text-center space-y-4 p-6 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl">📁</span>
                </div>
                <h3 className="font-bold text-white text-xl">File Upload</h3>
                <p className="text-blue-200">Upload documents and automatically generate structured mind maps with comprehensive analysis</p>
              </div>
              <div className="text-center space-y-4 p-6 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="font-bold text-white text-xl">Multiple Chart Types</h3>
                <p className="text-blue-200">Choose from various visualization styles including hierarchical, radial, flowchart, and more</p>
              </div>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-bold text-xl hover:from-cyan-700 hover:to-blue-700 focus:ring-4 focus:ring-cyan-200 transition-all shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
            >
              Get Started Free
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-background">
      <Header />
      <EnhancedDashboard />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;