
import { useState, useRef, useCallback, useEffect } from 'react';

const useVideoSync = (tacticsData = null) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const [syncedEvents, setSyncedEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  
  // Initialize with tactics data if provided
  useEffect(() => {
    if (tacticsData && tacticsData.events) {
      setSyncedEvents(tacticsData.events);
    }
  }, [tacticsData]);
  
  // Track current time and find active events
  const handleTimeUpdate = useCallback((time) => {
    setCurrentTime(time);
    
    // Find any events that should be triggered at this time
    const activeEvent = syncedEvents.find(event => {
      return time >= event.startTime && time <= event.endTime;
    });
    
    if (activeEvent !== currentEvent) {
      setCurrentEvent(activeEvent);
    }
  }, [syncedEvents, currentEvent]);
  
  // Methods to control video
  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, []);
  
  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
  const seek = useCallback((time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);
  
  // Add an event synced to the video
  const addEvent = useCallback((event) => {
    setSyncedEvents(prevEvents => [...prevEvents, {
      ...event,
      id: Date.now().toString(),
      startTime: currentTime,
      endTime: currentTime + (event.duration || 5)
    }]);
  }, [currentTime]);
  
  // Remove an event
  const removeEvent = useCallback((eventId) => {
    setSyncedEvents(prevEvents => 
      prevEvents.filter(event => event.id !== eventId)
    );
  }, []);
  
  // Set up video reference
  const setVideoElement = useCallback((element) => {
    if (element) {
      videoRef.current = element;
      element.addEventListener('durationchange', () => {
        setDuration(element.duration);
      });
    }
  }, []);
  
  return {
    currentTime,
    isPlaying,
    duration,
    currentEvent,
    syncedEvents,
    setVideoElement,
    handleTimeUpdate,
    play,
    pause,
    seek,
    addEvent,
    removeEvent
  };
};

export default useVideoSync;
