import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '../button';
interface ISwapButtonProps {
  onSwapLocations: () => void;
}
export const SwapButton = ({ onSwapLocations }: ISwapButtonProps) => {
  const [isRotated, setIsRotated] = useState(false);

  const handleClick = () => {
    setIsRotated(!isRotated); // Toggle rotation state
    // Add your swap logic here
    onSwapLocations();
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      className="self-end bg-primary scale-95 text-primary-foreground  hover:bg-primary hover:text-primary-foreground active:scale-90 active:shadow-inner transition-transform duration-150 "
    >
      <ArrowLeftRight
        className={`h-5 w-5 transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`}
      />
    </Button>
  );
};
