"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  submissionId: string;
  label?: string;
}

export function PdfDownloadButton({ submissionId, label = "Download PDF" }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/intake/download?submissionId=${submissionId}`);
      if (!res.ok) {
        throw new Error("Could not generate download link.");
      }
      const { pdfSignedUrl } = await res.json();
      const a = document.createElement("a");
      a.href = pdfSignedUrl;
      a.download = `intake-${submissionId}.pdf`;
      a.click();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} variant="outline">
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {label}
    </Button>
  );
}
