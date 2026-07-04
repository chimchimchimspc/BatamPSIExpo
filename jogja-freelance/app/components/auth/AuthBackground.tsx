"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const PHOTOS = [
  "/km0.jpg",
  "/jogja-1.jpg",
  "/jogja-2.jpg",
  "/jogja-3.jpg",
  "/jogja-4.jpg",
];

export default function AuthBackground() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % PHOTOS.length);
        setTimeout(() => {
          setFading(false);
        }, 50);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Image
        key={current}
        src={PHOTOS[current]}
        alt="Yogyakarta"
        fill
        className="object-cover object-center"
        style={{
          transition: fading ? "opacity 400ms ease-out" : "opacity 1000ms ease-in",
          opacity: fading ? 0 : 0.2,
          filter: "blur(8px)",
        }}
        priority
      />
    </div>
  );
}
