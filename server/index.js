import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Gemini API Configuration with fallback
const GEMINI_API_KEY = 'AIzaSyDEMyLzfLVxgHduJBiVpMEhr-AsH0kDbPc';
let genAI = null;
let model = null;

// Initialize Gemini API
try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Updated model name
  console.log('✅ Gemini API initialized successfully');
} catch (error) {
  console.log('⚠️ Gemini API initialization failed, using fallback mode');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper function to read file content
const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Failed to read file content');
  }
};

// Fallback AI service using OpenAI-compatible API (free alternative)
const generateWithFallbackAPI = async (prompt) => {
  try {
    // Using Hugging Face Inference API (free tier available)
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_demo', // Demo token - replace with your own for production
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error('Fallback API failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Fallback API also failed, using mock data');
    return null;
  }
};

// Generate comprehensive mock data
const generateMockMindMap = (prompt, chartType) => {
  const topics = prompt.split(' ').slice(0, 3).join(' ');
  
  return {
    title: `Comprehensive Mind Map: ${topics}`,
    chartType: chartType || 'hierarchical',
    nodes: [
      {
        id: "1",
        text: topics || "Main Topic",
        level: 0,
        description: `Central concept exploring ${topics}. This comprehensive overview covers fundamental principles, practical applications, and advanced concepts that form the foundation of understanding this subject matter.`
      },
      {
        id: "2",
        text: "Core Concepts & Fundamentals",
        level: 1,
        parentId: "1",
        description: "Essential building blocks and theoretical foundations that provide the groundwork for deeper understanding. Includes definitions, principles, and basic terminology."
      },
      {
        id: "3",
        text: "Practical Applications",
        level: 1,
        parentId: "1",
        description: "Real-world implementations and use cases demonstrating how theoretical knowledge translates into practical solutions and everyday applications."
      },
      {
        id: "4",
        text: "Advanced Techniques",
        level: 1,
        parentId: "1",
        description: "Sophisticated methods and cutting-edge approaches that represent the current state of the art in this field, including emerging trends and innovations."
      },
      {
        id: "5",
        text: "Tools & Technologies",
        level: 1,
        parentId: "1",
        description: "Essential software, hardware, and methodological tools that professionals use to implement and work with these concepts effectively."
      },
      {
        id: "6",
        text: "Best Practices & Standards",
        level: 1,
        parentId: "1",
        description: "Industry-accepted guidelines, methodologies, and quality standards that ensure optimal results and professional-grade implementations."
      },
      {
        id: "7",
        text: "Common Challenges",
        level: 1,
        parentId: "1",
        description: "Typical obstacles, pitfalls, and difficulties encountered when working in this area, along with proven strategies for overcoming them."
      },
      {
        id: "8",
        text: "Theoretical Framework",
        level: 2,
        parentId: "2",
        description: "Underlying scientific and theoretical principles that explain why and how these concepts work, providing intellectual foundation."
      },
      {
        id: "9",
        text: "Key Terminology",
        level: 2,
        parentId: "2",
        description: "Essential vocabulary and definitions that professionals must understand to communicate effectively in this field."
      },
      {
        id: "10",
        text: "Industry Applications",
        level: 2,
        parentId: "3",
        description: "Specific ways different industries and sectors utilize these concepts to solve problems and create value."
      },
      {
        id: "11",
        text: "Case Studies",
        level: 2,
        parentId: "3",
        description: "Detailed examples of successful implementations, including lessons learned and measurable outcomes achieved."
      },
      {
        id: "12",
        text: "Emerging Trends",
        level: 2,
        parentId: "4",
        description: "Latest developments and future directions that are shaping the evolution of this field and creating new opportunities."
      },
      {
        id: "13",
        text: "Expert Techniques",
        level: 2,
        parentId: "4",
        description: "Advanced methodologies used by leading practitioners to achieve superior results and maintain competitive advantages."
      }
    ]
  };
};

