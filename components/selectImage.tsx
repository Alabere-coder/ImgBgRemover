import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Input } from "./ui/input";

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
  const [backgroundColor, setBackgroundColor] = useState<string>("#fff");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError("File size must be less than 5MB");
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
    }
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
        throw new Error(`HTTP error! status: ${res.status}`);
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

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <label className="flex items-center justify-center gap-4 max-w-xl cursor-pointer">
          <span className="rounded-3xl bg-slate-800 px-20 py-5 text-sm font-semibold text-white hover:bg-slate-500">
            Choose Image
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isPopupOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="relative  w-11/12 max-w-2xl p-6 max-md:h-[95%] bg-white rounded-xl shadow-xl">
              <Button
                variant="destructive"
                className="absolute top-4 right-4 rounded-[9px] bg-black text-white hover:text-red-700 hover:border-red-700 hover:border-2"
                onClick={() => setIsPopupOpen(false)}
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 26 26"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>

              <div className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-4 max-md:gap-8 mb-8 md:h-[20rem]">
                  {image && (
                    <div className="space-y-2">
                      <h3 className="text-sm text-gray-700 font-semibold">
                        Original Image
                      </h3>
                      <Image
                        src={image}
                        alt="Original"
                        width={200}
                        height={200}
                        className="w-full h-full  max-md:h-[90%] rounded-xl border border-gray-200"
                      />
                    </div>
                  )}

                  {processedImage && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-green-600">
                        Processed Image
                      </h3>
                      <Image
                        src={processedImage}
                        alt="Processed"
                        width={200}
                        height={200}
                        className="w-full h-full max-md:h-[90%] rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-4">
                  <Button
                    onClick={() => setIsPopupOpen(false)}
                    variant="outline"
                    className="bg-black text-white rounded-[8px]"
                  >
                    Close
                  </Button>
                  {processedImage ? (
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleDownload}
                        className="bg-blue-700 text-white rounded-[8px] hover:text-blue-700"
                      >
                        Download
                      </Button>
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) =>
                          handleBackgroundColorChange(e.target.value)
                        }
                        className="w-12 h-12 p-0 border-none"
                      />
                    </div>
                  ) : (
                    <Button
                      onClick={handleRemoveBackground}
                      disabled={isLoading || !image}
                      variant="secondary"
                      className="bg-blue-500 rounded-[8px] text-white hover:text-blue-500 hover:border-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <p className="">Processing...</p>
                        </>
                      ) : (
                        "Remove Background"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSelector;
