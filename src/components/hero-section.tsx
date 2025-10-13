import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Lightbulb, Users, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { Counter } from "./ui/counter";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video started playing
          })
          .catch(error => {
            console.warn('Video play was prevented:', error);
            // Try again with user interaction
            document.addEventListener('click', tryPlayOnInteraction, { once: true });
          });
      }
    };

    const tryPlayOnInteraction = () => {
      video.muted = true;
      video.play().catch(e => console.warn('Still cannot play:', e));
    };

    // Try to play when video is ready
    if (video.readyState >= 3) { // HAVE_FUTURE_DATA
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true });
    }

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', playVideo);
      document.removeEventListener('click', tryPlayOnInteraction);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-wind-farm-1580-large.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      </div>
      {/* Floating Elements */}
      {/* Content */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <Lightbulb className="h-12 w-12 text-white" />
      </div>
      <div className="absolute top-40 right-20 opacity-20 animate-float delay-1000">
        <Zap className="h-16 w-16 text-white" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-20 animate-float delay-2000">
        <Users className="h-14 w-14 text-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Vision Badge */}
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <span className="text-sm font-medium">
              🌍 Accelerating Africa's Energy Transition
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6 animate-fade-in delay-200">
            Let's Build a{" "}
            <span className="bg-gradient-to-r from-accent to-earth-light bg-clip-text text-transparent">
              Sustainable Future
            </span>{" "}
            Together!
          </h1>

          {/* Vision Statement */}
          <p className="text-xl md:text-2xl font-light mb-4 text-white/90 animate-fade-in delay-400">
            To accelerate Africa's Energy transition and Sustainability Journey.
          </p>

          {/* Description */}
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in delay-600">
            The African Energy and Sustainability Consortium drives innovation, partnerships, 
            and strategic initiatives to build a cleaner, more sustainable energy future for Africa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in delay-800">
            <Button 
              variant="cta" 
              size="lg" 
              className="text-lg px-8 py-4 min-w-[200px]" 
              asChild
            >
              <Link to="/auth">
                Join Us Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 min-w-[200px] bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link to="/partnerships">
                Partner With Us
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-lg px-8 py-4 min-w-[200px] text-white/90 hover:bg-white/10"
              asChild
            >
              <Link to="/about">
                <Play className="mr-2 h-5 w-5" />
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto animate-fade-in delay-1000">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">
                <Counter value={2063} />
              </div>
              <p className="text-white/80 text-sm">
                Agenda 2063 Aligned
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">
                <Counter value={54} />
              </div>
              <p className="text-white/80 text-sm">
                African Countries
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">
                <Counter value={100} suffix="+" />
              </div>
              <p className="text-white/80 text-sm">
                Partners & Stakeholders
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">
                <Counter value={6} suffix="+" />
              </div>
              <p className="text-white/80 text-sm">
                Pillars of Transition
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-20">
          <path
            d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}