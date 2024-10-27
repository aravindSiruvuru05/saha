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
          </>
        )}
      </div>
    </div>
  );
};
