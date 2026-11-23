"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { MediaImage, MediaVideo } from "@/types/content";
import { embedUrl, formatTime } from "@/lib/utils/video";
import { cn } from "@/lib/utils/cn";

type Props = {
  video: MediaVideo;
  poster?: MediaImage;
  title: string;
  autoPlay?: boolean;
  className?: string;
  /** Aspect ratio of the frame, e.g. "16 / 9" or "9 / 16". */
  ratio?: string;
  /** Large custom play button shown before playback starts. */
  playLabel?: string;
};

/**
 * Cinematic player with custom, keyboard-accessible controls for MP4/Cloudinary
 * sources, and a privacy-friendly embed for YouTube / Vimeo links.
 */
export function VideoPlayer({ video, poster, title, autoPlay = false, className, ratio = "16 / 9", playLabel = "Play film" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(autoPlay);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<number>(0);

  const embed = video.kind !== "file" ? embedUrl(video) : null;

  const start = useCallback(() => {
    setStarted(true);
    requestAnimationFrame(() => el.current?.play().catch(() => {
      // autoplay with sound blocked → retry muted
      if (el.current) {
        el.current.muted = true;
        setMuted(true);
        el.current.play().catch(() => {});
      }
    }));
  }, []);

  useEffect(() => {
    if (autoPlay && video.kind === "file") start();
  }, [autoPlay, start, video.kind]);

  useEffect(() => {
    const onFs = () => setFullscreen(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggle = () => {
    const v = el.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleFullscreen = async () => {
    const v = el.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (wrap.current?.requestFullscreen) await wrap.current.requestFullscreen();
      else v?.webkitEnterFullscreen?.(); // iOS Safari
    } catch {}
  };

  const poke = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2600);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const v = el.current;
    if (!v || !started) return;
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") v.currentTime = Math.min(v.duration, v.currentTime + 5);
    else if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 5);
    else if (e.key === "m") {
      v.muted = !v.muted;
      setMuted(v.muted);
    } else if (e.key === "f") toggleFullscreen();
  };

  return (
    <div
      ref={wrap}
      className={cn("group/player relative overflow-hidden bg-ink-2", fullscreen && "flex items-center", className)}
      style={fullscreen ? undefined : { aspectRatio: ratio }}
      onPointerMove={poke}
      onKeyDown={onKey}
    >
      {/* Poster + play */}
      {!started && (
        <button
          type="button"
          onClick={start}
          className="group/play absolute inset-0 z-10 flex items-center justify-center"
          aria-label={`${playLabel}: ${title}`}
        >
          {poster && (
            <Image
              src={poster.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover/play:scale-[1.03]"
              placeholder={poster.blurDataURL ? "blur" : "empty"}
              blurDataURL={poster.blurDataURL}
            />
          )}
          <span className="absolute inset-0 bg-ink/30 transition-colors duration-700 group-hover/play:bg-ink/10" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-paper/40 backdrop-blur-sm transition-all duration-700 ease-[var(--ease-out-expo)] group-hover/play:scale-110 group-hover/play:border-gold md:h-32 md:w-32">
            <Play size={22} strokeWidth={1.25} className="ml-1 fill-paper" />
          </span>
          <span className="label absolute bottom-6 left-6 text-paper">{playLabel}</span>
        </button>
      )}

      {started && embed && (
        <iframe
          src={embed}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      )}

      {started && !embed && video.kind === "file" && (
        <>
          <video
            ref={el}
            src={video.src}
            className={cn("h-full w-full bg-black", fullscreen ? "object-contain" : "absolute inset-0 object-cover")}
            playsInline
            preload="metadata"
            poster={poster?.src}
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onWaiting={() => setBuffering(true)}
            onPlaying={() => setBuffering(false)}
            onEnded={() => setPlaying(false)}
            aria-label={title}
          />

          {buffering && (
            <span className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border border-paper/20 border-t-gold" />
          )}

          {/* Controls */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/90 to-transparent px-4 pb-4 pt-12 transition-opacity duration-500 md:px-6",
              playing && idle ? "opacity-0 focus-within:opacity-100" : "opacity-100",
            )}
          >
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={time}
              onChange={(e) => {
                if (el.current) el.current.currentTime = Number(e.target.value);
              }}
              aria-label="Seek"
              aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
              className="block h-4 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gold [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-gold)_var(--p),rgb(245_243_239/0.25)_var(--p))] [&::-webkit-slider-thumb]:-mt-[5.5px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-paper/25 [&::-moz-range-progress]:h-px [&::-moz-range-progress]:bg-gold"
              style={{ ["--p" as string]: `${duration ? (time / duration) * 100 : 0}%` }}
            />
            <div className="mt-3 flex items-center gap-5">
              <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="text-paper hover:text-gold">
                {playing ? <Pause size={18} strokeWidth={1.5} /> : <Play size={18} strokeWidth={1.5} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!el.current) return;
                  el.current.muted = !el.current.muted;
                  setMuted(el.current.muted);
                }}
                aria-label={muted ? "Unmute" : "Mute"}
                className="text-paper hover:text-gold"
              >
                {muted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
              </button>
              <span className="label text-paper tabular-nums">
                {formatTime(time)} <span className="text-mute-2">/ {formatTime(duration)}</span>
              </span>
              <span className="label ml-auto hidden truncate sm:block">{title}</span>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                className="ml-auto text-paper hover:text-gold sm:ml-0"
              >
                {fullscreen ? <Minimize size={18} strokeWidth={1.5} /> : <Maximize size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
