'use client'

import { NoUserError } from '@/components/no-user-error'
import { FormInputSkeleton } from '@/components/skeleton/form-input-skeleton'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StudentGrade } from '@/lib/generated/prisma'
import { useTRPC } from '@/trpc/client'
import { markAsPassedSchema, MarkAsPassedSchema } from '@/trpc/schemas/class.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface GraduateClassAlertDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  isLast: boolean
  classId: string
}

export function GraduateClassAlertDialog({
  open,
  setOpen,
  setIsLoading,
  isLast,
  classId,
}: GraduateClassAlertDialogProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const graduateClassMutationOptions = trpc.class.markAsPassed.mutationOptions({
    onSuccess: data => {
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
      setOpen(false)
    },
    onError: error => {
      toast.error(error.message)
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })
  const graduateClassMutation = useMutation(graduateClassMutationOptions)
  const isGraduating = graduateClassMutation.isPending
  const { data: availableClasses, isPending } = useQuery(
    trpc.class.getAvailableClasses.queryOptions(undefined, {
      enabled: !isLast,
    })
  )

  const form = useForm<MarkAsPassedSchema>({
    resolver: zodResolver(markAsPassedSchema),
    defaultValues: {
      classId,
      promotedClassId: undefined,
    },
  })

  function onSubmit(data: MarkAsPassedSchema) {
    graduateClassMutation.mutate({
      classId: data.classId,
      promotedClassId: data.promotedClassId,
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={open => {
        setOpen(open)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin ingin meluluskan kelas ini?</AlertDialogTitle>
          <AlertDialogDescription>
            {isLast
              ? 'Semua siswa akan keluar dari kelas ini dan siswa akan otomatis memiliki status alumni. Tindakan ini tidak dapat dibatalkan.'
              : 'Semua siswa akan keluar dari kelas ini. Tindakan ini tidak dapat dibatalkan.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {isLast ? null : isPending ? (
              <FormInputSkeleton />
            ) : (
              availableClasses && (
                <FormField
                  control={form.control}
                  name="promotedClassId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih kelas tujuan untuk siswa yang naik kelas</FormLabel>
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
                                    .filter(
                                      aclass => aclass.tingkat === grade && aclass.id !== classId
                                    )
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
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isGraduating || (!isLast && isPending)}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isGraduating || (!isLast && isPending)}
            onClick={e => {
              e.preventDefault()
              form.handleSubmit(onSubmit)()
            }}
          >
            {isGraduating ? 'Meluluskan...' : 'Ya, Luluskan'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
