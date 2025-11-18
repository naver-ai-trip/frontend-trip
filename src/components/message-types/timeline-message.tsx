 

interface TimelineMessageProps {
  metadata?: Record<string, any>;
}

export default function TimelineMessage({ metadata }: TimelineMessageProps) {
  if (!metadata?.events) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Timeline</h3>
      <div className="space-y-4">
        {metadata.events.map((event: any, index: number) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 ring-4 ring-white dark:ring-slate-800" />
              {index < metadata.events.length - 1 && (
                <div className="h-12 w-1 bg-gradient-to-b from-purple-300 to-transparent dark:from-purple-700" />
              )}
            </div>
            <div className="pb-4">
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {event.date}
              </p>
              <p className="font-medium">{event.title}</p>
              <p className="text-muted-foreground text-sm">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
