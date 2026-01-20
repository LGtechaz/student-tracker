/*
  Warnings:

  - You are about to drop the column `activityPoints` on the `AttendanceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `AttendanceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `AttendanceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AttendanceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AttendanceRecord" DROP COLUMN "activityPoints",
DROP COLUMN "comment",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "activity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "present" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "AttendanceStatus";
