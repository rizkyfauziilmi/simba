import { Prisma } from "@/lib/generated/prisma";

export type ClassWithWaliAndCount = Prisma.ClassGetPayload<{
  include: {
    waliKelas: {
      select: {
        nama: true;
      };
    };
    _count: {
      select: {
        students: true;
      };
    };
  };
}>;

export type TransactionFinanceRecord = Prisma.SchoolFinanceGetPayload<{
  select: {
    id: true;
    type: true;
    amount: true;
    date: true;
    category: true;
    description: true;
  };
}>;
