"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) {
      document.addEventListener("keydown", onKey);
      // lock scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // focus close button when opened
      setTimeout(() => closeBtnRef.current?.focus(), 0);

      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }

    return undefined;
  }, [open, onClose]);

  if (!open) return null;

  const root = typeof document !== "undefined" && document.getElementById("modal-root");
  if (!root) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={() => {
        if (closeOnOverlay) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className="relative z-10 w-full max-w-lg rounded-lg bg-white dark:bg-slate-900 p-6 shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          {title ? (
            <h2 id="modal-title" className="text-lg font-medium">
              {title}
            </h2>
          ) : null}

          <button
            ref={closeBtnRef}
            aria-label="Close modal"
            onClick={onClose}
            className="ml-auto rounded-md bg-transparent p-1 text-slate-700 hover:bg-slate-100 dark:text-slate-300"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );

  return createPortal(content, root);
}

export default Modal;
