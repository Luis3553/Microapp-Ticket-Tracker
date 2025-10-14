import z from 'zod'

export const AuthSchemas = {
  register: z
    .object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(8).max(100),
      confirm: z.string().min(8).max(100),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ['confirm'],
    }),
  login: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),
}
