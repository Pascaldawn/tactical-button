
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Board from '../components/Board/Board';
import { toast } from 'sonner';

const BoardPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
      toast.error('Please sign in to access the tactics board');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 px-4 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-16 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <Board />
      </div>
    </div>
  );
};

export default BoardPage;
