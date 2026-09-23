"use client";

import { useState } from "react";
import type { ReactElement, SubmitEvent, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Mail,
  Check,
  BookOpen,
  BookMarked,
  Compass,
} from "lucide-react";

interface QuickLinkItem {
  href: string;
  label: string;
}

const libraryLinks: readonly QuickLinkItem[] = [
  { href: "/", label: "Library & Search" },
  { href: "/plan-to-read", label: "My Bookshelf" },
  { href: "/plan-to-read?tab=journal", label: "My Reviews & Notes" },
  { href: "/plan-to-read?tab=journeys", label: "Curated Journeys" },
  { href: "/plan-to-read?tab=goals", label: "Reading Goals & Stats" },
] as const;

const popularSubjects: readonly QuickLinkItem[] = [
  { href: "/?subject=classic_literature", label: "Classic Literature" },
  { href: "/?subject=philosophy", label: "Philosophy" },
  { href: "/?subject=science_fiction", label: "Science Fiction" },
  { href: "/?subject=fantasy", label: "Fantasy" },
  { href: "/?subject=history", label: "History" },
] as const;

const Footer = (): ReactElement => {
  const [email, setEmail] = useState<string>("");
  const [subscriptionState, setSubscriptionState] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (subscriptionState === "error") {
      setSubscriptionState("idle");
      setFeedbackMessage("");
    }
  };

  const handleSubscribe = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed) {
      setSubscriptionState("error");
      setFeedbackMessage("Please enter an email address.");
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setSubscriptionState("error");
      setFeedbackMessage("Please enter a valid email address.");
      return;
    }

    setSubscriptionState("success");
    setFeedbackMessage(
      `Thanks for subscribing! We'll send occasional book recommendations to ${trimmed}.`,
    );
  };

  const handleResetSubscription = (): void => {
    setEmail("");
    setSubscriptionState("idle");
    setFeedbackMessage("");
  };

  const scrollToTop = (): void => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-20 border-t border-[#352419] bg-[#18100A] text-[#EFE4D8]">
      <div className="container mx-auto max-w-7xl px-4 pt-12 pb-10 lg:px-6">
        {/* Newsletter Box */}
        <div className="relative mb-12 overflow-hidden rounded-2xl border border-[#3B281D] bg-linear-to-br from-[#241710] via-[#1E130D] to-[#170E08] p-6 shadow-lg sm:p-8">
          <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3324] bg-[#2E1E14]/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                <BookMarked className="h-3.5 w-3.5" />
                <span>Reading Newsletter</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Get occasional book recommendations
              </h3>
              <p className="max-w-xl text-xs sm:text-sm text-[#C4B2A5] leading-relaxed">
                Receive handpicked titles, reading lists, and new book
                highlights. No spam, unsubscribe anytime.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscriptionState === "success" ? (
                <div className="rounded-xl border border-[#4E392B] bg-[#2A1C13]/90 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">Subscribed</p>
                      <p className="mt-1 text-xs text-[#D8C7BA] leading-relaxed">
                        {feedbackMessage}
                      </p>
                      <Button
                        onClick={handleResetSubscription}
                        className="mt-2 text-xs font-semibold text-secondary hover:underline"
                      >
                        Subscribe another email
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9E8A7C]" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        aria-label="Email for book recommendations"
                        className="w-full rounded-xl border border-[#3D291D] bg-[#140C07] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#877263] transition focus:border-secondary focus:outline-hidden"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-primary-hover transition"
                    >
                      Subscribe
                    </Button>
                  </div>

                  {subscriptionState === "error" && (
                    <p className="text-xs text-rose-400 font-medium">
                      {feedbackMessage}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-secondary transition hover:text-[#E8BC91]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2C1C13] p-1.5 text-base text-secondary ring-1 ring-[#4A3223]">
                <Image
                  src="/icons/coffee.svg"
                  alt="Book Vibe logo"
                  width={18}
                  height={18}
                  className="h-4 w-4 invert"
                  style={{ width: "auto", height: "auto" }}
                />
              </span>
              Book <span className="text-white">Vibe</span>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-[#C4B2A5]">
              A simple, distraction-free book tracking app. Track books on your
              shelf, write personal notes and reviews, and explore millions of
              titles from Open Library.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#B8A494]">
              <span className="rounded-lg border border-[#3A271B] bg-[#22150E] px-2.5 py-1">
                📚 Shelf Tracking
              </span>
              <span className="rounded-lg border border-[#3A271B] bg-[#22150E] px-2.5 py-1">
                ✍️ Personal Reviews
              </span>
              <span className="rounded-lg border border-[#3A271B] bg-[#22150E] px-2.5 py-1">
                🔒 Saved Locally
              </span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
              <BookOpen className="h-4 w-4" />
              <span>Navigation</span>
            </h4>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#C4B2A5]">
              {libraryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
              <Compass className="h-4 w-4" />
              <span>Popular Genres</span>
            </h4>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#C4B2A5]">
              {popularSubjects.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#302016] pt-6 text-xs text-[#9E8A7C] sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Book Vibe. Minimal book tracking
            for readers.
          </p>

          <Button
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#3D2B20] bg-[#241710] px-3 py-1.5 text-xs font-semibold text-secondary hover:border-primary hover:bg-[#2F1F15] hover:text-white transition"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
