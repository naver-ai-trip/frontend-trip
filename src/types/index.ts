export interface Message {
  id: string;
  role: "user" | "agent";
  type: "text" | "image" | "video" | "timeline" | "plan" | "code" | "mixed" | "places_list";
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}
