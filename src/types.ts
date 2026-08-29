export interface UploadedDocument {
  id: string;
  file: string;
  chunks: number;
  uploadedAt: number;
}

export interface ChatReference {
  doc_id: number;
  source: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  references?: ChatReference[];
  mode?: string;
  selectedDocument?: string;
  timestamp: number;
}

export interface UploadResponse {
  status: string;
  file: string;
  chunks: number;
}

export interface QueryResponse {
  answer: string;
  references: ChatReference[];
  mode: string;
  selected_document: string;
}
