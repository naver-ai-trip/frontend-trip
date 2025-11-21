"use client";
import { Heart, LogIn, LogOut, Map, MapPin, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const Header = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search-places?q=${encodeURIComponent(searchTerm.trim())}`, { scroll: true });
    } else {
      router.push("/search-places", { scroll: true });
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white shadow-sm backdrop-blur-sm dark:bg-black/70">
      <div className="container mx-auto flex h-20 items-center justify-between gap-6 px-4">
        <div className="flex flex-shrink-0 items-center space-x-2">
          <Link prefetch href="/" className="group flex items-center space-x-2">
            <Image src="/logo_text.png" width={210} height={80} alt="logo" />
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden max-w-xl flex-1 md:flex">
          <div className="group relative w-full">
            <div className="bg-primary pointer-events-none absolute inset-y-0 top-1/2 left-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full">
              <Search className="text-accent h-4 w-4 transition-colors" />
            </div>
            <Input
              type="search"
              placeholder="Search destinations, trips, or experiences..."
              className="h-12 w-full rounded-full border-2 pr-4 pl-12 shadow-sm transition-all hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center transition-transform hover:scale-110"
              onClick={handleSearch}
            >
              <MapPin className="text-muted-foreground hover:text-primary h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="flex flex-shrink-0 items-center space-x-3">
          <ModeToggle />
          <div className="hidden items-center space-x-2 sm:flex">
            <Button>
              <Link prefetch href="/create-trip" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Plan new trip</span>
              </Link>
            </Button>
            <Popover>
              <PopoverTrigger>
                <div className="bg-secondary rounded-full p-2">
                  <User className="size-5" />
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-40 p-1">
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    size="default"
                    asChild
                    className="hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <Link prefetch href="/trip" className="flex items-center justify-start gap-2">
                      <Map className="h-4 w-4" />
                      <span>My trip</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    asChild
                    className="hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <Link
                      prefetch
                      href="/favorites"
                      className="flex items-center justify-start gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      <span>My favorite</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    asChild
                    className="hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <Link prefetch href="/login" className="flex items-center justify-start gap-2">
                      <LogOut className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button size="default" variant={"ghost"} asChild className="justify-start">
                    <Link prefetch href="/register" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {/* <Button variant="ghost" size="default" asChild className="hover:bg-blue-50 dark:hover:bg-blue-950">
              <Link href="/login" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
            <Button size="default" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
              <Link href="/register" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </Button> */}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={handleSearch} className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search destinations..."
            className="h-10 w-full rounded-full border-2 pr-4 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
};
