import React, { useState } from 'react';
import { Send, Sparkles, Loader2, Zap } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = "Describe what you want to create a mind map about..."
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const suggestedPrompts = [
    "Create a comprehensive mind map about machine learning algorithms and their applications",
    "Generate a detailed mind map for project management methodologies and best practices",
    "Make a mind map about sustainable energy sources and their environmental impact",
    "Create a mind map for digital marketing strategies and modern techniques",
    "Generate a mind map about human psychology and cognitive behavioral patterns",
    "Make a mind map about blockchain technology and cryptocurrency fundamentals"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/50 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent transition-all">
          <div className="flex items-start space-x-6 p-6">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex-shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className="flex-1 resize-none border-0 focus:ring-0 text-white placeholder-gray-400 bg-transparent min-h-[120px] text-lg leading-relaxed"
              rows={5}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between p-6 border-t border-gray-700/50">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <p className="text-sm text-gray-400">
                Describe your topic in detail for more comprehensive AI analysis
              </p>
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 focus:ring-4 focus:ring-cyan-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="text-lg">{isLoading ? 'Generating...' : 'Generate Mind Map'}</span>
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Suggested AI Prompts:</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedPrompts.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setPrompt(suggestion)}
              className="text-left p-6 bg-gray-800/30 backdrop-blur-sm hover:bg-gray-700/50 rounded-xl transition-all text-gray-300 hover:text-white border border-gray-600/30 hover:border-gray-500/50 group"
              disabled={isLoading}
            >
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0 group-hover:bg-cyan-300 transition-colors"></div>
                <span className="leading-relaxed">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;