import Navbar from "@/components/navbar";
import UploadImage from "@/components/uploadImage";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center h-screen">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <UploadImage />
        </main>
      </div>
    </div>
  );
}
