"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Wifi } from "lucide-react"
import { API_BASE } from "@/lib/constants"
import { motion } from "framer-motion"

export function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking")
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    const checkApiStatus = async () => {
      const startTime = Date.now()
      try {
        // Just try to connect to the API base URL
        const response = await fetch(API_BASE, { method: "HEAD" })
        const endTime = Date.now()

        if (response.ok) {
          setStatus("online")
          setLatency(endTime - startTime)
        } else {
          setStatus("offline")
        }
      } catch (error) {
        setStatus("offline")
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="mb-4 bg-white/10 backdrop-blur-md border-white/20 rounded-xl overflow-hidden">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-[#EC4899]" />
            <p className="text-sm font-medium text-white">API Status:</p>
            {status === "checking" && (
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mr-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                </motion.div>
                Checking...
              </Badge>
            )}
            {status === "online" && (
              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online {latency && `(${latency}ms)`}
              </Badge>
            )}
            {status === "offline" && (
              <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
                <XCircle className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>
          <p className="text-xs text-[#94A3B8]">{API_BASE}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
