"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PaymentState } from "@/lib/types"

interface PaymentProcessingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  state: PaymentState
  onRetry?: () => void
}

export function PaymentProcessingDialog({ open, onOpenChange, state, onRetry }: PaymentProcessingDialogProps) {
  const getContent = () => {
    switch (state) {
      case "pending":
        return {
          icon: <Loader2 className="h-12 w-12 animate-spin text-primary" />,
          title: "Initializing Payment",
          description: "Setting up your payment with Pi Network...",
        }
      case "processing":
        return {
          icon: <Loader2 className="h-12 w-12 animate-spin text-primary" />,
          title: "Processing Payment",
          description: "Please complete the payment in Pi Wallet. This may take a few moments.",
        }
      case "success":
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          title: "Payment Successful",
          description: "Your premium features have been activated! Enjoy your upgraded experience.",
        }
      case "failed":
        return {
          icon: <XCircle className="h-12 w-12 text-destructive" />,
          title: "Payment Failed",
          description: "We couldn't process your payment. Please try again.",
        }
      case "cancelled":
        return {
          icon: <AlertCircle className="h-12 w-12 text-yellow-500" />,
          title: "Payment Cancelled",
          description: "You cancelled the payment. No charges were made.",
        }
      default:
        return {
          icon: null,
          title: "",
          description: "",
        }
    }
  }

  const content = getContent()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">{content.icon}</div>
          <DialogTitle className="text-center">{content.title}</DialogTitle>
          <DialogDescription className="text-center">{content.description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 mt-4">
          {state === "success" && (
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Continue
            </Button>
          )}
          {state === "failed" && onRetry && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={onRetry} className="flex-1">
                Try Again
              </Button>
            </>
          )}
          {state === "cancelled" && (
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
