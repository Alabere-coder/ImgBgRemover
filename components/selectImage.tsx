import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Download, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Card } from "./ui/card";

interface ImageSelectorProps {
  apiKey: string | undefined;
  apiUrl: string | undefined;
  onImageProcess?: (originalImage: string, processedImage: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  apiKey,
  apiUrl,
  onImageProcess,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (file: File) => {
    setError(null);

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 8MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImage(result);
      setIsPopupOpen(true);
      setProcessedImage(null);
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveBackground = async () => {
    if (!image || !apiKey || !apiUrl) {
      setError("Missing required configuration");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image_file", blob, "image.png");
      formData.append("size", "auto");

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: formData,
      });

      if (!res.ok) {
        // Try to extract a meaningful error message from the response
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.blob();
      const imageUrl = URL.createObjectURL(data);
      setProcessedImage(imageUrl);
      onImageProcess?.(image, imageUrl);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to process image"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = "processed-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${!image ? "cursor-pointer" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer">
          <Upload
            className={`w-12 h-12 ${
              isDragging ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Drag and drop your image, or click to select
            </p>
            <p className="text-xs text-gray-500">
              Supports: JPG, PNG, WebP (max 8MB)
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handleImageChange(e.target.files[0])
            }
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative flex flex-wrap w-11/12 max-w-4xl md:h-[70%] max-sm:w-[80%] max-md:w-[60%] max-md:h-[95%] p-6  bg-white rounded-xl shadow-xl">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsPopupOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="flex flex-row max-sm:px-8 max-md:flex-col max-h-screen max-md:px-10 gap-6">
              {image && (
                <div className="space-y-2 w-[50%] max-md:w-full">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Original Image
                  </h3>
                  <Card className="max-w-[100%]">
                    <Image
                      src={image}
                      alt="Original"
                      width={200}
                      height={100}
                      className="w-screen h-[23rem] ma max-md:h-[15rem] max-sm:h-[14rem] rounded-[8px] "
                    />
                  </Card>
                </div>
              )}

              {processedImage && (
                <div className="space-y-2 max-md:w-full w-[50%]">
                  <h3 className="text-sm font-semibold text-green-600">
                    Processed Image
                  </h3>
                  <Card className="max-w-[100%]" style={{ backgroundColor }}>
                    <Image
                      src={processedImage}
                      alt="Processed"
                      width={200}
                      height={100}
                      className="w-screen h-[23rem] max-md:h-[15rem] rounded-[8px]"
                    />
                  </Card>
                </div>
              )}
            </div>

            <div className="w-full flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                {processedImage && (
                  <>
                    <label className="text-sm font-medium text-gray-700">
                      Add-Bg:
                    </label>
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 p-1 rounded-md"
                    />
                  </>
                )}
              </div>

              <div className="flex gap-2 place-content-end">
                <Button
                  onClick={() => setIsPopupOpen(false)}
                  variant="outline"
                  className="rounded-[8px] max-sm:hidden"
                >
                  Close
                </Button>

                {processedImage ? (
                  <Button
                    onClick={handleDownload}
                    className="rounded-[8px] text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                ) : (
                  <Button
                    onClick={handleRemoveBackground}
                    disabled={isLoading || !image}
                    className="rounded-[8px] text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Remove BG"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
