
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Upload, Download, List } from 'lucide-react';

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
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 pt-20 md:pt-6 md:pl-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Record & Review</h1>
              <p className="text-muted-foreground">Record matches and review game footage</p>
            </div>
            <Button className="flex items-center gap-2">
              <Upload size={18} />
              <span>Upload Video</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Video</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-black/90 flex items-center justify-center">
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    <Play size={24} />
                    <span>Select a video to play</span>
                  </Button>
                </div>
                <div className="flex justify-between p-4 border-t">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Play size={16} />
                    <span>Play</span>
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download size={16} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <List size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Player Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="aspect-square bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-muted-foreground mt-4">
                    Drag players onto the field to track their movements
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Match Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 border rounded">
                      <p className="text-sm font-medium">10:23 - Goal opportunity</p>
                      <p className="text-xs text-muted-foreground">Player 7 made a good run but missed</p>
                    </div>
                    <div className="p-2 border rounded">
                      <p className="text-sm font-medium">23:45 - Defensive breakdown</p>
                      <p className="text-xs text-muted-foreground">Need to work on defensive positioning</p>
                    </div>
                    <div className="p-2 border rounded">
                      <p className="text-sm font-medium">47:12 - Goal scored</p>
                      <p className="text-xs text-muted-foreground">Good teamwork on the counter attack</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Record;
