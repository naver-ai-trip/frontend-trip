import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface TextMessageAgentLoadingProps {
  streamStates: Array<{
    type: "progress" | "response" | "complete" | "error";
    node?: string;
    data?: any;
  }>;
}

const stateLabels: Record<string, string> = {
  initialize: "Initializing...",
  route: "Routing...",
  search_plan: "Searching plans...",
  generate: "Generating response...",
  save: "Saving...",
};

export const TextMessageAgentLoading = ({ streamStates = [] }: TextMessageAgentLoadingProps) => {
  console.log(streamStates);
  const hasCompleted = streamStates.some((state) => state.type === "complete");
  const shouldShowProgress = streamStates.length > 0 && !hasCompleted;
  console.log("shouldShowProgress", shouldShowProgress);
  console.log("hasCompleted", hasCompleted);
  return (
    <div>
      loading...
      {shouldShowProgress && (
        <div className="mt-4 space-y-2 rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-purple-900 dark:text-purple-300">
              Stream Progress
            </h4>
            {!hasCompleted && (
              <div className="flex items-center gap-1">
                <Loader className="h-3 w-3 animate-spin text-purple-500" />
                <span className="text-xs text-purple-600 dark:text-purple-400">Processing...</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            {streamStates.map((state, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {state.type === "progress" && (
                  <>
                    <Loader className="mt-0.5 h-3 w-3 flex-shrink-0 animate-spin text-blue-500" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {stateLabels[state.node || ""] || state.node}
                      </p>
                    </div>
                  </>
                )}

                {state.type === "response" && (
                  <>
                    <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Response received
                      </p>
                    </div>
                  </>
                )}

                {state.type === "error" && (
                  <>
                    <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-red-500" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-red-700 dark:text-red-400">
                        Error: {state.data?.message || "Unknown error"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
