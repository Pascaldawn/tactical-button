
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TacticsList from '@/components/dashboard/TacticsList';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
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

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <DashboardHeader 
        title={`Welcome back, ${user?.name}`}
        description="Manage your tactics and strategies from your dashboard"
      />
      
      <StatsOverview tacticsCount={recentTactics.length} />
      
      <TacticsList tactics={recentTactics} />
      
      <QuickActions />
    </div>
  );
};

export default Dashboard;
