
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TacticsList from '@/components/dashboard/TacticsList';
import QuickActions from '@/components/dashboard/QuickActions';

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
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 pt-20 md:pt-6 md:pl-6 lg:px-8">
          <DashboardHeader 
            title={`Welcome back, ${user?.name || 'Coach'}`}
            description="Manage your tactics and strategies from your dashboard"
          />
          
          <StatsOverview tacticsCount={recentTactics.length} />
          
          <Tabs defaultValue="tactics" className="space-y-4 mb-8">
            <TabsList>
              <TabsTrigger value="tactics">My Tactics</TabsTrigger>
              <TabsTrigger value="recent">Recent Games</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tactics" className="space-y-4">
              <TacticsList tactics={recentTactics} />
            </TabsContent>
            
            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Games</CardTitle>
                  <CardDescription>
                    Your team's most recent match analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No recent games found. Record your first game analysis!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Tactic Templates</CardTitle>
                  <CardDescription>
                    Quick-start templates for common formations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Pro to access template library
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <QuickActions />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
