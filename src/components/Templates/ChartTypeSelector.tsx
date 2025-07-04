import React from 'react';
import { Network, GitBranch, Workflow, Layers, BarChart3, PieChart, TrendingUp, Zap } from 'lucide-react';

interface ChartTypeSelectorProps {
  selectedChart: string;
  onChartSelect: (chart: string) => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  selectedChart,
  onChartSelect
}) => {
  const chartTypes = [
    {
      id: 'hierarchical',
      name: 'Hierarchical Tree',
      description: 'Traditional tree structure with main topic at center',
      icon: GitBranch,
      preview: '🌳',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'radial',
      name: 'Radial Map',
      description: 'Central hub with branches radiating outward',
      icon: Network,
      preview: '🎯',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'flowchart',
      name: 'Flowchart',
      description: 'Linear flow showing process or sequence',
      icon: Workflow,
      preview: '➡️',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'network',
      name: 'Network Diagram',
      description: 'Interconnected nodes showing relationships',
      icon: Layers,
      preview: '🕸️',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'timeline',
      name: 'Timeline Chart',
      description: 'Chronological sequence of events or processes',
      icon: TrendingUp,
      preview: '📅',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'concept',
      name: 'Concept Map',
      description: 'Concepts connected with labeled relationships',
      icon: Zap,
      preview: '💡',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'organizational',
      name: 'Organizational Chart',
      description: 'Hierarchical structure for organizations',
      icon: BarChart3,
      preview: '🏢',
      color: 'from-teal-500 to-green-600'
    },
    {
      id: 'circular',
      name: 'Circular Diagram',
      description: 'Circular layout with interconnected elements',
      icon: PieChart,
      preview: '⭕',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Choose Your Chart Type</h3>
        <p className="text-blue-200">Select a visualization style that best represents your content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {chartTypes.map((chart) => {
          const Icon = chart.icon;
          const isSelected = selectedChart === chart.id;

          return (
            <button
              key={chart.id}
              onClick={() => onChartSelect(chart.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-105 glow-effect ${
                isSelected
                  ? 'border-cyan-400 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 shadow-2xl shadow-cyan-500/25'
                  : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-400 backdrop-blur-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${chart.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl filter drop-shadow-lg">{chart.preview}</span>
                </div>

                <div>
                  <h4 className={`font-bold mb-2 text-lg ${
                    isSelected ? 'text-cyan-300' : 'text-white'
                  }`}>
                    {chart.name}
                  </h4>
                  <p className={`text-sm leading-relaxed ${
                    isSelected ? 'text-cyan-200' : 'text-gray-300'
                  }`}>
                    {chart.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${chart.color} blur-xl -z-10`}></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChartTypeSelector;