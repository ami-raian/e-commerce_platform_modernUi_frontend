"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center h-screen ${
          theme === "dark" ? "text-white bg-black" : "bg-gray-100 text-black"
        } absolute inset-0 z-50`}
      >
        <p className="text-4xl font-bold mb-4">404 - Page Not Found</p>
        <p className="text-xl mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button asChild variant={"outline"}>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </>
  );
}
