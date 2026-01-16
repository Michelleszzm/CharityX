"use client";

import { Copy, Check } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { toast } from "sonner";

interface Props {
  text: string;
}

export default function CopyButton({ text }: Props) {
  const { copied, copy } = useCopy();

  const handleCopy = () => {
    copy(text);
    toast.success("Copied to clipboard");
  };
  return (
    <button
      onClick={() => handleCopy()}
      className=""
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-gray-600" />
      )}
    </button>
  );
}
