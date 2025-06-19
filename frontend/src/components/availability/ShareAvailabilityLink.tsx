import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Share2 } from 'lucide-react';

interface ShareAvailabilityLinkProps {
  username: string;
}

export const ShareAvailabilityLink: React.FC<ShareAvailabilityLinkProps> = ({ username }) => {
  const [copied, setCopied] = useState(false);
  
  // Generate the public availability URL
  const publicUrl = `${window.location.origin}/u/${username}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Availability',
          text: 'Check my availability for scheduling meetings',
          url: publicUrl,
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      // Fallback to copy if Web Share API is not available
      handleCopyLink();
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Share Your Availability</h3>
          <p className="text-sm text-muted-foreground">
            Share this link with others so they can see your availability.
          </p>
          
          <div className="flex items-center space-x-2">
            <Input 
              value={publicUrl} 
              readOnly 
              className="flex-1"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopyLink}
              title="Copy link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            {navigator.share && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare}
                title="Share link"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};