
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const AnalyzePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (!isAuthenticated) {
          navigate("/auth");
          toast.error("Please sign in to access this page");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, navigate]);

  // Dummy subscription check (replace later with real API call)
  const isSubscribed = false; // Change manually for now for testing

  const handleRecordClick = () => {
    if (isSubscribed) {
      setIsRecording(true);
    } else {
      navigate("/subscribe"); // Redirect to subscribe page
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Top bar with Record button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tactics Board</h1>
        <button
          onClick={handleRecordClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Record
        </button>
      </div>

      {/* Tactics Board (always visible) */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <p>This is your tactics board for analyzing plays.</p>
        {/* Your normal tactics board code can go here */}
      </div>

      {/* Recording Mode (only visible when recording) */}
      {isRecording && (
        <div className="bg-black text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recording Mode</h2>
          <div className="bg-gray-800 p-4 rounded">
            <p>Camera feed here (replace with actual camera component)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
