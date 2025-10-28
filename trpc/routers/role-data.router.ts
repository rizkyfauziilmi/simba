import { endOfDay } from 'date-fns'
import { adminProcedure, createTRPCRouter, studentProcedure, teacherProcedure } from '../init'

export const roleDataRouter = createTRPCRouter({
  getAdminDashboardData: adminProcedure.query(async ({ ctx }) => {
    const studentCount = await ctx.db.student.count({
      where: {
        status: 'AKTIF',
      },
    })
    const teacherCount = await ctx.db.teacher.count({
      where: {
        status: 'AKTIF',
      },
    })
    const classCount = await ctx.db.class.count({
      where: { status: 'AKTIF' },
    })
    const { amount } = (await ctx.db.schoolBalance.findFirst({
      where: { id: 1 },
      select: {
        amount: true,
      },
    })) ?? { amount: 0 }

    const today = endOfDay(new Date())
    const newestTransactions = await ctx.db.schoolFinance.findMany({
      where: {
        date: {
          lte: today,
        },
      },
      select: {
        id: true,
        date: true,
        type: true,
        category: true,
        amount: true,
        description: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      take: 5,
      orderBy: { date: 'desc' },
    })

    const newestStudents = await ctx.db.student.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        nisn: true,
        nama: true,
        kelas: {
          select: {
            namaKelas: true,
          },
        },
        user: {
          select: {
            image: true,
          },
        },
        status: true,
      },
    })

    return {
      studentCount,
      teacherCount,
      classCount,
      schoolBalance: amount,
      newestTransactions,
      newestStudents,
    }
  }),
  getTeacherDashboardData: teacherProcedure.query(async ({ ctx }) => {
    const teacher = await ctx.db.teacher.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        nip: true,
        nama: true,
        jenisKelamin: true,
        noTelepon: true,
        status: true,
        user: {
          select: {
            image: true,
          },
        },
      },
    })

    const waliKelas = await ctx.db.class.findFirst({
      where: { waliKelasId: ctx.session.teacherId },
      select: {
        namaKelas: true,
        tingkat: true,
        students: {
          where: { status: 'AKTIF' },
          select: {
            nisn: true,
            nama: true,
            jenisKelamin: true,
            user: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    })

    const jadwalMengajar = await ctx.db.classSchedule.findMany({
      where: { guruPengampuId: ctx.session.teacherId },
      orderBy: [{ hari: 'asc' }, { jamMulai: 'asc' }],
      select: {
        hari: true,
        jamMulai: true,
        jamSelesai: true,
        kelas: {
          select: { namaKelas: true, ruang: true },
        },
        subject: {
          select: { nama: true },
        },
      },
    })

    return {
      teacherInfo: teacher,
      waliKelas: waliKelas
        ? {
            namaKelas: waliKelas.namaKelas,
            tingkat: waliKelas.tingkat,
            jumlahSiswa: waliKelas.students.length,
          }
        : null,
      jadwalMengajar: jadwalMengajar.map(jadwal => ({
        hari: jadwal.hari,
        jamMulai: jadwal.jamMulai,
        jamSelesai: jadwal.jamSelesai,
        kelas: jadwal.kelas.namaKelas,
        mataPelajaran: jadwal.subject.nama,
        lokasi: `Ruang ${jadwal.kelas.ruang}`,
      })),
      daftarSiswa: waliKelas ? waliKelas.students : [],
    }
  }),
  getStudentDashboardData: studentProcedure.query(async ({ ctx }) => {
    const student = await ctx.db.student.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        nisn: true,
        nama: true,
        jenisKelamin: true,
        noTelepon: true,
        status: true,
        tanggalLahir: true,
        alamat: true,
        user: {
          select: {
            image: true,
          },
        },
      },
    })

    const kelas = await ctx.db.class.findFirst({
      where: {
        students: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      select: {
        namaKelas: true,
        tingkat: true,
        ruang: true,
        waliKelas: {
          select: {
            nama: true,
            noTelepon: true,
          },
        },
      },
    })

    const jadwalPelajaran = await ctx.db.classSchedule.findMany({
      where: {
        kelas: {
          students: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
      orderBy: [{ hari: 'asc' }, { jamMulai: 'asc' }],
      select: {
        hari: true,
        jamMulai: true,
        jamSelesai: true,
        subject: {
          select: { nama: true },
        },
        guruPengampu: {
          select: { nama: true },
        },
      },
    })

    const temanSekelas = await ctx.db.student.findMany({
      where: {
        kelas: {
          students: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        userId: {
          not: ctx.session.user.id,
        },
        status: 'AKTIF',
      },
      select: {
        nisn: true,
        nama: true,
        jenisKelamin: true,
        user: {
          select: {
            image: true,
          },
        },
      },
    })

    return {
      studentInfo: student,
      kelasInfo: kelas,
      jadwalPelajaran: jadwalPelajaran.map(jadwal => ({
        hari: jadwal.hari,
        jamMulai: jadwal.jamMulai,
        jamSelesai: jadwal.jamSelesai,
        mataPelajaran: jadwal.subject.nama,
        guruPengampu: jadwal.guruPengampu,
      })),
      temanSekelas: temanSekelas,
    }
  }),
})
