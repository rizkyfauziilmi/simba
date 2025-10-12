"use client";

import { formatDateISOToID, formatIDR } from "@/lib/string";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function TransactionsTable() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.finance.getFinanceSummary.queryOptions({}),
  );

  const { transactions } = data;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="min-w-full text-left text-sm text-card-foreground">
        <caption className="sr-only">Daftar transaksi terbaru</caption>
        <thead className="bg-secondary text-secondary-foreground">
          <tr>
            <th scope="col" className="px-4 py-3">
              Tanggal
            </th>
            <th scope="col" className="px-4 py-3">
              Tipe
            </th>
            <th scope="col" className="px-4 py-3">
              Kategori
            </th>
            <th scope="col" className="px-4 py-3">
              Jumlah
            </th>
            <th scope="col" className="px-4 py-3">
              Keterangan
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-border">
              <td className="px-4 py-3">
                {formatDateISOToID(transaction.date)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    transaction.type === "PEMASUKAN"
                      ? "rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
                      : "rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive-foreground"
                  }
                >
                  {transaction.type}
                </span>
              </td>
              <td className="px-4 py-3">{transaction.category}</td>
              <td className="px-4 py-3">{formatIDR(transaction.amount)}</td>
              <td className="px-4 py-3">{transaction.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
