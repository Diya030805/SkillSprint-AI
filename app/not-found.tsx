"use client";

import NotFoundPage from "@/components/NotFoundPage";

export default function NotFound() {
  return (
    <NotFoundPage onGoHome={() => {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }} />
  );
}
