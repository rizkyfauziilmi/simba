"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function CreateAdminDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Password strength logic
  function calculatePasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  }

  const passwordStrength = calculatePasswordStrength(password);
  const getPasswordStrengthLabel = () => {
    const labels = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
    return password
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

  const queryClient = useQueryClient();
  const createAdmin = async () => {
    if (!email || !name) {
      toast.error("Mohon isi semua kolom");
      return;
    }
    if (passwordStrength < 4) {
      toast.error("Kata sandi belum cukup kuat", {
        description: "Mohon pilih kata sandi yang lebih kuat sebelum mengirim.",
      });
      return;
    }
    setIsSubmitting(true);
    const { error } = await authClient.admin.createUser({
      email,
      password,
      name,
      role: "admin",
    });
    setIsSubmitting(false);

    if (error) {
      toast.error("Gagal membuat admin", {
        description: error.message,
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["users"] });
    setIsOpen(false);
    setEmail("");
    setName("");
    setPassword("");
    toast.success("Admin berhasil dibuat");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Buat Admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Admin Baru</DialogTitle>
          <DialogDescription>
            Isi formulir di bawah untuk menambah pengguna admin baru.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="adminEmail">Email</Label>
          <Input
            id="adminEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2 pt-2">
          <Label htmlFor="adminName">Nama</Label>
          <Input
            id="adminName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2 pt-2">
          <Label htmlFor="adminPassword">Kata Sandi</Label>
          <div className="relative">
            <Input
              id="adminPassword"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        {/* Password Strength Indicator */}
        {password && (
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
              <span className="font-medium">{getPasswordStrengthLabel()}</span>
            </p>
          </div>
        )}
        {/* Password Requirements */}
        <div className="pt-2">
          <ul className="text-sm space-y-1">
            {[
              {
                label: "Minimal 8 karakter",
                test: (pw: string) => pw.length >= 8,
              },
              {
                label: "Huruf besar dan kecil",
                test: (pw: string) => /[a-z]/.test(pw) && /[A-Z]/.test(pw),
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
              const passed = req.test(password || "");
              return (
                <li key={idx} className="flex items-center gap-2">
                  {passed ? (
                    <span className="text-green-600 font-bold">✓</span>
                  ) : (
                    <span className="text-red-600 font-bold">✗</span>
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Batal
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={createAdmin}
            disabled={!email || !name || passwordStrength < 4 || isSubmitting}
          >
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {isSubmitting ? "Membuat..." : "Buat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
