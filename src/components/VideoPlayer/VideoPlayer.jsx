
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Maximize, Minimize 
} from 'lucide-react';

const VideoPlayer = ({ src, title, onTimeUpdate }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      const updateTime = () => {
        setCurrentTime(video.currentTime);
        if (onTimeUpdate) {
          onTimeUpdate(video.currentTime);
        }
      };

      const handleDurationChange = () => {
        setDuration(video.duration);
      };
      
      const handleVideoEnd = () => {
        setIsPlaying(false);
      };
      
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('durationchange', handleDurationChange);
      video.addEventListener('ended', handleVideoEnd);
      
      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('durationchange', handleDurationChange);
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [onTimeUpdate]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  
  const handleSeek = (value) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value) => {
    const video = videoRef.current;
    if (video) {
      const newVolume = value[0];
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };
  
  const toggleFullscreen = () => {
    const playerContainer = document.querySelector('.video-player-container');
    
    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="video-player-container relative rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { videoRef.current.currentTime = 0; }}
              className="text-white hover:bg-white/20"
            >
              <SkipBack size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { videoRef.current.currentTime += 10; }}
              className="text-white hover:bg-white/20"
            >
              <SkipForward size={18} />
            </Button>
            
            <span className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              
              <div className="hidden group-hover:block absolute bottom-full left-0 w-24 p-2 bg-black/80 rounded shadow">
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </Button>
          </div>
        </div>
      </div>
      
      {title && (
        <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-sm text-white">
          {title}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
