 

import { CheckCircle2 } from "lucide-react";

interface PlanMessageProps {
  metadata?: Record<string, any>;
}

export default function PlanMessage({ metadata }: PlanMessageProps) {
  if (!metadata?.phases) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Kế hoạch thực hiện</h3>
      <div className="space-y-3">
        {metadata.phases.map((phase: any, index: number) => (
          <div
            key={index}
            className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-slate-700 dark:bg-slate-700/50"
          >
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white">
                {index + 1}
              </div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">{phase.phase}</h4>
            </div>
            <ul className="ml-9 space-y-2">
              {phase.tasks.map((task: string, taskIndex: number) => (
                <li key={taskIndex} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
