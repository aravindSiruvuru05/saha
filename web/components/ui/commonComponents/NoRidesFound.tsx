import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIonRouter } from '@ionic/react';

interface INoRidesFoundProps {
  simdple?: boolean;
}
export const NoRidesFound: React.FC<INoRidesFoundProps> = props => {
  const router = useIonRouter();
  return (
    <div className="bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-secondary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          No Rides {props.simdple ? '' : 'Found'}
        </h2>
        {!props.simdple && (
          <>
            <p className="text-muted-foreground mb-6">
              We couldn&#39;t find any rides matching your search criteria. Try
              adjusting your filters or search for a different route.
            </p>
            <div className="w-full max-w-[240px] h-1 bg-secondary rounded-full overflow-hidden mx-auto mb-6">
              <div className="w-1/3 h-full bg-primary rounded-full animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Don&#39;t give up! New rides are added frequently.
            </p>
          </>
        )}
        <Button
          className="w-full max-w-[200px]"
          onClick={() => router.push('', 'back', 'pop')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    </div>
  );
};
