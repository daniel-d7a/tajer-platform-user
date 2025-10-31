"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
export default function LoadingAnimation() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="text-center">
        <DotLottieReact
          src="/loading.json"
          autoplay
          loop
          style={{ height: "500px", width: "500px" }}
        />
      </div>
    </div>
  ); 
}
