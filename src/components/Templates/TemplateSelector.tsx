import React from 'react';
import { Network, GitBranch, Workflow, Layers } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: 'hierarchical' | 'radial' | 'flowchart' | 'network';
  onTemplateSelect: (template: 'hierarchical' | 'radial' | 'flowchart' | 'network') => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect
}) => {
  const templates = [
    {
      id: 'hierarchical' as const,
      name: 'Hierarchical Tree',
      description: 'Traditional tree structure with main topic at center',
      icon: GitBranch,
      preview: '🌳'
    },
    {
      id: 'radial' as const,
      name: 'Radial Map',
      description: 'Central hub with branches radiating outward',
      icon: Network,
      preview: '🎯'
    },
    {
      id: 'flowchart' as const,
      name: 'Flowchart',
      description: 'Linear flow showing process or sequence',
      icon: Workflow,
      preview: '➡️'
    },
    {
      id: 'network' as const,
      name: 'Network Diagram',
      description: 'Interconnected nodes showing relationships',
      icon: Layers,
      preview: '🕸️'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Template</h3>
        <p className="text-gray-600">Select a visualization style that best fits your content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-150'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className="text-2xl">{template.preview}</span>
                </div>

                <div>
                  <h4 className={`font-semibold mb-2 ${
                    isSelected ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {template.name}
                  </h4>
                  <p className={`text-sm ${
                    isSelected ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {template.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;