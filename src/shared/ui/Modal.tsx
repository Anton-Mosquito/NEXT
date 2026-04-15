"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  closeOnOverlay?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  closeOnOverlay = true,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && closeOnOverlay) onClose();
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => {
          if (!closeOnOverlay) e.preventDefault();
        }}
        onEscapeKeyDown={onClose}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="mt-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
