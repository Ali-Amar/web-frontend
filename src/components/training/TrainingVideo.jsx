import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Progress, 
  Card,
  Accordion,
  Badge,
  Textarea 
} from 'flowbite-react';
import { 
  HiPlay,
  HiPause,
  HiVolumeUp,
  HiVolumeOff,
  HiDownload,
  HiCog,
  HiTranslate,
  HiChevronDown,
  HiChevronUp,
  HiDocumentText,
  HiBookmark
} from 'react-icons/hi';

const TrainingVideo = ({ 
  lesson,
  onComplete,
  onSaveNote,
  onDownloadResource,
  onNextLesson
}) => {
  const {language} = useSelector(state => state.language) || 'en';
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [note, setNote] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    title,
    titleUrdu,
    description,
    descriptionUrdu,
    videoUrl,
    transcript,
    transcriptUrdu,
    resources,
    duration: lessonDuration,
    hasQuiz
  } = lesson;

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Mark as completed when 90% watched
      if (!isCompleted && (videoRef.current.currentTime / videoRef.current.duration) > 0.9) {
        setIsCompleted(true);
        onComplete?.();
      }
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-6">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        />

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <Progress
              progress={(currentTime / duration) * 100}
              size="sm"
              color="blue"
            />
            <div className="flex justify-between text-white text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                color="gray"
                size="sm"
                pill
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <HiPause className="w-5 h-5" />
                ) : (
                  <HiPlay className="w-5 h-5" />
                )}
              </Button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Button
                  color="gray"
                  size="sm"
                  pill
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <HiVolumeOff className="w-5 h-5" />
                  ) : (
                    <HiVolumeUp className="w-5 h-5" />
                  )}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>

              {/* Playback Speed */}
              <div className="relative">
                <Button
                  color="gray"
                  size="sm"
                  onClick={() => {
                    const speeds = [0.5, 1, 1.25, 1.5, 2];
                    const currentIndex = speeds.indexOf(playbackRate);
                    const nextIndex = (currentIndex + 1) % speeds.length;
                    handlePlaybackRateChange(speeds[nextIndex]);
                  }}
                >
                  {playbackRate}x
                </Button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <Button
                color="gray"
                size="sm"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                <HiTranslate className="w-5 h-5" />
              </Button>
              <Button
                color="gray"
                size="sm"
                onClick={() => {/* Handle full screen */}}
              >
                <HiCog className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'ur' ? titleUrdu : title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ur' ? descriptionUrdu : description}
            </p>

            {/* Notes Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {language === 'ur' ? 'نوٹس' : 'Notes'}
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder={
                  language === 'ur' 
                    ? 'اس سبق کے بارے میں اپنے نوٹس یہاں لکھیں...'
                    : 'Write your notes about this lesson here...'
                }
              />
              <Button
                color="gray"
                size="sm"
                className="mt-2"
                onClick={() => onSaveNote(note)}
              >
                {language === 'ur' ? 'نوٹس محفوظ کریں' : 'Save Notes'}
              </Button>
            </div>
          </Card>

          {/* Transcript */}
          {showTranscript && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ur' ? 'ٹرانسکرپٹ' : 'Transcript'}
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                {language === 'ur' ? transcriptUrdu : transcript}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            {/* Resources */}
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ur' ? 'وسائل' : 'Resources'}
            </h3>
            <div className="space-y-2">
              {resources.map((resource, index) => (
                <Button
                  key={index}
                  color="gray"
                  className="w-full justify-start"
                  onClick={() => onDownloadResource(resource)}
                >
                  <HiDocumentText className="w-5 h-5 mr-2" />
                  {language === 'ur' ? resource.titleUrdu : resource.title}
                </Button>
              ))}
            </div>

            {/* Next Steps */}
            <div className="mt-6">
              {hasQuiz ? (
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="w-full"
                  disabled={!isCompleted}
                >
                  {language === 'ur' ? 'کوئز شروع کریں' : 'Start Quiz'}
                </Button>
              ) : (
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="w-full"
                  onClick={onNextLesson}
                  disabled={!isCompleted}
                >
                  {language === 'ur' ? 'اگلا سبق' : 'Next Lesson'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingVideo;