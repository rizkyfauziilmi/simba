"use server";

import { expenseCategories, incomeCategories } from "@/constants/categories";
import { auth } from "@/lib/auth";
import { now } from "@/lib/date";
import db from "@/lib/db";
import { Gender, Hari, Prisma, StudentGrade } from "@/lib/generated/prisma";
import { formatIDR } from "@/lib/string";
import { faker } from "@faker-js/faker";
import cliProgress from "cli-progress";
import { eachDayOfInterval, subYears } from "date-fns";

// ------------------------------------
// ✅ Helper: Safe Username Generator
// ------------------------------------
function generateSafeUsername(base: string, index: number) {
  return base.toLowerCase().replace(/[^a-z0-9]/g, "") + index;
}

// ------------------------------------
// ✅ Clean DB
// ------------------------------------
async function cleanDb() {
  console.log("🧹 Cleaning up database...");

  // Delete schedule and subjects first (they reference classes & teachers)
  await db.classSchedule.deleteMany({});
  await db.subject.deleteMany({});

  // Other relational cleanup
  await db.classHistory.deleteMany({});
  await db.session.deleteMany({});
  await db.account.deleteMany({});
  await db.verification.deleteMany({});
  await db.student.deleteMany({});
  await db.teacher.deleteMany({});
  await db.class.deleteMany({});
  // Finance & balance (so seed is idempotent)
  await db.schoolFinance.deleteMany({});
  await db.schoolBalance.deleteMany({});

  // Finally users
  await db.user.deleteMany({});

  console.log("✅ Database cleanup complete!");
}