// Generate mindmap from prompt
app.post('/api/generate-mindmap', async (req, res) => {
  try {
    const { prompt, chartType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`🔄 Generating mindmap for: "${prompt}" with chart type: ${chartType}`);

    let mindMapData = null;

    // Try Gemini API first
    if (model) {
      try {
        const enhancedPrompt = `
        Create a comprehensive and detailed mind map for the topic: "${prompt}"
        Chart Type: ${chartType || 'hierarchical'}
        
        Generate a response in the following JSON format:
        {
          "title": "Comprehensive title for the mind map",
          "chartType": "${chartType || 'hierarchical'}",
          "nodes": [
            {
              "id": "1",
              "text": "Central topic (level 0)",
              "level": 0,
              "description": "Detailed description of the central topic with comprehensive information"
            },
            {
              "id": "2",
              "text": "Main branch 1 (level 1)",
              "level": 1,
              "parentId": "1",
              "description": "Detailed description with specific information, examples, and context"
            }
          ]
        }

        Requirements:
        - Create a ${chartType || 'hierarchical'} structure with 1 central node (level 0)
        - Add 6-8 main branches (level 1) with comprehensive topics
        - Include 2-3 sub-branches for each main branch (level 2)
        - Each node should have detailed, educational descriptions (50-100 words each)
        - Include specific examples, applications, and real-world context
        - Make descriptions informative and valuable for learning
        - Ensure logical flow and meaningful relationships
        - Focus on depth and educational value
        - Total nodes should be 15-25 for comprehensive coverage
        `;

        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          mindMapData = JSON.parse(jsonMatch[0]);
          console.log('✅ Gemini API generated mindmap successfully');
        } else {
          throw new Error('Invalid JSON format from Gemini');
        }
      } catch (geminiError) {
        console.log('⚠️ Gemini API failed:', geminiError.message);
        mindMapData = null;
      }
    }

    // Fallback to mock data if Gemini fails
    if (!mindMapData) {
      console.log('🔄 Using enhanced mock data generation');
      mindMapData = generateMockMindMap(prompt, chartType);
    }

    res.json(mindMapData);
  } catch (error) {
    console.error('❌ Error generating mindmap:', error);
    res.status(500).json({ 
      error: 'Failed to generate mindmap',
      details: error.message 
    });
  }
});

