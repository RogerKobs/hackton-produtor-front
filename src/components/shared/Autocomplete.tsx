import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Controller, useFormContext } from 'react-hook-form';

interface AutocompleteProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export function Autocomplete({ name, label, options }: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className='flex flex-col gap-2 w-full'>
          <Label>{label}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className='w-full justify-between'
              >
                {value
                  ? options.find((item) => item.value === value)?.label
                  : 'Selecione uma opção'}
                <ChevronsUpDown className='opacity-50' />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className='p-0'
              align='start'
              style={{ width: 'var(--radix-popover-trigger-width)' }}
            >
              <Command>
                <CommandInput
                  placeholder='Search framework...'
                  className='h-9'
                />
                <CommandList>
                  <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>

                  <CommandGroup>
                    {options.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          onChange(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            value === item.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    />
  );
}
