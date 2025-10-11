// src/pages/Welcome.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useAnimation,
  useInView,
  Variants,
  AnimatePresence,
} from "framer-motion";
import { MessageCircle, Repeat2, Heart, Share2 } from "lucide-react";

import image1 from "/images/iphone15.png";
import image2 from "/images/iphone-16.png";
import image4 from "/images/iphone-17(1).png";
import image5 from "/images/iphone-17(2).png";
import image6 from "/images/iphone-17(3).png";
import image7 from "/images/study-group-african-people 1.png";
import image0 from "/images/Vector.png";
import image8 from "/images/post.png";
import image9 from "/images/iphone-16(1).png";
import image10 from "/images/iphone-16(2).png";

/**
 * Fully animated Welcome page (TypeScript + React + Framer Motion + Tailwind)
 * - Framer Motion animations on every element (text, buttons, images, backgrounds)
 * - Scroll-triggered reveals for each section
 *
 * Requirements:
 *  - npm i framer-motion
 *  - Tailwind configured
 *  - Add image module declarations if TypeScript complains:
 *      declare module '*.png';
 *      declare module '*.jpg';
 *      declare module '*.svg';
 */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

const fadeInSlow: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9 } },
};

const floatSlow: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 1, -1, 0],
    transition: { repeat: Infinity, duration: 6.5, ease: "easeInOut" },
  },
};

const floatGentle: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: { repeat: Infinity, duration: 5.6, ease: "easeInOut" },
  },
};

function useRevealControls(ref: React.RefObject<HTMLElement>) {
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, margin: "-120px" });
  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);
  return controls;
}

export default function Welcome(): JSX.Element {
  const navigate = useNavigate();
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if (/Android/i.test(navigator.userAgent)) setIsAndroid(true);
  }, []);

  const handleSignUp = () => navigate("/signup");
  const handleLogin = () => navigate("/login");

  // Section refs
  const heroRef = useRef<HTMLElement | null>(null);
  const platformRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const engageRef = useRef<HTMLElement | null>(null);
  const oppRef = useRef<HTMLElement | null>(null);
  const readyRef = useRef<HTMLElement | null>(null);
  const finalRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  const heroControls = useRevealControls(heroRef);
  const platformControls = useRevealControls(platformRef);
  const featuresControls = useRevealControls(featuresRef);
  const engageControls = useRevealControls(engageRef);
  const oppControls = useRevealControls(oppRef);
  const readyControls = useRevealControls(readyRef);
  const finalControls = useRevealControls(finalRef);
  const footerControls = useRevealControls(footerRef);

  return (
    <div className="min-h-screen w-full bg-[#750015] font-sans text-white overflow-x-hidden">
      {/* Header */}
      <motion.header
        className="p-4 sm:p-6 lg:p-8 bg-[#750015] sticky top-0 z-40 backdrop-blur-sm"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
      >
        <div className="flex flex-row items-center justify-between mx-auto max-w-7xl">
          <motion.div
            className="flex flex-row items-center gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.img
              src={image0}
              alt="Varsigram logo"
              className="w-8 h-8 lg:w-12 lg:h-12"
              variants={fadeUp}
              whileHover={{ scale: 1.08, rotate: 6 }}
              transition={{ type: "spring", stiffness: 140 }}
            />
            <motion.h2
              className="text-lg font-bold text-white select-none lg:text-xl"
              variants={fadeUp}
            >
              Varsigram
            </motion.h2>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 lg:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
          >
            <motion.a
              href="https://www.linkedin.com/company/varsigram/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs font-semibold text-white lg:text-base hover:text-blue-300 sm:block"
              whileHover={{ scale: 1.06 }}
            >
              Linkedin
            </motion.a>

            <motion.a
              href="https://www.instagram.com/thevarsigram"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs font-semibold text-white lg:text-base hover:text-pink-300 sm:block"
              whileHover={{ scale: 1.06 }}
            >
              Instagram
            </motion.a>

            <motion.a
              href="https://x.com/thevarsigram"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs font-semibold text-white lg:text-base hover:text-blue-400 sm:block"
              whileHover={{ scale: 1.06 }}
            >
              X
            </motion.a>

            <motion.button
              onClick={handleSignUp}
              className="bg-white text-[#750015] px-4 py-2 rounded-md text-xs lg:text-base font-semibold"
              whileHover={{
                scale: 1.06,
                boxShadow: "0 8px 30px rgba(255,255,255,0.12)",
              }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* HERO */}
      <motion.section
        ref={heroRef as any}
        className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16 bg-[#750015] relative overflow-visible"
        initial="hidden"
        animate={heroControls}
        variants={containerVariants}
      >
        <div className="grid items-center gap-8 mx-auto max-w-7xl lg:grid-cols-2 lg:gap-12">
          {/* Left — Text */}
          <motion.div
            className="space-y-6 text-white"
            variants={containerVariants}
          >
            <motion.h1
              className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl"
              variants={fadeUp}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 80, duration: 0.9 }}
              >
                Be In The Conversation With A
              </motion.span>

              <motion.span
                className="text-[#FF6682] block"
                variants={{
                  hidden: { opacity: 0, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.8 },
                  },
                }}
                animate={{ rotate: [0, 2, -1.5, 0] }}
                transition={{ repeat: 0, duration: 1.2 }}
              >
                Vars.
              </motion.span>
            </motion.h1>

            <motion.p
              className="max-w-xl text-sm leading-relaxed sm:text-base lg:text-lg text-white/90"
              variants={fadeUp}
            >
              Discover real-time information on Varsigram to stay up to date on
              campus news, directly from verified sources. Connect with other
              students across faculties and showcase your talent.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 pt-2 sm:flex-row"
              variants={containerVariants}
            >
              <motion.button
                onClick={handleSignUp}
                className="bg-white text-[#750015] px-6 py-3 rounded-lg font-semibold text-sm lg:text-base"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 40px rgba(255,255,255,0.12)",
                }}
                variants={fadeUp}
              >
                Sign Up Now
              </motion.button>

              <motion.button
                onClick={handleLogin}
                className="px-6 py-3 text-sm font-semibold text-white bg-transparent border-2 border-white rounded-lg lg:text-base"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgb(255,255,255,0.95)",
                  color: "#750015",
                }}
                variants={fadeUp}
              >
                Log In
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {isAndroid && (
                <motion.a
                  href="/base1.apk"
                  download
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    className="px-6 py-3 mt-2 text-sm font-semibold text-white border-2 border-white rounded-lg lg:text-base"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 12px 40px rgba(255,255,255,0.08)",
                    }}
                    variants={fadeUp}
                  >
                    Download here
                  </motion.button>
                </motion.a>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right — Overlapping Phones */}
          <motion.div
            className="relative flex justify-center mb-8 lg:justify-end lg:mb-0"
            variants={fadeUp}
          >
            <motion.div
              className="relative w-full max-w-sm md:max-w-md h-[420px] sm:h-[520px] md:h-[620px]"
              variants={floatSlow}
              animate="animate"
            >
              <motion.img
                src={image8}
                alt="App preview back"
                className="absolute right-4 top-[8%] z-10 object-contain w-[62%] md:w-[58%] h-auto drop-shadow-2xl"
                initial={{ x: 80, opacity: 0, rotate: -6 }}
                animate={{ x: 0, opacity: 1, rotate: -2 }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 16,
                  duration: 0.95,
                }}
                whileHover={{ scale: 1.03 }}
              />
              <motion.img
                src={image1}
                alt="App preview front"
                className="absolute left-0 top-0 z-20 object-contain w-[65%] md:w-[60%] h-auto"
                initial={{ x: -80, opacity: 0, rotate: 6 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 14,
                  duration: 1,
                }}
                whileHover={{ scale: 1.04, rotate: 2 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Platform Description */}
      <motion.section
        ref={platformRef as any}
        className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-[#750015] mt-10"
        initial="hidden"
        animate={platformControls}
        variants={containerVariants}
      >
        <motion.div
          className="mx-auto text-center text-white max-w-7xl"
          variants={fadeUp}
        >
          <motion.h2
            className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl lg:mb-4"
            variants={fadeUp}
          >
            Your Favorite University Student Platform
          </motion.h2>
          <motion.p
            className="max-w-4xl mx-auto text-base leading-relaxed sm:text-lg lg:text-xl"
            variants={fadeUp}
          >
            Build meaningful networks, follow top organisations, get one-on-one
            with your campus and join insightful conversations.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        ref={featuresRef as any}
        className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-[#750015]"
        initial="hidden"
        animate={featuresControls}
        variants={containerVariants}
      >
        <motion.div className="grid gap-6 mx-auto max-w-7xl md:grid-cols-2 lg:gap-8">
          {/* Follow Organisations */}
          <motion.div
            className="bg-[#5A0010] rounded-3xl p-6 lg:p-10 border-2 border-white/10 overflow-visible"
            variants={fadeUp}
          >
            <motion.h3
              className="mb-3 text-xl font-bold text-white sm:text-2xl lg:text-3xl lg:mb-4"
              variants={fadeUp}
            >
              Follow Organisations and Student Associations
            </motion.h3>
            <motion.p
              className="mb-6 text-sm leading-relaxed sm:text-base text-white/80 lg:mb-8"
              variants={fadeUp}
            >
              Get in smart control of when school updates or Varsigram host
              featured verified educational content on your feed.
            </motion.p>

            <motion.div
              className="relative flex justify-center h-[280px] sm:h-[320px] lg:h-[380px]"
              variants={fadeUp}
            >
              <motion.img
                src={image2}
                alt="Organizations left"
                className="absolute left-[10%] sm:left-[15%] bottom-0 z-20 w-[45%] sm:w-[42%] h-auto object-contain drop-shadow-2xl"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
                variants={floatGentle}
              />
              <motion.img
                src={image4}
                alt="Organizations right"
                className="absolute right-[10%] sm:right-[15%] bottom-0 z-10 w-[45%] sm:w-[42%] h-auto object-contain drop-shadow-2xl"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06, duration: 0.95 }}
                variants={floatSlow}
              />
            </motion.div>
          </motion.div>

          {/* Connect with Coursemates */}
          <motion.div
            className="p-6 bg-white rounded-3xl lg:p-10"
            variants={fadeUp}
          >
            <motion.h3
              className="mb-3 text-xl font-bold text-black sm:text-2xl lg:text-3xl lg:mb-4"
              variants={fadeUp}
            >
              Connect with coursemates across your faculty and beyond
            </motion.h3>
            <motion.p
              className="mb-6 text-sm leading-relaxed text-gray-700 sm:text-base lg:mb-8"
              variants={fadeUp}
            >
              Find and connect with mates in your Faculty, Level or even a
              different course — expand your network.
            </motion.p>

            <motion.div
              className="relative flex justify-center h-[280px] sm:h-[320px] lg:h-[380px]"
              variants={fadeUp}
            >
              <motion.img
                src={image10}
                alt="Connections center"
                className="absolute  -translate-x-1/2 bottom-0 z-30 w-[55%] sm:w-[50%] h-auto object-contain drop-shadow-2xl"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
                variants={floatGentle}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Engage Section */}
      <motion.section
        ref={engageRef as any}
        className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-[#750015] overflow-visible"
        initial="hidden"
        animate={engageControls}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div className="bg-gradient-to-r from-[#FF8BA7] to-[#FFC6D3] rounded-3xl p-6 lg:p-12 grid lg:grid-cols-2 gap-8 items-center overflow-visible relative min-h-[400px] lg:min-h-[450px]">
            {/* background lines */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-20"
              aria-hidden
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="100"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1="20"
                  x2="100"
                  y2="80"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1="40"
                  x2="100"
                  y2="60"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </motion.div>

            <motion.div
              className="relative z-10 p-2 text-white"
              variants={containerVariants}
            >
              <motion.h3
                className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl lg:mb-6"
                variants={fadeUp}
              >
                Engage vibrant and insightful conversations with a{" "}
                <span className="text-[#750015] bg-white/80 px-1 rounded-sm">
                  Vars
                </span>
              </motion.h3>
              <motion.p
                className="mb-6 text-base lg:text-lg lg:mb-8"
                variants={fadeUp}
              >
                Have unique and one-of-a-kind conversationalists at your
                fingertips.
              </motion.p>

              <motion.button
                onClick={handleSignUp}
                className="bg-white text-[#750015] px-6 lg:px-8 py-3 rounded-lg font-semibold text-sm lg:text-base"
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
                }}
                variants={fadeUp}
              >
                Start Here
              </motion.button>
            </motion.div>

            <motion.div
              className="relative z-10 flex justify-center lg:justify-end h-[350px] lg:h-[400px]"
              variants={fadeUp}
            >
              <motion.div
                className="relative w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]"
                variants={fadeUp}
              >
                <motion.img
                  src={image9}
                  alt="Conversations"
                  className="relative z-30 object-contain w-full h-full drop-shadow-2xl"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  whileHover={{ scale: 1.03 }}
                />

                {/* Post cards */}
                <motion.div
                  className="absolute left-[-50%] sm:left-[-45%] lg:left-[-40%] top-[12%] z-40 w-full lg:w-full bg-white rounded-lg shadow-2xl"
                  initial={{ x: -60, opacity: 0, rotate: -2 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 12,
                    delay: 0.14,
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="p-2 border border-gray-200 rounded-lg sm:p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-semibold text-white bg-orange-500 rounded-full sm:w-8 sm:h-8 sm:text-sm">
                        K
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                          Kponane Ogan
                        </h3>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">
                          Just now
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-[9px] sm:text-[11px] leading-relaxed text-gray-700">
                        I just joined the community and I'm very excited.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 sm:gap-3">
                      <button className="flex items-center gap-1 text-gray-600">
                        <MessageCircle size={12} />
                        <span className="text-[8px] sm:text-[10px]">13.6k</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600">
                        <Repeat2 size={12} />
                        <span className="text-[8px] sm:text-[10px]">Share</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600">
                        <Heart size={12} />
                        <span className="text-[8px] sm:text-[10px]">3.7k</span>
                      </button>
                      <button className="flex items-center ml-auto text-gray-600">
                        <Share2 size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute left-[-50%] sm:left-[-45%] lg:left-[-35%] top-[48%] sm:top-[50%] z-40 w-full bg-white rounded-lg shadow-2xl"
                  initial={{ x: -60, opacity: 0, rotate: -2 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 12,
                    delay: 0.28,
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="p-2 border border-gray-200 rounded-lg sm:p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-semibold text-white bg-orange-500 rounded-full sm:w-8 sm:h-8 sm:text-sm">
                        A
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                          Adaazra Ike
                        </h3>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">
                          Just now
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-[9px] sm:text-[11px] leading-relaxed text-gray-700 line-clamp-2 sm:line-clamp-3">
                        The tech industry's rapid evolution has changed the
                        concept of security...
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 sm:gap-3">
                      <button className="flex items-center gap-1 text-gray-600">
                        <MessageCircle size={12} />
                        <span className="text-[8px] sm:text-[10px]">7.1k</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600">
                        <Repeat2 size={12} />
                        <span className="text-[8px] sm:text-[10px]">Share</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600">
                        <Heart size={12} />
                        <span className="text-[8px] sm:text-[10px]">1.4k</span>
                      </button>
                      <button className="flex items-center ml-auto text-gray-600">
                        <Share2 size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Opportunities */}
      <motion.section
        ref={oppRef as any}
        className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-[#750015]"
        initial="hidden"
        animate={oppControls}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="grid overflow-hidden bg-white rounded-3xl lg:grid-cols-2"
            variants={fadeUp}
          >
            <motion.div
              className="flex flex-col justify-center order-2 p-6 lg:p-12 lg:order-1"
              variants={fadeUp}
            >
              <motion.div
                className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-600 lg:text-base"
                variants={fadeUp}
              >
                <span>Coming Soon</span>
                <span>→</span>
              </motion.div>
              <motion.h3
                className="mb-4 text-3xl font-bold text-black sm:text-4xl lg:text-5xl"
                variants={fadeUp}
              >
                Your Opportunities,
              </motion.h3>
              <motion.h3
                className="mb-4 text-2xl font-bold text-[#750015] sm:text-3xl lg:text-4xl"
                variants={fadeUp}
              >
                All in one Place
              </motion.h3>
              <motion.p
                className="text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg"
                variants={fadeUp}
              >
                Find and apply for internships, scholarships, and jobs all
                within-platform, tailored and timely.
              </motion.p>
            </motion.div>

            <motion.div
              className="relative flex items-center justify-center order-1 p-6 overflow-hidden bg-white lg:p-12 lg:order-2"
              variants={fadeUp}
            >
              <motion.div
                className="absolute w-full h-full pointer-events-none"
                aria-hidden
              >
                <motion.div
                  className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 border-[25px] sm:border-[35px] lg:border-[45px] border-[#FFB3C6] rounded-full opacity-40"
                  variants={floatSlow}
                  animate="animate"
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 lg:w-60 lg:h-60 border-[20px] sm:border-[28px] lg:border-[35px] border-[#FFB3C6] rounded-full opacity-40"
                  variants={floatGentle}
                  animate="animate"
                />
              </motion.div>

              <motion.img
                src={image6}
                alt="Opportunities phone"
                className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px] h-auto object-contain drop-shadow-2xl"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
                whileHover={{ scale: 1.03 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Ready to Make */}
      <motion.section
        ref={readyRef as any}
        className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-[#750015]"
        initial="hidden"
        animate={readyControls}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="bg-gradient-to-br from-[#FFD5E0] to-[#FFC6D3] rounded-3xl overflow-hidden grid lg:grid-cols-2"
            variants={fadeUp}
          >
            <motion.div
              className="relative flex items-center justify-center p-6 overflow-hidden lg:p-12"
              variants={fadeUp}
            >
              <motion.div
                className="absolute w-full h-full pointer-events-none"
                aria-hidden
              >
                <motion.div
                  className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 border-[25px] sm:border-[35px] lg:border-[45px] border-[#FFB3C6] rounded-full opacity-40"
                  variants={floatSlow}
                  animate="animate"
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-36 h-36 sm:w-48 sm:h-48 lg:w-60 lg:h-60 border-[20px] sm:border-[28px] lg:border-[35px] border-[#FFB3C6] rounded-full opacity-40"
                  variants={floatGentle}
                  animate="animate"
                />
              </motion.div>

              <motion.img
                src={image5}
                alt="Create Vars phone"
                className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px] h-auto object-contain drop-shadow-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 68, damping: 14 }}
                whileHover={{ scale: 1.03 }}
              />
            </motion.div>

            <motion.div
              className="flex flex-col justify-center p-6 lg:p-12"
              variants={fadeUp}
            >
              <motion.h3
                className="mb-2 text-2xl font-bold text-black sm:text-3xl lg:text-4xl"
                variants={fadeUp}
              >
                Ready to make your
              </motion.h3>
              <motion.h3
                className="mb-6 text-3xl font-bold text-[#750015] sm:text-4xl lg:text-5xl lg:mb-8"
                variants={fadeUp}
              >
                FIRST Vars?
              </motion.h3>
              <motion.button
                onClick={handleSignUp}
                className="bg-[#750015] text-white px-6 lg:px-8 py-3 rounded-lg font-semibold w-fit text-sm lg:text-base"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 80px rgba(0,0,0,0.22)",
                }}
                variants={fadeUp}
              >
                Download Here
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        ref={finalCtaRef} // Ensure you use the correct ref variable (finalCtaRef from the provided code)
        variants={container}
        initial="initial"
        animate={isFinalCtaVisible ? "animate" : "initial"}
        className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-[#750015]"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative grid items-center gap-4 lg:grid-cols-2">
            {/* 1. IMAGE CONTAINER - Set to span both columns on large screens to make it bigger */}
            <motion.div
              variants={fadeIn}
              className="relative order-2 col-span-full lg:col-span-2 h-72 sm:h-96 lg:h-[500px] overflow-hidden rounded-3xl"
            >
              <img
                src={image7}
                alt="Community"
                className="object-cover w-full h-full"
              />
            </motion.div>

            {/* 2. TEXT CONTAINER - Positioned absolutely to overlap the image */}
            <motion.div
              variants={fadeIn}
              className="absolute left-0 z-10 order-1 w-full p-4 text-white -translate-y-1/2 top-1/2 sm:w-2/3 lg:w-1/2 sm:p-6 lg:p-12"
            >
              <h3 className="text-3xl font-bold leading-snug sm:text-4xl lg:text-5xl xl:text-6xl text-shadow-lg">
                Join 500+ on Varsigram today!
              </h3>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        ref={footerRef as any}
        className="px-4 sm:px-6 lg:px-8 py-8 bg-[#5A0010]"
        initial="hidden"
        animate={footerControls}
        variants={fadeInSlow}
      >
        <motion.div
          className="flex flex-wrap justify-center gap-6 mx-auto text-sm text-white max-w-7xl lg:gap-8 lg:text-base"
          variants={containerVariants}
        >
          <motion.a
            href="https://www.linkedin.com/company/varsigram/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-blue-300"
            whileHover={{ scale: 1.06 }}
          >
            LinkedIn
          </motion.a>
          <motion.a
            href="https://www.instagram.com/thevarsigram"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-pink-300"
            whileHover={{ scale: 1.06 }}
          >
            Instagram
          </motion.a>
          <motion.a
            href="https://x.com/thevarsigram"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-blue-400"
            whileHover={{ scale: 1.06 }}
          >
            X
          </motion.a>
        </motion.div>
      </motion.footer>
    </div>
  );
}
