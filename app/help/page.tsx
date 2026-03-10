"use client";
import MenuBar from "@/components/menu-bar";
import { faqs } from "@/utils";
import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import {
  IoHelpBuoyOutline,
  IoMailOutline,
  IoChatbubbleOutline,
  IoStarOutline,
  IoStar,
  IoDocumentTextOutline,
  IoChevronForward,
  IoSearchOutline,
  IoCallOutline,
  IoLogoTwitter,
  IoLogoInstagram,
  IoBulbOutline,
  IoShieldCheckmarkOutline,
  IoVideocamOutline,
  IoPersonOutline,
  IoLogoGithub,
} from "react-icons/io5";
export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");
  const categories = [
    { id: "all", name: "All", icon: IoDocumentTextOutline },
    { id: "account", name: "Account", icon: IoPersonOutline },
    { id: "movies", name: "Movies", icon: IoVideocamOutline },
    { id: "security", name: "Security", icon: IoShieldCheckmarkOutline },
    { id: "technical", name: "Technical", icon: IoBulbOutline },
  ];
  const filteredFaqs =
    faqCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === faqCategory);
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // Feedback yuborish funksiyasi - siz yozasiz
    console.log({ name, email, message, feedbackType, rating });
  };
  const handleRatingClick = (value: number) => {
    setRating(value);
    // Rating yuborish funksiyasi - siz yozasiz
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <MenuBar />
      <div className="max-w-1520 mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 rounded-full mb-4">
            <IoHelpBuoyOutline className="text-red-600 text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions, get in touch with us, or share
            your feedback
          </p>
        </div>
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full h-14 pl-14 pr-4 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
            />
            <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <button
            onClick={() => window.open("mailto:userjon800@gmail.com", "_blank")}
            className="p-6 bg-gray-900/50 rounded-lg border cursor-pointer border-gray-800 hover:border-red-600 transition-all group"
          >
            <IoMailOutline className="text-3xl text-gray-400 group-hover:text-red-600 mb-3" />
            <h3 className="font-medium mb-1">Email Us</h3>
            <p className="text-sm text-gray-500">userjon800@gmail.com</p>
          </button>
          <button className="p-6 bg-gray-900/50 rounded-lg border cursor-pointer border-gray-800 hover:border-red-600 transition-all group">
            <IoChatbubbleOutline className="text-3xl text-gray-400 group-hover:text-red-600 mb-3" />
            <h3 className="font-medium mb-1">Live Chat</h3>
            <p className="text-sm text-gray-500">24/7 support</p>
          </button>
          <button
            onClick={() => window.open("tel:998933547854", "_blank")}
            className="p-6 bg-gray-900/50 rounded-lg border cursor-pointer border-gray-800 hover:border-red-600 transition-all group"
          >
            <IoCallOutline className="text-3xl text-gray-400 group-hover:text-red-600 mb-3" />
            <h3 className="font-medium mb-1">Call Us</h3>
            <p className="text-sm text-gray-500">+998 93&#41;354-78-54</p>
          </button>
          <button className="p-6 bg-gray-900/50 rounded-lg border cursor-pointer border-gray-800 hover:border-red-600 transition-all group">
            <IoDocumentTextOutline className="text-3xl text-gray-400 group-hover:text-red-600 mb-3" />
            <h3 className="font-medium mb-1">Documentation</h3>
            <p className="text-sm text-gray-500">API & guides</p>
          </button>
        </div>
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <IoDocumentTextOutline className="text-red-600" />
            Frequently Asked Questions
          </h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFaqCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    faqCategory === cat.id
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <Icon className="text-sm" />
                  {cat.name}
                </button>
              );
            })}
          </div>
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <h3 className="font-medium text-white">{faq.question}</h3>
                    <IoChevronForward className="text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-gray-400 border-t border-gray-800">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <IoChatbubbleOutline className="text-red-600" />
            Send us your feedback
          </h2>
          <form
            onSubmit={handleSubmitFeedback}
            className="bg-gray-900/50 rounded-lg border border-gray-800 p-6"
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Feedback Type
              </label>
              <div className="flex flex-wrap gap-4">
                {["general", "bug", "feature", "other"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="feedbackType"
                      value={type}
                      checked={feedbackType === type}
                      onChange={(e) => setFeedbackType(e.target.value)}
                      className="text-red-600 focus:ring-red-600 bg-gray-800 border-gray-700"
                    />
                    <span className="text-gray-300 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Rate your experience
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    {star <= (hoverRating || rating) ? (
                      <IoStar className="text-yellow-500 text-3xl" />
                    ) : (
                      <IoStarOutline className="text-gray-500 text-3xl hover:text-yellow-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-red-600 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-red-600 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-red-600 focus:outline-none transition-colors resize-none"
                placeholder="Tell us what you think..."
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Send Feedback
            </button>
          </form>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4">Get in touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <IoMailOutline className="text-red-600 text-xl mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-400">userjon800@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IoCallOutline className="text-red-600 text-xl mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-400">+998 93&#41;354-78-54</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IoChatbubbleOutline className="text-red-600 text-xl mt-1" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-gray-400">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
            <h3 className="text-xl font-bold mb-4">Follow us</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest news and features
            </p>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  window.open("https://x.com/userjon800", "_blank")
                }
                className="w-12 h-12 cursor-pointer bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <IoLogoTwitter className="text-xl" />
              </button>
              <button
                onClick={() =>
                  window.open("https://github.com/userjon800-spec", "_blank")
                }
                className="w-12 h-12 cursor-pointer bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <IoLogoGithub className="text-xl" />
              </button>
              <button
                onClick={() =>
                  window.open("https://www.instagram.com/j9v0h1r/", "_blank")
                }
                className="w-12 h-12 cursor-pointer bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <IoLogoInstagram className="text-xl" />
              </button>
              <button
                onClick={() =>
                  window.open("https://t.me/Xamdamb0yev", "_blank")
                }
                className="w-12 h-12 cursor-pointer bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FaTelegramPlane className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}