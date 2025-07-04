import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from 'lucide-react';
import { apiService } from '../../services/apiService';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const faqData = await apiService.getFAQs();
      setFaqs(faqData);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      // Fallback FAQ data
      setFaqs([
        {
          id: 1,
          question: "What is an AI-powered mind map generator?",
          answer: "An AI-powered mind map generator is an intelligent tool that uses artificial intelligence to automatically create visual representations of information, concepts, and ideas. It analyzes your input and generates structured, hierarchical diagrams."
        },
        {
          id: 2,
          question: "How does the AI analyze my documents?",
          answer: "Our AI system reads and processes your uploaded documents using advanced natural language processing. It identifies key concepts, relationships, and themes within the content."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 rounded-full border-t-transparent mx-auto"></div>
        <p className="text-cyan-300 mt-4">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
          <HelpCircle className="w-6 h-6 text-purple-400" />
          <span className="text-purple-300 font-semibold">Frequently Asked Questions</span>
        </div>
        <h2 className="text-4xl font-bold text-white">
          Everything You Need to Know
        </h2>
        <p className="text-blue-200 text-lg">
          Get answers to common questions about our AI-powered mind mapping tool
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(faq.id)}
              className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white pr-4">
                {faq.question}
              </h3>
              {openItems.has(faq.id) ? (
                <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              )}
            </button>
            
            {openItems.has(faq.id) && (
              <div className="px-6 pb-6">
                <div className="border-t border-gray-700/50 pt-4">
                  <p className="text-blue-200 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-8 border border-cyan-500/30">
          <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Still Have Questions?
          </h3>
          <p className="text-cyan-200 mb-6">
            Our AI-powered mind mapping tool is designed to be intuitive and powerful. 
            Try it out and discover how it can transform your learning and planning process!
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;