--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10 (Homebrew)
-- Dumped by pg_dump version 15.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: CampaignStatus; Type: TYPE; Schema: public; Owner: mounirbennassar
--

CREATE TYPE public."CampaignStatus" AS ENUM (
    'DRAFT',
    'SCHEDULED',
    'SENDING',
    'SENT',
    'FAILED'
);


ALTER TYPE public."CampaignStatus" OWNER TO mounirbennassar;

--
-- Name: EmailProvider; Type: TYPE; Schema: public; Owner: mounirbennassar
--

CREATE TYPE public."EmailProvider" AS ENUM (
    'SENDGRID',
    'ELASTIC_EMAIL'
);


ALTER TYPE public."EmailProvider" OWNER TO mounirbennassar;

--
-- Name: ProductType; Type: TYPE; Schema: public; Owner: mounirbennassar
--

CREATE TYPE public."ProductType" AS ENUM (
    'DIGITAL',
    'PHYSICAL'
);


ALTER TYPE public."ProductType" OWNER TO mounirbennassar;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: mounirbennassar
--

CREATE TYPE public."Role" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'WRITER',
    'PENDING'
);


ALTER TYPE public."Role" OWNER TO mounirbennassar;

--
-- Name: SendStatus; Type: TYPE; Schema: public; Owner: mounirbennassar
--

CREATE TYPE public."SendStatus" AS ENUM (
    'PENDING',
    'SENT',
    'FAILED',
    'OPENED',
    'CLICKED'
);


ALTER TYPE public."SendStatus" OWNER TO mounirbennassar;

--
-- Name: SubscriberStatus; Type: TYPE; Schema: public; Owner: mounirbennassar
--

CREATE TYPE public."SubscriberStatus" AS ENUM (
    'PENDING',
    'ACTIVE',
    'UNSUBSCRIBED'
);


ALTER TYPE public."SubscriberStatus" OWNER TO mounirbennassar;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Bundle; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."Bundle" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    "salePrice" double precision,
    thumbnail text,
    published boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    file text
);


ALTER TABLE public."Bundle" OWNER TO mounirbennassar;

--
-- Name: Campaign; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."Campaign" (
    id text NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    status public."CampaignStatus" DEFAULT 'DRAFT'::public."CampaignStatus" NOT NULL,
    "templateId" text,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Campaign" OWNER TO mounirbennassar;

--
-- Name: CampaignRecipient; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."CampaignRecipient" (
    id text NOT NULL,
    "campaignId" text NOT NULL,
    "subscriberId" text NOT NULL,
    status public."SendStatus" DEFAULT 'PENDING'::public."SendStatus" NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "openedAt" timestamp(3) without time zone,
    "clickedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CampaignRecipient" OWNER TO mounirbennassar;

--
-- Name: EmailConfig; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."EmailConfig" (
    id text NOT NULL,
    provider public."EmailProvider" NOT NULL,
    "apiKey" text NOT NULL,
    "fromEmail" text NOT NULL,
    "fromName" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmailConfig" OWNER TO mounirbennassar;

--
-- Name: EmailTemplate; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."EmailTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmailTemplate" OWNER TO mounirbennassar;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."Post" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    thumbnail text,
    published boolean DEFAULT false NOT NULL,
    "categoryId" text NOT NULL,
    "subcategoryId" text,
    tags text[],
    "seoTitle" text,
    "seoDescription" text,
    "seoKeywords" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "authorId" text NOT NULL
);


ALTER TABLE public."Post" OWNER TO mounirbennassar;

--
-- Name: PostCategory; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."PostCategory" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail text,
    slug text NOT NULL,
    "seoTitle" text,
    "seoDescription" text,
    "seoKeywords" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PostCategory" OWNER TO mounirbennassar;

--
-- Name: PostSubCategory; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."PostSubCategory" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail text,
    slug text NOT NULL,
    "seoTitle" text,
    "seoDescription" text,
    "seoKeywords" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "categoryId" text NOT NULL,
    "parentCategoryId" text
);


ALTER TABLE public."PostSubCategory" OWNER TO mounirbennassar;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    type public."ProductType" NOT NULL,
    price double precision NOT NULL,
    "salePrice" double precision,
    thumbnail text,
    gallery text[],
    "digitalAssets" text[],
    stock integer DEFAULT 0,
    published boolean DEFAULT false NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "authorId" text NOT NULL
);


