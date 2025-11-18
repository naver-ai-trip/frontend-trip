 

import Image from "next/image";

interface ImageMessageProps {
  metadata?: Record<string, any>;
}

export default function ImageMessage({ metadata }: ImageMessageProps) {
  if (!metadata?.url) return null;

  return (
    <div className="space-y-2">
      <div className="bg-muted relative h-64 w-full overflow-hidden rounded-lg">
        <Image
          src={metadata.url || "/placeholder.svg"}
          alt={metadata.alt || "Image"}
          fill
          className="object-cover"
        />
      </div>
      {metadata.caption && <p className="text-muted-foreground text-sm">{metadata.caption}</p>}
    </div>
  );
}
