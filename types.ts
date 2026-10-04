
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  links?: { title: string; url: string }[];
  isThinking?: boolean;
}

export interface ExamInfo {
  title: string;
  description: string;
  icon: string;
}
