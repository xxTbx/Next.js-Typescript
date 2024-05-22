import { cn } from "@/lib/utils"

import { type ReactNode } from "react"

export default function Button({
  children,
  classNames,
}: {
  children: ReactNode
  classNames: string | string[]
}) {
  return (
    <button type="button" className={cn("bg-slate-700 px-2 py-1", classNames)}>
      {children}
    </button>
  )
}