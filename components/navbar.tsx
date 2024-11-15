import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <div className=" sticky top-0 px-20 max-md:px-4 h-16 flex items-center justify-between border-b-2">
      <Image
        aria-hidden
        src="/logo1-r.png"
        alt="File icon"
        width={100}
        height={100}
      />
      <Sheet>
        <SheetTrigger className="md:hidden">
          <Image
            aria-hidden
            src="/hamburger.png"
            alt="File icon"
            width={30}
            height={30}
            className="mr-4"
          />
        </SheetTrigger>
        <SheetContent className="bg-white w-2/3">
          <SheetHeader>
            <SheetTitle>Go to</SheetTitle>
            <SheetDescription className="flex flex-col gap-6 items-end mr-6 pt-8">
              <Link href="/">Home</Link>
              <Link href="/">About</Link>
              <Link href="/">Collections</Link>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="flex gap-4 max-md:hidden">
        <Link href="/">
          <Button
            variant="secondary"
            className="bg-slate-800 text-white hover:text-slate-500 rounded-[8px]"
          >
            Home
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant="secondary"
            className="bg-slate-800 text-white hover:text-slate-500 rounded-[8px]"
          >
            About
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant="secondary"
            className="bg-slate-800 text-white hover:text-slate-500 rounded-[8px]"
          >
            Collections
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
