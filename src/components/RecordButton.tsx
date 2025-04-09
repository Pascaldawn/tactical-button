
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Video, BarChart3 } from 'lucide-react';

interface RecordButtonProps {
  type: 'record' | 'analyze';
  className?: string;
}

const RecordButton: React.FC<RecordButtonProps> = ({ type, className }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (type === 'record') {
      navigate('/record');
    } else {
      navigate('/analyze');
    }
  };
  
  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={`flex flex-col items-center justify-center p-8 h-40 w-full max-w-xs border-2 hover:border-primary hover:bg-primary/5 transition-all ${className}`}
    >
      {type === 'record' ? (
        <>
          <Video className="h-12 w-12 mb-4 text-primary" />
          <span className="text-lg font-medium">Record & Analyze</span>
        </>
      ) : (
        <>
          <BarChart3 className="h-12 w-12 mb-4 text-primary" />
          <span className="text-lg font-medium">Analyze Only</span>
        </>
      )}
    </Button>
  );
};

export default RecordButton;
