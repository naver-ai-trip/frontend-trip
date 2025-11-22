export interface Message {
  id: string;
  role: "user" | "agent";
  type: "text" | "image" | "video" | "timeline" | "plan" | "code" | "mixed" | "places_list";
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface MessageRequest {
  content: string;
  from_role: string;
  message_type: string;
  metadata?: Metadata;
  references?: Reference[];
}

export interface MessageResponse {
  id: number;
  chat_session_id: number;
  from_role: string;
  message_type: string;
  content: string;
  metadata: Metadata | null;
  references: Reference | null;
  created_at: string;
  updated_at: string;
}

interface Reference {
  type?: string;
  id?: number;
}

interface Metadata {
  model?: string;
  confidence?: number;
  next_suggestions?: string[];
  [key: string]: any;
}
