-- CreateEnum
CREATE TYPE "public"."FinanceType" AS ENUM ('PEMASUKAN', 'PENGELUARAN');

-- CreateTable
CREATE TABLE "public"."SchoolFinance" (
    "id" TEXT NOT NULL,
    "type" "public"."FinanceType" NOT NULL,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "SchoolFinance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SchoolFinance" ADD CONSTRAINT "SchoolFinance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
