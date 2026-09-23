"use client";

import { useState, useEffect, useRef } from "react";
import { DEFAULT_POST_IMAGE } from "@/lib/images";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

function imageUrl(src: string | undefined): string {
  if (!src) return DEFAULT_POST_IMAGE;
  if (/^(?:[a-z][a-z\d+\-.]*:|\/\/)/i.test(src)) return src;
  const path = src.startsWith("/") ? src : `/${src}`;
  return SITE_URL ? `${SITE_URL}${path}` : path;
}

/** Swap a broken img to the default — once per element. */
function useImageFallback() {
  const ref = useRef<HTMLImageElement>(null);

  const fallback = (img: HTMLImageElement) => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.src = imageUrl(DEFAULT_POST_IMAGE);
  };

  // Static export: the error can fire before hydration attaches onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) fallback(img);
  }, []);

  return { ref, fallback };
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className = "",
  placeholder = "empty",
  blurDataURL,
  loading = "lazy",
  style,
}: ResponsiveImageProps) {
  const { ref, fallback } = useImageFallback();

  return (
    <img
      ref={ref}
      src={imageUrl(src)}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      style={{
        ...style,
        maxWidth: "100%",
        height: "auto",
      }}
      onError={(e) => fallback(e.currentTarget)}
      {...(placeholder === "blur" && blurDataURL && {
        "data-blur": blurDataURL,
      })}
    />
  );
}

// Hero image with priority loading and LQIP
interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function HeroImage({ src, alt, className = "", style }: HeroImageProps) {
  const { ref, fallback } = useImageFallback();

  return (
    <img
      ref={ref}
      src={imageUrl(src)}
      alt={alt}
      loading="eager"
      decoding="async"
      className={className}
      style={style}
      onError={(e) => fallback(e.currentTarget)}
    />
  );
}

// Card image with hover zoom effect
interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function CardImage({ src, alt, className = "", aspectRatio = "16/9" }: CardImageProps) {
  const { ref, fallback } = useImageFallback();

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <img
        ref={ref}
        src={imageUrl(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={(e) => fallback(e.currentTarget)}
      />
    </div>
  );
}

// Gallery lightbox image
interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function GalleryImage({ src, alt, className = "" }: GalleryImageProps) {
  const { ref, fallback } = useImageFallback();

  return (
    <img
      ref={ref}
      src={imageUrl(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => fallback(e.currentTarget)}
    />
  );
}