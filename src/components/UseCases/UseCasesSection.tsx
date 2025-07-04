import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/apiService';

interface UseCase {
  id: number;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

const UseCasesSection: React.FC = () => {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUseCases();
  }, []);

  const loadUseCases = async () => {
    try {
      const useCaseData = await apiService.getUseCases();
      setUseCases(useCaseData);
    } catch (error) {
      console.error('Error loading use cases:', error);
      // Fallback use case data
      setUseCases([
        {
          id: 1,
          title: "Academic Research & Study",
          description: "Transform research papers and academic materials into structured mind maps.",
          icon: "📚",
          benefits: ["Improved comprehension", "Better retention", "Structured analysis"]
        },
        {
          id: 2,
          title: "Business Strategy & Planning",
          description: "Convert business documents into visual frameworks for decision-making.",
          icon: "💼",
          benefits: ["Clear visualization", "Enhanced collaboration", "Improved planning"]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 rounded-full border-t-transparent mx-auto"></div>
        <p className="text-cyan-300 mt-4">Loading use cases...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
          <Target className="w-6 h-6 text-green-400" />
          <span className="text-green-300 font-semibold">Use Cases & Applications</span>
        </div>
        <h2 className="text-4xl font-bold text-white">
          Powerful Applications for Every Need
        </h2>
        <p className="text-blue-200 text-lg max-w-3xl mx-auto">
          Discover how our AI-powered mind mapping tool can transform your workflow across various domains and industries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {useCases.map((useCase) => (
          <div
            key={useCase.id}
            className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4 filter drop-shadow-lg">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {useCase.title}
                </h3>
              </div>

              <p className="text-blue-200 leading-relaxed text-center">
                {useCase.description}
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold text-cyan-300 text-sm uppercase tracking-wide">
                  Key Benefits:
                </h4>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-700/50">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all group-hover:from-cyan-600 group-hover:to-blue-600">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-12">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-12 border border-blue-500/30">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals, students, and researchers who are already using our AI-powered mind mapping tool to organize their thoughts and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg text-lg">
              Start Creating Mind Maps
            </button>
            <button className="px-8 py-4 bg-gray-800/50 text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-all border border-gray-600/50 text-lg">
              View Examples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCasesSection;