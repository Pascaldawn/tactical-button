
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Presentation, ShieldCheck, ArrowRight, ArrowUpRight, ArrowDown } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section with Field Background */}
      <section className="relative py-20 px-4 md:px-8 lg:py-32 bg-gradient-to-b from-green-600/30 to-background overflow-hidden">
        {/* Football field pattern overlay */}
        <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none"></div>
        
        {/* Decorative player pieces */}
        <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-players-team1 shadow-lg opacity-70 hidden md:block"></div>
        <div className="absolute top-1/3 right-20 w-8 h-8 rounded-full bg-players-team2 shadow-lg opacity-70 hidden md:block"></div>
        <div className="absolute bottom-1/4 left-20 w-8 h-8 rounded-full bg-players-team1 shadow-lg opacity-70 hidden md:block"></div>
        <div className="absolute bottom-1/3 right-10 w-8 h-8 rounded-full bg-players-team2 shadow-lg opacity-70 hidden md:block"></div>
        
        {/* Additional player pieces */}
        <div className="absolute top-2/5 left-1/3 w-8 h-8 rounded-full bg-players-team1 shadow-lg opacity-70 hidden md:block"></div>
        <div className="absolute bottom-2/5 right-1/4 w-8 h-8 rounded-full bg-players-team2 shadow-lg opacity-70 hidden md:block"></div>
        
        {/* Center circle (field marking) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-white/20 pointer-events-none hidden lg:block"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-sm">
            Football Tactics Board
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Create, edit, and share your football strategies with our interactive tactics board
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                <Link to="/board">Go to Tactics Board</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
            <Button asChild size="lg" variant="secondary">
              <Link to="/subscription">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-background to-green-50/30 dark:to-green-950/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Coaches
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition duration-300 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full border-4 border-primary/10 opacity-20"></div>
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Presentation className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Board</h3>
              <p className="text-muted-foreground">
                Drag-and-drop player icons to create formations and plays with our intuitive tactics board
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition duration-300 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full border-4 border-primary/10 opacity-20"></div>
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <ShieldCheck className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Football Games</h3>
              <p className="text-muted-foreground">
                Break down game footage, identify patterns, and develop winning strategies with our advanced analysis tools
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Demo Field Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-green-50/30 to-background dark:from-green-950/10 dark:to-background">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-600 p-1 rounded-xl overflow-hidden relative shadow-xl">
            <div className="bg-green-700 bg-stripes w-full aspect-video rounded-lg overflow-hidden relative">
              {/* Field markings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-white/30 rounded-full"></div>
              </div>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
              
              {/* Example players - more of them with arrows */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-players-team1 flex items-center justify-center text-white font-bold shadow-md">9</div>
              <div className="absolute top-3/4 right-1/4 w-8 h-8 rounded-full bg-players-team2 flex items-center justify-center text-white font-bold shadow-md">10</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-players-neutral flex items-center justify-center text-white font-bold shadow-md">R</div>
              
              {/* Additional players */}
              <div className="absolute top-1/3 left-1/3 w-8 h-8 rounded-full bg-players-team1 flex items-center justify-center text-white font-bold shadow-md">7</div>
              <div className="absolute bottom-1/3 right-1/3 w-8 h-8 rounded-full bg-players-team2 flex items-center justify-center text-white font-bold shadow-md">5</div>
              <div className="absolute top-2/3 left-2/3 w-8 h-8 rounded-full bg-players-team1 flex items-center justify-center text-white font-bold shadow-md">11</div>
              
              {/* Movement arrows */}
              <div className="absolute top-[25%] left-[30%] text-white">
                <ArrowRight className="w-10 h-10 text-white/70" />
              </div>
              <div className="absolute top-[60%] right-[40%] text-white">
                <ArrowUpRight className="w-10 h-10 text-white/70" />
              </div>
              <div className="absolute bottom-[40%] left-[45%] text-white">
                <ArrowDown className="w-10 h-10 text-white/70" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Elevate Your Coaching?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join thousands of coaches who are improving their team's performance with our tactics board
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
            <Link to={isAuthenticated ? "/board" : "/auth"}>
              {isAuthenticated ? "Go to Tactics Board" : "Get Started Now"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
