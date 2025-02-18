-- CreateTable
CREATE TABLE "SeoIndexingLog" (
    "id" TEXT NOT NULL,
    "urls" TEXT[],
    "type" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoIndexingLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeoIndexingLog" ADD CONSTRAINT "SeoIndexingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
