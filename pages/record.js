// pages/record.js
import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import TacticBoard from "../components/TacticBoard";

export default function RecordAnalyzePage() {
  const [recording, setRecording] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Record & Analyze</h2>

      <ReactMediaRecorder
        video
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  startRecording();
                  setRecording(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={recording}
              >
                Start Recording
              </button>
              <button
                onClick={() => {
                  stopRecording();
                  setRecording(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={!recording}
              >
                Stop Recording
              </button>
            </div>

            <div className="mt-4">
              {mediaBlobUrl && (
                <div>
                  <video src={mediaBlobUrl} controls className="w-full mb-2" />
                  {/* 🔒 Lock download unless subscribed */}
                  {true /* Replace with actual subscription check */ ? (
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded"
                      onClick={() => window.open(mediaBlobUrl)}
                    >
                      Download Video
                    </button>
                  ) : (
                    <p className="text-red-600">
                      Subscribe to download this video.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <TacticBoard />
            </div>
          </>
        )}
      />
    </div>
  );
}

