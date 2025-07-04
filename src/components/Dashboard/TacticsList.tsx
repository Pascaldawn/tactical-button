
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock } from 'lucide-react';

interface TacticItem {
  id: number;
  name: string;
  lastEdited: string;
}

interface TacticsListProps {
  tactics: TacticItem[];
}

const TacticsList: React.FC<TacticsListProps> = ({ tactics }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Tactics</h2>
        <Button 
          onClick={() => navigate('/board')} 
          className="btn-primary flex items-center gap-1"
        >
          <PlusCircle size={18} />
          <span>New Tactic</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tactics.map((tactic) => (
          <div 
            key={tactic.id} 
            className="glass-panel p-6 hover:shadow-md transition-all cursor-pointer hover:translate-y-[-2px]"
            onClick={() => navigate('/board')}
          >
            <h3 className="font-semibold mb-2">{tactic.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock size={14} className="mr-1" />
              <span>Last edited {tactic.lastEdited}</span>
            </div>
          </div>
        ))}

        <div 
          className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"
          onClick={() => navigate('/board')}
        >
          <PlusCircle size={24} className="mb-2" />
          <p className="font-medium">Create New Tactic</p>
        </div>
      </div>
    </div>
  );
};

export default TacticsList;
