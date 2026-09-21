"use client";

import { useState } from "react";
import type { ReactElement, SubmitEvent, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUp,
  Mail,
  Check,
  Sparkles,
  BookOpen,
  Heart,
  Compass,
} from "lucide-react";

interface QuickLinkItem {
  href: string;
  label: string;
  badge?: string;
}

const libraryLinks: readonly QuickLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/allbooks", label: "All Books", badge: "100" },
  { href: "/plan-to-read", label: "Plan to Read" },
  { href: "/#books", label: "Best Sellers" },
] as const;

const genreLinks: readonly QuickLinkItem[] = [
  { href: "/allbooks", label: "Philosophy & Thoughts" },
  { href: "/allbooks", label: "Classical Masterpieces" },
  { href: "/allbooks", label: "Islamic Masterworks" },
  { href: "/allbooks", label: "Historical Fiction" },
  { href: "/allbooks", label: "Psychological Fiction" },
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
      setFeedbackMessage("Please enter your email address to receive a note.");
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setSubscriptionState("error");
      setFeedbackMessage(
        "Please enter a valid email address (e.g. your@email.com).",
      );
      return;
    }

    setSubscriptionState("success");
    setFeedbackMessage(
      `We have saved ${trimmed}. A quiet note will arrive when the next letter is ready.`,
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
      <div className="container mx-auto max-w-7xl px-4 pt-14 pb-10 lg:px-6">
        <div className="relative mb-14 overflow-hidden rounded-3xl border border-[#3B281D] bg-linear-to-br from-[#241710] via-[#1E130D] to-[#170E08] p-6 shadow-xl sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#8B5A2B]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#D4A373]/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3324] bg-[#2E1E14]/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4A373] backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#E5A93C]" />
                <span>A Quiet Note for Readers</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                A little something to read when the day gets quiet.
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-[#C4B2A5] sm:text-base">
                Sometimes it is nice to have a few words waiting for you. A
                little reading, a little thought, and something worth keeping
                for later.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscriptionState === "success" ? (
                <div className="rounded-2xl border border-[#4E392B] bg-[#2A1C13]/90 p-5 backdrop-blur-xs">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8B5A2B] text-white shadow-md">
                      <Check className="h-5 w-5 stroke-[2.5]" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">
                        Saved for Later
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#D8C7BA]">
                        {feedbackMessage}
                      </p>
                      <button
                        type="button"
                        onClick={handleResetSubscription}
                        className="mt-3 text-xs font-semibold text-[#D4A373] underline-offset-4 hover:text-white hover:underline"
                      >
                        Send to another email
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9E8A7C]" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="your@email.com"
                        aria-label="Email address for quiet note"
                        className={`w-full rounded-xl border bg-[#140C07] py-3 pl-10 pr-4 text-sm text-white placeholder-[#877263] transition duration-200 focus:outline-hidden focus:ring-2 ${
                          subscriptionState === "error"
                            ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
                            : "border-[#3D291D] focus:border-[#D4A373] focus:ring-[#D4A373]/20"
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#8B5A2B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#8B5A2B]/25 transition-all duration-200 hover:bg-[#6F4420] active:scale-[0.98]"
                    >
                      <span>Keep Me Posted</span>
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>

                  {subscriptionState === "error" && (
                    <p className="text-xs font-medium text-rose-300">
                      {feedbackMessage}
                    </p>
                  )}

                  <p className="text-xs text-[#9E8A7C]">
                    No noise. Just a small note now and then. You can leave
                    whenever you want.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#D4A373] transition hover:text-[#E8BC91]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2C1C13] p-2 text-lg text-[#D4A373] ring-1 ring-[#4A3223]">
                <Image
                  src="/icons/coffee.svg"
                  alt="Book Vibe logo"
                  width={20}
                  height={20}
                  className="h-4.5 w-4.5 invert"
                />
              </span>
              Book <span className="text-white">Vibe</span>
            </Link>

            <p className="max-w-sm text-sm leading-6 text-[#C4B2A5]">
              A quiet place for people who like books, slow evenings, and
              thoughts that stay a little longer than expected. Sit down, take
              your time, and find something to read.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#B8A494]">
              <span className="rounded-lg border border-[#3A271B] bg-[#22150E] px-2.5 py-1">
                ☕ Slow Mornings
              </span>
              <span className="rounded-lg border border-[#3A271B] bg-[#22150E] px-2.5 py-1">
                📖 Books Worth Keeping
              </span>
              <span className="rounded-lg border border-[#3A271B] bg-[#22150E] px-2.5 py-1">
                🌙 Quiet Evenings
              </span>
            </div>

            <div className="pt-2 text-xs text-[#9E8A7C]">
              Always open for late-night readers and people who still want one
              more chapter.
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4A373]">
              <BookOpen className="h-4 w-4" />
              <span>The Library</span>
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#C4B2A5]">
              {libraryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="rounded-md bg-[#2C1C13] px-1.5 py-0.5 text-[10px] font-bold text-[#D4A373] ring-1 ring-[#4A3223]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4A373]">
              <Compass className="h-4 w-4" />
              <span>Literary Aisles</span>
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#C4B2A5]">
              {genreLinks.map((genre) => (
                <li key={genre.label}>
                  <Link
                    href={genre.href}
                    className="group inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8B5A2B] transition group-hover:bg-[#D4A373]" />
                    <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                      {genre.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4A373]">
              <Heart className="h-4 w-4 text-[#D4A373]" />
              <span>Weekly Epigraph</span>
            </h4>

            <div className="rounded-2xl border border-[#38261B] bg-[#22160F] p-4 text-xs">
              <p className="italic leading-relaxed text-[#D8C7BA]">
                &ldquo;A book must be the axe for the frozen sea within
                us.&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-[#352317] pt-2 text-[11px] text-[#9E8A7C]">
                <span>Franz Kafka</span>
                <span className="text-[#D4A373]">1904</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#38261B] bg-[#22160F] p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#9E8A7C]">Sanctuary Stats</span>
                <span className="text-[10px] font-bold text-[#E5A93C]">
                  Live Catalog
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 border-t border-[#352317] pt-2 text-center">
                <div>
                  <p className="text-base font-extrabold text-white">100</p>
                  <p className="text-[10px] text-[#9E8A7C]">Books</p>
                </div>
                <div>
                  <p className="text-base font-extrabold text-white">30+</p>
                  <p className="text-[10px] text-[#9E8A7C]">Authors</p>
                </div>
                <div>
                  <p className="text-base font-extrabold text-[#E5A93C]">
                    4.9★
                  </p>
                  <p className="text-[10px] text-[#9E8A7C]">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#302016] pt-8 text-xs text-[#9E8A7C] sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Book Vibe. Made for quiet readers
            and books that stay with us.
          </p>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline">
              Quiet Reading &bull; No Noise &bull; Just Books
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#3D2B20] bg-[#241710] px-3.5 py-2 text-xs font-semibold text-[#D4A373] shadow-xs transition-all duration-200 hover:border-[#8B5A2B] hover:bg-[#2F1F15] hover:text-white active:scale-95"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
