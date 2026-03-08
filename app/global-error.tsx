"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoHomeOutline, IoRefreshOutline, IoAlertCircleOutline } from "react-icons/io5";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-black text-white font-sans antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
          <div className="fixed inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
              alt="Netflix Background"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black" />
          </div>
          <div className="relative z-10 max-w-2xl w-full text-center">
            <div className="mb-8">
              <Image
                src="/images/logo.png"
                alt="Netflix"
                width={160}
                height={45}
                className="mx-auto"
                priority
              />
            </div>
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center animate-pulse">
                  <IoAlertCircleOutline className="text-6xl text-red-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  !
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Oops! Something went wrong
            </h1>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-800">
              <p className="text-gray-300 text-lg mb-2">
                {error.message || "An unexpected error occurred"}
              </p>
              {error.digest && (
                <p className="text-sm text-gray-500">
                  Error ID: <span className="font-mono">{error.digest}</span>
                </p>
              )}
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-8 text-left overflow-auto max-h-60">
                <p className="text-red-400 font-mono text-sm mb-2">Stack trace:</p>
                <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => reset()}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
              >
                <IoRefreshOutline className="text-xl" />
                Try Again
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-8 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                <IoHomeOutline className="text-xl" />
                Go Home
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              If the problem persists, please{" "}
              <button
                onClick={() => window.location.href = "mailto:support@netflix.com"}
                className="text-red-500 hover:underline"
              >
                contact support
              </button>
            </p>
            <div className="mt-12 text-xs text-gray-700 font-mono">
              <span>ERROR_500</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-700">
            © 2024 Netflix Clone. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  );
}