import MenuBar from "@/components/menu-bar";
import Link from "next/link";
import {
  IoCodeSlash,
  IoBugOutline,
  IoMailOutline,
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoHeartOutline,
  IoRocketOutline,
  IoFlashOutline,
} from "react-icons/io5";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { BsTypescript } from "react-icons/bs";
import { SiExpress, SiMongodb } from "react-icons/si";
import { MdMovie } from "react-icons/md";
import { description } from "@/utils";
export default function AboutPage() {
  const mainPart = [
    {
      name: "Next.js",
      icon: <RiNextjsFill className="w-7.5 h-7.5" />,
      color: "text-white",
    },
    {
      name: "React",
      icon: <FaReact className="w-7.5 h-7.5" />,
      color: "text-blue-400",
    },
    {
      name: "TypeScript",
      icon: <BsTypescript className="w-7.5 h-7.5 text-[blue]" />,
      color: "text-blue-500",
    },
    {
      name: "Tailwind CSS",
      icon: <RiTailwindCssFill className="text-[#38BDF8] w-7.5 h-7.5" />,
      color: "text-cyan-400",
    },
    {
      name: "Node.js",
      icon: <FaNodeJs className="w-7.5 h-7.5 text-[#4B9642]" />,
      color: "text-green-500",
    },
    {
      name: "Express",
      icon: <SiExpress className="w-7.5 h-7.5" />,
      color: "text-gray-400",
    },
    {
      name: "MongoDB",
      icon: <SiMongodb className="w-7.5 h-7.5 text-[#4AA73C]" />,
      color: "text-green-600",
    },
    {
      name: "TMDB API",
      icon: <MdMovie className="w-7.5 h-7.5 text-[#0EB5DF]" />,
      color: "text-yellow-500",
    },
  ];
  return (
    <div className="min-h-screen bg-black text-white">
      <MenuBar />
      <div className="max-w-1520 mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-red-600 to-red-800 rounded-full mb-4">
            <IoCodeSlash className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            About This Project
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A Netflix-inspired movie platform built with passion and modern
            technologies
          </p>
        </div>
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-linear-to-br from-gray-900/50 to-gray-900/30 rounded-2xl border border-gray-800 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    J
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <IoHeartOutline className="text-white text-lg" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Javohir Xamdamboyev
                </h2>
                <p className="text-red-500 mb-4">Full Stack Developer</p>
                <p className="text-gray-400 mb-6">
                  Passionate developer with a love for creating beautiful and
                  functional web applications. This project is a demonstration
                  of modern web development practices and Netflix-inspired
                  design.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <Link
                    href="https://github.com/userjon800-spec"
                    target="_blank"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <IoLogoGithub className="text-xl" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/javohir-xamdamboyev-701765380/"
                    target="_blank"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <IoLogoLinkedin className="text-xl" />
                  </Link>
                  <Link
                    href="https://x.com/userjon800"
                    target="_blank"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <IoLogoTwitter className="text-xl" />
                  </Link>
                  <Link
                    href="mailto:userjon800@gmail.com"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <IoMailOutline className="text-xl" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <IoRocketOutline className="text-red-600" />
            Project Status
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <IoFlashOutline className="text-blue-500 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fresh Project</h3>
              <p className="text-gray-400 text-sm">
                This is a newly developed project, actively being improved and
                updated. New features are being added regularly.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                <IoBugOutline className="text-yellow-500 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Beta Version</h3>
              <p className="text-gray-400 text-sm">
                Currently in beta stage. Some features might not work as
                expected. Your feedback helps improve the platform.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <IoCodeSlash className="text-red-600" />
            Built With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainPart.map((tech) => (
              <div
                key={tech.name}
                className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 text-center hover:border-red-600 transition-colors group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform flex items-center justify-center">
                  {tech.icon}
                </div>
                <h3 className={`font-medium text-sm ${tech.color}`}>
                  {tech.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <IoBugOutline className="text-red-600" />
            Known Issues & Improvements
          </h2>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <p className="text-gray-300 mb-4">
              As this is a new project, you might encounter some issues. Here
              are things we're working on:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-400">
                  Mobile responsiveness on some pages needs improvement
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-400">
                  Search functionality might be slow with large queries
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-400">
                  Some images may not load properly on first visit
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-400">
                  Like/Save features occasionally need page refresh to update
                </span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
              <p className="text-sm text-yellow-500 flex items-center gap-2">
                <IoBugOutline className="text-lg" />
                Found a bug? Please report it through the help page or contact
                directly.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <IoRocketOutline className="text-red-600" />
            Coming Soon
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {description.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 hover:border-red-600 transition-colors"
              >
                <h3 className="font-semibold mb-1 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}