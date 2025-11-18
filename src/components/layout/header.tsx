'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ModeToggle } from '../mode-toggle'
import { LogIn, LogOut, Search, MapPin, Plane, User, Map, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export const Header = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search-places?q=${encodeURIComponent(searchTerm.trim())}`, { scroll: true });
    } else {
      router.push('/search-places', { scroll: true });
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b  bg-white dark:bg-black/70 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-secondary transition-all">
              <Plane className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Visca
            </h1>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-3 top-1/2 -translate-y-1/2 size-8 justify-center rounded-full flex items-center pointer-events-none bg-primary">
              <Search className="h-4 w-4 text-accent transition-colors" />
            </div>
            <Input
              type="search"
              placeholder="Search destinations, trips, or experiences..."
              className="w-full pl-12 pr-4 h-12 border-2  rounded-full shadow-sm hover:shadow-md transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" className="absolute inset-y-0 right-3 flex items-center hover:scale-110 transition-transform" onClick={handleSearch}>
              <MapPin className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </button>
          </div>
        </form>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <ModeToggle />
          <div className="hidden sm:flex items-center space-x-2">
            <Button>
              <Link href="/create-trip" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Plan new trip</span>
              </Link>
            </Button>
            <Popover>
              <PopoverTrigger>
                <div className='rounded-full p-2 bg-secondary'>
                  <User className='size-5' />
                </div>
              </PopoverTrigger>
              <PopoverContent align='end' className='p-1 w-40'>
                <div className='flex flex-col space-y-2'>
                  <Button variant="ghost" size="default" asChild className="hover:bg-blue-50 dark:hover:bg-blue-950">
                    <Link href="/trip" className="flex items-center justify-start gap-2">
                      <Map className="h-4 w-4" />
                      <span>My trip</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="default" asChild className="hover:bg-blue-50 dark:hover:bg-blue-950">
                    <Link href="/favorites" className="flex items-center justify-start gap-2">
                      <Heart className="h-4 w-4" />
                      <span>My favorite</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="default" asChild className="hover:bg-blue-50 dark:hover:bg-blue-950">
                    <Link href="/login" className="flex items-center justify-start gap-2">
                      <LogOut className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button size="default" variant={'ghost'} asChild className=" justify-start">
                    <Link href="/register" className="flex items-center gap-2">
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

      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search destinations..."
            className="w-full pl-10 pr-4 h-10 rounded-full border-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
    </header>
  )
}
