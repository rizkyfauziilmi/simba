"use client";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  createSubjectSchema,
  CreateSubjectSchema,
} from "@/trpc/schemas/subject.schema";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { enumToReadable, getAvatarFallback } from "@/lib/string";
import { EmptySchedules } from "../../_components/empty-schedules";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hari, StudentGrade } from "@/lib/generated/prisma";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/time-picker";
import { formatTime24, parseTimeToDate } from "@/lib/time";
import { NoUserError } from "@/components/no-user-error";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FormInputSkeleton } from "@/components/skeleton/form-input-skeleton";
import { Spinner } from "@/components/ui/spinner";

export function CreateMapelForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: availableClasses, isPending: isPendingAvailableClasses } =
    useQuery(trpc.class.getAvailableClasses.queryOptions());
  const { data: activeTeachers, isPending: isPendingActiveTeachers } = useQuery(
    trpc.teacher.getActiveTeachers.queryOptions(),
  );

  const form = useForm<CreateSubjectSchema>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      nama: "",
      deskripsi: "",
      schedules: [],
    },
  });

  const createMapelMutationOptions = trpc.subject.createSubject.mutationOptions(
    {
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
        queryClient.invalidateQueries({
          queryKey: trpc.subject.pathKey(),
        });
        toast.success(data.message);
        router.push("/master/mapel");
      },
    },
  );
  const createMapelMutation = useMutation(createMapelMutationOptions);

  function onSubmit(data: CreateSubjectSchema) {
    createMapelMutation.mutate(data);
  }

  const isLoading =
    createMapelMutation.isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama mata pelajaran" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Masukkan deskripsi mata pelajaran"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="schedules"
          render={({ field }) => (
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Pelajaran</CardTitle>
                <CardDescription>
                  Anda dapat menambahkan beberapa jadwal dengan waktu yang
                  berbeda. Pastikan untuk memilih kelas dan guru pengampu yang
                  sesuai untuk setiap jadwal.
                </CardDescription>
                <FormMessage />
                <CardAction>
                  <Button
                    type="button"
                    onClick={() =>
                      field.onChange([
                        ...field.value,
                        {
                          id: createId(),
                          hari: "SENIN",
                          jamMulai: "00:00:00",
                          jamSelesai: "00:00:00",
                          kelasId: "",
                        },
                      ])
                    }
                  >
                    Tambah Jadwal
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                {form.watch("schedules").length === 0 ? (
                  <EmptySchedules
                    onClick={() =>
                      field.onChange([
                        ...field.value,
                        {
                          id: createId(),
                          hari: "SENIN",
                          jamMulai: "00:00:00",
                          jamSelesai: "00:00:00",
                          kelasId: "",
                        },
                      ])
                    }
                  />
                ) : (
                  <div className="space-y-2">
                    {field.value.map((schedule, index) => (
                      <Item variant="muted" key={schedule.id}>
                        <ItemContent>
                          <ItemTitle>
                            Jadwal {index + 1} - {enumToReadable(schedule.hari)}{" "}
                            - {schedule.jamMulai} - {schedule.jamSelesai}
                          </ItemTitle>
                          <ItemDescription></ItemDescription>
                          <div className="flex items-center gap-6 py-4">
                            <div className="space-y-2">
                              <Label>Hari</Label>
                              <Select
                                value={schedule.hari}
                                onValueChange={(value) => {
                                  const updatedSchedules = field.value.map(
                                    (s) =>
                                      s.id === schedule.id
                                        ? {
                                            ...s,
                                            hari: value as Hari,
                                          }
                                        : s,
                                  );
                                  field.onChange(updatedSchedules);
                                }}
                              >
                                <SelectTrigger value="" className="w-[180px]">
                                  <SelectValue placeholder="Pilih hari" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(Hari).map((hari) => (
                                    <SelectItem key={hari} value={hari}>
                                      {enumToReadable(hari)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {form.formState.errors?.schedules?.[index]
                                ?.hari && (
                                <p className="text-sm text-red-500">
                                  {
                                    form.formState.errors.schedules[index].hari
                                      .message
                                  }
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Jam Mulai</Label>
                              <TimePicker
                                date={parseTimeToDate(schedule.jamMulai)}
                                setDate={(date) => {
                                  if (!date) return;
                                  const updatedSchedules = field.value.map(
                                    (s) =>
                                      s.id === schedule.id
                                        ? {
                                            ...s,
                                            jamMulai: formatTime24(date),
                                          }
                                        : s,
                                  );
                                  field.onChange(updatedSchedules);
                                }}
                              />
                              {form.formState.errors?.schedules?.[index]
                                ?.jamMulai && (
                                <p className="text-sm text-red-500">
                                  {
                                    form.formState.errors.schedules[index]
                                      .jamMulai.message
                                  }
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Jam Selesai</Label>
                              <TimePicker
                                date={parseTimeToDate(schedule.jamSelesai)}
                                setDate={(date) => {
                                  if (!date) return;
                                  const updatedSchedules = field.value.map(
                                    (s) =>
                                      s.id === schedule.id
                                        ? {
                                            ...s,
                                            jamSelesai: formatTime24(date),
                                          }
                                        : s,
                                  );
                                  field.onChange(updatedSchedules);
                                }}
                              />
                              {form.formState.errors?.schedules?.[index]
                                ?.jamSelesai && (
                                <p className="text-sm text-red-500">
                                  {
                                    form.formState.errors.schedules[index]
                                      .jamSelesai.message
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-4">
                            {isPendingAvailableClasses ? (
                              <FormInputSkeleton />
                            ) : (
                              availableClasses && (
                                <div className="space-y-2">
                                  <Label>Kelas Siswa</Label>
                                  <Select
                                    onValueChange={(value) => {
                                      const updatedSchedules = field.value.map(
                                        (s) =>
                                          s.id === schedule.id
                                            ? {
                                                ...s,
                                                kelasId: value,
                                              }
                                            : s,
                                      );
                                      field.onChange(updatedSchedules);
                                    }}
                                    defaultValue={schedule.kelasId}
                                    key={schedule.kelasId}
                                  >
                                    {availableClasses.length === 0 ? (
                                      <NoUserError
                                        title="Kelas tidak tersedia"
                                        description="Tidak ada kelas yang tersedia. Pastikan Anda telah membuat kelas dan kelas tersebut memiliki status aktif."
                                      />
                                    ) : (
                                      <>
                                        <FormControl className="w-full">
                                          <SelectTrigger
                                            disabled={
                                              availableClasses.length === 0
                                            }
                                          >
                                            <SelectValue placeholder="Pilih kelas siswa" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {Object.values(StudentGrade).map(
                                            (grade, index) => (
                                              <SelectGroup
                                                key={`${grade}-${index}`}
                                              >
                                                <SelectLabel>
                                                  {grade}
                                                </SelectLabel>
                                                {availableClasses
                                                  .filter(
                                                    (aclass) =>
                                                      aclass.tingkat === grade,
                                                  )
                                                  .map((aclass) => (
                                                    <SelectItem
                                                      value={aclass.id}
                                                      key={aclass.id}
                                                    >
                                                      {aclass.namaKelas}
                                                    </SelectItem>
                                                  ))}
                                              </SelectGroup>
                                            ),
                                          )}
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
                                      </>
                                    )}
                                  </Select>
                                  {form.formState.errors?.schedules?.[index]
                                    ?.kelasId && (
                                    <p className="text-sm text-red-500">
                                      {
                                        form.formState.errors.schedules[index]
                                          .kelasId.message
                                      }
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                            {isPendingActiveTeachers ? (
                              <FormInputSkeleton />
                            ) : activeTeachers &&
                              activeTeachers.length === 0 ? (
                              <NoUserError
                                title="Tidak ada guru aktif tersedia"
                                description="Pastikan Anda telah menambahkan guru aktif yang dapat mengajar jadwal ini."
                              />
                            ) : activeTeachers && activeTeachers.length > 0 ? (
                              <div className="space-y-2">
                                <Label>Pengajar</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl className="w-full">
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "justify-between",
                                          !schedule.guruPengampuId &&
                                            "text-muted-foreground",
                                        )}
                                      >
                                        {schedule.guruPengampuId
                                          ? activeTeachers.find(
                                              (teacher) =>
                                                teacher.id ===
                                                schedule.guruPengampuId,
                                            )?.nama
                                          : "Pilih pengajar"}
                                        <ChevronsUpDown className="opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full p-0">
                                    <Command
                                      filter={(
                                        value: string,
                                        search: string,
                                      ) => {
                                        const option = activeTeachers.find(
                                          (teacher) =>
                                            teacher.nama === search ||
                                            teacher.nip === search,
                                        );

                                        if (!option) return 1;

                                        return option.nama
                                          .toLowerCase()
                                          .includes(value.toLowerCase())
                                          ? 0
                                          : 1;
                                      }}
                                    >
                                      <CommandInput
                                        placeholder="Cari nama guru atau NIP..."
                                        className="h-9"
                                      />
                                      <CommandList>
                                        <CommandEmpty>
                                          Tidak ada guru ditemukan.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {activeTeachers.map((teacher) => (
                                            <CommandItem
                                              value={teacher.id}
                                              key={teacher.id}
                                              onSelect={() => {
                                                const updatedSchedules =
                                                  field.value.map((s) =>
                                                    s.id === schedule.id
                                                      ? {
                                                          ...s,
                                                          guruPengampuId:
                                                            teacher.id,
                                                        }
                                                      : s,
                                                  );
                                                field.onChange(
                                                  updatedSchedules,
                                                );
                                              }}
                                            >
                                              <Avatar className="outline outline-primary size-6">
                                                <AvatarFallback className="text-xs">
                                                  {getAvatarFallback(
                                                    teacher.nama,
                                                  )}
                                                </AvatarFallback>
                                              </Avatar>
                                              {teacher.nama}
                                              <Check
                                                className={cn(
                                                  "ml-auto",
                                                  teacher.id ===
                                                    schedule.guruPengampuId
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                {form.formState.errors?.schedules?.[index]
                                  ?.guruPengampuId && (
                                  <p className="text-sm text-red-500">
                                    {
                                      form.formState.errors.schedules[index]
                                        .guruPengampuId.message
                                    }
                                  </p>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </ItemContent>
                        <ItemActions>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedSchedules = field.value.filter(
                                (s) => s.id !== schedule.id,
                              );
                              field.onChange(updatedSchedules);
                            }}
                          >
                            Hapus
                          </Button>
                        </ItemActions>
                      </Item>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        />
        <div className="flex items-center gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={
              isLoading || isPendingAvailableClasses || isPendingActiveTeachers
            }
            onClick={() => router.back()}
          >
            Kembali
          </Button>
          <Button
            type="submit"
            disabled={
              isLoading || isPendingAvailableClasses || isPendingActiveTeachers
            }
          >
            {isLoading && <Spinner />}
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
