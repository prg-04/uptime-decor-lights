import { z } from 'zod'

export type FormType = 'sign-in' | 'sign-up'

export const getAuthFormSchema = (type: FormType) =>
  z.object({
    firstName: type === 'sign-up' ? z.string().min(3) : z.string(),
    lastName: type === 'sign-up' ? z.string().min(3) : z.string(),
    email: z.string().email(),
    password: z.string().min(3),
  })

export const schema = getAuthFormSchema('sign-in')

export type AuthFormData = z.infer<ReturnType<typeof getAuthFormSchema>>
