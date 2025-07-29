"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="bg-gradient-to-br from-black/50 via-purple-900/40 to-purple-800/40 backdrop-blur-md text-white shadow-2xl rounded-xl">
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-white font-semibold">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-white">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white hover:text-purple-300" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
