import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { LucideIcon } from 'lucide-react';

interface ResearchNodeData {
  label: string;
  tagline: string;
  icon: LucideIcon;
  isCenter: boolean;
}

const ResearchNodeComponent = ({ data, isConnectable }: NodeProps<ResearchNodeData>) => {
  const Icon = data.icon;
  const iconSize = data.isCenter ? 48 : 40;

  return (
    <HoverCard openDelay={400} closeDelay={200}>
      <HoverCardTrigger asChild>
        <div className="w-full h-full flex items-center justify-center">
          <Icon size={iconSize} strokeWidth={2} />
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
            style={{ opacity: 0 }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
            style={{ opacity: 0 }}
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="center"
        sideOffset={15}
        className="border-primary/20"
      >
        <div className="space-y-2">
          <h4 className="text-lg font-semibold leading-tight">{data.label}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.tagline}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default memo(ResearchNodeComponent);
