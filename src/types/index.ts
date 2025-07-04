export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  level: number;
  parentId?: string;
  children?: string[];
  color?: string;
  description?: string;
}

export interface MindMap {
  id: string;
  title: string;
  nodes: MindMapNode[];
  template: 'hierarchical' | 'radial' | 'flowchart' | 'network';
  createdAt: string;
  userId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}