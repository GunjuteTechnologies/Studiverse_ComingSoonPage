"use client";
import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Globe, Rocket, MessageCircle, Send, Bot } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ComingSoonPageProps {
  launchDate?: Date;
  customFeatures?: Feature[] | null;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ launchDate = new Date('2024-12-31'), customFeatures = null }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const defaultFeatures: Feature[] = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-500" />,
      title: "24/7 AI Assistant",
      description: "Get instant answers to all your study abroad questions anytime, anywhere"
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "Global Program Database",
      description: "Access comprehensive information about universities and courses worldwide"
    },
    {
      icon: <Rocket className="w-8 h-8 text-blue-500" />,
      title: "Smart Recommendations",
      description: "Receive personalized program suggestions based on your preferences"
    }
  ];
  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<{
    isSubmitting: boolean;
    isSubmitted: boolean;
    error: string | null;
  }>({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const features = customFeatures || defaultFeatures;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +launchDate - +new Date();
      let newTimeLeft: TimeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      setTimeLeft(newTimeLeft);
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) return;
  
    setSubmitStatus({ isSubmitting: true, isSubmitted: false, error: null });
  
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }
  
      setSubmitStatus({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });
      setEmail('');
    } catch (error) {
      setSubmitStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <AnimatedBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/50 pointer-events-none" />

      <main className="relative z-10">
        <nav className="sticky top-0 backdrop-blur-md bg-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StudiVerse
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600 font-medium">AI Chatbot</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <div className="mb-8 inline-flex items-center justify-center space-x-4 bg-blue-50 rounded-full px-6 py-2">
              <Bot className="w-6 h-6 text-blue-600 animate-bounce" />
              <span className="text-blue-600 font-medium">AI-Powered Study Abroad Assistant</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              StudiVerse Chatbot
              <br />
              Coming Soon
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Your intelligent companion for navigating the world of international education. Get ready for personalized study abroad guidance powered by advanced AI.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
                  <div className="text-4xl font-bold text-blue-600">{value}</div>
                  <div className="text-gray-600 capitalize">{unit}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {defaultFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto mb-16 bg-white/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-white" />
                <span className="text-white font-medium">StudiVerse Assistant</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-blue-100 rounded-lg p-3 flex-1">
                  <p className="text-gray-800">
                    👋 Hi! I&apos;m the StudiVerse AI assistant. I&apos;ll be here soon to help you with all your study abroad questions!
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                <input
                  type="text"
                  placeholder="Get notified when chat launches..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-gray-600"
                  disabled
                />
                <Send className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto text-center">
  <h2 className="text-2xl font-semibold mb-4">Be the First to Know</h2>
  <p className="text-gray-600 mb-6">Get early access to our AI study abroad assistant!</p>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="flex gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitStatus.isSubmitting || submitStatus.isSubmitted}
      />
      <button 
        type="submit" 
        className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-200 ${
          submitStatus.isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
        }`}
        disabled={submitStatus.isSubmitting || submitStatus.isSubmitted}
      >
        {submitStatus.isSubmitting ? 'Joining...' : submitStatus.isSubmitted ? 'Joined!' : 'Join Waitlist'}
      </button>
    </div>
    {submitStatus.isSubmitted && (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          Thanks for joining! We&apos;ll notify you when we launch.
        </AlertDescription>
      </Alert>
    )}
    {submitStatus.error && (
      <Alert className="bg-red-50 border-red-200">
        <AlertDescription className="text-red-800">
          {submitStatus.error}
        </AlertDescription>
      </Alert>
    )}
  </form>
</div>
        </div>
      </main>
    </div>
  );
};

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  reset: () => void;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class ParticleClass implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > (canvas?.width || 0) || this.x < 0 || 
            this.y > (canvas?.height || 0) || this.y < 0) {
          this.reset();
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(66, 153, 225, 0.5)';
        ctx.fill();
      }
    }
    
    const particles: Particle[] = Array(50).fill(null).map(() => new ParticleClass());
    
    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      particles.forEach(particleA => {
        particles.forEach(particleB => {
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(66, 153, 225, ${0.3 * (1 - distance/100)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

export default ComingSoonPage;