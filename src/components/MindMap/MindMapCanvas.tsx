import React, { useState, useRef, useEffect } from 'react';
import { MindMap, MindMapNode } from '../../types';
import { ZoomIn, ZoomOut, Download, Maximize2, Info } from 'lucide-react';
import EnhancedNodeDetail from './EnhancedNodeDetail';

interface MindMapCanvasProps {
  mindMap: MindMap;
  onNodeClick?: (node: MindMapNode) => void;
}

const MindMapCanvas: React.FC<MindMapCanvasProps> = ({ mindMap, onNodeClick }) => {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [showNodeDetail, setShowNodeDetail] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (node: MindMapNode) => {
    setSelectedNode(node);
    setShowNodeDetail(true);
    onNodeClick?.(node);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  const getParentContext = (node: MindMapNode): string | undefined => {
    if (node.parentId) {
      const parent = mindMap.nodes.find(n => n.id === node.parentId);
      return parent?.text;
    }
    return undefined;
  };

  const renderHierarchicalMap = () => {
    const centerNode = mindMap.nodes.find(node => node.level === 0);
    if (!centerNode) return null;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Center Node */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: '50%', top: '50%' }}
          onClick={() => handleNodeClick(centerNode)}
        >
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-8 py-6 rounded-2xl shadow-2xl group-hover:shadow-cyan-500/50 transition-all group-hover:scale-105 relative border border-cyan-400/50">
            <h3 className="font-bold text-xl">{centerNode.text}</h3>
            {centerNode.description && (
              <p className="text-cyan-100 text-sm mt-2 max-w-xs">{centerNode.description}</p>
            )}
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <Info className="w-4 h-4 text-cyan-600" />
            </div>
          </div>
        </div>

        {/* Level 1 Nodes */}
        {mindMap.nodes.filter(node => node.level === 1).map((node, index) => {
          const angle = (index * 2 * Math.PI) / mindMap.nodes.filter(n => n.level === 1).length;
          const radius = 250;
          const x = 50 + (radius * Math.cos(angle)) / 8;
          const y = 50 + (radius * Math.sin(angle)) / 8;

          return (
            <div key={node.id}>
              {/* Connection Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f5ff" />
                    <stop offset="100%" stopColor="#0066ff" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Node */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => handleNodeClick(node)}
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-400/50 px-6 py-4 rounded-xl shadow-xl group-hover:shadow-cyan-400/50 transition-all group-hover:scale-105 group-hover:border-cyan-400 relative max-w-56 backdrop-blur-sm">
                  <p className="font-semibold text-white text-sm">{node.text}</p>
                  {node.description && (
                    <p className="text-cyan-200 text-xs mt-2 line-clamp-2">{node.description}</p>
                  )}
                  <div className="absolute -top-1 -right-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Info className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Level 2 Nodes */}
        {mindMap.nodes.filter(node => node.level === 2).map((node, index) => {
          const parent = mindMap.nodes.find(n => n.id === node.parentId);
          if (!parent) return null;

          const parentIndex = mindMap.nodes.filter(n => n.level === 1).findIndex(n => n.id === parent.id);
          const parentAngle = (parentIndex * 2 * Math.PI) / mindMap.nodes.filter(n => n.level === 1).length;
          const parentRadius = 250;
          const parentX = 50 + (parentRadius * Math.cos(parentAngle)) / 8;
          const parentY = 50 + (parentRadius * Math.sin(parentAngle)) / 8;

          const childrenOfParent = mindMap.nodes.filter(n => n.parentId === parent.id);
          const childIndex = childrenOfParent.findIndex(n => n.id === node.id);
          const childAngle = parentAngle + (childIndex - (childrenOfParent.length - 1) / 2) * 0.6;
          const childRadius = 140;
          const x = parentX + (childRadius * Math.cos(childAngle)) / 8;
          const y = parentY + (childRadius * Math.sin(childAngle)) / 8;

          return (
            <div key={node.id}>
              {/* Connection Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1={`${parentX}%`}
                  y1={`${parentY}%`}
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke="url(#gradient2)"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f5ff" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Node */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => handleNodeClick(node)}
              >
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 border border-purple-400/50 px-4 py-3 rounded-lg shadow-lg group-hover:shadow-purple-400/50 transition-all group-hover:scale-105 group-hover:border-purple-400 relative max-w-44 backdrop-blur-sm">
                  <p className="font-medium text-white text-xs">{node.text}</p>
                  {node.description && (
                    <p className="text-purple-200 text-xs mt-1 line-clamp-1">{node.description}</p>
                  )}
                  <div className="absolute -top-1 -right-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMindMap = () => {
    // For now, we'll use the hierarchical layout for all chart types
    // In a full implementation, you would create different rendering functions for each chart type
    return renderHierarchicalMap();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden">
      {/* Controls */}
      <div className="absolute top-6 right-6 z-10 flex space-x-3">
        <button
          onClick={handleZoomOut}
          className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white">
          <Download className="w-5 h-5" />
        </button>
        <button className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-6 left-6 z-10 bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-600/50 max-w-sm">
        <p className="text-sm text-cyan-300 flex items-center space-x-2">
          <Info className="w-4 h-4" />
          <span>Click on any node for AI-generated detailed information and analysis</span>
        </p>
      </div>

      {/* Mind Map Content */}
      <div
        ref={canvasRef}
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{ transform: `scale(${zoom})` }}
      >
        {renderMindMap()}
      </div>

      {/* Node Detail Modal */}
      {showNodeDetail && selectedNode && (
        <EnhancedNodeDetail
          node={selectedNode}
          isOpen={showNodeDetail}
          onClose={() => setShowNodeDetail(false)}
          parentContext={getParentContext(selectedNode)}
          documentContext={mindMap.title}
        />
      )}
    </div>
  );
};

export default MindMapCanvas;