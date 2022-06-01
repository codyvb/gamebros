import { Dialog } from "@headlessui/react";
import { useRef } from "react";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ onClose = () => {}, children }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog
      static
      open={true}
      onClose={onClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        className="fixed inset-0 bg-gray-800/60"
      />
      <div className="relative flex items-center justify-center w-1/2">
        {children}
      </div>
    </Dialog>
  );
}
