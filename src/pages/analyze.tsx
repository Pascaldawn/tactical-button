
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analyze: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
      toast.error('Please sign in to access the analysis page');
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
              <h1 className="text-3xl font-bold">Analyze Tactics</h1>
              <p className="text-muted-foreground">Review and analyze player movements and team strategies</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Field View</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-[16/9] bg-green-100 border-2 border-green-800 relative flex items-center justify-center">
                  <div className="w-[80%] h-[90%] border-2 border-white">
                    {/* Field center circle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
                    
                    {/* Center line */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white"></div>
                    
                    {/* Penalty areas */}
                    <div className="absolute top-[15%] left-0 w-[20%] h-[70%] border-2 border-white"></div>
                    <div className="absolute top-[15%] right-0 w-[20%] h-[70%] border-2 border-white"></div>
                    
                    {/* Goal areas */}
                    <div className="absolute top-[35%] left-0 w-[10%] h-[30%] border-2 border-white"></div>
                    <div className="absolute top-[35%] right-0 w-[10%] h-[30%] border-2 border-white"></div>
                    
                    <div className="text-lg text-white">Drag and drop players to position</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="formation" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="formation">Formation</TabsTrigger>
                <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                <TabsTrigger value="patterns">Play Patterns</TabsTrigger>
              </TabsList>
              <TabsContent value="formation" className="p-4 border rounded-md mt-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 border rounded text-center">4-3-3</div>
                  <div className="p-2 border rounded text-center">4-4-2</div>
                  <div className="p-2 border rounded text-center">3-5-2</div>
                  <div className="p-2 border rounded text-center">5-3-2</div>
                  <div className="p-2 border rounded text-center">4-2-3-1</div>
                  <div className="p-2 border rounded text-center">3-4-3</div>
                </div>
              </TabsContent>
              <TabsContent value="heatmap" className="p-4 border rounded-md mt-2">
                <p className="text-center text-muted-foreground">Upgrade to Pro to access heatmap analysis</p>
              </TabsContent>
              <TabsContent value="patterns" className="p-4 border rounded-md mt-2">
                <p className="text-center text-muted-foreground">Upgrade to Pro to access play pattern analysis</p>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Analyze;