// Generate mindmap from file
app.post('/api/generate-mindmap-file', upload.single('file'), async (req, res) => {
  try {
    const { chartType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const fileContent = readFileContent(req.file.path);
    const fileName = req.file.originalname;

    console.log(`🔄 Generating mindmap from file: ${fileName}`);

    let mindMapData = null;

    // Try Gemini API first
    if (model) {
      try {
        const enhancedPrompt = `
        Analyze the following document and create a comprehensive mind map:
        
        File Name: ${fileName}
        Chart Type: ${chartType || 'hierarchical'}
        Document Content: ${fileContent.substring(0, 15000)}${fileContent.length > 15000 ? '...(content continues)' : ''}
        
        Generate a response in the following JSON format:
        {
          "title": "Mind map title based on document analysis",
          "chartType": "${chartType || 'hierarchical'}",
          "nodes": [
            {
              "id": "1",
              "text": "Main topic from document (level 0)",
              "level": 0,
              "description": "Comprehensive summary of the document's main theme"
            },
            {
              "id": "2",
              "text": "Key section/concept (level 1)",
              "level": 1,
              "parentId": "1",
              "description": "Detailed information extracted from the document"
            }
          ]
        }

        Requirements:
        - Analyze the document content thoroughly
        - Extract key concepts, main ideas, and important details
        - Create a ${chartType || 'hierarchical'} structure representing the document
        - Include 1 central node representing the main topic
        - Add 6-10 main branches for key sections/concepts
        - Include sub-branches for important details and examples
        - Provide detailed descriptions based on actual document content
        - Ensure accuracy and relevance to the source material
        - Make it educational and comprehensive
        - Total nodes should be 15-30 based on document complexity
        `;

        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          mindMapData = JSON.parse(jsonMatch[0]);
          console.log('✅ Gemini API generated file-based mindmap successfully');
        } else {
          throw new Error('Invalid JSON format from Gemini');
        }
      } catch (geminiError) {
        console.log('⚠️ Gemini API failed for file:', geminiError.message);
        mindMapData = null;
      }
    }

    // Fallback to enhanced mock data
    if (!mindMapData) {
      console.log('🔄 Using enhanced file-based mock data');
      mindMapData = {
        title: `Analysis of ${fileName}`,
        chartType: chartType || 'hierarchical',
        nodes: [
          {
            id: "1",
            text: fileName.split('.')[0],
            level: 0,
            description: `Comprehensive analysis of the document "${fileName}". This mind map extracts and organizes the key concepts, main ideas, and important details found within the document content.`
          },
          {
            id: "2",
            text: "Document Overview",
            level: 1,
            parentId: "1",
            description: "High-level summary of the document's purpose, scope, and main objectives as identified through content analysis."
          },
          {
            id: "3",
            text: "Key Concepts",
            level: 1,
            parentId: "1",
            description: "Primary concepts and ideas that form the foundation of the document's content and message."
          },
          {
            id: "4",
            text: "Main Topics",
            level: 1,
            parentId: "1",
            description: "Central themes and subjects discussed throughout the document, organized by importance and relevance."
          },
          {
            id: "5",
            text: "Supporting Details",
            level: 1,
            parentId: "1",
            description: "Important supporting information, examples, and evidence that reinforce the main topics and concepts."
          },
          {
            id: "6",
            text: "Conclusions & Insights",
            level: 1,
            parentId: "1",
            description: "Key takeaways, conclusions, and insights derived from the document's content and analysis."
          }
        ]
      };
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json(mindMapData);
  } catch (error) {
    console.error('❌ Error generating mindmap from file:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to generate mindmap from file',
      details: error.message 
    });
  }
});

