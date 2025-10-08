import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  timeline?: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, timeline, children }) => {
  return (
    <div className="flex items-start gap-4 animate-fade-in">
      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {timeline && (
            <span className="text-sm text-muted-foreground font-medium">{timeline}</span>
          )}
        </div>
        <div className="text-foreground/70">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
