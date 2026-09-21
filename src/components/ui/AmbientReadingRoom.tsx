"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  X,
  CloudRain,
  Flame,
  Coffee,
  Minimize2,
} from "lucide-react";
import {
  ambientAudio,
  type AmbientSoundType,
} from "@/lib/ambientAudio";

const SOUND_OPTIONS: { type: AmbientSoundType; label: string; icon: typeof CloudRain }[] = [
  { type: "rain", label: "Warm Rain", icon: CloudRain },
  { type: "fireplace", label: "Fireplace", icon: Flame },
  { type: "cafe", label: "Coffeehouse", icon: Coffee },
];

export const AmbientReadingRoom = (): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSound, setActiveSound] = useState<AmbientSoundType>("silent");
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listen to global open event
    const handleOpen = (): void => setIsOpen(true);
    window.addEventListener("open-ambient-room", handleOpen);
    return () => window.removeEventListener("open-ambient-room", handleOpen);
  }, []);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const handleSelectSound = (type: AmbientSoundType): void => {
    if (activeSound === type) {
      ambientAudio.stop();
      setActiveSound("silent");
    } else {
      ambientAudio.play(type);
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (newVol: number): void => {
    setVolume(newVol);
    ambientAudio.setVolume(newVol);
  };

  const handleToggleMute = (): void => {
    const muted = ambientAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleSetPresetTimer = (mins: number): void => {
    setTimerMinutes(mins);
    setTimeLeft(mins * 60);
    setIsTimerRunning(false);
  };

  const handleResetTimer = (): void => {
    setTimeLeft(timerMinutes * 60);
    setIsTimerRunning(false);
  };

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Floating Mini Pill when Sound or Timer is active and modal is closed */}
      {!isOpen && (activeSound !== "silent" || isTimerRunning) && (
        <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 rounded-full border border-[#D4A373]/40 bg-[#241812] px-4 py-2.5 text-xs font-semibold text-[#EFE4D8] shadow-2xl backdrop-blur-md transition hover:scale-105 hover:bg-[#35231A]"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#E5A93C] animate-pulse" />
            <span>
              {activeSound === "rain" && "🌧️ Rain"}
              {activeSound === "fireplace" && "🔥 Fireplace"}
              {activeSound === "cafe" && "☕ Coffeehouse"}
              {activeSound === "silent" && "⏱️ Timer"}
            </span>
            <span className="text-[#D4A373]">&bull;</span>
            <span className="font-mono text-[11px] font-bold text-[#D4A373]">
              {formatTime(timeLeft)}
            </span>
          </button>
        </div>
      )}

      {/* Ambient Room Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#DCC8B6] bg-[#FAF7F2] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[#EADBCE] pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5ECE3] text-[#8B5A2B]">
                  <Coffee className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#241812]">
                    Quiet Reading Sanctuary
                  </h3>
                  <p className="text-[11px] font-medium text-[#6F5B50]">
                    Native ambient soundscape & focus timer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-[#6F5B50] transition hover:bg-[#F5ECE3]"
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    ambientAudio.stop();
                    setActiveSound("silent");
                    setIsTimerRunning(false);
                    setIsOpen(false);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-[#6F5B50] transition hover:bg-red-50 hover:text-red-500"
                  title="Close & Stop"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Ambient Soundscapes */}
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6F5B50]">
                Choose Ambient Soundscape
              </label>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {SOUND_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = activeSound === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => handleSelectSound(opt.type)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                        isActive
                          ? "border-[#8B5A2B] bg-[#8B5A2B] text-white shadow-md shadow-[#8B5A2B]/20"
                          : "border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-[#8B5A2B] hover:bg-[#F5ECE3]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider */}
              {activeSound !== "silent" && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#EADBCE] bg-white px-3.5 py-2.5 shadow-xs">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="text-[#6F5B50] transition hover:text-[#241812]"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-[#8B5A2B]"
                  />
                  <span className="w-8 text-right font-mono text-xs text-[#6F5B50]">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Focus Session Timer */}
            <div className="mt-6 border-t border-[#EADBCE] pt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6F5B50]">
                Reading Session Timer
              </label>

              <div className="my-3 text-center">
                <div className="font-mono text-4xl font-extrabold tracking-tight text-[#241812]">
                  {formatTime(timeLeft)}
                </div>
                <p className="mt-1 text-xs text-[#6F5B50]">
                  {isTimerRunning ? "Session in progress" : "Ready when you are"}
                </p>
              </div>

              <div className="flex justify-center gap-1.5">
                {[15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSetPresetTimer(mins)}
                    className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                      timerMinutes === mins
                        ? "bg-[#8B5A2B] text-white"
                        : "border border-[#DCC8B6] bg-white text-[#4A2E18] hover:bg-[#F5ECE3]"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#8B5A2B] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#8B5A2B]/20 transition hover:bg-[#6F4420]"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Start Reading
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-[#6F5B50] transition hover:bg-[#F5ECE3]"
                  title="Reset timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#EADBCE] bg-white/70 p-3 text-center text-xs text-[#8B6E5A]">
              <span className="font-semibold text-[#5B3315]">
                &ldquo;A book must be the axe for the frozen sea within us.&rdquo;
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
