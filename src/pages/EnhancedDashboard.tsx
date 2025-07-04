import React, { useState, useEffect } from 'react';
import { Plus, FileText, Brain, Upload, Sparkles, AlertCircle, CheckCircle, Wifi, WifiOff, HelpCircle, Target } from 'lucide-react';
import FileUploader from '../components/FileUpload/FileUploader';
import PromptInput from '../components/AIPrompt/PromptInput';
import ChartTypeSelector from '../components/Templates/ChartTypeSelector';
import MindMapCanvas from '../components/MindMap/MindMapCanvas';
import CursorEffects from '../components/Effects/CursorEffects';
import BackgroundParticles from '../components/Effects/BackgroundParticles';
import FAQSection from '../components/FAQ/FAQSection';
import UseCasesSection from '../components/UseCases/UseCasesSection';
import { MindMap, MindMapNode } from '../types';
import { apiService } from '../services/apiService';

const EnhancedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'prompt'>('prompt');
  const [activeSection, setActiveSection] = useState<'create' | 'faq' | 'usecases'>('create');
  const [selectedChart, setSelectedChart] = useState<string>('hierarchical');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMindMap, setGeneratedMindMap] = useState<MindMap | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkServerHealth = async () => {
    try {
      const health = await apiService.checkHealth();
      setServerStatus('connected');
      console.log('Server health:', health);
    } catch (error) {
      setServerStatus('disconnected');
    }
  };

  const handleFileUpload = async (file: File) => {
    setError('');
    setSuccess('');
    setIsGenerating(true);
    
    try {
      const response = await apiService.generateMindMapFromFile(file, selectedChart);
      
      const mindMapNodes: MindMapNode[] = response.nodes.map((node) => ({
        id: node.id,
        text: node.text,
        x: 0,
        y: 0,
        level: node.level,
        parentId: node.parentId,
        description: node.description
      }));

      const mindMap: MindMap = {
        id: Math.random().toString(36).substr(2, 9),
        title: response.title,
        nodes: mindMapNodes,
        template: selectedChart as any,
        createdAt: new Date().toISOString(),
        userId: 'current-user'
      };

      setGeneratedMindMap(mindMap);
      setSuccess(`Successfully generated comprehensive mind map from ${file.name}! Click on any node to explore detailed AI-generated information.`);
    } catch (error) {
      console.error('Error generating mind map from file:', error);
      setError('Failed to generate mind map from file. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    setError('');
    setSuccess('');
    setIsGenerating(true);
    
    try {
      const response = await apiService.generateMindMapFromPrompt(prompt, selectedChart);
      
      const mindMapNodes: MindMapNode[] = response.nodes.map((node) => ({
        id: node.id,
        text: node.text,
        x: 0,
        y: 0,
        level: node.level,
        parentId: node.parentId,
        description: node.description
      }));

      const mindMap: MindMap = {
        id: Math.random().toString(36).substr(2, 9),
        title: response.title,
        nodes: mindMapNodes,
        template: selectedChart as any,
        createdAt: new Date().toISOString(),
        userId: 'current-user'
      };

      setGeneratedMindMap(mindMap);
      setSuccess('Successfully generated comprehensive AI-powered mind map! Click on any node to explore detailed information, examples, and learning paths.');
    } catch (error) {
      console.error('Error generating mind map from prompt:', error);
      setError('Failed to generate mind map from prompt. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNodeClick = (node: MindMapNode) => {
    console.log('Node clicked:', node);
  };

  const resetDashboard = () => {
    setGeneratedMindMap(null);
    setError('');
    setSuccess('');
    setActiveSection('create');
  };

  const renderMainContent = () => {
    if (activeSection === 'faq') {
      return <FAQSection />;
    }

    if (activeSection === 'usecases') {
      return <UseCasesSection />;
    }

    // Create section
    if (!generatedMindMap) {
      return (
        <div className="space-y-10">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 backdrop-blur-sm">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className="text-cyan-300 font-semibold text-lg">AI-Powered Mind Mapping</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Your Mind Map
            </h1>
            <p className="text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into beautiful, interactive mind maps with comprehensive AI-generated information
            </p>
          </div>

          {/* Server Status */}
          <div className="max-w-4xl mx-auto">
            <div className={`flex items-center space-x-3 px-6 py-4 rounded-xl border backdrop-blur-sm ${
              serverStatus === 'connected' 
                ? 'bg-green-900/30 border-green-500/50 text-green-300'
                : serverStatus === 'disconnected'
                ? 'bg-red-900/30 border-red-500/50 text-red-300'
                : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300'
            }`}>
              {serverStatus === 'connected' ? (
                <Wifi className="w-5 h-5" />
              ) : serverStatus === 'disconnected' ? (
                <WifiOff className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              <span className="font-medium">
                {serverStatus === 'connected' 
                  ? 'Connected to AI Server - Full functionality with comprehensive information generation'
                  : serverStatus === 'disconnected'
                  ? 'Disconnected from AI Server - Please check your connection'
                  : 'Checking server connection...'
                }
              </span>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 flex items-start space-x-4 backdrop-blur-sm">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-semibold">Error</p>
                  <p className="text-red-200 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-6 flex items-start space-x-4 backdrop-blur-sm">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-300 font-semibold">Success</p>
                  <p className="text-green-200 mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Creation Mode Tabs */}
          <div className="flex justify-center">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-gray-700/50">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'prompt'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Sparkles className="w-6 h-6" />
                  <span>AI Prompt</span>
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Upload className="w-6 h-6" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chart Type Selection */}
          <ChartTypeSelector
            selectedChart={selectedChart}
            onChartSelect={setSelectedChart}
          />

          {/* Input Section */}
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-10 glow-effect">
            {activeTab === 'prompt' ? (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                    <Brain className="w-6 h-6 text-blue-400" />
                    <span className="text-blue-300 font-semibold">AI-Powered Generation</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    Describe Your Topic
                  </h2>
                  <p className="text-blue-200 text-lg">
                    Tell our advanced AI what you want to create a comprehensive mind map about
                  </p>
                </div>
                <PromptInput
                  onSubmit={handlePromptSubmit}
                  isLoading={isGenerating}
                  placeholder={`Describe your topic for a detailed ${selectedChart} mind map with comprehensive information...`}
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                    <FileText className="w-6 h-6 text-green-400" />
                    <span className="text-green-300 font-semibold">Document Analysis</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    Upload Your Document
                  </h2>
                  <p className="text-green-200 text-lg">
                    Upload a file and our AI will analyze it to create your comprehensive {selectedChart} mind map
                  </p>
                </div>
                <FileUploader onFileSelect={handleFileUpload} />
              </div>
            )}
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-16">
              <div className="inline-flex items-center space-x-4 px-8 py-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
                <div className="relative">
                  <div className="animate-spin w-8 h-8 border-4 border-cyan-500 rounded-full border-t-transparent"></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-cyan-500/20 rounded-full"></div>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-lg">
                    AI is analyzing and generating your comprehensive mind map...
                  </p>
                  <p className="text-cyan-300 text-sm mt-1">
                    Creating {selectedChart} visualization with detailed information, examples, and learning paths
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Mind map display
    return (
      <div className="space-y-8">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">{generatedMindMap.title}</h1>
            <p className="text-blue-200 mt-3 text-lg">
              Interactive {selectedChart} mind map with comprehensive AI-generated information. Click any node to explore detailed content.
            </p>
          </div>
          <button
            onClick={resetDashboard}
            className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create New</span>
          </button>
        </div>

        {/* Mind Map Display */}
        <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 h-[800px] glow-effect">
          <MindMapCanvas
            mindMap={generatedMindMap}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen animated-background relative overflow-hidden">
      <CursorEffects />
      <BackgroundParticles />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-gray-700/50">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveSection('create')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeSection === 'create'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span>Create Mind Map</span>
              </button>
              <button
                onClick={() => setActiveSection('usecases')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeSection === 'usecases'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Target className="w-5 h-5" />
                <span>Use Cases</span>
              </button>
              <button
                onClick={() => setActiveSection('faq')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeSection === 'faq'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span>FAQ</span>
              </button>
            </div>
          </div>
        </div>

        {renderMainContent()}
      </div>
    </div>
  );
};

export default EnhancedDashboard;