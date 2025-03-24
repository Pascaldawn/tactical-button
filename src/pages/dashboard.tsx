
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TacticsList from '@/components/dashboard/TacticsList';
import QuickActions from '@/components/dashboard/QuickActions';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
      toast.error('Please sign in to access your dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Sample data for tactics
  const recentTactics = [
    { id: 1, name: '4-3-3 Formation', lastEdited: '2 hours ago' },
    { id: 2, name: 'Counter Attack Setup', lastEdited: 'Yesterday' },
    { id: 3, name: 'Defensive Strategy', lastEdited: '3 days ago' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <DashboardHeader 
        title={`Welcome back, ${user?.name || 'Coach'}`}
        description="Manage your tactics and strategies from your dashboard"
      />
      
      <StatsOverview tacticsCount={recentTactics.length} />
      
      <TacticsList tactics={recentTactics} />
      
      <QuickActions />
    </div>
  );
};

export default Dashboard;
