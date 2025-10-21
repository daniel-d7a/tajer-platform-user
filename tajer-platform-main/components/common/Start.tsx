"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useEffect, useState } from "react";

export default function Start() {
  const [show, setIsShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <DotLottieReact
        src="/Start.json"
        autoplay={true}
        loop={false}
        style={{ height: "300px", width: "300px" }}
      />
    </div>
  );
}
