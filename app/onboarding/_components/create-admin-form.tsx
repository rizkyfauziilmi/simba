"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, UserPen } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { createAdmin } from "../_actions/actions";

const createAdminSchema = z
  .object({
    username: z
      .string()
      .min(3, "Nama pengguna minimal 3 karakter")
      .max(30, "Nama pengguna maksimal 30 karakter"),
    email: z.email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter")
      .max(128, "Kata sandi maksimal 128 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi dan konfirmasi kata sandi tidak sesuai",
    path: ["confirmPassword"],
  });

export function CreateAdminForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<z.infer<typeof createAdminSchema>>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createAdminSchema>) {
    const result = await createAdmin({
      username: values.username,
      email: values.email,
      password: values.password,
    });

    if (!result.success) {
      toast.error("Gagal membuat akun admin", {
        description: result.message,
      });
      return;
    }

    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error("Gagal masuk setelah membuat akun admin", {
        description: "coba masuk secara manual",
      });
      router.push("/login");
      return;
    }

    toast.success(`Selamat datang, ${data.user?.name || "Admin"}!`);

    form.reset();
    router.push("/");
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Buat Akun Admin Pertama Anda</CardTitle>
          <CardDescription>
            Silakan masukkan detail Anda untuk membuat akun admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pengguna</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nama@google.com" {...field} />
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
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <UserPen />
                )}
                {isLoading ? "Membuat Akun..." : "Buat Akun Admin"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
