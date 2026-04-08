"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ResponsiveDialogProps {
  children: React.ReactNode;
  trigger?: React.ReactElement;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  nativeButton?: boolean;
}

export function ResponsiveDialog({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  nativeButton = false,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger && <SheetTrigger render={trigger} nativeButton={nativeButton} />}
        <SheetContent side="bottom" showCloseButton={false}>
          <SheetHeader className="text-left px-5 pt-2">
            <SheetTitle className="font-heading text-xl font-bold">{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="px-5 pb-8">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} nativeButton={nativeButton} />}
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
