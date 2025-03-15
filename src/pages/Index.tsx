
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Presentation, ShieldCheck, Video, Zap } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Football Tactics Board
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Create, edit, and share your football strategies with our interactive tactics board
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link to="/board">Go to Tactics Board</Link>
              </Button>
            ) : (
              <Button asChild size="lg">
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
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Coaches
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition duration-300">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Presentation className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Board</h3>
              <p className="text-muted-foreground">
                Drag-and-drop player icons to create formations and plays with our intuitive tactics board
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition duration-300">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Video className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Integration</h3>
              <p className="text-muted-foreground">
                Upload training videos and sync them with your tactics for comprehensive coaching sessions
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition duration-300">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Collaboration</h3>
              <p className="text-muted-foreground">
                Work together with your coaching staff and players in real-time on the same tactics board
              </p>
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
          <Button asChild size="lg">
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
