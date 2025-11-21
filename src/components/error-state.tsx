import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string
  onRetry: () => void
}) {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center">
      {/* Icon Wrapper */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-destructive/20 blur-xl animate-pulse" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border border-destructive/30 backdrop-blur-md">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-destructive mb-2">
        {message}
      </h3>

      <p className="text-muted-foreground mb-6 max-w-sm">
        Something unexpected happened. Please try again.
      </p>

      {/* Button */}
      <Button
        onClick={onRetry}
        className="px-6"
      >
        Try Again
      </Button>
    </div>
  )
}
