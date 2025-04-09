
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Download, Share2 } from 'lucide-react';

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
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analyze Tactics</h1>
            <p className="text-muted-foreground">Review and analyze strategies without recording</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Save size={18} />
              <span>Save Formation</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 size={18} />
              <span>Share</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Tactics Board</CardTitle>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Formations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">4-3-3</Button>
                <Button variant="outline" size="sm">4-4-2</Button>
                <Button variant="outline" size="sm">3-5-2</Button>
                <Button variant="outline" size="sm">5-3-2</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">First Team</Button>
                <Button variant="outline" size="sm">Reserve Team</Button>
                <Button variant="outline" size="sm">Youth Team</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">Draw Line</Button>
                <Button variant="outline" size="sm">Add Player</Button>
                <Button variant="outline" size="sm">Clear Board</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
