import React, { useState } from 'react';
import { Plus, FileText, Brain, Upload, Sparkles, AlertCircle } from 'lucide-react';
import FileUploader from '../components/FileUpload/FileUploader';
import PromptInput from '../components/AIPrompt/PromptInput';
import TemplateSelector from '../components/Templates/TemplateSelector';
import MindMapCanvas from '../components/MindMap/MindMapCanvas';
import { MindMap, MindMapNode } from '../types';
import { geminiService } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'prompt'>('prompt');
  const [selectedTemplate, setSelectedTemplate] = useState<'hierarchical' | 'radial' | 'flowchart' | 'network'>('hierarchical');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMindMap, setGeneratedMindMap] = useState<MindMap | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    console.log('File uploaded:', file.name);
    setError('');
    
    try {
      await generateMindMapFromFile(file);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process the uploaded file. Please try again.');
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    console.log('Prompt submitted:', prompt);
    setError('');
    
    try {
      await generateMindMapFromPrompt(prompt);
    } catch (err) {
      console.error('Error generating from prompt:', err);
      setError('Failed to generate mind map from prompt. Please try again.');
    }
  };

  const generateMindMapFromFile = async (file: File) => {
    setIsGenerating(true);
    
    try {
      // Extract text from file
      const fileContent = await geminiService.extractTextFromFile(file);
      
      // Generate mind map using Gemini API
      const aiResponse = await geminiService.generateMindMapFromFile(fileContent, file.name);
      
      // Convert AI response to our MindMap format
      const mindMapNodes: MindMapNode[] = aiResponse.nodes.map((node, index) => ({
        id: node.id,
        text: node.text,
        x: 0, // Will be positioned by the canvas
        y: 0,
        level: node.level,
        parentId: node.parentId,
        description: node.description
      }));

      const mindMap: MindMap = {
        id: Math.random().toString(36).substr(2, 9),
        title: aiResponse.title,
        nodes: mindMapNodes,
        template: selectedTemplate,
        createdAt: new Date().toISOString(),
        userId: 'current-user'
      };

      setGeneratedMindMap(mindMap);
    } catch (error) {
      console.error('Error generating mind map from file:', error);
      
      // Fallback to mock data if API fails
      const mockNodes: MindMapNode[] = [
        {
          id: '1',
          text: file.name.split('.')[0],
          x: 0,
          y: 0,
          level: 0,
          description: 'Main topic extracted from the uploaded document'
        },
        {
          id: '2',
          text: 'Key Concepts',
          x: -200,
          y: -100,
          level: 1,
          parentId: '1',
          description: 'Important concepts identified in the document'
        },
        {
          id: '3',
          text: 'Main Topics',
          x: 200,
          y: -100,
          level: 1,
          parentId: '1',
          description: 'Primary topics discussed in the content'
        },
        {
          id: '4',
          text: 'Important Details',
          x: -200,
          y: 100,
          level: 1,
          parentId: '1',
          description: 'Significant details and information'
        },
        {
          id: '5',
          text: 'Summary Points',
          x: 200,
          y: 100,
          level: 1,
          parentId: '1',
          description: 'Key summary points from the document'
        }
      ];

      const mockMindMap: MindMap = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Mind Map from ${file.name}`,
        nodes: mockNodes,
        template: selectedTemplate,
        createdAt: new Date().toISOString(),
        userId: 'current-user'
      };

      setGeneratedMindMap(mockMindMap);
      setError('Using fallback generation. For AI-powered analysis, please check your Gemini API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMindMapFromPrompt = async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      // Generate mind map using Gemini API
      const aiResponse = await geminiService.generateMindMapFromPrompt(prompt);
      
      // Convert AI response to our MindMap format
      const mindMapNodes: MindMapNode[] = aiResponse.nodes.map((node, index) => ({
        id: node.id,
        text: node.text,
        x: 0, // Will be positioned by the canvas
        y: 0,
        level: node.level,
        parentId: node.parentId,
        description: node.description
      }));

      const mindMap: MindMap = {
        id: Math.random().toString(36).substr(2, 9),
        title: aiResponse.title,
        nodes: mindMapNodes,
        template: selectedTemplate,
        createdAt: new Date().toISOString(),
        userId: 'current-user'
      };

      setGeneratedMindMap(mindMap);
    } catch (error) {
      console.error('Error generating mind map from prompt:', error);
      
      // Fallback to mock data if API fails
      const mockNodes: MindMapNode[] = [
        {
          id: '1',
          text: prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt,
          x: 0,
          y: 0,
          level: 0,
          description: 'Central topic based on your prompt'
        },
        {
          id: '2',
          text: 'Definition & Overview',
          x: -200,
          y: -100,
          level: 1,
          parentId: '1',
          description: 'Basic definition and overview of the topic'
        },
        {
          id: '3',
          text: 'Key Components',
          x: 200,
          y: -100,
          level: 1,
          parentId: '1',
          description: 'Main components and elements'
        },
        {
          id: '4',
          text: 'Best Practices',
          x: -200,
          y: 100,
          level: 1,
          parentId: '1',
          description: 'Recommended practices and approaches'
        },
        {
          id: '5',
          text: 'Real-world Applications',
          x: 200,
          y: 100,
          level: 1,
          parentId: '1',
          description: 'Practical applications and use cases'
        },
        {
          id: '6',
          text: 'Examples',
          x: 0,
          y: 200,
          level: 1,
          parentId: '1',
          description: 'Concrete examples and case studies'
        }
      ];

      const mockMindMap: MindMap = {
        id: Math.random().toString(36).substr(2, 9),
        title: `AI Generated: ${prompt.substring(0, 30)}...`,
        nodes: mockNodes,
        template: selectedTemplate,
        createdAt: new Date().toISOString(),
        userId: 'current-user'
      };

      setGeneratedMindMap(mockMindMap);
      setError('Using fallback generation. For AI-powered analysis, please check your Gemini API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNodeClick = (node: MindMapNode) => {
    console.log('Node clicked:', node);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!generatedMindMap ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Mind Map
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your ideas into beautiful, interactive mind maps using AI
              </p>
            </div>

            {/* API Key Notice */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">AI-Powered Features</p>
                  <p className="text-blue-700 mt-1">
                    To enable full AI capabilities, add your Gemini API key to the environment variables as <code className="bg-blue-100 px-1 rounded">VITE_GEMINI_API_KEY</code>. 
                    Without it, the app will use fallback mock data.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Creation Mode Tabs */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('prompt')}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === 'prompt'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>AI Prompt</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === 'upload'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />

            {/* Input Section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              {activeTab === 'prompt' ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">AI-Powered Generation</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Describe Your Topic
                    </h2>
                    <p className="text-gray-600">
                      Tell our AI what you want to create a mind map about
                    </p>
                  </div>
                  <PromptInput
                    onSubmit={handlePromptSubmit}
                    isLoading={isGenerating}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">Document Analysis</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Upload Your Document
                    </h2>
                    <p className="text-gray-600">
                      Upload a file and we'll analyze it to create your mind map
                    </p>
                  </div>
                  <FileUploader onFileSelect={handleFileUpload} />
                </div>
              )}
            </div>

            {/* Loading State */}
            {isGenerating && (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-3 px-6 py-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  <span className="text-gray-700 font-medium">
                    AI is analyzing and generating your mind map...
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{generatedMindMap.title}</h1>
                <p className="text-gray-600 mt-2">Interactive mind map with AI-generated detailed information</p>
              </div>
              <button
                onClick={() => {
                  setGeneratedMindMap(null);
                  setError('');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New</span>
              </button>
            </div>

            {/* Mind Map Display */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[700px]">
              <MindMapCanvas
                mindMap={generatedMindMap}
                onNodeClick={handleNodeClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;