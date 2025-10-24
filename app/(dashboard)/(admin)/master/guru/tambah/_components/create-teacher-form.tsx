"use client";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Gender, TeacherStatus } from "@/lib/generated/prisma";
import { enumToReadable } from "@/lib/string";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PhoneInput } from "@/components/phone-input";
import { createTeacherSchema } from "@/trpc/schemas/teacher.schema";
import { Spinner } from "@/components/ui/spinner";

export function CreateTeacherForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof createTeacherSchema>>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      nip: "",
      nama: "",
      alamat: "",
      noTelepon: "",
      status: "AKTIF",
    },
  });

  const createTeacherMutationOptions =
    trpc.teacher.createTeacher.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        form.reset();
        queryClient.invalidateQueries({
          queryKey: trpc.student.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.teacher.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.class.pathKey(),
        });
        toast.success(data.message);
        router.push("/master/guru");
      },
    });
  const createTeacherMutation = useMutation(createTeacherMutationOptions);

  function onSubmit(data: z.infer<typeof createTeacherSchema>) {
    createTeacherMutation.mutate(data);
  }

  const isLoading =
    createTeacherMutation.isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIP</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="Masukkan NIP" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan nama lengkap" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jenisKelamin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  key={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(Gender).map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {enumToReadable(gender)}
                      </SelectItem>
                    ))}
                    {field.value && (
                      <Button
                        type="button"
                        className="w-full"
                        onClick={() => {
                          field.onChange("");
                        }}
                      >
                        Hapus Pilihan
                      </Button>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan alamat" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noTelepon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Handphone</FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="Masukkan Nomor Handphone"
                    international={false}
                    defaultCountry="ID"
                    allowedCountries={["ID"]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggalLahir"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Lahir</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", {
                            locale: id,
                          })
                        ) : (
                          <span>Pilih Tanggal Lahir</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      locale={id}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggalMasuk"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Masuk Mengajar</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", {
                            locale: id,
                          })
                        ) : (
                          <span>Pilih Tanggal Masuk</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      locale={id}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                key={field.value}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(TeacherStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {enumToReadable(status)}
                    </SelectItem>
                  ))}
                  {field.value && (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        field.onChange("");
                      }}
                    >
                      Hapus Pilihan
                    </Button>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => router.back()}
          >
            Kembali
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner />}
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
