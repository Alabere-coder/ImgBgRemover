"use client";

import Image from "next/image";
import ImageSelector from "./selectImage";
import { Card } from "@/components/ui/card";

const API_KEY = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_REMOVE_BG_API_URL;

const UploadImage = () => {
  const handleImageProcess = (original: string, processed: string) => {
    console.log("Original image:", original);
    console.log("Processed image:", processed);
  };

  return (
    <div className="flex items-center max-md:flex-col w-full gap-6 px-6">
      <div className="w-10/12">
        <p className="text-7xl max-md:text-[43px] max-md:mt-6 mb-10">
          Remove Image
        </p>
        <p className="inline bg-slate-800 rounded-2xl p-2  text-5xl font-semibold text-white">
          Background
        </p>
        <div className="flex items-center gap-4 mt-6">
          <Image
            src="/magic-wand-icon.webp"
            alt="magic-wand"
            height={60}
            width={60}
          />
          <p className="text-xl">With just a click.</p>
        </div>
      </div>
      <Card className="w-11/12 shadow-md">
        <div className="h-[25rem] rounded-2xl bg-white w- flex justify-center items-center">
          <ImageSelector
            apiKey={API_KEY}
            apiUrl={API_URL}
            onImageProcess={handleImageProcess}
          />
        </div>
      </Card>
    </div>
  );
};

export default UploadImage;
