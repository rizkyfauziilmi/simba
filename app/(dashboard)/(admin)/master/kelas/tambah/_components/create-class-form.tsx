'use client'

import { useTRPC } from '@/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ClassStatus, StudentGrade } from '@/lib/generated/prisma'
import { enumToReadable, getAvatarFallback } from '@/lib/string'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { createClassSchema } from '@/trpc/schemas/class.schema'
import {
  CommandGroup,
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
} from '@/components/ui/command'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { NoUserError } from '@/components/no-user-error'
import { Switch } from '@/components/ui/switch'
import { FormInputSkeleton } from '@/components/skeleton/form-input-skeleton'
import { Spinner } from '@/components/ui/spinner'

export function CreateClassForm() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: homeroomTeachers, isPending: isPendingHomeroomTeachers } = useQuery(
    trpc.teacher.getNotHomeRoomTeachers.queryOptions()
  )
  const { data: studentsWithNoClass, isPending: isPendingStudentsWithNoClass } = useQuery(
    trpc.student.getAllStudentsWithNoClass.queryOptions()
  )

  const form = useForm<z.infer<typeof createClassSchema>>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      namaKelas: '',
      ruang: '',
      status: 'AKTIF',
      tingkat: 'SMK',
    },
  })

  const createClassMutationOptions = trpc.class.createClass.mutationOptions({
    onError: error => {
      toast.error(error.message)
    },
    onSuccess: data => {
      form.reset()
      queryClient.invalidateQueries({
        queryKey: trpc.student.pathKey(),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.teacher.pathKey(),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.class.pathKey(),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.subject.pathKey(),
      })
      toast.success(data.message)
      router.push('/master/kelas')
    },
  })
  const createTeacherMutation = useMutation(createClassMutationOptions)

  function onSubmit(data: z.infer<typeof createClassSchema>) {
    createTeacherMutation.mutate(data)
  }

  const isLoading = createTeacherMutation.isPending || form.formState.isSubmitting
  const isPending = isPendingHomeroomTeachers || isPendingStudentsWithNoClass

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="namaKelas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kelas</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan nama kelas" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tingkat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tingkat</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(StudentGrade).map(tingkat => (
                      <SelectItem key={tingkat} value={tingkat}>
                        {tingkat}
                      </SelectItem>
                    ))}
                    {field.value && (
                      <Button
                        type="button"
                        className="w-full"
                        onClick={() => {
                          field.onChange('')
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
            name="ruang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ruangan / Lokasi Mengajar</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan ruangan kelas" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(ClassStatus).map(status => (
                      <SelectItem key={status} value={status}>
                        {enumToReadable(status)}
                      </SelectItem>
                    ))}
                    {field.value && (
                      <Button
                        type="button"
                        className="w-full"
                        onClick={() => {
                          field.onChange('')
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
        </div>
        <FormField
          control={form.control}
          name="isLast"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Tandai sebagai kelas terakhir untuk tingkat ini</FormLabel>
                <FormDescription>
                  Jika diaktifkan, kelas ini akan dianggap sebagai kelas terakhir dan setiap siswa
                  yang lulus dari kelas ini akan menjadi alumni.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        {isPendingHomeroomTeachers ? (
          <FormInputSkeleton />
        ) : (
          homeroomTeachers && (
            <FormField
              control={form.control}
              name="waliKelasId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Wali Kelas</FormLabel>
                  {homeroomTeachers.length === 0 ? (
                    <NoUserError
                      title="Tidak ada guru yang tersedia"
                      description="Hanya guru yang belum menjadi wali kelas di kelas lain dan yang memiliki status aktif atau cuti dapat dipilih. Jika tidak ada guru yang muncul, pastikan kembali data guru sudah benar."
                    />
                  ) : (
                    <>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className="w-full">
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? homeroomTeachers.find(teacher => teacher.id === field.value)?.nama
                                : 'Pilih wali kelas'}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command
                            filter={(value: string, search: string) => {
                              const option = homeroomTeachers.find(
                                teacher => teacher.nama === search || teacher.nip === search
                              )

                              if (!option) return 1

                              return option.nama.toLowerCase().includes(value.toLowerCase()) ? 0 : 1
                            }}
                          >
                            <CommandInput
                              placeholder="Cari nama guru atau NIP..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>Tidak ada guru ditemukan.</CommandEmpty>
                              <CommandGroup>
                                {homeroomTeachers.map(teacher => (
                                  <CommandItem
                                    value={teacher.id}
                                    key={teacher.id}
                                    onSelect={() => {
                                      form.setValue('waliKelasId', teacher.id)
                                    }}
                                  >
                                    <Avatar className="outline outline-primary size-6">
                                      <AvatarFallback className="text-xs">
                                        {getAvatarFallback(teacher.nama)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {teacher.nama}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        teacher.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Wali kelas bertanggung jawab terhadap kelas ini. Guru yang keluar, pensiun,
                        atau sudah menjadi wali kelas di kelas lain tidak dapat dipilih (ubah
                        terlebih dahulu statusnya di data master guru).
                      </FormDescription>
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        )}
        {isPendingStudentsWithNoClass ? (
          <FormInputSkeleton />
        ) : (
          studentsWithNoClass && (
            <FormField
              control={form.control}
              name="studentIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Siswa</FormLabel>
                    {studentsWithNoClass.length !== 0 && (
                      <FormDescription>
                        Jika tidak ada siswa yang muncul, pastikan kembali status siswa aktif dan
                        siswa belum memiliki kelas.
                      </FormDescription>
                    )}
                  </div>
                  {studentsWithNoClass.length === 0 ? (
                    <NoUserError
                      title="Tidak ada siswa yang tersedia"
                      description="Hanya siswa yang belum memiliki kelas dan yang memiliki status aktif yang dapat ditambahkan ke kelas. Jika tidak ada siswa yang muncul, pastikan kembali data siswa sudah benar."
                    />
                  ) : (
                    <div className="bg-card py-4 space-y-4 rounded-md max-h-72 overflow-y-auto border">
                      {studentsWithNoClass.map((student, index) => {
                        const isLastItem = index === studentsWithNoClass.length - 1

                        return (
                          <React.Fragment key={student.id}>
                            <FormField
                              control={form.control}
                              name="studentIds"
                              render={({ field }) => {
                                // Ensure field.value is always an array for iteration
                                const valueArray = Array.isArray(field.value) ? field.value : []
                                return (
                                  <FormItem
                                    key={student.id}
                                    className="flex flex-row items-center gap-2 px-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={valueArray.includes(student.id)}
                                        onCheckedChange={checked => {
                                          return checked
                                            ? field.onChange([...valueArray, student.id])
                                            : field.onChange(
                                                valueArray.filter(value => value !== student.id)
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex items-center gap-2">
                                      <Avatar>
                                        <AvatarFallback>
                                          {getAvatarFallback(student.nama)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <FormLabel className="text-sm font-normal">
                                          {student.nama}
                                        </FormLabel>
                                        <FormDescription>{student.nisn}</FormDescription>
                                      </div>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                            {!isLastItem && <Separator />}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        )}
        <div className="flex md:items-center gap-2 md:justify-end flex-col md:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || isPending}
            onClick={() => router.back()}
          >
            Kembali
          </Button>
          <Button type="submit" disabled={isLoading || isPending}>
            {isLoading && <Spinner />}
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
