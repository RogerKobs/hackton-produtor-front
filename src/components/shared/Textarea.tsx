import { Textarea as TextareaUI } from '@/components/ui/textarea';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '../ui/label';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}

export function Textarea({ name, label, ...props }: TextAreaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className='grid w-full gap-3'>
          <Label htmlFor='message'>{label}</Label>
          <TextareaUI onChange={onChange} value={value} {...props} />
        </div>
      )}
    />
  );
}
