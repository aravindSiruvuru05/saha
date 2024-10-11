import {
  AlertDialog as AD,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MouseEventHandler } from 'react';

interface IAlertDialogProps {
  title: string;
  description: string;
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined;
  onAction: MouseEventHandler<HTMLButtonElement> | undefined;
  cancleLabel?: string;
  actionLabel: string;
  dialogButtonLabel?: string;
  show?: boolean;
  setShow?: (open: boolean) => void;
}

export const AlertDialog = ({
  title,
  description,
  onCancel,
  onAction,
  cancleLabel,
  actionLabel,
  show,
  setShow,
  dialogButtonLabel,
}: IAlertDialogProps) => {
  return (
    <AD open={show} onOpenChange={setShow}>
      {dialogButtonLabel && (
        <AlertDialogTrigger asChild>
          <Button variant="outline">{dialogButtonLabel}</Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancleLabel && (
            <AlertDialogCancel onClick={onCancel}>
              {cancleLabel}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={onAction}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AD>
  );
};
