
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Board from '../components/Board/Board';
import { toast } from 'sonner';

const BoardPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Please sign in to access the tactics board');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen pt-16 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <Board />
      </div>
    </div>
  );
};

export default BoardPage;
