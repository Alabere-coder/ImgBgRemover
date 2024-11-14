import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

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
      <div className="flex gap-4">
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
