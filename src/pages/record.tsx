
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Camera, Save } from 'lucide-react';

const Record: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
      toast.error('Please sign in to access the record page');
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Record & Analyze</h1>
            <p className="text-muted-foreground">Record and analyze your team's performance</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Camera size={18} />
              <span>Start Recording</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Save size={18} />
              <span>Save Session</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Camera Feed</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-black/90 flex items-center justify-center">
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    <Play size={24} />
                    <span>Enable camera to start recording</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tactics Board</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-green-100 border-2 border-green-800 relative flex items-center justify-center">
                  <div className="text-center text-sm text-muted-foreground">
                    Your tactics board will appear here
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Save Formation</Button>
                  <Button variant="outline" size="sm">Clear Board</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Record;
