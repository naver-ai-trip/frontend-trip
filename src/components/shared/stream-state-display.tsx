"use client";

export default function StreamStateDisplay({
  streamStates,
}: {
  streamStates: Array<{
    type: "progress" | "response" | "complete" | "error";
    node?: string;
    data?: any;
  }>;
}) {
  return (
    <div className="space-y-2 p-4">
      {streamStates.map((s, i) => (
        <div key={i} className="text-sm">
          {s.type === "progress" && (
            <div className="flex items-center gap-2 text-blue-500">
              <span className="size-2 animate-pulse rounded-full bg-blue-500"></span>
              <span>{s.node}</span>
            </div>
          )}

          {s.type === "response" && (
            <div className="text-green-600">Response ready (message + components)</div>
          )}

          {s.type === "complete" && (
            <div className="font-medium text-purple-600">✔ Stream complete</div>
          )}
        </div>
      ))}
    </div>
  );
}
