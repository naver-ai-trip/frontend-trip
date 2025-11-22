"use client";

import { CheckCircle, Loader, AlertCircle } from "lucide-react";

interface StreamState {
  type: "progress" | "response" | "complete" | "error";
  node?: string;
  data?: any;
}

interface StreamStateDisplayProps {
  states: StreamState[];
  isStreaming: boolean;
}

const stateLabels: Record<string, string> = {
  initialize: "Initializing...",
  route: "Routing...",
  search_plan: "Searching plans...",
  generate: "Generating response...",
  save: "Saving...",
};

export default function StreamStateDisplay({ states, isStreaming }: StreamStateDisplayProps) {
  return (
    <div className="space-y-3 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-purple-900 dark:text-purple-300">Stream Progress</h3>
        {isStreaming && (
          <div className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin text-purple-500" />
            <span className="text-xs text-purple-600 dark:text-purple-400">Streaming...</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {states.map((state, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {state.type === "progress" && (
              <>
                <Loader className="mt-0.5 h-4 w-4 flex-shrink-0 animate-spin text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {stateLabels[state.node || ""] || state.node}
                  </p>
                </div>
              </>
            )}

            {state.type === "response" && (
              <>
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Response received
                  </p>
                  {state.data?.message && (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {state.data.message}
                    </p>
                  )}
                  {state.data?.actions_taken && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {state.data.actions_taken.map((action: string, i: number) => (
                        <span
                          key={i}
                          className="inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        >
                          ✓ {action}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {state.type === "complete" && (
              <>
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Stream completed
                  </p>
                </div>
              </>
            )}

            {state.type === "error" && (
              <>
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Error: {state.data?.message || "Unknown error"}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
