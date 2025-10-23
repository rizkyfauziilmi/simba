"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoaderIcon, RefreshCw } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient, Session } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface ProfileInfoFormProps {
  user: Pick<Session, "user">["user"];
  onUpdate: () => void;
}

const updateProfileInfoSchema = z.object({
  image: z
    .url({ message: "Harus berupa URL gambar yang valid" })
    .refine((val) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(val), {
      message: "URL harus berakhiran dengan ekstensi gambar (.jpg, .png, dll)",
    })
    .optional(),
  name: z.string().min(2, "Nama harus terdiri dari minimal 2 karakter"),
  displayUsername: z
    .string()
    .min(3, "Nama tampilan harus terdiri dari minimal 3 karakter"),
  username: z
    .string()
    .min(3, "Username harus terdiri dari minimal 3 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh mengandung huruf, angka, dan garis bawah",
    ),
});

export default function ProfileInfoForm({
  user,
  onUpdate,
}: ProfileInfoFormProps) {
  const form = useForm<z.infer<typeof updateProfileInfoSchema>>({
    resolver: zodResolver(updateProfileInfoSchema),
    defaultValues: {
      image: user.image ?? undefined,
      name: user.name,
      displayUsername: user.displayUsername ?? "",
      username: user.username ?? "",
    },
  });

  const isNotValidImageUrl = (url: string) => {
    return !/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const refreshInfo = () => {
    onUpdate();
    form.reset({
      image: user.image ?? undefined,
      name: user.name,
      displayUsername: user.displayUsername ?? undefined,
      username: user.username ?? undefined,
    });
  };

  async function onSubmit(dataForm: z.infer<typeof updateProfileInfoSchema>) {
    const { error } = await authClient.updateUser({
      image: isNotValidImageUrl(dataForm.image || "")
        ? undefined
        : dataForm.image,
      name: dataForm.name,
      displayUsername: dataForm.displayUsername,
      username: dataForm.username,
    });

    if (error) {
      toast.error("Gagal memperbarui profil", {
        description: error.message,
      });
      return;
    }

    toast.success("Profil berhasil diperbarui");
    onUpdate();
    form.reset({
      image: isNotValidImageUrl(dataForm.image || "")
        ? undefined
        : dataForm.image,
      name: dataForm.name,
      displayUsername: dataForm.displayUsername,
      username: dataForm.username,
    });
  }

  const isLoading = form.formState.isSubmitting;
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle>Informasi Profil</CardTitle>
        <CardDescription>Perbarui informasi pribadi Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Profil</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={field.value || undefined}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Input
                        type="url"
                        placeholder="URL gambar"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Masukkan nama lengkap Anda"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field (not editable) */}
            <div className="space-y-2">
              <FormLabel htmlFor="email">Email</FormLabel>
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  disabled
                />
              </div>
            </div>

            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="username"
                      placeholder="Masukkan username Anda"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Username Field */}
            <FormField
              control={form.control}
              name="displayUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Tampilan</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="displayUsername"
                      placeholder="Nama yang ditampilkan kepada pengguna lain"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => {
                  refreshInfo();
                  toast.success("Profile disinkronisasi ulang");
                }}
              >
                <RefreshCw />
                Refresh
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
                )}
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
