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
    <div className="flex items-center max-md:flex-col gap-10">
      <div className="w-[30rem] max-md:w-[25rem]">
        <p className="text-5xl leading-normal max-md:text-[43px]">
          Remove Image
          <span className="bg-slate-800 rounded-2xl px-3 mx-2 font-semibold text-white">
            Background
          </span>
        </p>
        <div className="flex items-center gap-4">
          <Image
            src="/magic-wand-icon.webp"
            alt="magic-wand"
            height={60}
            width={60}
          />
          <p className="text-xl">With just a click.</p>
        </div>
      </div>
      <Card className=" shadow-md">
        <div className="h-[25rem] rounded-2xl bg-white w-[25rem] flex justify-center items-center">
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
