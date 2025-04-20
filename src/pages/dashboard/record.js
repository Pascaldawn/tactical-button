"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Record() {
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Replace this with your actual subscription checking logic
    const checkSubscription = async () => {
      // Example API call to check if the user is subscribed
      const res = await fetch("/api/check-subscription");
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
    };

    checkSubscription();
  }, []);

  useEffect(() => {
    if (isSubscribed === false) {
      router.push("/subscribe");
    }
  }, [isSubscribed, router]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  useEffect(() => {
    if (isSubscribed) {
      startCamera();
    }
  }, [isSubscribed]);

  if (isSubscribed === null) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Record Your Analysis</h1>
      <video ref={videoRef} autoPlay muted className="w-full max-w-4xl rounded shadow-md" />

      <button
        onClick={() => router.push("/analyze-with-recording")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Start Recording Analysis
      </button>
    </div>
  );
}

