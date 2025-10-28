'use client'

import { useTRPC } from '@/trpc/client'
import { createStudentSchema } from '@/trpc/schemas/student.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import {
  Form,
  FormControl,
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Gender, StudentGrade, StudentStatus } from '@/lib/generated/prisma'
import { enumToReadable } from '@/lib/string'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { PhoneInput } from '@/components/phone-input'
import { FormInputSkeleton } from '@/components/skeleton/form-input-skeleton'
import { NoUserError } from '@/components/no-user-error'
import { Spinner } from '@/components/ui/spinner'

export function CreateStudentForm() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: availableClasses, isPending } = useQuery(
    trpc.class.getAvailableClasses.queryOptions()
  )

  const form = useForm<z.infer<typeof createStudentSchema>>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      alamat: '',
      nama: '',
      nisn: '',
      noTelepon: '',
      status: 'AKTIF',
    },
  })

  const createStudentMutationOptions = trpc.student.createStudent.mutationOptions({
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
      router.push('/master/siswa')
    },
  })
  const createStudentMutation = useMutation(createStudentMutationOptions)

  function onSubmit(data: z.infer<typeof createStudentSchema>) {
    createStudentMutation.mutate(data)
  }

  const isLoading = createStudentMutation.isPending || form.formState.isSubmitting

  return (
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
                  <Input type="number" {...field} placeholder="Masukkan NISN" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(Gender).map(gender => (
                      <SelectItem key={gender} value={gender}>
                        {enumToReadable(gender)}
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
            name="tanggalLahir"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Lahir</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', {
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
                      disabled={date => date > new Date() || date < new Date('1900-01-01')}
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
            name="noTelepon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Handphone</FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="Masukkan Nomor Handphone"
                    international={false}
                    defaultCountry="ID"
                    allowedCountries={['ID']}
                    {...field}
                  />
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
              <Select onValueChange={field.onChange} defaultValue={field.value} key={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(StudentStatus).map(status => (
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
        {isPending ? (
          <FormInputSkeleton />
        ) : (
          availableClasses && (
            <FormField
              control={form.control}
              name="kelasId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    key={field.value}
                  >
                    {availableClasses.length === 0 ? (
                      <NoUserError
                        title="Kelas tidak tersedia"
                        description="Tidak ada kelas yang tersedia. Silakan buat kelas terlebih dahulu."
                      />
                    ) : (
                      <>
                        <FormControl className="w-full">
                          <SelectTrigger disabled={availableClasses.length === 0}>
                            <SelectValue placeholder="Pilih kelas siswa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(StudentGrade).map((grade, index) => (
                            <SelectGroup key={`${grade}-${index}`}>
                              <SelectLabel>{grade}</SelectLabel>
                              {availableClasses
                                .filter(aclass => aclass.tingkat === grade)
                                .map(aclass => (
                                  <SelectItem value={aclass.id} key={aclass.id}>
                                    {aclass.namaKelas}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
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
                      </>
                    )}
                  </Select>
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
