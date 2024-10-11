import { Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Label } from '../label';

interface ISingleSelectProps {
  label: string;
}
export const SingleSelect = ({ label }: ISingleSelectProps) => {
  return (
    <div className="flex flex-col w-[100%] gap-3">
      <Label htmlFor="date">{label}</Label>
      <Select>
        <SelectTrigger id="time" className="w-full">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 24 }, (_, i) => i).map(hour => (
            <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
