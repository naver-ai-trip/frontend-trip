 

interface VideoMessageProps {
  metadata?: Record<string, any>;
}

export default function VideoMessage({ metadata }: VideoMessageProps) {
  if (!metadata?.url) return null;

  return (
    <div className="space-y-2">
      <div className="relative w-full overflow-hidden rounded-lg bg-black">
        <video
          src={metadata.url}
          controls
          className="h-auto max-h-96 w-full"
          poster={metadata.poster}
        />
      </div>
      {metadata.title && <p className="text-sm font-medium">{metadata.title}</p>}
      {metadata.description && (
        <p className="text-muted-foreground text-sm">{metadata.description}</p>
      )}
    </div>
  );
}
