import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoHomeOutline, IoSearchOutline, IoFilmOutline, IoTrendingUpOutline } from 'react-icons/io5';
export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute top-0 left-0 z-20 p-8">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Netflix"
            width={120}
            height={40}
            className="cursor-pointer"
            priority
          />
        </Link>
      </div>
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
          alt="Netflix Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-400">
            404
          </h1>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl font-bold">!</span>
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Lost your way?
        </h2>
        <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          >
            <IoHomeOutline className="text-xl" />
            Back to Home
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            <IoTrendingUpOutline className="text-xl" />
            Trending Now
          </Link>
        </div>
        <div className="max-w-3xl w-full">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 text-center">
            Popular Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Action", href: "/genre/action" },
              { name: "Comedy", href: "/genre/comedy" },
              { name: "Drama", href: "/genre/drama" },
              { name: "Horror", href: "/genre/horror" },
              { name: "Sci-Fi", href: "/genre/sci-fi" },
              { name: "Romance", href: "/genre/romance" }
            ].map((genre) => (
              <Link
                key={genre.name}
                href={genre.href}
                className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 w-full max-w-md">
          <p className="text-sm text-gray-500 mb-3 text-center">
            Or try searching for something:
          </p>
          <form 
            action="/search" 
            method="GET"
            className="relative"
          >
            <input
              type="text"
              name="query"
              placeholder="Search movies, TV shows..."
              className="w-full h-12 pl-12 pr-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
              autoFocus
            />
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          </form>
        </div>
        <div className="mt-16 text-xs text-gray-700 font-mono">
          <span>ERROR_404 | PAGE_NOT_FOUND</span>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-700 z-10">
        © 2024 Netflix Clone. All rights reserved.
      </div>
    </div>
  );
}