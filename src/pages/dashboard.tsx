
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3, Users, Layers, Clock, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Sample data for tactics
  const recentTactics = [
    { id: 1, name: '4-3-3 Formation', lastEdited: '2 hours ago' },
    { id: 2, name: 'Counter Attack Setup', lastEdited: 'Yesterday' },
    { id: 3, name: 'Defensive Strategy', lastEdited: '3 days ago' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Manage your tactics and strategies from your dashboard
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/settings')} className="flex items-center gap-2">
            <Settings size={18} />
            <span>Settings</span>
          </Button>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 text-destructive">
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-6 flex items-center">
            <div className="rounded-full p-3 bg-primary/10 text-primary mr-4">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Tactics</p>
              <p className="text-2xl font-bold">{recentTactics.length}</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-center">
            <div className="rounded-full p-3 bg-accent/10 text-accent mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Account Type</p>
              <p className="text-2xl font-bold">Coach</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-center">
            <div className="rounded-full p-3 bg-secondary/10 text-foreground mr-4">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Subscription</p>
              <p className="text-2xl font-bold">Free</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Tactics</h2>
          <Button 
            onClick={() => navigate('/board')} 
            className="btn-primary flex items-center gap-1"
          >
            <PlusCircle size={18} />
            <span>New Tactic</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTactics.map((tactic) => (
            <div 
              key={tactic.id} 
              className="glass-panel p-6 hover:shadow-md transition-all cursor-pointer hover:translate-y-[-2px]"
              onClick={() => navigate('/board')}
            >
              <h3 className="font-semibold mb-2">{tactic.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock size={14} className="mr-1" />
                <span>Last edited {tactic.lastEdited}</span>
              </div>
            </div>
          ))}

          <div 
            className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"
            onClick={() => navigate('/board')}
          >
            <PlusCircle size={24} className="mb-2" />
            <p className="font-medium">Create New Tactic</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => navigate('/board')}
            className="glass-panel p-6 text-left hover:shadow-md transition-all hover:translate-y-[-2px]"
            variant="ghost"
          >
            <h3 className="font-semibold mb-4">Tactics Board</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Design your strategies with our interactive board
            </p>
            <div className="text-primary flex items-center text-sm font-medium">
              <span>Go to board</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="ml-1 h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Button>

          <Button 
            onClick={() => navigate('/subscription')}
            className="glass-panel p-6 text-left hover:shadow-md transition-all hover:translate-y-[-2px]"
            variant="ghost"
          >
            <h3 className="font-semibold mb-4">Upgrade to Premium</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Unlock all features and remove limitations
            </p>
            <div className="text-primary flex items-center text-sm font-medium">
              <span>View plans</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="ml-1 h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Button>

          <Button 
            onClick={() => navigate('/settings')}
            className="glass-panel p-6 text-left hover:shadow-md transition-all hover:translate-y-[-2px]"
            variant="ghost"
          >
            <h3 className="font-semibold mb-4">Account Settings</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Update your profile and preferences
            </p>
            <div className="text-primary flex items-center text-sm font-medium">
              <span>Manage account</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="ml-1 h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
