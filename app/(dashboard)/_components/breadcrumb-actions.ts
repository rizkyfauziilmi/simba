"use server";

import db from "@/lib/db";

export async function getSiswaName(id: string) {
  try {
    const student = await db.student.findUnique({
      where: { id },
      select: { nama: true },
    });
    return student?.nama || null;
  } catch (error) {
    console.error("Error fetching student name:", error);
    return null;
  }
}

export async function getTeacherName(id: string) {
  try {
    const teacher = await db.teacher.findUnique({
      where: { id },
      select: { nama: true },
    });
    return teacher?.nama || null;
  } catch (error) {
    console.error("Error fetching teacher name:", error);
    return null;
  }
}

export async function getClassName(id: string) {
  try {
    const classData = await db.class.findUnique({
      where: { id },
      select: { namaKelas: true },
    });
    return classData?.namaKelas || null;
  } catch (error) {
    console.error("Error fetching class name:", error);
    return null;
  }
}

export async function getSubjectName(id: string) {
  try {
    const subject = await db.subject.findUnique({
      where: { id },
      select: { nama: true },
    });
    return subject?.nama || null;
  } catch (error) {
    console.error("Error fetching subject name:", error);
    return null;
  }
}

export async function getEntityName(type: string, id: string): Promise<string | null> {
  switch (type) {
    case "siswa":
      return getSiswaName(id);
    case "guru":
      return getTeacherName(id);
    case "kelas":
      return getClassName(id);
    case "mapel":
      return getSubjectName(id);
    default:
      return null;
  }
}
