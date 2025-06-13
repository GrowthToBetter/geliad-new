/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// CloudinaryHelper class
interface PDFPreviewDialogProps {
  previewCloud: string | null;
  setPreviewCloud: React.Dispatch<React.SetStateAction<string | null>>;
}

const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({
  previewCloud,
  setPreviewCloud,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleIframeError = (): void => {
    console.log("Iframe failed to load");
    setError("Failed to display PDF in preview");
  };

  const handleOpenInNewTab = (): void => {
    const url = previewCloud;
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleDownload = (): void => {
    if (previewCloud) {
      const link = document.createElement("a");
      link.href = previewCloud;
      link.download = "file.pdf"; // Nama file saat di-download (optional)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      {previewCloud && (
        <Dialog
          open={!!previewCloud}
          onOpenChange={() => setPreviewCloud(null)}>
          <DialogContent className="max-w-5xl h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>PDF Preview</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                    Open in New Tab
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                    Download
                  </button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="h-full">
              {error && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-red-600 mb-4">
                      <p className="text-lg font-semibold">
                        Unable to preview PDF
                      </p>
                      <p className="text-sm">{error}</p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={handleOpenInNewTab}
                        className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Open PDF in New Tab
                      </button>
                      <button
                        onClick={handleDownload}
                        className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="h-full">
                <iframe
                  src={previewCloud}
                  className="w-full h-full rounded-md border"
                  allow="fullscreen"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PDFPreviewDialog;
