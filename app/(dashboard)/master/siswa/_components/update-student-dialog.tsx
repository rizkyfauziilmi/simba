"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gender, Student, StudentStatus } from "@/lib/generated/prisma";
import { enumToReadable } from "@/lib/string";
import { cn } from "@/lib/utils";
import { updateStudentSchema } from "@/trpc/schemas/student.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface UpdateStudentDialogProps {
  student: Student;
  setOpen: (open: boolean) => void;
  open: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function UpdateStudentDialog({
  student,
  setOpen,
  open,
  setIsLoading,
}: UpdateStudentDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof updateStudentSchema>>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      status: student.status,
      tanggalLahir: student.tanggalLahir,
      jenisKelamin: student.jenisKelamin,
      alamat: student.alamat,
      nama: student.nama,
      nisn: student.nisn,
      nomorTelepon: student.nomorTelepon,
      studentId: student.id,
    },
  });

  const updateStudentMutationOptions =
    trpc.student.updateStudent.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        form.reset();
        queryClient.invalidateQueries({
          queryKey: trpc.student.getAllStudents.queryKey(),
        });
        setOpen(false);
        toast.success(data.message);
      },
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  const updateStudentMutation = useMutation(updateStudentMutationOptions);

  function onSubmit(data: z.infer<typeof updateStudentSchema>) {
    updateStudentMutation.mutate(data);
  }

  const isLoading =
    updateStudentMutation.isPending || form.formState.isSubmitting;

  // set initial values
  useEffect(() => {
    form.reset({
      nama: student.nama,
      nisn: student.nisn,
      nomorTelepon: student.nomorTelepon,
      studentId: student.id,
      alamat: student.alamat,
      jenisKelamin: student.jenisKelamin,
      status: student.status,
      tanggalLahir: student.tanggalLahir,
    });
  }, [form, student]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isLoading) return;

        setOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Siswa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nisn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NISN</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukkan NISN" />
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
                      </SelectContent>
                    </Select>
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
                name="nomorTelepon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukkan nomor telepon" />
                    </FormControl>
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
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(StudentStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {enumToReadable(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading && <LoaderIcon className="animate-spin" />}
                {isLoading ? "Mengubah..." : "Ubah"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
