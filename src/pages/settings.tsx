
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface ProfileFormValues {
  name: string;
  email: string;
}

const Settings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      // This would update the user profile in a real app
      console.log('Updating profile with:', data);
      
      // For demo purposes we'll just show a success message
      toast.success('Profile updated successfully');
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard')} 
        className="mb-6 -ml-2 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <div className="glass-panel p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    Your email address is used for login and cannot be changed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      <div className="glass-panel p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Type</h2>
        <p className="mb-4">
          You are currently using a <strong>Coach</strong> account with the <strong>Free</strong> plan.
        </p>
        <Button onClick={() => navigate('/subscription')}>
          Upgrade to Premium
        </Button>
      </div>
      
      <div className="glass-panel p-6 border-destructive/20">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
        <p className="mb-4 text-muted-foreground">
          Permanently delete your account and all of your content.
        </p>
        <Button variant="destructive">
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default Settings;
