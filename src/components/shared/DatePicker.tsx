import { useState } from 'react';

import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Controller, useFormContext } from 'react-hook-form';

interface DatePickerProps {
  name: string;
}

export function DatePicker({ name }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const { control } = useFormContext();

  const parseValue = (value: string | undefined): Date | null => {
    if (!value) return null;
    const date = new Date(value.replace(' ', 'T'));
    return isNaN(date.getTime()) ? null : date;
  };

  const formatDateDisplay = (value: string | undefined): string => {
    const date = parseValue(value);
    return date ? date.toLocaleDateString() : '';
  };

  const formatTimeDisplay = (value: string | undefined): string => {
    const date = parseValue(value);
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const currentDate = parseValue(value);

        const handleDateChange = (date: Date | undefined) => {
          if (!date) return;
          // Mantém a hora existente ou usa 00:00:00
          const newDate = new Date(date);
          if (currentDate) {
            newDate.setHours(currentDate.getHours());
            newDate.setMinutes(currentDate.getMinutes());
            newDate.setSeconds(currentDate.getSeconds());
            newDate.setMilliseconds(currentDate.getMilliseconds());
          } else {
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
          }
          onChange(newDate.toISOString());
        };

        const handleTimeChange = (timeValue: string) => {
          if (!timeValue) return;
          const [hours, minutes] = timeValue.split(':');
          const newDate = currentDate || new Date();
          newDate.setHours(parseInt(hours, 10));
          newDate.setMinutes(parseInt(minutes, 10));
          newDate.setSeconds(0);
          newDate.setMilliseconds(0);
          onChange(newDate.toISOString());
        };

        return (
          <div className='flex gap-4 w-full'>
            <div className='flex flex-col gap-3 flex-1'>
              <Label htmlFor='date-picker' className='px-1'>
                Date
              </Label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    id='date-picker'
                    className='w-full justify-between font-normal'
                  >
                    {value ? formatDateDisplay(value) : 'Select date'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={currentDate || undefined}
                    captionLayout='dropdown'
                    onSelect={(date) => {
                      if (date) {
                        handleDateChange(date);
                        setOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='flex flex-col gap-3 flex-1'>
              <Label htmlFor='time-picker' className='px-1'>
                Time
              </Label>
              <Input
                type='time'
                id='time-picker'
                step='60'
                value={formatTimeDisplay(value)}
                onChange={(e) => handleTimeChange(e.target.value)}
                className='w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
            </div>
          </div>
        );
      }}
    />
  );
}
