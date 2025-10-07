"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { faker } from "@faker-js/faker";
import cliProgress from "cli-progress";

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

  await db.classHistory.deleteMany({});
  await db.session.deleteMany({});
  await db.account.deleteMany({});
  await db.verification.deleteMany({});
  await db.student.deleteMany({});
  await db.teacher.deleteMany({});
  await db.class.deleteMany({});
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
        name: `Admin ${count}`,
        email: `admin${count}@example.com`,
        password: "Admin123!",
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
        tingkat: faker.helpers.arrayElement(["SD", "SMP", "SMK"]),
        ruang: `R${i + 1}`,
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
        name: `Teacher ${count}`,
        email: `teacher${count}@example.com`,
        password: "Teacher123!",
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

    const teacher = await db.teacher.create({
      data: {
        userId: data.user.id,
        // 18 digits unique identifier
        nip: faker.string.numeric(18),
        nama: faker.person.fullName(),
        jenisKelamin: faker.helpers.arrayElement(["LAKI_LAKI", "PEREMPUAN"]),
        tanggalLahir: faker.date.birthdate({ min: 25, max: 60, mode: "age" }),
        alamat: faker.location.streetAddress(),
        email: `teacher${count}@example.com`,
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
        name: `Student ${count}`,
        email: `student${count}@example.com`,
        password: "Student123!",
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
        tanggalLahir: faker.date.birthdate({ min: 12, max: 18, mode: "age" }),
        jenisKelamin: faker.helpers.arrayElement(["LAKI_LAKI", "PEREMPUAN"]),
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
// ✅ Main Seeder Function
// ------------------------------------
async function main() {
  await cleanDb();

  await createAdmin(5);

  const classes = await createClasses(5);
  const classIds = classes.map((c) => c.id);

  await createTeachers(5, classIds);
  await createStudents(20, classIds);
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
