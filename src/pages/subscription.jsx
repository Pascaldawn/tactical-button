
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const SubscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
    features: [
      'Interactive Tactics Board',
      'Basic Team Management',
      'Export as Images',
      'Save up to 10 Tactics',
    ],
    btnText: 'Subscribe Monthly',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$99.99',
    period: 'per year',
    popular: true,
    features: [
      'Interactive Tactics Board',
      'Advanced Team Management',
      'Export as Images and Videos',
      'Unlimited Saved Tactics',
      'Video Integration',
      'Priority Support',
    ],
    btnText: 'Subscribe Yearly',
  },
];

const Subscription = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Please sign in to view subscription plans');
    }
  }, [isAuthenticated, navigate]);

  const handleSubscribe = (planId) => {
    toast.success(`Redirecting to Payoneer for ${planId} subscription...`);
    // This would redirect to Payoneer payment in a real app
  };

  return (
    <div className="min-h-screen pt-16 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a plan that works for your team. All payments are processed securely through Payoneer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {SubscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.period}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.btnText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            All payments are processed securely through Payoneer. 
            You can cancel your subscription at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
