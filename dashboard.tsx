import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// import RecordButton from '@/components/RecordButton';  ❌ REMOVE this

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
      toast.error('Please sign in to access your dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome, {user?.name || 'Coach'}
        </h1>
        <p className="text-muted-foreground text-center mb-12">
          Choose an option to start working with your tactics
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          {/* ONLY ANALYZE BUTTON REMAINS */}
          <button
            onClick={() => navigate('/dashboard/analyze')}
            className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition"
          >
            Go to Analyze
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

