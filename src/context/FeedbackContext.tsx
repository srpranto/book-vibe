"use client";

import { createContext, useContext, useCallback } from "react";
import type { ReactElement, ReactNode } from "react";
import { toast } from "sonner";

interface FeedbackContextType {
  notify: (
    message: string,
    severity?: "success" | "info" | "warning" | "error",
  ) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  showError: (message: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType>({
  notify: () => {},
  showSuccess: () => {},
  showInfo: () => {},
  showWarning: () => {},
  showError: () => {},
});

export const FeedbackProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const notify = useCallback(
    (
      msg: string,
      sev: "success" | "info" | "warning" | "error" = "success",
    ): void => {
      switch (sev) {
        case "success":
          toast.success(msg);
          break;
        case "info":
          toast.info(msg);
          break;
        case "warning":
          toast.warning(msg);
          break;
        case "error":
          toast.error(msg);
          break;
        default:
          toast(msg);
      }
    },
    [],
  );

  const showSuccess = useCallback((msg: string): void => {
    toast.success(msg);
  }, []);

  const showInfo = useCallback((msg: string): void => {
    toast.info(msg);
  }, []);

  const showWarning = useCallback((msg: string): void => {
    toast.warning(msg);
  }, []);

  const showError = useCallback((msg: string): void => {
    toast.error(msg);
  }, []);

  return (
    <FeedbackContext.Provider
      value={{ notify, showSuccess, showInfo, showWarning, showError }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType =>
  useContext(FeedbackContext);
