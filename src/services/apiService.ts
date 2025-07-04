import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface MindMapResponse {
  title: string;
  chartType: string;
  nodes: Array<{
    id: string;
    text: string;
    level: number;
    parentId?: string;
    description: string;
  }>;
}

export interface NodeDetailsResponse {
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
    resources: string[];
  };
  practicalInfo: {
    howToImplement: string[];
    commonMistakes: string[];
    bestPractices: string[];
    tools: string[];
  };
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface UseCase {
  id: number;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

class ApiService {
  async generateMindMapFromPrompt(prompt: string, chartType: string): Promise<MindMapResponse> {
    try {
      const response = await api.post('/generate-mindmap', {
        prompt,
        chartType
      });
      return response.data;
    } catch (error) {
      console.error('Error generating mindmap from prompt:', error);
      throw new Error('Failed to generate mindmap from prompt');
    }
  }

  async generateMindMapFromFile(file: File, chartType: string): Promise<MindMapResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chartType', chartType);

      const response = await api.post('/generate-mindmap-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error generating mindmap from file:', error);
      throw new Error('Failed to generate mindmap from file');
    }
  }

  async getNodeDetails(nodeText: string, parentContext?: string, documentContext?: string): Promise<NodeDetailsResponse> {
    try {
      const response = await api.post('/node-details', {
        nodeText,
        parentContext,
        documentContext
      });
      return response.data;
    } catch (error) {
      console.error('Error getting node details:', error);
      throw new Error('Failed to get node details');
    }
  }

  async checkHealth(): Promise<{ status: string; timestamp: string; geminiStatus: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Server health check failed');
    }
  }

  async getFAQs(): Promise<FAQ[]> {
    try {
      const response = await api.get('/faq');
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw new Error('Failed to fetch FAQs');
    }
  }

  async getUseCases(): Promise<UseCase[]> {
    try {
      const response = await api.get('/use-cases');
      return response.data;
    } catch (error) {
      console.error('Error fetching use cases:', error);
      throw new Error('Failed to fetch use cases');
    }
  }
}

export const apiService = new ApiService();