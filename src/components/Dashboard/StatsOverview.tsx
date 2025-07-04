
import React from 'react';
import { Layers, Users, BarChart3 } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColorClass: string;
  textColorClass: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, bgColorClass, textColorClass }) => (
  <div className="glass-panel p-6 flex items-center">
    <div className={`rounded-full p-3 ${bgColorClass} ${textColorClass} mr-4`}>
      {icon}
    </div>
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

interface StatsOverviewProps {
  tacticsCount: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ tacticsCount }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatItem 
          icon={<Layers size={24} />}
          label="Total Tactics"
          value={tacticsCount}
          bgColorClass="bg-primary/10"
          textColorClass="text-primary"
        />

        <StatItem 
          icon={<Users size={24} />}
          label="Account Type"
          value="Coach"
          bgColorClass="bg-accent/10"
          textColorClass="text-accent"
        />

        <StatItem 
          icon={<BarChart3 size={24} />}
          label="Subscription"
          value="Free"
          bgColorClass="bg-secondary/10"
          textColorClass="text-foreground"
        />
      </div>
    </div>
  );
};

export default StatsOverview;
