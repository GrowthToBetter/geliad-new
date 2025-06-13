/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// CloudinaryHelper class
class CloudinaryHelper {
  private cloudName: string;

  constructor(cloudName: string) {
    this.cloudName = cloudName;
  }

  extractPublicId(url: string): string | null {
    try {
      const patterns = [
        /\/raw\/upload\/(?:v\d+\/)?(.+)\.[\w]+$/,
        /\/image\/upload\/(?:v\d+\/)?(.+)\.[\w]+$/,
        /\/video\/upload\/(?:v\d+\/)?(.+)\.[\w]+$/,
        /\/[\w]+\/upload\/(?:v\d+\/)?(.+)\.[\w]+$/,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return match[1];
        }
      }
      return null;
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return null;
    }
  }

  extractVersion(url: string) {
    const match = url.match(/\/v(\d+)\//);
    return match ? match[1] : null;
  }

  generateUrls(
    publicId: string,
    options: { version?: string; format?: string } = {}
  ) {
    const { version, format = "pdf" } = options;
    const versionPart = version ? `v${version}/` : "";

    return {
      raw: `https://res.cloudinary.com/${this.cloudName}/raw/upload/${versionPart}${publicId}.${format}`,
      image: `https://res.cloudinary.com/${this.cloudName}/image/upload/${versionPart}${publicId}.${format}`,
      withAttachment: `https://res.cloudinary.com/${this.cloudName}/image/upload/fl_attachment/${versionPart}${publicId}.${format}`,
      withForceDownload: `https://res.cloudinary.com/${this.cloudName}/raw/upload/fl_attachment/${versionPart}${publicId}.${format}`,
      signed: `https://res.cloudinary.com/${this.cloudName}/image/upload/f_auto,q_auto/${versionPart}${publicId}.${format}`,
    };
  }
}

// Initialize the helper with your cloud name
const cloudinaryHelper = new CloudinaryHelper("daedflf4e");

interface PDFPreviewDialogProps {
  previewCloud: string | null;
  setPreviewCloud: React.Dispatch<React.SetStateAction<string | null>>;
}

const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({
  previewCloud,
  setPreviewCloud,
}) => {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [urlAttempts, setUrlAttempts] = useState<number>(0);

  useEffect(() => {
    if (previewCloud) {
      processCloudinaryUrl(previewCloud);
    } else {
      resetState();
    }
  }, [previewCloud]);

  const resetState = (): void => {
    setProcessedUrl(null);
    setLoading(false);
    setError(null);
    setUrlAttempts(0);
  };

  const processCloudinaryUrl = async (url: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setUrlAttempts(0);

    try {
      const publicId = cloudinaryHelper.extractPublicId(url);
      const version = cloudinaryHelper.extractVersion(url);

      if (!publicId) {
        throw new Error("Could not extract public ID from URL");
      }

      console.log("Extracted Public ID:", publicId);
      console.log("Extracted Version:", version);

      // Generate alternative URLs
      const alternatives = cloudinaryHelper.generateUrls(publicId, {
        version: version || undefined,
        format: "pdf",
      });

      console.log("Generated URLs:", alternatives);

      // Try URLs in order of likelihood to work
      const urlsToTry = [
        alternatives.withAttachment,
        alternatives.signed,
        alternatives.image,
        alternatives.raw,
        url, // Original URL as fallback
      ];

      await tryUrls(urlsToTry);
    } catch (err: unknown) {
      console.error("Error processing URL:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setLoading(false);
    }
  };

  const tryUrls = async (urls: string[]): Promise<void> => {
    for (let i = 0; i < urls.length; i++) {
      const currentUrl = urls[i];
      console.log(`Trying URL ${i + 1}:`, currentUrl);

      try {
        // Test if URL is accessible
        const response = await fetch(currentUrl, {
          method: "HEAD",
          mode: "no-cors", // This allows us to make the request even with CORS issues
        });

        // If we get here without error, try to use the URL
        setProcessedUrl(currentUrl);
        setUrlAttempts(i + 1);
        setLoading(false);
        return;
      } catch (fetchError: unknown) {
        const errorMessage =
          fetchError instanceof Error
            ? fetchError.message
            : "Unknown fetch error";
        console.log(`URL ${i + 1} failed:`, errorMessage);

        // If it's the last URL, still try it (sometimes iframe works when fetch fails)
        if (i === urls.length - 1) {
          setProcessedUrl(currentUrl);
          setUrlAttempts(i + 1);
          setLoading(false);
          return;
        }
      }
    }

    // If all URLs failed
    setError("All URL attempts failed");
    setLoading(false);
  };

  const handleIframeError = (): void => {
    console.log("Iframe failed to load");
    setError("Failed to display PDF in preview");
  };

  const handleOpenInNewTab = (): void => {
    const url = processedUrl ?? previewCloud;
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleDownload = (): void => {
    if (previewCloud) {
      const publicId = cloudinaryHelper.extractPublicId(previewCloud);
      const version = cloudinaryHelper.extractVersion(previewCloud);

      if (publicId) {
        const downloadUrl = cloudinaryHelper.generateUrls(publicId, {
          version: version || undefined,
          format: "pdf",
        }).withForceDownload;

        window.open(downloadUrl, "_blank");
      }
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
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                    <p>Processing PDF URL...</p>
                    {urlAttempts > 0 && (
                      <p className="text-sm text-gray-600">
                        Attempt {urlAttempts}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-red-600 mb-4">
                      <p className="text-lg font-semibold">
                        Unable to preview PDF
                      </p>
                      <p className="text-sm">{error}</p>
                      {urlAttempts > 0 && (
                        <p className="text-sm mt-2">
                          Tried {urlAttempts} different URL formats
                        </p>
                      )}
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

              {processedUrl && !loading && !error && (
                <div className="h-full">
                  <iframe
                    src={processedUrl}
                    className="w-full h-full rounded-md border"
                    allow="fullscreen"
                    onError={handleIframeError}
                    title="PDF Preview"
                  />
                  {urlAttempts > 1 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Using URL format #{urlAttempts}
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PDFPreviewDialog;
