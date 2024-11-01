import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Label } from '../label';

interface ISingleSelectProps<T> {
  label?: string;
  value: string;
  items: T[];
  placeholder: string;
  onSelect: (value: string) => void;
}
export const SingleSelect = <
  T extends { id: string; value: string; label: string },
>({
  label,
  items,
  placeholder,
  value,
  onSelect,
}: ISingleSelectProps<T>) => {
  return (
    <div className="flex flex-col w-[100%] gap-3">
      {label && <Label htmlFor="time">{label}</Label>}
      <Select onValueChange={onSelect} value={value || undefined}>
        <SelectTrigger id="time" className="w-full">
          <SelectValue placeholder={placeholder} className="text-white" />
        </SelectTrigger>
        <SelectContent>
          {items?.map((item, idx) => (
            <SelectItem key={idx} value={item.value}>
              <div className="flex items-center">{item.label}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
