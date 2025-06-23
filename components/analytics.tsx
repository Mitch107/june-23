"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export function Analytics() {
  useEffect(() => {
    // Core Web Vitals monitoring
    if (typeof window !== "undefined") {
      // Monitor LCP
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime)
            // Send to analytics
            if (window.gtag) {
              window.gtag("event", "web_vitals", {
                name: "LCP",
                value: Math.round(entry.startTime),
                event_category: "Web Vitals",
              })
            }
          }
        }
      })

      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] })
      } catch (e) {
        console.warn("Performance Observer not supported")
      }

      // Monitor CLS
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
      })

      try {
        clsObserver.observe({ entryTypes: ["layout-shift"] })
      } catch (e) {
        console.warn("Layout Shift Observer not supported")
      }

      // Send CLS on page unload
      const sendCLS = () => {
        if (window.gtag && clsValue > 0) {
          window.gtag("event", "web_vitals", {
            name: "CLS",
            value: Math.round(clsValue * 1000),
            event_category: "Web Vitals",
          })
        }
      }

      window.addEventListener("beforeunload", sendCLS)

      return () => {
        observer.disconnect()
        clsObserver.disconnect()
        window.removeEventListener("beforeunload", sendCLS)
      }
    }
  }, [])

  return null
}
