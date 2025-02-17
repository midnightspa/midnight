-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "ogTitle" DROP NOT NULL,
ALTER COLUMN "ogDescription" DROP NOT NULL,
ALTER COLUMN "ogImage" DROP NOT NULL,
ALTER COLUMN "twitterHandle" DROP NOT NULL,
ALTER COLUMN "twitterCardType" SET DEFAULT 'summary_large_image',
ALTER COLUMN "organizationName" DROP NOT NULL,
ALTER COLUMN "organizationLogo" DROP NOT NULL,
ALTER COLUMN "contactEmail" DROP NOT NULL,
ALTER COLUMN "contactPhone" DROP NOT NULL,
ALTER COLUMN "contactAddress" DROP NOT NULL,
ALTER COLUMN "favicon" DROP NOT NULL;