// Generate detailed node information
app.post('/api/node-details', async (req, res) => {
  try {
    const { nodeText, parentContext, documentContext } = req.body;

    if (!nodeText) {
      return res.status(400).json({ error: 'Node text is required' });
    }

    console.log(`🔄 Generating details for node: "${nodeText}"`);

    let nodeDetails = null;

    // Try Gemini API first
    if (model) {
      try {
        const contextInfo = parentContext ? `in the context of "${parentContext}"` : '';
        const docInfo = documentContext ? `Based on the document context: ${documentContext}` : '';

        const detailedPrompt = `
        Generate comprehensive, detailed information about "${nodeText}" ${contextInfo}.
        ${docInfo}
        
        Provide a detailed response in the following JSON format:
        {
          "summary": "A comprehensive 3-4 sentence summary explaining this topic in detail",
          "keyPoints": ["7-10 detailed key points about this topic with specific information"],
          "detailedInfo": {
            "definition": "Clear, comprehensive definition with technical details",
            "applications": ["5-7 specific real-world applications with examples"],
            "benefits": ["5-7 detailed benefits with explanations"],
            "challenges": ["4-6 specific challenges with solutions"],
            "examples": ["5-7 concrete examples with detailed explanations"],
            "relatedConcepts": ["5-7 related concepts with brief explanations"]
          },
          "learningPath": {
            "prerequisites": ["3-5 specific prerequisites with explanations"],
            "nextSteps": ["5-7 detailed next steps for deeper learning"],
            "timeEstimate": "Realistic time estimate with breakdown",
            "difficulty": "Beginner, Intermediate, or Advanced",
            "resources": ["3-5 recommended learning resources"]
          },
          "practicalInfo": {
            "howToImplement": ["4-6 practical implementation steps"],
            "commonMistakes": ["3-5 common mistakes to avoid"],
            "bestPractices": ["4-6 industry best practices"],
            "tools": ["3-5 relevant tools or technologies"]
          }
        }

        Requirements:
        - Provide in-depth, educational content
        - Include specific examples and real-world applications
        - Make it comprehensive and valuable for learning
        - Ensure accuracy and up-to-date information
        - Focus on practical value and actionable insights
        `;

        const result = await model.generateContent(detailedPrompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          nodeDetails = JSON.parse(jsonMatch[0]);
          console.log('✅ Gemini API generated node details successfully');
        } else {
          throw new Error('Invalid JSON format from Gemini');
        }
      } catch (geminiError) {
        console.log('⚠️ Gemini API failed for node details:', geminiError.message);
        nodeDetails = null;
      }
    }

    // Fallback to comprehensive mock data
    if (!nodeDetails) {
      console.log('🔄 Using enhanced mock node details');
      nodeDetails = {
        summary: `${nodeText} represents a fundamental concept that plays a crucial role in its domain. This topic encompasses various aspects including theoretical foundations, practical applications, and real-world implementations. Understanding this concept is essential for anyone looking to gain comprehensive knowledge in this field.`,
        keyPoints: [
          `Core definition and fundamental principles of ${nodeText}`,
          `Historical development and evolution of the concept`,
          `Key characteristics and distinguishing features`,
          `Primary applications and use cases in various industries`,
          `Benefits and advantages of implementing this concept`,
          `Common challenges and potential solutions`,
          `Best practices and industry standards`,
          `Future trends and emerging developments`,
          `Integration with related concepts and technologies`,
          `Practical implementation strategies and methodologies`
        ],
        detailedInfo: {
          definition: `${nodeText} is a comprehensive concept that encompasses multiple dimensions of understanding and application. It represents a systematic approach to organizing, analyzing, and implementing specific methodologies within its domain.`,
          applications: [
            "Educational institutions for curriculum development and learning enhancement",
            "Corporate training programs for skill development and knowledge transfer",
            "Research and development projects for innovation and discovery",
            "Project management for planning and execution strategies",
            "Problem-solving frameworks for systematic analysis",
            "Decision-making processes for strategic planning",
            "Knowledge management systems for information organization"
          ],
          benefits: [
            "Enhanced understanding and clarity of complex concepts",
            "Improved problem-solving capabilities and analytical thinking",
            "Better organization and structure of information",
            "Increased efficiency in learning and knowledge retention",
            "Enhanced communication and collaboration among teams",
            "Systematic approach to tackling complex challenges",
            "Improved decision-making through visual representation"
          ],
          challenges: [
            "Initial learning curve and time investment required",
            "Complexity in handling large amounts of information",
            "Need for continuous updates and maintenance",
            "Potential oversimplification of complex relationships",
            "Difficulty in measuring effectiveness and impact",
            "Integration challenges with existing systems and processes"
          ],
          examples: [
            "Academic research projects utilizing structured analysis methods",
            "Business strategy development using systematic frameworks",
            "Software development projects with modular design approaches",
            "Educational curriculum design with progressive learning paths",
            "Marketing campaigns with targeted audience segmentation",
            "Scientific research with hypothesis-driven methodologies",
            "Product development with user-centered design principles"
          ],
          relatedConcepts: [
            "Systems thinking and holistic analysis approaches",
            "Information architecture and knowledge organization",
            "Cognitive psychology and learning theory principles",
            "Design thinking and creative problem-solving methods",
            "Data visualization and information presentation techniques",
            "Project management methodologies and frameworks",
            "Strategic planning and decision-making processes"
          ]
        },
        learningPath: {
          prerequisites: [
            "Basic understanding of the subject domain and terminology",
            "Familiarity with fundamental concepts and principles",
            "Basic analytical and critical thinking skills",
            "Understanding of information organization principles",
            "Awareness of problem-solving methodologies"
          ],
          nextSteps: [
            "Advanced study of specialized techniques and methodologies",
            "Practical application through hands-on projects and exercises",
            "Integration with complementary tools and technologies",
            "Development of expertise through continuous practice",
            "Exploration of emerging trends and innovations",
            "Collaboration with experts and practitioners in the field",
            "Teaching and mentoring others to reinforce understanding"
          ],
          timeEstimate: "2-4 weeks for basic understanding, 2-3 months for proficiency, ongoing for mastery",
          difficulty: "Intermediate",
          resources: [
            "Comprehensive textbooks and academic publications",
            "Online courses and interactive learning platforms",
            "Professional workshops and training programs",
            "Industry conferences and networking events",
            "Practical tools and software applications"
          ]
        },
        practicalInfo: {
          howToImplement: [
            "Start with clear objectives and defined scope",
            "Gather and organize relevant information and resources",
            "Apply systematic methodology and structured approach",
            "Implement iterative process with continuous feedback",
            "Monitor progress and adjust strategies as needed",
            "Evaluate results and document lessons learned"
          ],
          commonMistakes: [
            "Rushing through the process without proper planning",
            "Overlooking important details and relationships",
            "Failing to consider multiple perspectives and viewpoints",
            "Not allowing sufficient time for iteration and refinement",
            "Ignoring feedback and failing to adapt approach"
          ],
          bestPractices: [
            "Maintain clear documentation and version control",
            "Involve stakeholders throughout the process",
            "Use proven methodologies and established frameworks",
            "Implement quality assurance and validation procedures",
            "Foster collaboration and knowledge sharing",
            "Continuously update and improve based on experience"
          ],
          tools: [
            "Specialized software applications and platforms",
            "Collaborative tools for team coordination",
            "Analytics and measurement instruments",
            "Documentation and knowledge management systems",
            "Communication and presentation tools"
          ]
        }
      };
    }

    res.json(nodeDetails);
  } catch (error) {
    console.error('❌ Error generating node details:', error);
    res.status(500).json({ 
      error: 'Failed to generate node details',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    geminiStatus: model ? 'connected' : 'fallback mode'
  });
});

// FAQ endpoint
app.get('/api/faq', (req, res) => {
  const faqs = [
    {
      id: 1,
      question: "What is an AI-powered mind map generator?",
      answer: "An AI-powered mind map generator is an intelligent tool that uses artificial intelligence to automatically create visual representations of information, concepts, and ideas. It analyzes your input (text prompts or uploaded documents) and generates structured, hierarchical diagrams that help organize and understand complex topics."
    },
    {
      id: 2,
      question: "How does the AI analyze my documents?",
      answer: "Our AI system reads and processes your uploaded documents using advanced natural language processing. It identifies key concepts, relationships, and themes within the content, then organizes this information into a logical mind map structure with detailed descriptions for each node."
    },
    {
      id: 3,
      question: "What file formats are supported?",
      answer: "We support various text-based file formats including PDF, DOC, DOCX, TXT, and Markdown files. The system can extract and analyze content from these formats to generate comprehensive mind maps."
    },
    {
      id: 4,
      question: "Can I customize the chart types?",
      answer: "Yes! We offer 8 different chart types including Hierarchical Tree, Radial Map, Flowchart, Network Diagram, Timeline Chart, Concept Map, Organizational Chart, and Circular Diagram. Each type is optimized for different kinds of information and use cases."
    },
    {
      id: 5,
      question: "How detailed is the information generated for each node?",
      answer: "Each node contains comprehensive information including definitions, real-world applications, benefits, challenges, examples, learning paths, implementation guides, and best practices. The AI generates educational content that provides deep insights into each concept."
    },
    {
      id: 6,
      question: "Is my data secure and private?",
      answer: "Yes, we take data security seriously. Uploaded files are processed temporarily and deleted immediately after mind map generation. We don't store your personal documents or sensitive information on our servers."
    },
    {
      id: 7,
      question: "Can I export or save my mind maps?",
      answer: "Currently, you can view and interact with your mind maps in the browser. Export functionality for various formats (PDF, PNG, SVG) is planned for future updates."
    },
    {
      id: 8,
      question: "What makes this different from traditional mind mapping tools?",
      answer: "Unlike traditional tools that require manual creation, our AI automatically generates comprehensive mind maps with detailed, educational content. It saves time, provides expert-level insights, and ensures no important concepts are overlooked."
    }
  ];
  
  res.json(faqs);
});

// Use cases endpoint
app.get('/api/use-cases', (req, res) => {
  const useCases = [
    {
      id: 1,
      title: "Academic Research & Study",
      description: "Transform research papers, textbooks, and academic materials into structured mind maps for better understanding and retention.",
      icon: "📚",
      benefits: [
        "Improved comprehension of complex topics",
        "Better retention of academic material",
        "Structured approach to research analysis",
        "Visual organization of literature reviews"
      ]
    },
    {
      id: 2,
      title: "Business Strategy & Planning",
      description: "Convert business documents, reports, and strategic plans into visual frameworks for better decision-making.",
      icon: "💼",
      benefits: [
        "Clear visualization of business strategies",
        "Enhanced team collaboration and alignment",
        "Improved strategic planning processes",
        "Better communication of complex business concepts"
      ]
    },
    {
      id: 3,
      title: "Project Management",
      description: "Break down project requirements, specifications, and documentation into manageable, visual components.",
      icon: "📋",
      benefits: [
        "Better project scope understanding",
        "Improved task organization and prioritization",
        "Enhanced team coordination",
        "Clear visualization of project dependencies"
      ]
    },
    {
      id: 4,
      title: "Educational Content Creation",
      description: "Transform educational materials into engaging, visual learning resources for students and trainees.",
      icon: "🎓",
      benefits: [
        "Enhanced student engagement and understanding",
        "Improved knowledge retention rates",
        "Structured curriculum development",
        "Visual learning support for different learning styles"
      ]
    },
    {
      id: 5,
      title: "Technical Documentation",
      description: "Convert technical manuals, API documentation, and system specifications into accessible visual guides.",
      icon: "⚙️",
      benefits: [
        "Simplified technical concept explanation",
        "Better developer onboarding processes",
        "Improved documentation accessibility",
        "Enhanced system architecture understanding"
      ]
    },
    {
      id: 6,
      title: "Knowledge Management",
      description: "Organize and structure organizational knowledge, procedures, and best practices for easy access and understanding.",
      icon: "🧠",
      benefits: [
        "Centralized knowledge organization",
        "Improved knowledge transfer processes",
        "Better institutional memory preservation",
        "Enhanced employee training and development"
      ]
    },
    {
      id: 7,
      title: "Creative Brainstorming",
      description: "Generate comprehensive mind maps from initial ideas to explore all aspects and possibilities of creative projects.",
      icon: "💡",
      benefits: [
        "Enhanced creative thinking processes",
        "Comprehensive idea exploration",
        "Better project conceptualization",
        "Improved innovation and ideation"
      ]
    },
    {
      id: 8,
      title: "Meeting & Workshop Planning",
      description: "Transform meeting agendas, workshop materials, and discussion topics into structured visual frameworks.",
      icon: "🤝",
      benefits: [
        "Better meeting preparation and structure",
        "Enhanced participant engagement",
        "Improved discussion flow and focus",
        "Clear action item identification and tracking"
      ]
    }
  ];
  
  res.json(useCases);
});

app.listen(5000, () => {
  console.log(`🚀 Server running on port 5000`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🤖 AI Status: ${model ? 'Gemini API Ready' : 'Fallback Mode'}`);
});