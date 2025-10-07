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
