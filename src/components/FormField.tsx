'use client'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'

import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  className?: string
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  type = 'text',
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input
              className={cn('input', className)}
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormField
