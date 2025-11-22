"use client";
interface TextMessageProps {
  content: string;
}

export default function TextMessage({ content }: TextMessageProps) {
  return <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>;
}
