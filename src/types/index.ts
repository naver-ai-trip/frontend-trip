export interface Message {
  id: string;
  role: "user" | "agent";
  type: "text" | "image" | "video" | "timeline" | "plan" | "code" | "mixed";
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}
