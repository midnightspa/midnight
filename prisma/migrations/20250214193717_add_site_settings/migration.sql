-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "siteName" DROP NOT NULL,
ALTER COLUMN "siteTitle" DROP NOT NULL,
ALTER COLUMN "siteDescription" DROP NOT NULL,
ALTER COLUMN "siteKeywords" DROP NOT NULL,
ALTER COLUMN "twitterCardType" DROP NOT NULL,
ALTER COLUMN "twitterCardType" DROP DEFAULT;
