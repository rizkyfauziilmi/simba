"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2Icon, X, Check } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini diperlukan"),
    newPassword: z
      .string()
      .min(8, "Kata sandi baru harus minimal 8 karakter")
      .refine(
        (val) => /[a-z]/.test(val) && /[A-Z]/.test(val),
        "Kata sandi baru harus mengandung kombinasi huruf besar dan kecil",
      )
      .refine(
        (val) => /\d/.test(val),
        "Kata sandi baru harus mengandung minimal satu angka",
      )
      .refine(
        (val) => /[^a-zA-Z\d]/.test(val),
        "Kata sandi baru harus mengandung minimal satu karakter khusus",
      ),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi diperlukan"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi baru tidak cocok",
    path: ["confirmPassword"],
  });

export default function PasswordChangeForm() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");

  function calculatePasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  }

  const passwordStrength = calculatePasswordStrength(newPassword || "");
  const getPasswordStrengthLabel = () => {
    const labels = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
    return newPassword
      ? labels[passwordStrength - 1] || "Masukkan kata sandi"
      : "Masukkan kata sandi";
  };
  const getPasswordStrengthColor = () => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
    ];
    return colors[passwordStrength - 1] || "bg-slate-300";
  };

  async function onSubmit(data: z.infer<typeof changePasswordSchema>) {
    const { error } = await authClient.changePassword({
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error("Gagal mengubah kata sandi", {
        description: error.message,
      });

      return;
    }

    toast.success("Kata sandi berhasil diubah");
    form.reset();
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubah Kata Sandi</CardTitle>
        <CardDescription>
          Perbarui kata sandi akun Anda untuk keamanan yang lebih baik
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi Saat Ini</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Masukkan kata sandi saat ini"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        tabIndex={-1}
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Masukkan kata sandi baru"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        tabIndex={-1}
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {/* Password Strength Indicator */}
                  {field.value && (
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i < passwordStrength
                                ? getPasswordStrengthColor()
                                : "bg-slate-300 dark:bg-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Kekuatan:{" "}
                        <span className="font-medium">
                          {getPasswordStrengthLabel()}
                        </span>
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Konfirmasi kata sandi baru"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        tabIndex={-1}
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan Kata Sandi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  {[
                    {
                      label: "Minimal 8 karakter",
                      test: (pw: string) => pw.length >= 8,
                    },
                    {
                      label: "Kombinasi huruf besar dan kecil",
                      test: (pw: string) =>
                        /[a-z]/.test(pw) && /[A-Z]/.test(pw),
                    },
                    {
                      label: "Minimal satu angka",
                      test: (pw: string) => /\d/.test(pw),
                    },
                    {
                      label: "Minimal satu karakter khusus (!@#$%^&*)",
                      test: (pw: string) => /[^a-zA-Z\d]/.test(pw),
                    },
                  ].map((req, idx) => {
                    const passed = req.test(newPassword || "");
                    return (
                      <li key={idx} className="flex items-center gap-2">
                        {passed ? (
                          <Check className="text-green-600 h-4 w-4" />
                        ) : (
                          <X className="text-red-600 h-4 w-4" />
                        )}
                        <span
                          className={
                            passed ? "text-green-700" : "text-muted-foreground"
                          }
                        >
                          {req.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" disabled={isLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                )}
                {isLoading ? "Memproses..." : "Ubah Kata Sandi"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
