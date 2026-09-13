import type { ReactNode } from "react";

export default function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-[min(1280px,calc(100%-48px))] max-sm:w-[calc(100%-28px)] ${className}`}>{children}</div>;
}
