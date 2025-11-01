import { Input as InputUI } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { Controller, useFormContext } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export function Input({ label, name, className, ...props }: InputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor={props.id}>{label}</Label>
          <InputUI {...field} {...props} className={cn('w-full', className)} />
        </div>
      )}
    />
  );
}
