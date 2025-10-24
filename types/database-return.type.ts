import { Prisma } from "@/lib/generated/prisma";

export type StudentWithImage = Prisma.StudentGetPayload<{
  include: {
    user: {
      select: {
        image: true;
      };
    };
  };
}>;

export type TeacherWithImage = Prisma.TeacherGetPayload<{
  include: {
    user: {
      select: {
        image: true;
      };
    };
  };
}>;

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

export type SubjectWithScheduleCount = Prisma.SubjectGetPayload<{
  include: {
    _count: {
      select: {
        schedules: true;
      };
    };
  };
}>;

export type SchoolSchedule = Prisma.ClassScheduleGetPayload<{
  select: {
    hari: true;
    jamMulai: true;
    jamSelesai: true;
    subject: { select: { nama: true } };
    guruPengampu: { select: { nama: true } };
  };
}>;
