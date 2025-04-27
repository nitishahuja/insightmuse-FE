"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium text-red-700">Something went wrong</h3>
            </div>
            <p className="text-sm text-red-600 mb-2">{this.state.error?.message || "An unexpected error occurred"}</p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="text-xs bg-red-100 p-2 rounded overflow-auto max-h-[200px]">{this.state.error.stack}</pre>
            )}
          </CardContent>
          <CardFooter className="bg-red-100/50 border-t border-red-200">
            <Button variant="outline" className="bg-white hover:bg-red-50" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}
