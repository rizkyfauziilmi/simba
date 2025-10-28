'use client'

import { Eye, EyeOff, LogIn } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import logo from '@/public/logo.png'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Nama Pengguna atau Email harus diisi'),
  password: z.string().min(1, 'Kata Sandi harus diisi'),
})

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    // identify whether the input is username or email with zod
    const isEmail = z.email().safeParse(values.usernameOrEmail).success

    // if not email, then login with username otherwise with email
    if (!isEmail) {
      const { data, error } = await authClient.signIn.username({
        username: values.usernameOrEmail,
        password: values.password,
      })

      if (error) {
        toast.error('Gagal Masuk!', {
          description: error.message,
        })
        return
      }

      toast.success(`Selamat datang, ${data.user.name}!`)

      form.reset()

      router.push('/')
    } else {
      const { data, error } = await authClient.signIn.email({
        email: values.usernameOrEmail,
        password: values.password,
      })

      if (error) {
        toast.error('Gagal Masuk!', {
          description: error.message,
        })
        return
      }

      toast.success(`Selamat datang, ${data.user.name}!`)

      form.reset()

      router.push('/')
    }
  }

  const isLoading = form.formState.isSubmitting

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <Link href="/" className="flex flex-col items-center gap-2 font-medium">
          <Image src={logo} alt="SIMBA Logo" width={48} height={48} />
          <span className="sr-only">Bustanul Arifin</span>
        </Link>
        <h1 className="text-xl font-bold">
          Selamat datang di <br /> SIMBA
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pengguna atau Email</FormLabel>
                <FormControl>
                  <Input placeholder="nama / nama@domain.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kata Sandi</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="******"
                      {...field}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : <LogIn />}
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
