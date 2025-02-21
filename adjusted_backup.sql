--
-- PostgreSQL database dump
--

-- Dumped from database version 14.16 (Homebrew)
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
-- Name: public; Type: SCHEMA; Schema: -; Owner: mounirbennassar
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO mounirbennassar;

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
    "updatedAt" timestamp(3) without time zone NOT NULL
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
-- Name: SiteSettings; Type: TABLE; Schema: public; Owner: mounirbennassar
--

CREATE TABLE public."site_settings" (
    id text NOT NULL,
    "siteName" text,
    "siteTitle" text,
    "siteDescription" text,
    "siteKeywords" text,
    "ogTitle" text,
    "ogDescription" text,
    "ogImage" text,
    "twitterHandle" text,
    "twitterCardType" text,
    "organizationName" text,
    "organizationLogo" text,
    "contactEmail" text,
    "contactPhone" text,
    "contactAddress" text,
    "googleAnalyticsId" text,
    "googleSiteVerification" text,
    "robotsTxt" text,
    "sitemapXml" text,
    favicon text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."site_settings" OWNER TO mounirbennassar;

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
-- Data for Name: Bundle; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."Bundle" (id, title, slug, description, price, "salePrice", thumbnail, published, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Campaign; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."Campaign" (id, name, subject, content, status, "templateId", "sentAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CampaignRecipient; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."CampaignRecipient" (id, "campaignId", "subscriberId", status, "sentAt", "openedAt", "clickedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EmailConfig; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."EmailConfig" (id, provider, "apiKey", "fromEmail", "fromName", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EmailTemplate; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."EmailTemplate" (id, name, subject, content, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."Post" (id, title, slug, excerpt, content, thumbnail, published, "categoryId", "subcategoryId", tags, "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt", "authorId") FROM stdin;
\.


--
-- Data for Name: PostCategory; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."PostCategory" (id, title, description, thumbnail, slug, "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PostSubCategory; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."PostSubCategory" (id, title, description, thumbnail, slug, "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt", "categoryId", "parentCategoryId") FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."Product" (id, title, slug, description, type, price, "salePrice", thumbnail, gallery, "digitalAssets", stock, published, featured, "categoryId", "createdAt", "updatedAt", "authorId") FROM stdin;
\.


--
-- Data for Name: ProductCategory; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."ProductCategory" (id, title, description, thumbnail, slug, type, "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProductSubCategory; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."ProductSubCategory" (id, title, description, thumbnail, slug, "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt", "categoryId", "parentCategoryId") FROM stdin;
\.


--
-- Data for Name: SeoIndexingLog; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."SeoIndexingLog" (id, urls, type, results, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."site_settings" (id, "siteName", "siteTitle", "siteDescription", "siteKeywords", "ogTitle", "ogDescription", "ogImage", "twitterHandle", "twitterCardType", "organizationName", "organizationLogo", "contactEmail", "contactPhone", "contactAddress", "googleAnalyticsId", "googleSiteVerification", "robotsTxt", "sitemapXml", favicon, "createdAt", "updatedAt") FROM stdin;
cm79qw0mw0001unmrtpttgxr1	The Midnight Spa	The Midnight Spa | Luxury Wellness & Relaxation	Experience luxury wellness and relaxation at The Midnight Spa. Professional massage, skincare treatments, and holistic therapies in a serene environment.	spa, massage, wellness, relaxation, skincare, therapy, luxury spa, holistic treatments	The Midnight Spa - Your Premium Wellness Destination	Discover peace and rejuvenation at The Midnight Spa. Book your luxury spa experience today.	\N	@themidnightspa	summary_large_image	The Midnight Spa	\N	contact@themidnightspa.com	\N	\N	\N	\N	\N	\N	\N	2025-02-18 00:27:25.881	2025-02-18 00:27:25.881
cm79qw0mw0000unmr01podclv	The Midnight Spa	The Midnight Spa | Luxury Wellness & Relaxation	Experience luxury wellness and relaxation at The Midnight Spa. Professional massage, skincare treatments, and holistic therapies in a serene environment.	spa, massage, wellness, relaxation, skincare, therapy, luxury spa, holistic treatments	The Midnight Spa - Your Premium Wellness Destination	Discover peace and rejuvenation at The Midnight Spa. Book your luxury spa experience today.	\N	@themidnightspa	summary_large_image	The Midnight Spa	\N	contact@themidnightspa.com	\N	\N	\N	\N	\N	\N	\N	2025-02-18 00:27:25.881	2025-02-18 00:27:25.881
\.


--
-- Data for Name: StaticPageSeo; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."StaticPageSeo" (id, path, title, description, keywords, "ogTitle", "ogDescription", "ogImage", "twitterTitle", "twitterDescription", "twitterImage", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Subscriber; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."Subscriber" (id, email, "firstName", "lastName", status, "confirmedAt", "unsubscribedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."User" (id, email, password, name, "createdAt", "updatedAt", "isApproved", role) FROM stdin;
cm79nw58i00004433tyo3cqam	mounir@clicksalesmedia.com	$2a$12$aMBkCnZdnnNHjIwl4AKf9ujGDGW0hiMceHwvcShBbqfw5KnKW.ydq	Super Admin	2025-02-17 23:03:32.994	2025-02-17 23:03:32.994	t	SUPER_ADMIN
cm79ohzba0000rotispi5vapw	mounir.bennassar1@gmail.com	$2a$12$cqSEXdsw6XVP/AAoyyYmYObJ0U5UXpKF2kC5LdClB9IZzyB9Bz7iW	\N	2025-02-17 23:20:31.75	2025-02-17 23:21:33.211	t	PENDING
\.


--
-- Data for Name: Video; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."Video" (id, title, slug, description, "youtubeUrl", "seoTitle", "seoDescription", "seoKeywords", published, "createdAt", "updatedAt", "authorId") FROM stdin;
\.


--
-- Data for Name: _BundleIncludes; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."_BundleIncludes" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _BundleProducts; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."_BundleProducts" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ba7dc3c6-b7b0-4480-ab7f-170f8e4641fd	9bdd11a47cd592138a02e45c1aafc4cf95bb6fea43e8afa767268d3095dcc062	2025-02-17 23:03:25.38289+00	20250212230419_init	\N	\N	2025-02-17 23:03:25.378067+00	1
6c36e1e2-6e24-4bb1-823e-38946a07edec	296e0e4567704f7f314905bfda8afa86f204bfffbcef0023ff2dbe0ed43f0ad7	2025-02-17 23:03:25.396407+00	20250212233321_add_categories	\N	\N	2025-02-17 23:03:25.383503+00	1
1be6217f-3276-40f4-bd0b-86a5ab7a7b22	59455742fdb083670f53b0003bbe3c47fe657da84f065f51e8db76b5801027f9	2025-02-17 23:03:25.403712+00	20250213001349_add_posts	\N	\N	2025-02-17 23:03:25.396893+00	1
bfd27929-a495-41df-ad53-9ca5e44c6542	e13d5f8d080e95e3b27bd08674ccd027b0e14746660ed26b7e5ba5475d37d9d1	2025-02-17 23:03:25.444197+00	20250213123355_add_products_and_bundles	\N	\N	2025-02-17 23:03:25.404168+00	1
f9152e4d-7795-43f3-9fc4-7971c2f6512d	900d863da4bd79a8bb35f1b63e43038e8f0c7d4f8858f2b82dcd48f8d059296d	2025-02-17 23:03:25.446469+00	20250213130624_add_type_to_category	\N	\N	2025-02-17 23:03:25.444644+00	1
e13cdd79-37ea-4bc1-a701-a46bd6986783	ddb2d862e225fd7161e9957b459ce0bfbd2f0614a3654266e08eadc25472d0bb	2025-02-17 23:03:25.460588+00	20250213131935_separate_post_and_product_categories	\N	\N	2025-02-17 23:03:25.446878+00	1
3fcb2dd1-5847-4fb2-a052-253c35478e67	b1e8a9837eadd0c8110f8c1326fcdf3c6319679b92be4d79ba28a88955bdd4e1	2025-02-17 23:03:25.463571+00	20250214190505_add_site_settings	\N	\N	2025-02-17 23:03:25.460909+00	1
5417543c-a7d4-4712-8292-367cb3f6b395	0f2620e517b3e531b5abec2b2a70a4ea32aa850ff6506a52ab6793673398ebde	2025-02-17 23:03:25.465056+00	20250214192200_add_site_settings	\N	\N	2025-02-17 23:03:25.463933+00	1
edccbebc-723c-47ba-ac3a-f0a5f2fcdd19	c8d2614bf7214daac3c4869443e0f94779f0f0853749549c47d795f296a1f083	2025-02-17 23:03:25.466457+00	20250214193717_add_site_settings	\N	\N	2025-02-17 23:03:25.465377+00	1
0dfcabe9-a6dd-42b6-b57d-7077b8b2a836	92d6d8c8629b881d2f43d939c597b77590ac37a8419127589bd5fc57e3caa49c	2025-02-17 23:03:25.476912+00	20250214194629_add_newsletter_system	\N	\N	2025-02-17 23:03:25.466768+00	1
4bdc68a1-9349-4640-848d-a53dc6a4b62a	034a8bb8be0b279b197d475229917a43bae4a087a772f45ed578f1baffd03d8a	2025-02-17 23:03:25.478721+00	20250217210754_add_user_roles	\N	\N	2025-02-17 23:03:25.477356+00	1
\.


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
-- Name: SiteSettings SiteSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: mounirbennassar
--

ALTER TABLE ONLY public."site_settings"
    ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY (id);


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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: mounirbennassar
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

