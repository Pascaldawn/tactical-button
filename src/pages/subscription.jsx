
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const Subscription = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Please sign in to view subscription options');
    }
  }, [isAuthenticated, navigate]);

  const handleSubscribe = (plan) => {
    toast.info(`Redirecting to Payoneer for ${plan} subscription...`);
    // In a real implementation, this would redirect to Payoneer payment gateway
    setTimeout(() => {
      toast('This is a frontend demo - backend integration with Payoneer needed for actual implementation');
    }, 2000);
  };

  const plans = [
    {
      name: 'Monthly',
      price: '$9.99',
      period: 'per month',
      features: [
        'Interactive tactics board',
        'Save up to 10 tactics',
        'Basic drawing tools',
        'Export as image'
      ]
    },
    {
      name: 'Yearly',
      price: '$99.99',
      period: 'per year',
      features: [
        'Interactive tactics board',
        'Unlimited tactics',
        'Advanced drawing tools',
        'Export as image or video',
        'Team collaboration',
        'Video integration',
        '24/7 support'
      ],
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Choose Your Plan</h1>
        <p className="text-center text-muted-foreground mb-12">
          Unlock premium features with a subscription
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`glass-panel p-8 rounded-lg flex flex-col ${
                plan.highlight ? 'border-2 border-primary ring-2 ring-primary/20' : ''
              }`}
            >
              {plan.highlight && (
                <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full self-start mb-4">
                  Best Value
                </div>
              )}
              
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-2 mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground"> {plan.period}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.name)}
                className={`mt-auto ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
              >
                Subscribe with Payoneer
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All payments are processed securely through Payoneer.</p>
          <p className="mt-1">Cancel your subscription at any time.</p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
