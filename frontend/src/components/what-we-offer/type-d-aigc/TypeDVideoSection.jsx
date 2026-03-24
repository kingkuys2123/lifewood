import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../../../hooks/useReveal';

export default function TypeDVideoSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useReveal(sectionRef, 0.1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const preloadObserver = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          obs.disconnect();
        }
      },
      { rootMargin: '280px 0px', threshold: 0.01 }
    );

    preloadObserver.observe(section);
    return () => preloadObserver.disconnect();
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  return (
    <section className="tyd-video" ref={sectionRef} aria-labelledby="tyd-video-title">
      <div className="wrap">
        <div className="tyd-video__frame reveal">
          <h2 id="tyd-video-title" className="tyd-video__title">Video</h2>

          <video
            ref={videoRef}
            className="tyd-video__media"
            src={shouldLoadVideo ? '/videos/aigc-video.mp4' : undefined}
            muted
            loop
            autoPlay
            playsInline
            preload="none"
            aria-label="AIGC showcase video"
          />

          <button
            type="button"
            className="tyd-video__toggle"
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause showcase video' : 'Play showcase video'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </section>
  );
}
