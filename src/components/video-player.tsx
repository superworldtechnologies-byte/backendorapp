"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative w-full h-1 bg-white/20 rounded-full cursor-pointer",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <div
        className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-150"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) return;

    const newVolume = value / 100;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;

    setProgress(isFinite(progress) ? progress : 0);
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);
  };

  const handleSeek = (value: number) => {
    if (!videoRef.current || !videoRef.current.duration) return;

    const time = (value / 100) * videoRef.current.duration;

    if (isFinite(time)) {
      videoRef.current.currentTime = time;
      setProgress(value);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);

    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(1);
      videoRef.current.volume = 1;
    }
  };

  const setSpeed = (speed: number) => {
    if (!videoRef.current) return;

    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full"
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
      />

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 mx-auto m-2 max-w-xl rounded-2xl bg-[#11111198] p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-white">
              {formatTime(currentTime)}
            </span>

            <CustomSlider
              value={progress}
              onChange={handleSeek}
              className="flex-1"
            />

            <span className="text-sm text-white">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="text-white transition hover:scale-105 hover:bg-[#111111d1] hover:text-white active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="text-white transition hover:scale-105 hover:bg-[#111111d1] hover:text-white active:scale-95"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : volume > 0.5 ? (
                    <Volume2 className="h-5 w-5" />
                  ) : (
                    <Volume1 className="h-5 w-5" />
                  )}
                </Button>

                <div className="w-24">
                  <CustomSlider
                    value={volume * 100}
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[0.5, 1, 1.5, 2].map((speed) => (
                <Button
                  key={speed}
                  onClick={() => setSpeed(speed)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-white transition hover:scale-105 hover:bg-[#111111d1] hover:text-white active:scale-95",
                    playbackSpeed === speed && "bg-[#111111d1]"
                  )}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;