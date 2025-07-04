import React, { useState, useEffect } from 'react';
import { X, BookOpen, Key, TrendingUp, Users, Loader2, Brain, Clock, Target, Lightbulb, Code, AlertTriangle, CheckCircle, PenTool as Tool } from 'lucide-react';
import { MindMapNode } from '../../types';
import { apiService, NodeDetailsResponse } from '../../services/apiService';

interface EnhancedNodeDetailProps {
  node: MindMapNode;
  isOpen: boolean;
  onClose: () => void;
  parentContext?: string;
  documentContext?: string;
}

const EnhancedNodeDetail: React.FC<EnhancedNodeDetailProps> = ({ 
  node, 
  isOpen, 
  onClose, 
  parentContext,
  documentContext 
}) => {
  const [nodeInfo, setNodeInfo] = useState<NodeDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && node) {
      generateNodeInformation();
    }
  }, [isOpen, node]);

  const generateNodeInformation = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const information = await apiService.getNodeDetails(
        node.text, 
        parentContext, 
        documentContext
      );
      setNodeInfo(information);
    } catch (err) {
      console.error('Error generating node information:', err);
      setError('Failed to generate detailed information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900/30 border-green-500';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      case 'Advanced': return 'text-red-400 bg-red-900/30 border-red-500';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-cyan-500/30">
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-blue-900 border-b border-cyan-500/30 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{node.text}</h2>
                <p className="text-cyan-300 mt-1">AI-Generated Comprehensive Analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-6">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-cyan-400 mx-auto" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-400/20 rounded-full mx-auto"></div>
                </div>
                <div>
                  <p className="text-white text-xl font-semibold">Generating AI Analysis...</p>
                  <p className="text-cyan-300 mt-2">Creating comprehensive information about "{node.text}"</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-red-400 font-semibold text-lg">Error</h3>
              </div>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={generateNodeInformation}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium"
              >
                Try Again
              </button>
            </div>
          ) : nodeInfo ? (
            <div className="space-y-8">
              {/* Summary Section */}
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 border border-blue-500/30">
                <div className="flex items-center space-x-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <h3 className="font-bold text-blue-300 text-xl">Executive Summary</h3>
                </div>
                <p className="text-blue-100 leading-relaxed text-lg">{nodeInfo.summary}</p>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-gray-300">Difficulty</span>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getDifficultyColor(nodeInfo.learningPath.difficulty)}`}>
                    {nodeInfo.learningPath.difficulty}
                  </span>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-gray-300">Time Estimate</span>
                  </div>
                  <p className="text-white font-medium">{nodeInfo.learningPath.timeEstimate}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Lightbulb className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-gray-300">Level</span>
                  </div>
                  <p className="text-white font-medium">Level {node.level}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Key className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-gray-300">Key Points</span>
                  </div>
                  <p className="text-white font-medium">{nodeInfo.keyPoints.length} Points</p>
                </div>
              </div>

              {/* Key Points Section */}
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-8 border border-green-500/30">
                <div className="flex items-center space-x-3 mb-6">
                  <Key className="w-6 h-6 text-green-400" />
                  <h3 className="font-bold text-green-300 text-xl">Key Points</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nodeInfo.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-green-900/20 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-green-100">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Definition */}
                <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-500/30">
                  <h4 className="font-bold text-blue-300 mb-4 text-lg">Definition & Overview</h4>
                  <p className="text-blue-100 leading-relaxed">{nodeInfo.detailedInfo.definition}</p>
                </div>

                {/* Applications */}
                <div className="bg-green-900/30 rounded-xl p-6 border border-green-500/30">
                  <h4 className="font-bold text-green-300 mb-4 text-lg">Real-World Applications</h4>
                  <ul className="space-y-2">
                    {nodeInfo.detailedInfo.applications.map((app, index) => (
                      <li key={index} className="text-green-100 flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/30">
                  <h4 className="font-bold text-purple-300 mb-4 text-lg">Benefits & Advantages</h4>
                  <ul className="space-y-2">
                    {nodeInfo.detailedInfo.benefits.map((benefit, index) => (
                      <li key={index} className="text-purple-100 flex items-start space-x-2">
                        <TrendingUp className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="bg-orange-900/30 rounded-xl p-6 border border-orange-500/30">
                  <h4 className="font-bold text-orange-300 mb-4 text-lg">Challenges & Solutions</h4>
                  <ul className="space-y-2">
                    {nodeInfo.detailedInfo.challenges.map((challenge, index) => (
                      <li key={index} className="text-orange-100 flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practical Information */}
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/30">
                <h3 className="font-bold text-indigo-300 mb-6 text-xl flex items-center space-x-3">
                  <Code className="w-6 h-6" />
                  <span>Practical Implementation</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-indigo-200 mb-3">How to Implement</h4>
                    <ul className="space-y-2">
                      {nodeInfo.practicalInfo.howToImplement.map((step, index) => (
                        <li key={index} className="text-indigo-100 flex items-start space-x-2">
                          <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-200 mb-3">Best Practices</h4>
                    <ul className="space-y-2">
                      {nodeInfo.practicalInfo.bestPractices.map((practice, index) => (
                        <li key={index} className="text-indigo-100 flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tools and Resources */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-teal-900/30 rounded-xl p-6 border border-teal-500/30">
                  <h4 className="font-bold text-teal-300 mb-4 text-lg flex items-center space-x-2">
                    <Tool className="w-5 h-5" />
                    <span>Recommended Tools</span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {nodeInfo.practicalInfo.tools.map((tool, index) => (
                      <span key={index} className="px-4 py-2 bg-teal-800/50 text-teal-200 rounded-lg text-sm font-medium border border-teal-600/50">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-900/30 rounded-xl p-6 border border-yellow-500/30">
                  <h4 className="font-bold text-yellow-300 mb-4 text-lg">Common Mistakes</h4>
                  <ul className="space-y-2">
                    {nodeInfo.practicalInfo.commonMistakes.map((mistake, index) => (
                      <li key={index} className="text-yellow-100 flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Learning Path */}
              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-8 border border-cyan-500/30">
                <h3 className="font-bold text-cyan-300 mb-6 text-xl">Learning Path</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-3">Prerequisites</h4>
                    <ul className="space-y-2">
                      {nodeInfo.learningPath.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-cyan-100 flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-3">Next Steps</h4>
                    <ul className="space-y-2">
                      {nodeInfo.learningPath.nextSteps.map((step, index) => (
                        <li key={index} className="text-cyan-100 flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-3">Learning Resources</h4>
                    <ul className="space-y-2">
                      {nodeInfo.learningPath.resources.map((resource, index) => (
                        <li key={index} className="text-cyan-100 flex items-start space-x-2">
                          <BookOpen className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                          <span>{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-700">
                <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                  Explore Further
                </button>
                <button className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-6 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all">
                  Add to Favorites
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EnhancedNodeDetail;