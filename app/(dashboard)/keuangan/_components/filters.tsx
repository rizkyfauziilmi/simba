"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { enumToReadable } from "@/lib/string";
import { FilterX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { expenseCategories, incomeCategories } from "@/constants/categories";

export function FinanceFilters() {
  const [type, setType] = useQueryState(
    "type",
    parseAsStringEnum<FinanceType>(Object.values(FinanceType)),
  );
  const [category, setCategory] = useQueryState("category", parseAsString);

  const clearFilters = () => {
    setType(null);
    setCategory(null);
  };

  const isNoFilterApplied = !type && !category;

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          isNoFilterApplied ? "md:grid-cols-4" : "md:grid-cols-5",
        )}
      >
        <div className="space-y-2">
          <Label htmlFor="type">Tipe</Label>
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value: FinanceType) => setType(value)}
              value={type || ""}
            >
              <SelectTrigger value={""} className="w-full">
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FinanceType).map((value) => (
                  <SelectItem key={value} value={value}>
                    {enumToReadable(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {type && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setType(null)}
              >
                <X />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select
            onValueChange={(value) => setCategory(value)}
            value={category || ""}
          >
            <SelectTrigger value="" className="w-full">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Pemasukan</SelectLabel>
                {incomeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Pengeluaran</SelectLabel>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="from">Dari Tanggal</Label>
          <Input id="from" type="date" className="bg-background" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to">Sampai Tanggal</Label>
          <Input id="to" type="date" className="bg-background" />
        </div>

        {!isNoFilterApplied && (
          <Button
            type="button"
            variant="destructive"
            className="mt-auto"
            onClick={clearFilters}
          >
            <FilterX />
          </Button>
        )}
      </div>
    </div>
  );
}