// ------------------------------------
// ✅ Create Admins
// ------------------------------------
async function createAdmin(amount: number) {
  const bar = new cliProgress.SingleBar({
    format: "👤 Creating Admins |{bar}| {value}/{total} ({percentage}%)",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  bar.start(amount, 0);

  for (let i = 0; i < amount; i++) {
    const count = i + 1;
    const base = faker.person.firstName();
    const username = generateSafeUsername(base, count);

    const response = await auth.api.signUpEmail({
      body: {
        image: faker.image.avatar(),
        name: `Admin ${count}`,
        email: `admin${count}@example.com`,
        password: "admin@1234",
        displayUsername: username,
        username: username,
      },
      asResponse: true,
    });

    if (!response.ok) {
      console.error("❌ Failed to create admin user:", await response.text());
      bar.stop();
      throw new Error(`Failed to create admin user: ${response.statusText}`);
    }

    const data = await response.json();

    await db.user.update({
      where: { id: data.user.id },
      data: { role: "admin" },
    });

    bar.update(count);
  }

  bar.stop();
}

// ------------------------------------
// ✅ Create Classes
// ------------------------------------
async function createClasses(amount: number) {
  const bar = new cliProgress.SingleBar({
    format: "🏫 Creating Classes |{bar}| {value}/{total} ({percentage}%)",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  bar.start(amount, 0);

  const classes = [];

  for (let i = 0; i < amount; i++) {
    const classData = await db.class.create({
      data: {
        namaKelas: `Kelas ${i + 1}`,
        tingkat: faker.helpers.arrayElement(Object.values(StudentGrade)),
        ruang: `R${i + 1}`,
        isLast: i === amount - 1,
        status: "AKTIF",
      },
    });

    classes.push(classData);
    bar.update(i + 1);
  }

  bar.stop();
  return classes;
}

// ------------------------------------
// ✅ Create Teachers
// ------------------------------------
async function createTeachers(amount: number, classIds: string[]) {
  const bar = new cliProgress.SingleBar({
    format: "📽️ Projecting Teachers |{bar}| {value}/{total} ({percentage}%)",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  bar.start(amount, 0);

  const teachers = [];

  for (let i = 0; i < amount; i++) {
    const count = i + 1;
    const base = faker.person.firstName();
    const username = generateSafeUsername(base, count);

    const response = await auth.api.signUpEmail({
      body: {
        image: faker.image.avatar(),
        name: `Teacher ${count}`,
        email: `teacher${count}@example.com`,
        password: "teacher@1234",
        displayUsername: username,
        username: username,
      },
      asResponse: true,
    });

    if (!response.ok) {
      console.error("❌ Failed to create teacher user:", await response.text());
      bar.stop();
      throw new Error(`Failed to create teacher user: ${response.statusText}`);
    }

    const data = await response.json();

    await db.user.update({
      where: { id: data.user.id },
      data: { role: "teacher" },
    });

    const teacher = await db.teacher.create({
      data: {
        userId: data.user.id,
        // 18 digits unique identifier
        nip: faker.string.numeric(18),
        nama: faker.person.fullName(),
        jenisKelamin: faker.helpers.arrayElement(Object.values(Gender)),
        tanggalLahir: faker.date.birthdate({
          min: 25,
          max: 60,
          mode: "age",
        }),
        alamat: faker.location.streetAddress(),
        noTelepon: faker.phone.number({
          style: "international",
        }),
        tanggalMasuk: faker.date.past({ years: 10 }),
        status: "AKTIF",
      },
    });

    teachers.push(teacher);

    // Assign as wali kelas (1:1 dengan class)
    if (classIds[i]) {
      await db.class.update({
        where: { id: classIds[i] },
        data: {
          waliKelasId: teacher.id,
        },
      });
    }

    bar.update(count);
  }

  bar.stop();
  return teachers;
}

// ------------------------------------
// ✅ Create Students
// ------------------------------------
async function createStudents(amount: number, classIds: string[]) {
  const bar = new cliProgress.SingleBar({
    format: "🎓 Creating Students |{bar}| {value}/{total} ({percentage}%)",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  bar.start(amount, 0);

  for (let i = 0; i < amount; i++) {
    const count = i + 1;
    const base = faker.person.firstName();
    const username = generateSafeUsername(base, count);

    const response = await auth.api.signUpEmail({
      body: {
        image: faker.image.avatar(),
        name: `Student ${count}`,
        email: `student${count}@example.com`,
        password: "student@1234",
        displayUsername: username,
        username: username,
      },
      asResponse: true,
    });

    if (!response.ok) {
      console.error("❌ Failed to create student user:", await response.text());
      bar.stop();
      throw new Error(`Failed to create student user: ${response.statusText}`);
    }

    const data = await response.json();

    const classId = faker.helpers.arrayElement(classIds);

    await db.student.create({
      data: {
        userId: data.user.id,
        nama: faker.person.fullName(),
        // 10 digits unique identifier
        nisn: faker.string.numeric(10),
        tanggalLahir: faker.date.birthdate({
          min: 12,
          max: 18,
          mode: "age",
        }),
        jenisKelamin: faker.helpers.arrayElement(Object.values(Gender)),
        alamat: faker.location.streetAddress(),
        noTelepon: faker.phone.number({
          style: "international",
        }),
        status: "AKTIF",
        kelasId: classId,
      },
    });

    bar.update(count);
  }

  bar.stop();
}

// ------------------------------------
// ✅ Create Subjects
// ------------------------------------
async function createSubjects(
  subjectList?: { nama: string; kode: string; deskripsi?: string }[],
) {
  const defaultSubjects = [
    { nama: "Matematika", kode: "MAT" },
    { nama: "Bahasa Indonesia", kode: "BIND" },
    { nama: "Bahasa Inggris", kode: "BING" },
    { nama: "Ilmu Pengetahuan Alam", kode: "IPA" },
    { nama: "Ilmu Pengetahuan Sosial", kode: "IPS" },
    { nama: "Pendidikan Agama", kode: "PAI" },
    { nama: "Pendidikan Jasmani", kode: "PJOK" },
    { nama: "Seni Budaya", kode: "SEN" },
    { nama: "Kewarganegaraan", kode: "PKN" },
    { nama: "Teknologi Informasi", kode: "TIK" },
  ];

  const list = subjectList ?? defaultSubjects;

  const bar = new cliProgress.SingleBar({
    format: "📚 Creating Subjects |{bar}| {value}/{total} ({percentage}%)",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  bar.start(list.length, 0);

  const subjects = [];

  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    // Ensure unique kode by appending index if needed
    const kode = s.kode + (i > 0 ? i : "");
    const created = await db.subject.create({
      data: {
        nama: s.nama,
        kode,
        deskripsi: `${s.nama} untuk kurikulum sekolah.`,
      },
    });
    subjects.push(created);
    bar.update(i + 1);
  }

  bar.stop();
  return subjects;
}

// ------------------------------------
// ✅ Create Class Schedules
// ------------------------------------
async function createClassSchedules(
  classes: { id: string }[],
  subjects: { id: string }[],
  teachers: { id: string }[],
) {
  // Period templates (start-end)
  const periodTemplates = [
    { jamMulai: "07:00", jamSelesai: "07:45" },
    { jamMulai: "08:00", jamSelesai: "08:45" },
    { jamMulai: "09:00", jamSelesai: "09:45" },
    { jamMulai: "10:00", jamSelesai: "10:45" },
    { jamMulai: "11:00", jamSelesai: "11:45" },
  ];

  const hariList = Object.values(Hari);

  // We'll create for each class: for each hari (Mon-Sat) 4 periods (or less for Saturday)
  // const totalSchedulesEstimate = classes.length * (5 * 4 + 3); // rough estimate
  const bar = new cliProgress.SingleBar({
    format:
      "🗓️ Creating ClassSchedules |{bar}| {value}/{total} ({percentage}%)",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  // We'll compute total by summing planned inserts
  let plannedTotal = 0;
  // Just count once per class, all classes have same schedule pattern
  const classCount = classes.length;
  for (const hari of hariList) {
    // Saturday 3 periods, others 4
    plannedTotal += classCount * (hari === "SABTU" ? 3 : 4);
  }

  bar.start(plannedTotal, 0);

  let createdCount = 0;

  for (const _class of classes) {
    for (const hari of hariList) {
      const isSaturday = hari === "SABTU";
      const periodsCount = isSaturday ? 3 : 4;

      for (let p = 0; p < periodsCount; p++) {
        // Choose a template period cyclically
        const template = periodTemplates[p % periodTemplates.length];

        // Pick a subject and teacher randomly
        const subject = faker.helpers.arrayElement(subjects);
        // 70% chance to assign a specific teacher, otherwise null (no assigned guru)
        const assignTeacher = faker.datatype.boolean() && teachers.length > 0;
        const teacher = assignTeacher
          ? faker.helpers.arrayElement(teachers)
          : null;

        await db.classSchedule.create({
          data: {
            hari: hari,
            jamMulai: template.jamMulai,
            jamSelesai: template.jamSelesai,
            guruPengampuId: teacher ? teacher.id : undefined,
            kelasId: _class.id,
            subjectId: subject.id,
          },
        });

        createdCount++;
        bar.update(createdCount);
      }
    }
  }

  bar.stop();
  return createdCount;
}

async function createFinanceRecords(extraAmount: number) {
  const startDate = subYears(new Date(), 3); // 3 tahun lalu
  const days = eachDayOfInterval({ start: startDate, end: now });

  const totalTarget = days.length * 2 + extraAmount;

  const bar = new cliProgress.SingleBar({
    format:
      "💰 Creating Finance Records |{bar}| {value}/{total} ({percentage}%)",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  bar.start(totalTarget, 0);

  const allUsers = await db.user.findMany({
    where: { role: "admin" },
    select: { id: true },
  });

  // 1️⃣ Wajib 1 pemasukan & 1 pengeluaran per hari
  for (let i = 0; i < days.length; i++) {
    const date = days[i];

    const pemasukan: Prisma.SchoolFinanceCreateInput = {
      type: "PEMASUKAN",
      category: faker.helpers.arrayElement(incomeCategories),
      amount: faker.number.int({ min: 500_000, max: 800_000 }),
      date: faker.date.between({ from: date, to: date }), // jam random di hari itu
      description: `Penerimaan dari sekolah`,
    };

    const pengeluaran: Prisma.SchoolFinanceCreateInput = {
      type: "PENGELUARAN",
      category: faker.helpers.arrayElement(expenseCategories),
      amount: faker.number.int({ min: 100_000, max: 500_000 }),
      date: faker.date.between({ from: date, to: date }),
      description: `Pengeluaran sekolah`,
    };

    await db.schoolFinance.createMany({
      data: [pemasukan, pengeluaran],
    });

    bar.update((i + 1) * 2);
  }

  // 2️⃣ Tambahan data acak ekstra (optional)
  for (let i = 0; i < extraAmount; i++) {
    const isIncome = faker.datatype.boolean();
    const category = isIncome
      ? faker.helpers.arrayElement(incomeCategories)
      : faker.helpers.arrayElement(expenseCategories);

    const amountValue = isIncome
      ? faker.number.int({ min: 500_000, max: 800_000 })
      : faker.number.int({ min: 100_000, max: 500_000 });

    const randomDate = faker.date.between({ from: startDate, to: now });

    await db.schoolFinance.create({
      data: {
        type: isIncome ? "PEMASUKAN" : "PENGELUARAN",
        category,
        amount: amountValue,
        date: randomDate,
        description: isIncome
          ? `Penerimaan ${category}`
          : `Pengeluaran untuk ${category}`,
        userId: faker.helpers.arrayElement(allUsers)?.id,
      },
    });

    bar.update(days.length * 2 + i + 1);
  }

  bar.stop();
}

// ------------------------------------
// ✅ Sync School Balance
// ------------------------------------
async function syncSchoolBalance() {
  const [pemasukan, pengeluaran] = await db.$transaction([
    db.schoolFinance.aggregate({
      where: { type: "PEMASUKAN" },
      _sum: { amount: true },
    }),
    db.schoolFinance.aggregate({
      where: { type: "PENGELUARAN" },
      _sum: { amount: true },
    }),
  ]);

  const totalPemasukan = pemasukan._sum.amount ?? 0;
  const totalPengeluaran = pengeluaran._sum.amount ?? 0;
  const saldo = totalPemasukan - totalPengeluaran;

  const existingBalance = await db.schoolBalance.findFirst();

  if (existingBalance) {
    await db.schoolBalance.update({
      where: { id: existingBalance.id },
      data: {
        amount: saldo,
        description: "Saldo otomatis disinkronkan dari transaksi keuangan.",
      },
    });
  } else {
    await db.schoolBalance.create({
      data: {
        amount: saldo,
        description: "Saldo awal dari transaksi seed.",
      },
    });
  }

  console.log(`💰 SchoolBalance disinkronkan: ${formatIDR(saldo)}`);
}

// ------------------------------------
// ✅ Main Seeder Function
// ------------------------------------
async function main() {
  await cleanDb();

  await createAdmin(5);

  const classes = await createClasses(5);
  const classIds = classes.map((c) => c.id);

  const teachers = await createTeachers(5, classIds);

  // New: create subjects and schedules (wired into main)
  const subjects = await createSubjects(); // creates default subjects
  await createClassSchedules(classes, subjects, teachers);

  await createStudents(20, classIds);

  await createFinanceRecords(1000);
  await syncSchoolBalance();
}

main()
  .then(() => {
    console.log("🌱 Seeding completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
