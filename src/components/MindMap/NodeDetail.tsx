import React, { useState, useEffect } from 'react';
import { X, BookOpen, Key, TrendingUp, Users, Loader2, Brain, Clock, Target, Lightbulb } from 'lucide-react';
import { MindMapNode } from '../../types';
import { geminiService } from '../../services/geminiService';

interface NodeDetailProps {
  node: MindMapNode;
  isOpen: boolean;
  onClose: () => void;
  parentContext?: string;
}

interface NodeInformation {
  summary: string;
  keyPoints: string[];
  detailedInfo: {
    definition: string;
    applications: string[];
    benefits: string[];
    challenges: string[];
    examples: string[];
    relatedConcepts: string[];
  };
  learningPath: {
    prerequisites: string[];
    nextSteps: string[];
    timeEstimate: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  };
}

const NodeDetail: React.FC<NodeDetailProps> = ({ node, isOpen, onClose, parentContext }) => {
  const [nodeInfo, setNodeInfo] = useState<NodeInformation | null>(null);
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
      const information = await geminiService.generateNodeInformation(node.text, parentContext);
      setNodeInfo(information);
    } catch (err) {
      console.error('Error generating node information:', err);
      setError('Failed to generate detailed information. Please try again.');
      
      // Fallback to mock data if API fails
      setNodeInfo({
        summary: `This section covers ${node.text.toLowerCase()} and its fundamental concepts. It explores various aspects, applications, and best practices that are essential for understanding this topic comprehensively.`,
        keyPoints: [
          `Understanding the core principles of ${node.text.toLowerCase()}`,
          `Practical applications and real-world examples`,
          `Common challenges and how to overcome them`,
          `Best practices and industry standards`,
          `Future trends and developments`
        ],
        detailedInfo: {
          definition: `${node.text} is a fundamental concept that plays a crucial role in its domain.`,
          applications: [
            'Real-world implementation scenarios',
            'Industry-specific use cases',
            'Academic and research applications'
          ],
          benefits: [
            'Improved understanding and knowledge',
            'Enhanced problem-solving capabilities',
            'Better decision-making skills'
          ],
          challenges: [
            'Initial learning curve',
            'Complexity in implementation',
            'Keeping up with evolving practices'
          ],
          examples: [
            'Practical example 1',
            'Case study demonstration',
            'Real-world scenario'
          ],
          relatedConcepts: [
            'Connected topic 1',
            'Related methodology',
            'Associated framework'
          ]
        },
        learningPath: {
          prerequisites: ['Basic understanding of the domain'],
          nextSteps: ['Advanced concepts', 'Practical implementation'],
          timeEstimate: '2-3 hours',
          difficulty: 'Intermediate'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{node.text}</h2>
                <p className="text-sm text-gray-500">AI-Generated Detailed Information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
                <p className="text-gray-600">Generating detailed information with AI...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={generateNodeInformation}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : nodeInfo ? (
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Summary</h3>
                </div>
                <p className="text-blue-800 leading-relaxed">{nodeInfo.summary}</p>
              </div>

              {/* Learning Path Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Difficulty</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(nodeInfo.learningPath.difficulty)}`}>
                    {nodeInfo.learningPath.difficulty}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Time Estimate</span>
                  </div>
                  <p className="text-gray-700">{nodeInfo.learningPath.timeEstimate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Level</span>
                  </div>
                  <p className="text-gray-700">Level {node.level}</p>
                </div>
              </div>

              {/* Key Points Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Key className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Key Points</h3>
                </div>
                <ul className="space-y-3">
                  {nodeInfo.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Information Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Definition */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Definition</h4>
                  <p className="text-blue-800 text-sm">{nodeInfo.detailedInfo.definition}</p>
                </div>

                {/* Applications */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">Applications</h4>
                  <ul className="space-y-1 text-sm">
                    {nodeInfo.detailedInfo.applications.map((app, index) => (
                      <li key={index} className="text-green-800">• {app}</li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Benefits</h4>
                  <ul className="space-y-1 text-sm">
                    {nodeInfo.detailedInfo.benefits.map((benefit, index) => (
                      <li key={index} className="text-purple-800">• {benefit}</li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-3">Challenges</h4>
                  <ul className="space-y-1 text-sm">
                    {nodeInfo.detailedInfo.challenges.map((challenge, index) => (
                      <li key={index} className="text-orange-800">• {challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Examples and Related Concepts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Examples</h4>
                  <div className="space-y-2">
                    {nodeInfo.detailedInfo.examples.map((example, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-3">
                        <p className="text-gray-800 text-sm">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Related Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {nodeInfo.detailedInfo.relatedConcepts.map((concept, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Path */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-4">Learning Path</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-indigo-800 mb-2">Prerequisites</h4>
                    <ul className="space-y-1 text-sm">
                      {nodeInfo.learningPath.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-indigo-700">• {prereq}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800 mb-2">Next Steps</h4>
                    <ul className="space-y-1 text-sm">
                      {nodeInfo.learningPath.nextSteps.map((step, index) => (
                        <li key={index} className="text-indigo-700">• {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  Explore Further
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all">
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

export default NodeDetail;