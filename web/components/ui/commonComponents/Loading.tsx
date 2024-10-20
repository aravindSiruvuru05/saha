import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const Loading = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          Fetching rides for you
          <PulsingDot delay="0s" />
          <PulsingDot delay="0.2s" />
          <PulsingDot delay="0.4s" />
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please wait while we prepare your experience
        </p>
        {/* <div className="mt-8 space-y-2">
          <div className="h-1 w-64 mx-auto bg-secondary overflow-hidden rounded-full">
            <div className="h-full w-1/2 bg-primary rounded-full animate-pulse" />
          </div>
          <div className="text-xs text-muted-foreground">Loading assets...</div>
        </div> */}
      </div>
    </div>
  );
};

function PulsingDot({ delay = '0s' }: { delay?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-2 w-2 rounded-full bg-primary',
        'animate-pulse',
      )}
      style={{ animationDelay: delay, marginLeft: '2px' }}
    />
  );
}
