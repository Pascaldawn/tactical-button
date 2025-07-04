
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface QuickActionProps {
  title: string;
  description: string;
  actionText: string;
  path: string;
}

const QuickActionCard: React.FC<QuickActionProps> = ({ title, description, actionText, path }) => {
  const navigate = useNavigate();
  
  return (
    <Button 
      onClick={() => navigate(path)}
      className="glass-panel p-6 text-left hover:shadow-md transition-all hover:translate-y-[-2px]"
      variant="ghost"
    >
      <h3 className="font-semibold mb-4">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="text-primary flex items-center text-sm font-medium">
        <span>{actionText}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="ml-1 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Button>
  );
};

const QuickActions: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard 
          title="Tactics Board"
          description="Design your strategies with our interactive board"
          actionText="Go to board"
          path="/board"
        />

        <QuickActionCard 
          title="Upgrade to Premium"
          description="Unlock all features and remove limitations"
          actionText="View plans"
          path="/subscription"
        />

        <QuickActionCard 
          title="Account Settings"
          description="Update your profile and preferences"
          actionText="Manage account"
          path="/settings"
        />
      </div>
    </div>
  );
};

export default QuickActions;
