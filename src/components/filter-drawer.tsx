import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ReactNode } from 'react'

interface FilterDrawerProps {
  title: string
  description?: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function FilterDrawer({
  title,
  description,
  isOpen,
  onOpenChange,
  children,
}: FilterDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="space-y-6 mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