ALTER TABLE public."Product" OWNER TO mounirbennassar;

--
-- Name: ProductCategory; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."ProductCategory" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail text,
    slug text NOT NULL,
    type text DEFAULT 'DIGITAL'::text,
    "seoTitle" text,
    "seoDescription" text,
    "seoKeywords" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProductCategory" OWNER TO mounirbennassar;

--
-- Name: ProductSubCategory; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."ProductSubCategory" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail text,
    slug text NOT NULL,
    "seoTitle" text,
    "seoDescription" text,
    "seoKeywords" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "categoryId" text NOT NULL,
    "parentCategoryId" text
);


ALTER TABLE public."ProductSubCategory" OWNER TO mounirbennassar;

--
-- Name: SeoIndexingLog; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."SeoIndexingLog" (
    id text NOT NULL,
    urls text[],
    type text NOT NULL,
    results jsonb NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SeoIndexingLog" OWNER TO mounirbennassar;

--
-- Name: StaticPageSeo; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."StaticPageSeo" (
    id text NOT NULL,
    path text NOT NULL,
    title text,
    description text,
    keywords text,
    "ogTitle" text,
    "ogDescription" text,
    "ogImage" text,
    "twitterTitle" text,
    "twitterDescription" text,
    "twitterImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StaticPageSeo" OWNER TO mounirbennassar;

--
-- Name: Subscriber; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."Subscriber" (
    id text NOT NULL,
    email text NOT NULL,
    "firstName" text,
    "lastName" text,
    status public."SubscriberStatus" DEFAULT 'ACTIVE'::public."SubscriberStatus" NOT NULL,
    "confirmedAt" timestamp(3) without time zone,
    "unsubscribedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Subscriber" OWNER TO mounirbennassar;

--
-- Name: User; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    role public."Role" DEFAULT 'PENDING'::public."Role" NOT NULL
);


ALTER TABLE public."User" OWNER TO mounirbennassar;

--
-- Name: Video; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."Video" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    "youtubeUrl" text NOT NULL,
    "seoTitle" text,
    "seoDescription" text,
    "seoKeywords" text,
    published boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "authorId" text NOT NULL
);


ALTER TABLE public."Video" OWNER TO mounirbennassar;

--
-- Name: _BundleIncludes; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."_BundleIncludes" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BundleIncludes" OWNER TO mounirbennassar;

--
-- Name: _BundleProducts; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."_BundleProducts" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BundleProducts" OWNER TO mounirbennassar;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO mounirbennassar;

--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public.site_settings (
    id text NOT NULL,
    "siteName" text,
    "siteTitle" text,
    "siteDescription" text,
    "siteKeywords" text,
    favicon text,
    "ogImage" text,
    "twitterHandle" text,
    "organizationName" text,
    "organizationLogo" text,
    "contactPhone" text,
    "contactEmail" text,
    "contactAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.site_settings OWNER TO mounirbennassar;

--
-- Name: Bundle Bundle_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Bundle"
    ADD CONSTRAINT "Bundle_pkey" PRIMARY KEY (id);


--
-- Name: CampaignRecipient CampaignRecipient_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."CampaignRecipient"
    ADD CONSTRAINT "CampaignRecipient_pkey" PRIMARY KEY (id);


--
-- Name: Campaign Campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Campaign"
    ADD CONSTRAINT "Campaign_pkey" PRIMARY KEY (id);


--
-- Name: EmailConfig EmailConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."EmailConfig"
    ADD CONSTRAINT "EmailConfig_pkey" PRIMARY KEY (id);


--
-- Name: EmailTemplate EmailTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."EmailTemplate"
    ADD CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY (id);


--
-- Name: PostCategory PostCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."PostCategory"
    ADD CONSTRAINT "PostCategory_pkey" PRIMARY KEY (id);


--
-- Name: PostSubCategory PostSubCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."PostSubCategory"
    ADD CONSTRAINT "PostSubCategory_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: ProductCategory ProductCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY (id);


--
-- Name: ProductSubCategory ProductSubCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."ProductSubCategory"
    ADD CONSTRAINT "ProductSubCategory_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: SeoIndexingLog SeoIndexingLog_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."SeoIndexingLog"
    ADD CONSTRAINT "SeoIndexingLog_pkey" PRIMARY KEY (id);


--
-- Name: StaticPageSeo StaticPageSeo_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."StaticPageSeo"
    ADD CONSTRAINT "StaticPageSeo_pkey" PRIMARY KEY (id);


--
-- Name: Subscriber Subscriber_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Subscriber"
    ADD CONSTRAINT "Subscriber_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Video Video_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: Bundle_slug_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "Bundle_slug_idx" ON public."Bundle" USING btree (slug);


--
-- Name: Bundle_slug_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "Bundle_slug_key" ON public."Bundle" USING btree (slug);


--
-- Name: CampaignRecipient_campaignId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "CampaignRecipient_campaignId_idx" ON public."CampaignRecipient" USING btree ("campaignId");


--
-- Name: CampaignRecipient_subscriberId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "CampaignRecipient_subscriberId_idx" ON public."CampaignRecipient" USING btree ("subscriberId");


--
-- Name: Campaign_templateId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "Campaign_templateId_idx" ON public."Campaign" USING btree ("templateId");


--
-- Name: PostCategory_slug_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "PostCategory_slug_key" ON public."PostCategory" USING btree (slug);


--
-- Name: PostSubCategory_categoryId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "PostSubCategory_categoryId_idx" ON public."PostSubCategory" USING btree ("categoryId");


--
-- Name: PostSubCategory_parentCategoryId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "PostSubCategory_parentCategoryId_idx" ON public."PostSubCategory" USING btree ("parentCategoryId");


--
-- Name: PostSubCategory_slug_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "PostSubCategory_slug_key" ON public."PostSubCategory" USING btree (slug);


--
-- Name: Post_authorId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "Post_authorId_idx" ON public."Post" USING btree ("authorId");


--
-- Name: Post_categoryId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "Post_categoryId_idx" ON public."Post" USING btree ("categoryId");


--
-- Name: Post_slug_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "Post_slug_key" ON public."Post" USING btree (slug);


--
-- Name: Post_subcategoryId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "Post_subcategoryId_idx" ON public."Post" USING btree ("subcategoryId");


--
-- Name: ProductCategory_slug_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "ProductCategory_slug_key" ON public."ProductCategory" USING btree (slug);


--
-- Name: ProductSubCategory_categoryId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "ProductSubCategory_categoryId_idx" ON public."ProductSubCategory" USING btree ("categoryId");


--
-- Name: ProductSubCategory_parentCategoryId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "ProductSubCategory_parentCategoryId_idx" ON public."ProductSubCategory" USING btree ("parentCategoryId");


--
-- Name: ProductSubCategory_slug_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "ProductSubCategory_slug_key" ON public."ProductSubCategory" USING btree (slug);


--
-- Name: Product_authorId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "Product_authorId_idx" ON public."Product" USING btree ("authorId");


--
-- Name: Product_categoryId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "Product_categoryId_idx" ON public."Product" USING btree ("categoryId");


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: StaticPageSeo_path_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "StaticPageSeo_path_key" ON public."StaticPageSeo" USING btree (path);


--
-- Name: Subscriber_email_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "Subscriber_email_key" ON public."Subscriber" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Video_authorId_idx; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "Video_authorId_idx" ON public."Video" USING btree ("authorId");


--
-- Name: Video_slug_key; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "Video_slug_key" ON public."Video" USING btree (slug);


--
-- Name: _BundleIncludes_AB_unique; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "_BundleIncludes_AB_unique" ON public."_BundleIncludes" USING btree ("A", "B");


--
-- Name: _BundleIncludes_B_index; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "_BundleIncludes_B_index" ON public."_BundleIncludes" USING btree ("B");


--
-- Name: _BundleProducts_AB_unique; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE UNIQUE INDEX "_BundleProducts_AB_unique" ON public."_BundleProducts" USING btree ("A", "B");


--
-- Name: _BundleProducts_B_index; Type: INDEX; Schema: public; Owner: mounirbennassar
--

CREATE INDEX "_BundleProducts_B_index" ON public."_BundleProducts" USING btree ("B");


--
-- Name: CampaignRecipient CampaignRecipient_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."CampaignRecipient"
    ADD CONSTRAINT "CampaignRecipient_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."Campaign"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CampaignRecipient CampaignRecipient_subscriberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."CampaignRecipient"
    ADD CONSTRAINT "CampaignRecipient_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES public."Subscriber"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Campaign Campaign_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Campaign"
    ADD CONSTRAINT "Campaign_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."EmailTemplate"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PostSubCategory PostSubCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."PostSubCategory"
    ADD CONSTRAINT "PostSubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."PostCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PostSubCategory PostSubCategory_parentCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."PostSubCategory"
    ADD CONSTRAINT "PostSubCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES public."PostCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."PostCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_subcategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES public."PostSubCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductSubCategory ProductSubCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."ProductSubCategory"
    ADD CONSTRAINT "ProductSubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ProductCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductSubCategory ProductSubCategory_parentCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."ProductSubCategory"
    ADD CONSTRAINT "ProductSubCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES public."ProductCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ProductCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SeoIndexingLog SeoIndexingLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."SeoIndexingLog"
    ADD CONSTRAINT "SeoIndexingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Video Video_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _BundleIncludes _BundleIncludes_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."_BundleIncludes"
    ADD CONSTRAINT "_BundleIncludes_A_fkey" FOREIGN KEY ("A") REFERENCES public."Bundle"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BundleIncludes _BundleIncludes_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."_BundleIncludes"
    ADD CONSTRAINT "_BundleIncludes_B_fkey" FOREIGN KEY ("B") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BundleProducts _BundleProducts_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."_BundleProducts"
    ADD CONSTRAINT "_BundleProducts_A_fkey" FOREIGN KEY ("A") REFERENCES public."Bundle"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BundleProducts _BundleProducts_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."_BundleProducts"
    ADD CONSTRAINT "_BundleProducts_B_fkey" FOREIGN KEY ("B") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TABLE "Bundle"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."Bundle" TO root;


--
-- Name: TABLE "Campaign"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."Campaign" TO root;


--
-- Name: TABLE "CampaignRecipient"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."CampaignRecipient" TO root;


--
-- Name: TABLE "EmailConfig"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."EmailConfig" TO root;


--
-- Name: TABLE "EmailTemplate"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."EmailTemplate" TO root;


--
-- Name: TABLE "Post"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."Post" TO root;


--
-- Name: TABLE "PostCategory"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."PostCategory" TO root;


--
-- Name: TABLE "PostSubCategory"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."PostSubCategory" TO root;


--
-- Name: TABLE "Product"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."Product" TO root;


--
-- Name: TABLE "ProductCategory"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."ProductCategory" TO root;


--
-- Name: TABLE "ProductSubCategory"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."ProductSubCategory" TO root;


--
-- Name: TABLE "SeoIndexingLog"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."SeoIndexingLog" TO root;


--
-- Name: TABLE "StaticPageSeo"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."StaticPageSeo" TO root;


--
-- Name: TABLE "Subscriber"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."Subscriber" TO root;


--
-- Name: TABLE "User"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."User" TO root;


--
-- Name: TABLE "Video"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."Video" TO root;


--
-- Name: TABLE "_BundleIncludes"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."_BundleIncludes" TO root;


--
-- Name: TABLE "_BundleProducts"; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public."_BundleProducts" TO root;


--
-- Name: TABLE _prisma_migrations; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public._prisma_migrations TO root;


--
-- Name: TABLE site_settings; Type: ACL; Schema: public; Owner: mounirbennassar
--

GRANT ALL ON TABLE public.site_settings TO root;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: mounirbennassar
--

ALTER DEFAULT PRIVILEGES FOR ROLE mounirbennassar IN SCHEMA public GRANT ALL ON SEQUENCES  TO root;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: mounirbennassar
--

ALTER DEFAULT PRIVILEGES FOR ROLE mounirbennassar IN SCHEMA public GRANT ALL ON FUNCTIONS  TO root;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: mounirbennassar
--

ALTER DEFAULT PRIVILEGES FOR ROLE mounirbennassar IN SCHEMA public GRANT ALL ON TABLES  TO root;


--
-- PostgreSQL database dump complete
--

