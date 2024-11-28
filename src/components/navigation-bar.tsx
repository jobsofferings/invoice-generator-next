"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  MenuIcon,
  Moon,
  Sun,
  ComputerIcon
} from "lucide-react";

export default function NavigationBar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav
      className={`w-full fixed flex justify-center z-50 transition-all duration-300 ${
        isOpen ? "h-screen" : "h-24"
      }`}
    >
      <div className="w-11/12 bg-background shadow-lg p-4 rounded-md flex flex-col justify-between align-middle items-center m-4">
        <div className="flex w-full justify-between mt-2">
          <Link
            href="/"
            passHref
            className="font-black text-md align-middle cursor-pointer"
          >
            <span className="text-purple-500">invoice.</span>flightdev.co
          </Link>

          <div className="flex justify-between align-middle items-center">
            <div className="hidden lg:block w-fit">
              {theme == "light" && (
                <Sun
                  className="p-2 w-8 h-8 rounded-md text-muted-foreground stroke-black fill-white bg-muted/40 shadow-md"
                  onClick={() => setTheme("dark")}
                />
              )}
              {theme == "dark" && (
                <Moon
                  className="p-2 w-8 h-8 rounded-md text-muted-foreground stroke-white fill-black bg-muted/40"
                  onClick={() => setTheme("light")}
                />
              )}
              {theme == "system" && (
                <ComputerIcon
                  className="p-2 w-8 h-8 rounded-md text-muted-foreground stroke-black fill-black bg-white"
                  onClick={() => setTheme("light")}
                />
              )}
            </div>

            <MenuIcon
              className="h-6 w-6 lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out w-full ${
            isOpen ? "opacity-100 max-h-[300px]" : "opacity-0 max-h-0"
          } overflow-hidden`}
        >
          <a
            href="https://flightdev.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-full text-center mb-2 text-muted-foreground text-sm">
            Opensource Project By{" "}
            <span className="font-black text-purple-500">
              FLIGHTDEV.CO
            </span>
            </div>
          
          </a>

          {theme == "light" && (
            <div
              onClick={() => setTheme("dark")}
              className="flex gap-2 items-center p-2 rounded-md border-2 border-gray-200/20 bg-gray-200/20 hover:bg-gray-200/30 transition-color duration-300 text-gray-500 shadow-md w-full justify-center"
            >
              <Sun className="stroke-purple-500 fill-purple-500"/>
              <span>Light Mode</span>
            </div>
          )}
          {theme == "dark" && (
            <div
              onClick={() => setTheme("light")}
              className="flex gap-2 items-center p-2 rounded-md border-2 border-gray-800/20 bg-gray-800/20 hover:bg-gray-800/30 transition-color duration-300 text-gray-400 shadow-md w-full justify-center"
            >
              <Moon className="stroke-purple-500 fill-purple-500"/>
              <span>Dark Mode</span>
            </div>
          )}
          {theme == "system" && (
            <div
              onClick={() => setTheme("light")}
              className="flex gap-2 items-center p-2 rounded-md border-2 border-gray-800/20 bg-gray-800/20 hover:bg-gray-800/30 transition-color duration-300 text-gray-400 shadow-md w-full justify-center"
            >
              <ComputerIcon className="stroke-purple-500 fill-purple-500"/>
              <span>System Mode</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
