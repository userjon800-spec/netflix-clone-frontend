import Link from "next/link";
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-black w-full z-999">
      <div className="max-w-380 mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-10 lg:py-12">
        <div className="mb-6 md:mb-8">
          <h2 className="text-[#b3b3b3] text-base md:text-lg font-normal hover:text-white transition-colors">
            <a href="tel:998933547854" className="hover:underline">
              Questions? Call +998 93&#41;354-78-54
            </a>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/faq" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              FAQ
            </Link>
            <Link 
              href="/investor-relations" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Investor Relations
            </Link>
            <Link 
              href="/privacy" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/speed-test" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Speed Test
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link 
              href="/help" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Help Centre
            </Link>
            <Link 
              href="/jobs" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Jobs
            </Link>
            <Link 
              href="/cookie-preferences" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Cookie Preferences
            </Link>
            <Link 
              href="/legal-notices" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Legal Notices
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link 
              href="/account" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Account
            </Link>
            <Link 
              href="/ways-to-watch" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Ways to Watch
            </Link>
            <Link 
              href="/corporate-information" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Corporate Information
            </Link>
            <Link 
              href="/only-on-netflix" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Only on Netflix
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link 
              href="/media-centre" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Media Centre
            </Link>
            <Link 
              href="/terms-of-use" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Terms of Use
            </Link>
            <Link 
              href="/contact-us" 
              className="text-[#b3b3b3] text-sm hover:text-white hover:underline transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="mb-6">
          <select 
            className="bg-black text-[#b3b3b3] border border-[#4d4d4d] px-4 py-2 text-sm rounded hover:border-white transition-colors cursor-pointer outline-none focus:border-white"
            aria-label="Language Selector"
          >
            <option value="en" className="bg-black text-white">English</option>
            <option value="ru" className="bg-black text-white">Russian</option>
            <option value="uz" className="bg-black text-white">Uzbek</option>
          </select>
        </div>
        <div className="border-t border-[#4d4d4d] pt-6 mt-4">
          <div className="text-center">
            <Link 
              href="https://t.me/Xamdamb0yev" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b3b8d] text-sm md:text-base font-medium hover:text-[#4b4bb5] transition-colors inline-block mb-2"
            >
              Developed with ❤️ by Javohir
            </Link>
            <p className="text-[#b3b3b3] text-xs md:text-sm">
              © Copyright {currentYear} | Designed & Developed by Javohir Xamdamboyev | All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}