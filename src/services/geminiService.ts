import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }
  }

  async generateNodeInformation(nodeText: string, parentContext?: string): Promise<{
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
  }> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.');
    }

    const contextPrompt = parentContext ? `in the context of "${parentContext}"` : '';
    
    const prompt = `
    Generate comprehensive information about "${nodeText}" ${contextPrompt}. 
    
    Please provide a detailed response in the following JSON format:
    {
      "summary": "A comprehensive 2-3 sentence summary explaining what this topic is about",
      "keyPoints": ["5-7 key points about this topic as an array of strings"],
      "detailedInfo": {
        "definition": "Clear, detailed definition of the concept",
        "applications": ["3-5 real-world applications or use cases"],
        "benefits": ["3-5 main benefits or advantages"],
        "challenges": ["3-5 common challenges or limitations"],
        "examples": ["3-5 specific examples"],
        "relatedConcepts": ["3-5 related concepts or topics"]
      },
      "learningPath": {
        "prerequisites": ["2-4 things someone should know before learning this"],
        "nextSteps": ["3-5 logical next steps for learning more"],
        "timeEstimate": "Realistic time estimate to understand this topic",
        "difficulty": "Beginner, Intermediate, or Advanced"
      }
    }

    Make sure the response is valid JSON and all information is accurate and educational.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error generating node information:', error);
      throw error;
    }
  }

  async generateMindMapFromPrompt(prompt: string): Promise<{
    title: string;
    nodes: Array<{
      id: string;
      text: string;
      level: number;
      parentId?: string;
      description: string;
    }>;
  }> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.');
    }

    const mindMapPrompt = `
    Create a comprehensive mind map structure for the topic: "${prompt}"
    
    Generate a response in the following JSON format:
    {
      "title": "Main title for the mind map",
      "nodes": [
        {
          "id": "1",
          "text": "Central topic (level 0)",
          "level": 0,
          "description": "Brief description of the central topic"
        },
        {
          "id": "2",
          "text": "Main branch 1 (level 1)",
          "level": 1,
          "parentId": "1",
          "description": "Description of this branch"
        }
      ]
    }

    Create a hierarchical structure with:
    - 1 central node (level 0)
    - 4-6 main branches (level 1)
    - 2-3 sub-branches for each main branch (level 2)
    
    Make sure each node has meaningful, educational content and the structure flows logically.
    Ensure all IDs are unique and parentId references are correct.
    `;

    try {
      const result = await this.model.generateContent(mindMapPrompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error generating mind map from prompt:', error);
      throw error;
    }
  }

  async generateMindMapFromFile(fileContent: string, fileName: string): Promise<{
    title: string;
    nodes: Array<{
      id: string;
      text: string;
      level: number;
      parentId?: string;
      description: string;
    }>;
  }> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.');
    }

    const filePrompt = `
    Analyze the following document content and create a comprehensive mind map structure:
    
    File Name: ${fileName}
    Content: ${fileContent.substring(0, 8000)} ${fileContent.length > 8000 ? '...(truncated)' : ''}
    
    Generate a response in the following JSON format:
    {
      "title": "Mind map title based on the document content",
      "nodes": [
        {
          "id": "1",
          "text": "Main topic from document (level 0)",
          "level": 0,
          "description": "Brief description of the main topic"
        },
        {
          "id": "2",
          "text": "Key section/concept (level 1)",
          "level": 1,
          "parentId": "1",
          "description": "Description based on document content"
        }
      ]
    }

    Create a hierarchical structure that represents the document's content:
    - 1 central node representing the main topic
    - 4-8 main branches representing key sections or concepts
    - Sub-branches for important details, examples, or sub-topics
    
    Base the mind map structure on the actual content of the document.
    Extract key concepts, main ideas, and important details.
    Ensure the structure is logical and educational.
    `;

    try {
      const result = await this.model.generateContent(filePrompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error generating mind map from file:', error);
      throw error;
    }
  }

  async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For other file types, we'll read as text for now
        // In a real implementation, you'd want to use proper parsers for PDF, DOCX, etc.
        reader.readAsText(file);
      }
    });
  }
}

export const geminiService = new GeminiService();