import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsLoading(false);
    toast({
      title: "Successfully subscribed!",
      description: "You'll receive updates about my latest research.",
    });
  };

  if (isSubscribed) {
    return (
      <div className="bg-gradient-primary rounded-lg p-8 text-center text-white">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Thank you for subscribing!</h3>
        <p className="text-white/90">
          You'll receive updates about my latest research and publications.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card rounded-lg p-8 border border-border">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Stay Updated on My Research
        </h3>
        <p className="text-foreground/70">
          Subscribe to receive notifications about new publications, research insights, and conference presentations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="px-6"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        
        <p className="text-xs text-foreground/60 text-center">
          No spam, unsubscribe at any time. Your email is safe with us.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSubscription;