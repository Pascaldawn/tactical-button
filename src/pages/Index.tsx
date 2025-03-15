
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Users, Clock, Laptop, LucideProps } from 'lucide-react';

const FeatureIcon: React.FC<LucideProps & { className?: string }> = ({ className, ...props }) => (
  <div className={`rounded-full p-2 bg-primary/10 text-primary ${className}`}>
    {React.createElement(props.icon || 'div', { size: 24 })}
  </div>
);

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-fade-in">
              Revolutionize your coaching strategy
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Create, visualize and share football tactics
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              An intuitive platform for coaches and players to design and collaborate on football strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/auth" className="btn-primary">
                Get Started
              </Link>
              <Link to="/tactics" className="btn-secondary">
                Try the Tactics Board
              </Link>
            </div>
          </div>
          
          <div className="mt-16 relative animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-field relative">
                <div className="absolute inset-0 bg-field-pattern"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-players-team1 flex items-center justify-center text-white font-bold">10</div>
                <div className="absolute top-1/3 left-1/2 w-12 h-12 rounded-full bg-players-team1 flex items-center justify-center text-white font-bold">7</div>
                <div className="absolute top-2/3 right-1/4 w-12 h-12 rounded-full bg-players-team2 flex items-center justify-center text-white font-bold">4</div>
                <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M120,100 C200,140 280,160 380,120" stroke="white" strokeWidth="3" fill="none" strokeDasharray="8,8" />
                  <path d="M120,100 C220,90 320,140 330,220" stroke="red" strokeWidth="3" fill="none" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 glass-panel px-6 py-4 flex flex-col sm:flex-row items-center gap-4 shadow-md">
              <p className="font-medium">Ready to elevate your strategy?</p>
              <Link to="/auth" className="flex items-center text-primary font-medium">
                <span>Start creating now</span>
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Modern Coaching</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to design, analyze, and share your football strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <FeatureIcon icon={Laptop} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Tactics Board</h3>
              <p className="text-muted-foreground mb-4">
                Drag-and-drop player icons, draw plays, and create dynamic formations with our intuitive interface.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Easy player positioning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Drawing tools with multiple colors</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Export plays as images</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <FeatureIcon icon={Users} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground mb-4">
                Share tactics with your team and work together to develop winning strategies.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Coach and player accounts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Real-time collaboration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Permission management</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <FeatureIcon icon={Clock} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">Video Integration</h3>
              <p className="text-muted-foreground mb-4">
                Combine tactical diagrams with video analysis for comprehensive coaching.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Video upload and playback</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Sync diagrams with video</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={16} className="text-accent mr-2" />
                  <span>Create coaching points</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-primary/5 rounded-l-full transform translate-x-1/4 -z-10"></div>
            
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Ready to transform your football strategy?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join coaches and teams who are already using our platform to develop winning tactics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="btn-primary">
                  Get Started Free
                </Link>
                <Link to="#" className="btn-secondary">
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 py-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-bold text-lg">Football Tactics</p>
              <p className="text-sm text-muted-foreground">© 2023 All rights reserved</p>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
