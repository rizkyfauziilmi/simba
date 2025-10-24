"use client";

import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  createTransactionSchema,
  CreateTransactionSchema,
} from "@/trpc/schemas/finance.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FinanceType } from "@/lib/generated/prisma";
import { enumToReadable } from "@/lib/string";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { expenseCategories, incomeCategories } from "@/constants/categories";
import CurrencyInputIDR from "@/components/currency-input-idr";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useQueryState } from "nuqs";
import { filterSearchParams } from "@/lib/searchParams";
import { downloadCSV, downloadExcel, downloadPDF } from "@/lib/download";
import { formattedDate } from "@/lib/date";

export function TransactionHeader() {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [categories] = useQueryState(
    "categories",
    filterSearchParams.categories,
  );
  const [fromDate] = useQueryState("from", filterSearchParams.from);
  const [toDate] = useQueryState("to", filterSearchParams.to);
  const { data } = useSuspenseQuery(
    trpc.finance.getFinanceSummary.queryOptions({
      categories: categories ?? undefined,
      startDate: fromDate,
      endDate: toDate,
    }),
  );

  const createTransactionMutationOptions =
    trpc.finance.createTransaction.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.finance.pathKey(),
        });
        toast.success(data.message);
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const createTransactionMutation = useMutation(
    createTransactionMutationOptions,
  );

  function onSubmit(data: CreateTransactionSchema) {
    createTransactionMutation.mutate(data);
  }

  const isLoading =
    createTransactionMutation.isPending || form.formState.isSubmitting;

  return (
    <header className="mb-6 flex items-center justify-between gap-14">
      <div className="space-y-2">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
          Dashboard Keuangan Sekolah
        </h1>
        <p className="text-sm text-muted-foreground">
          Pantau dan kelola keuangan sekolah Anda dengan mudah dan efisien.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <DownloadIcon />
              Unduh Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Format File</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() =>
                downloadCSV(
                  data.transactions,
                  `${formattedDate(fromDate)}-${formattedDate(toDate)}_data-transaksi`,
                )
              }
            >
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                downloadExcel(
                  data.transactions,
                  `${formattedDate(fromDate)}-${formattedDate(toDate)}_data-transaksi`,
                )
              }
            >
              Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                downloadPDF(
                  data.transactions,
                  `${formattedDate(fromDate)}-${formattedDate(toDate)}_data-transaksi`,
                )
              }
            >
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Transaksi</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Transaksi Baru</DialogTitle>
              <DialogDescription>
                Isi detail transaksi untuk menambah data keuangan sekolah.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Transaksi</FormLabel>
                      <FormControl>
                        <CurrencyInputIDR
                          placeholder="Masukkan jumlah transaksi"
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          form.resetField("category");
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                        key={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe transaksi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(FinanceType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {enumToReadable(type)}
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        key={field.value}
                        disabled={!form.watch("type")}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {form.watch("type") === "PENGELUARAN" ? (
                            <SelectGroup>
                              <SelectLabel>Pengeluaran</SelectLabel>
                              {expenseCategories.map((category) => (
                                <SelectItem value={category} key={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ) : form.watch("type") === "PEMASUKAN" ? (
                            <SelectGroup>
                              <SelectLabel>Pemasukan</SelectLabel>
                              {incomeCategories.map((category) => (
                                <SelectItem value={category} key={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ) : null}
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Transaksi</FormLabel>
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
                                <span>Pilih Tanggal Transaksi</span>
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
                            disabled={
                              (date) => date > new Date() // Disable future dates
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keterangan</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukkan keterangan (opsional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isLoading}>
                      Batal
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Spinner />}
                    {isLoading ? "Menyimpan..." : "Simpan Transaksi"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
