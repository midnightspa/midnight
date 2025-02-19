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
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: mounirbennassar
--

COMMENT ON SCHEMA public IS '';


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

CREATE TABLE public."SiteSettings" (
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


ALTER TABLE public."SiteSettings" OWNER TO mounirbennassar;

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
cm74pshhb0003h5cov2c4lly7	Hacking Your Sleep: Science-Backed Strategies for a Better Night's Rest	hacking-your-sleep-science-backed-strategies-for-a-better-nights-rest	Are you tired of tossing and turning, longing for a good night's sleep?  You're not alone.  Many people struggle with sleep issues, but the good news is that there are science-backed strategies you can implement to improve your sleep quality and duration. This article delves into evidence-based techniques to help you "hack" your sleep and wake up feeling refreshed and revitalized.	<p>Are you tired of tossing and turning, longing for a good night's sleep? You're not alone. Many people struggle with sleep issues, but the good news is that there are science-backed strategies you can implement to improve your sleep quality and duration. This article delves into evidence-based techniques to help you "hack" your sleep and wake up feeling refreshed and revitalized.</p><p><br></p><p><strong>Understanding the Science of Sleep:</strong></p><p>Sleep is a complex process involving various stages and cycles. Understanding the science behind sleep can empower you to make informed choices about your sleep habits.</p><ul><li><strong>Circadian Rhythm:</strong> This internal clock regulates your sleep-wake cycle, influenced by external cues like light and darkness.</li><li><strong>Sleep Stages:</strong> We cycle through different sleep stages throughout the night, including light sleep, deep sleep, and REM sleep (rapid eye movement), each playing a unique role in physical and cognitive restoration.</li></ul><p><br></p><p><strong>Evidence-Based Strategies for Better Sleep:</strong></p><ul><li><strong>Light Exposure:</strong> Exposure to natural sunlight during the day helps regulate your circadian rhythm. Conversely, minimize exposure to artificial light, especially blue light from electronic devices, in the evening.</li><li><strong>Temperature Regulation:</strong> A cool bedroom temperature (around 60-67 degrees Fahrenheit) is ideal for sleep. Your body's core temperature naturally drops during sleep, and a cooler environment facilitates this process.</li><li><strong>Noise Reduction:</strong> Minimize noise distractions in your bedroom. Consider using earplugs, a white noise machine, or a fan to create a more peaceful sleep environment.</li><li><strong>Dietary Considerations:</strong> A balanced diet rich in fruits, vegetables, and whole grains supports healthy sleep. Limit caffeine and alcohol intake, especially before bed. Certain foods, like cherries and fatty fish, contain natural melatonin, which may promote sleep.</li><li><strong>Supplementation:</strong> Melatonin supplements can be helpful for regulating circadian rhythms, particularly for jet lag or shift work. However, it's essential to consult with a healthcare professional before taking any supplements.</li><li><strong>Exercise and Movement:</strong> Regular physical activity can improve sleep quality and reduce sleep latency (the time it takes to fall asleep). However, avoid intense exercise close to bedtime.</li><li><strong>Stress Management:</strong> Chronic stress can significantly impact sleep. Practice stress-reducing techniques like meditation, mindfulness, or yoga.</li><li><strong>Technology and Sleep:</strong> Limit screen time before bed. The blue light emitted from electronic devices can suppress melatonin production and disrupt sleep. Create a "technology-free zone" in your bedroom.</li><li><strong>Guided Imagery and Meditation:</strong> These techniques can help calm the mind and promote relaxation, making it easier to fall asleep. There are numerous apps and audio guides available to assist with these practices.</li><li><strong>Progressive Muscle Relaxation (PMR):</strong> This technique involves tensing and relaxing different muscle groups in your body, helping to release tension and promote relaxation.</li></ul><p><br></p><p><strong>The Military Sleep Method:</strong> This technique, developed for military personnel, combines progressive muscle relaxation with visualization to quickly fall asleep in stressful environments. While its effectiveness is largely anecdotal, many find it helpful for reducing pre-sleep anxiety.</p><p><br></p><p><strong>Building a Personalized Sleep Plan:</strong></p><p>Experiment with different strategies to find what works best for you. Consistency is key. By prioritizing sleep and implementing evidence-based techniques, you can significantly improve your sleep quality and wake up feeling refreshed and ready to take on the day.</p><p><br></p><p>Sleep is not a luxury; it's a fundamental pillar of health and well-being. By understanding the science of sleep and implementing the strategies outlined in this article, you can "hack" your sleep and unlock the numerous benefits of a truly restful night. Remember to consult with a healthcare professional if you have persistent sleep problems.</p>	/uploads/upload-1739534270467-278922648.jpg	t	cm74liob2000y5f65z1twa7jq	cm74lkp7p00125f65uq8qa8th	{"Hacking Your Sleep","Strategies for a Better Night's Rest","Better Sleep"}	Hacking Your Sleep: Science-Backed Strategies for a Better Night's Rest	Are you tired of tossing and turning, longing for a good night's sleep?  You're not alone.  Many people struggle with sleep issues, but the good news is that there are science-backed strategies you can implement to improve your sleep quality and duration. This article delves into evidence-based techniques to help you "hack" your sleep and wake up feeling refreshed and revitalized.	sleep,strategies for Better Sleep,Better Sleep	2025-02-14 11:57:50.591	2025-02-19 13:32:06.673	cm73nnd59000cfzn7ur5rvrvj
cm74p3pie0001h5com8n2xnk2	Unlock the Power of Sleep: Your Guide to a Restful Night	unlock-the-power-of-sleep-your-guide-to-a-restful-night	In today's fast-paced world, quality sleep often takes a backseat. But prioritizing sleep is not a luxury—it's a necessity for optimal physical and mental well-being. This article explores the profound importance of adequate sleep, delves into common sleep disruptors like insomnia, and provides practical strategies to unlock the power of a truly restful night.	<p>In today's fast-paced world, quality sleep often takes a backseat. But prioritizing sleep is not a luxury—it's a necessity for optimal physical and mental well-being. This article explores the profound importance of adequate sleep, delves into common sleep disruptors like insomnia, and provides practical strategies to unlock the power of a truly restful night.</p><p><br></p><p><strong>The Importance of Sleep: More Than Just Rest</strong></p><p>Sleep is a fundamental biological process crucial for a wide range of bodily functions. During sleep, our bodies and minds are hard at work:</p><ul><li><strong>Memory Consolidation:</strong> Sleep plays a vital role in processing and storing memories, strengthening learning and cognitive abilities.</li><li><strong>Cellular Repair:</strong> The body repairs and rejuvenates itself during sleep, bolstering the immune system and promoting overall health.</li><li><strong>Hormone Regulation:</strong> Sleep affects the production and regulation of various hormones, including those influencing appetite, growth, and stress response.</li></ul><p>Insufficient sleep can have significant consequences, increasing the risk of:</p><ul><li><strong>Chronic Diseases:</strong> Including obesity, diabetes, cardiovascular disease, and weakened immune function.</li><li><strong>Mental Health Issues:</strong> Such as mood disorders, anxiety, and decreased cognitive performance.</li><li><strong>Reduced Productivity:</strong> Impaired focus, concentration, and decision-making abilities.</li></ul><p><br></p><p><strong>Conquering Insomnia and Other Sleep Disruptors</strong></p><p>Insomnia, characterized by difficulty falling asleep or staying asleep, is a prevalent issue often triggered by stress, anxiety, or poor sleep hygiene. Other sleep disorders, like sleep apnea, further complicate the pursuit of restful sleep. Breaking the cycle of sleep deprivation requires a multi-faceted approach.</p><p><br></p><p><strong>Practical Strategies for Better Sleep:</strong></p><ul><li><strong>Establish a Consistent Sleep Schedule:</strong> Going to bed and waking up at the same time each day, even on weekends, helps regulate your body's natural sleep-wake cycle (circadian rhythm).</li><li><strong>Create a Relaxing Bedtime Routine:</strong> Wind down before bed with calming activities like reading, taking a warm bath, or listening to soothing music. Avoid screen time close to bedtime, as the blue light emitted from electronic devices can interfere with melatonin production, a hormone that regulates sleep.</li><li><strong>Optimize Your Sleep Environment:</strong> Ensure your bedroom is dark, quiet, and cool. Invest in a comfortable mattress and pillows. Consider using blackout curtains or a white noise machine to block out unwanted light and sound.</li><li><strong>Practice Relaxation Techniques:</strong> Deep breathing exercises, progressive muscle relaxation, and meditation can help calm the mind and body, promoting sleep onset. The 4-7-8 breathing method, developed by Dr. Andrew Weil, is a particularly effective technique for reducing stress and inducing relaxation.</li><li><strong>Mindful Eating and Drinking:</strong> Avoid caffeine and alcohol before bed. A light snack before sleep can sometimes be beneficial, but avoid heavy meals.</li><li><strong>Regular Exercise:</strong> Regular physical activity can improve sleep quality, but avoid intense workouts close to bedtime.</li></ul><p><br></p><p><strong>When to Seek Professional Help:</strong></p><p>If you consistently struggle with sleep despite implementing these strategies, it's essential to consult with a healthcare professional. They can help identify any underlying medical conditions or sleep disorders and recommend appropriate treatment options.</p><p><br></p><p><strong>Conclusion:</strong></p><p>Prioritizing sleep is an investment in your overall health and well-being. By adopting healthy sleep habits and optimizing your sleep environment, you can unlock the power of restorative sleep and experience the numerous benefits it offers for your mind, body, and daily life.</p>	/uploads/upload-1739533114478-311608704.jpg	t	cm74liob2000y5f65z1twa7jq	cm74lkp7p00125f65uq8qa8th	{sleep,"Guide to a Restful Night","the Power of Sleep"}	Unlock the Power of Sleep: Your Guide to a Restful Night	In today's fast-paced world, quality sleep often takes a backseat. But prioritizing sleep is not a luxury—it's a necessity for optimal physical and mental well-being. This article explores the profound importance of adequate sleep, delves into common sleep disruptors like insomnia, and provides practical strategies to unlock the power of a truly restful night.	sleep,guide to a restful night,the power of sleep	2025-02-14 11:38:34.597	2025-02-19 13:37:59.236	cm73nnd59000cfzn7ur5rvrvj
\.


--
-- Data for Name: PostCategory; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."PostCategory" (id, title, description, thumbnail, slug, "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt") FROM stdin;
cm74j5t4u00005f65rvmb8yek	Sleep for Different Lifestyles	Find Sleep for Different Lifestyles solutions—adjustable pillows, sleep trackers, and organic bedding—to support parents, professionals, travelers, and more. Achieve restful nights, energized days, and routines tailored to your unique needs!	/uploads/sleep-for-different-lifestyles-1739523134908-576756302.jpg	sleep-for-different-lifestyles	Sleep for Different Lifestyles	Find Sleep for Different Lifestyles solutions—adjustable pillows, sleep trackers, and organic bedding—to support parents, professionals, travelers, and more. Achieve restful nights, energized days, and routines tailored to your unique needs!	Sleep lifestyle, Sleep issues, Lifestyle	2025-02-14 08:52:14.91	2025-02-14 08:52:14.91
cm74l1yhm00095f65pfe336r1	Healing Sleep Energy	Explore Healing Sleep Energy solutions—herbal blends, supplements, and guided meditations—for deep restorative sleep, renewed energy, and natural balance. Recharge and transform your nights!	/uploads/healing-sleep-energy-1739526314457-110631305.jpg	healing-sleep-energy	Healing Sleep Energy	Explore Healing Sleep Energy solutions—herbal blends, supplements, and guided meditations—for deep restorative sleep, renewed energy, and natural balance. Recharge and transform your nights!	Sleep issues, Insomnia, Sleep Healing	2025-02-14 09:45:14.458	2025-02-14 09:45:14.458
cm74l8f4z000j5f65lxxwug0y	Relaxation & Stress Relief	Discover Relaxation & Stress Relief solutions—aromatherapy, mindfulness tools, supplements—to reduce anxiety, improve sleep, and restore balance. Unwind and find calm today!	/uploads/relaxation-stress-relief-1739526615970-721918975.jpg	relaxation-stress-relief	Relaxation & Stress Relief	Discover Relaxation & Stress Relief solutions—aromatherapy, mindfulness tools, supplements—to reduce anxiety, improve sleep, and restore balance. Unwind and find calm today!	Relaxation, Stress Relief, Relax	2025-02-14 09:50:15.971	2025-02-14 09:50:15.971
cm74liob2000y5f65z1twa7jq	Sleep Tips & Techniques	Discover effective sleep tips & techniques to improve your rest. Learn how to fall asleep faster, sleep deeper, and wake up refreshed with expert advice.	/uploads/sleep-tips-techniques-1739527094413-906320663.jpg	sleep-tips-techniques	Sleep Tips & Techniques	Discover effective sleep tips & techniques to improve your rest. Learn how to fall asleep faster, sleep deeper, and wake up refreshed with expert advice.	sleep,sleep techniques, sleep tips	2025-02-14 09:58:14.414	2025-02-14 09:58:14.414
\.


--
-- Data for Name: PostSubCategory; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."PostSubCategory" (id, title, description, thumbnail, slug, "seoTitle", "seoDescription", "seoKeywords", "createdAt", "updatedAt", "categoryId", "parentCategoryId") FROM stdin;
cm74knom900045f65tsjf1cam	Sleep for Seniors	Sleep for Seniors	/uploads/sleep-for-seniors-1739525648479-972295110.jpg	sleep-for-seniors	Sleep for Seniors	Sleep for Seniors	Sleep for Seniors	2025-02-14 09:34:08.481	2025-02-14 09:34:08.481	cm74j5t4u00005f65rvmb8yek	\N
cm74l09hi00065f65wsnkqnb8	Sleep for Parents	Sleep for Parents	/uploads/sleep-for-parents-1739526235396-918440834.jpg	sleep-for-parents	Sleep for Parents	Sleep for Parents	Sleep for Parents	2025-02-14 09:43:55.398	2025-02-14 09:43:55.398	cm74j5t4u00005f65rvmb8yek	\N
cm74l0zv200085f65wjqymjx5	Sleep for Professionals	Sleep for Professionals	/uploads/sleep-for-professionals-1739526269580-317151442.jpg	sleep-for-professionals	Sleep for Professionals	Sleep for Professionals	Sleep for Professionals	2025-02-14 09:44:29.582	2025-02-14 09:44:29.582	cm74j5t4u00005f65rvmb8yek	\N
cm74l4gku000c5f65xqrtzhfz	Chakra Balancing for Restful Nights	Chakra Balancing for Restful Nights	/uploads/chakra-balancing-for-restful-nights-1739526431213-922814064.jpg	chakra-balancing-for-restful-nights	Chakra Balancing for Restful Nights	Chakra Balancing for Restful Nights	Chakra Balancing for Restful Nights	2025-02-14 09:47:11.214	2025-02-14 09:47:11.214	cm74l1yhm00095f65pfe336r1	\N
cm74l5iax000e5f65u4gh7oad	Crystal Healing for Sleep	Crystal Healing for Sleep	/uploads/crystal-healing-for-sleep-1739526480104-635853760.jpg	crystal-healing-for-sleep	Crystal Healing for Sleep	Crystal Healing for Sleep	Crystal Healing for Sleep	2025-02-14 09:48:00.105	2025-02-14 09:48:00.105	cm74l1yhm00095f65pfe336r1	\N
cm74l693c000g5f65in4kfdkr	Natural Remedies	Natural Remedies	/uploads/natural-remedies-1739526514823-109706083.jpg	natural-remedies	Natural Remedies	Natural Remedies	Natural Remedies	2025-02-14 09:48:34.824	2025-02-14 09:48:34.824	cm74l1yhm00095f65pfe336r1	\N
cm74l70b0000i5f652egfjexs	Holistic Approaches	Holistic Approaches	/uploads/holistic-approaches-1739526550089-933261789.jpg	holistic-approaches	Holistic Approaches	Holistic Approaches	Holistic Approaches	2025-02-14 09:49:10.093	2025-02-14 09:49:10.093	cm74l1yhm00095f65pfe336r1	\N
cm74l93nt000l5f65n4ihr3gx	Guided Meditation for Sleep	Guided Meditation for Sleep	/uploads/guided-meditation-for-sleep-1739526647752-578907699.jpg	guided-meditation-for-sleep	Guided Meditation for Sleep	Guided Meditation for Sleep	Guided Meditation for Sleep	2025-02-14 09:50:47.753	2025-02-14 09:50:47.753	cm74l8f4z000j5f65lxxwug0y	\N
cm74l9vxh000n5f65n7tsblw1	Breathing Exercises for Relaxation	Breathing Exercises for Relaxation	/uploads/breathing-exercises-for-relaxation-1739526684381-978647451.jpg	breathing-exercises-for-relaxation	Breathing Exercises for Relaxation	Breathing Exercises for Relaxation	Breathing Exercises for Relaxation	2025-02-14 09:51:24.382	2025-02-14 09:51:24.382	cm74l8f4z000j5f65lxxwug0y	\N
cm74lbhhb000p5f65plwivfyx	Progressive Muscle Relaxation	Progressive Muscle Relaxation	/uploads/progressive-muscle-relaxation-1739526758973-476164617.jpg	progressive-muscle-relaxation	Progressive Muscle Relaxation	Progressive Muscle Relaxation	Progressive Muscle Relaxation	2025-02-14 09:52:38.975	2025-02-14 09:52:38.975	cm74l8f4z000j5f65lxxwug0y	\N
cm74lcaex000r5f65ite8uanp	Stress Management	Stress Management	/uploads/stress-management-1739526796472-156485346.jpg	stress-management	Stress Management	Stress Management	Stress Management	2025-02-14 09:53:16.473	2025-02-14 09:53:16.473	cm74l8f4z000j5f65lxxwug0y	\N
cm74lcyqy000t5f654pu35ucu	Calming Activities	Calming Activities	/uploads/calming-activities-1739526828008-181799352.jpg	calming-activities	Calming Activities	Calming Activities	Calming Activities	2025-02-14 09:53:48.01	2025-02-14 09:53:48.01	cm74l8f4z000j5f65lxxwug0y	\N
cm74lei29000v5f65d4z6gpw2	Yoga for Relaxation	Yoga for Relaxation	/uploads/yoga-for-relaxation-1739526899696-935508003.jpg	yoga-for-relaxation	Yoga for Relaxation	Yoga for Relaxation	Yoga for Relaxation	2025-02-14 09:54:59.698	2025-02-14 09:54:59.698	cm74l8f4z000j5f65lxxwug0y	\N
cm74lhngg000x5f65z8wfsssu	Aromatherapy for Sleep	Aromatherapy for Sleep	/uploads/aromatherapy-for-sleep-1739527046649-763573886.jpg	aromatherapy-for-sleep	Aromatherapy for Sleep	Aromatherapy for Sleep	Aromatherapy for Sleep	2025-02-14 09:57:26.65	2025-02-14 09:57:26.65	cm74l8f4z000j5f65lxxwug0y	\N
cm74lk2gz00105f65l1d5qxw5	Best Sleep Positions	Explore the best sleep positions for optimal comfort and health. Learn how side, back, and stomach sleeping can improve sleep quality and reduce pain.	/uploads/best-sleep-positions-1739527159426-768368237.jpg	best-sleep-positions	Best Sleep Positions	Explore the best sleep positions for optimal comfort and health. Learn how side, back, and stomach sleeping can improve sleep quality and reduce pain.	Best Sleep Positions, Sleep issues	2025-02-14 09:59:19.427	2025-02-14 09:59:19.427	cm74liob2000y5f65z1twa7jq	\N
cm74lkp7p00125f65uq8qa8th	How to Fall Asleep Faster	How to Fall Asleep Faster	/uploads/how-to-fall-asleep-faster-1739527188900-202502265.jpg	how-to-fall-asleep-faster	How to Fall Asleep Faster	How to Fall Asleep Faster	How to Fall Asleep Faster	2025-02-14 09:59:48.901	2025-02-14 09:59:48.901	cm74liob2000y5f65z1twa7jq	\N
cm74llk2700145f65ail8fvr4	Insomnia Solutions	Insomnia Solutions	/uploads/insomnia-solutions-1739527228877-797944692.jpg	insomnia-solutions	Insomnia Solutions	Insomnia Solutions	Insomnia Solutions	2025-02-14 10:00:28.879	2025-02-14 10:00:28.879	cm74liob2000y5f65z1twa7jq	\N
cm74lmf5l00165f650jy5c5o6	Daily Habits for Better Sleep	Daily Habits for Better Sleep	/uploads/daily-habits-for-better-sleep-1739527269176-951254612.jpg	daily-habits-for-better-sleep	Daily Habits for Better Sleep	Daily Habits for Better Sleep	Daily Habits for Better Sleep	2025-02-14 10:01:09.177	2025-02-14 10:01:09.177	cm74liob2000y5f65z1twa7jq	\N
cm74lmzhu00185f657enfznyl	Nighttime Routine Ideas	Nighttime Routine Ideas	/uploads/nighttime-routine-ideas-1739527295536-506233662.jpg	nighttime-routine-ideas	Nighttime Routine Ideas	Nighttime Routine Ideas	Nighttime Routine Ideas	2025-02-14 10:01:35.538	2025-02-14 10:01:35.538	cm74liob2000y5f65z1twa7jq	\N
cm74lnnmj001a5f65u7damf0c	Tech and Sleep	Tech and Sleep	/uploads/tech-and-sleep-1739527326809-814564185.jpg	tech-and-sleep	Tech and Sleep	Tech and Sleep	Tech and Sleep	2025-02-14 10:02:06.81	2025-02-14 10:02:06.81	cm74liob2000y5f65z1twa7jq	\N
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
cm73ff1w50001zncnz36ywpy8	testproduct	asfsadf	/uploads/testproduct-1739456381523-45001706.png	testproduct	DIGITAL	asfasf	safasf	safasfasf	2025-02-13 14:19:41.526	2025-02-13 14:19:41.526
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
cm7brsue30001wd8gen2brvpl	{https://themidnightspa.com/posts/hacking-your-sleep-science-backed-strategies-for-a-better-nights-rest,https://themidnightspa.com/posts/unlock-the-power-of-sleep-your-guide-to-a-restful-night}	URL_UPDATED	[{"url": "https://themidnightspa.com/posts/hacking-your-sleep-science-backed-strategies-for-a-better-nights-rest", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/posts/hacking-your-sleep-science-backed-strategies-for-a-better-nights-rest"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/posts/unlock-the-power-of-sleep-your-guide-to-a-restful-night", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/posts/unlock-the-power-of-sleep-your-guide-to-a-restful-night"}}, "success": true}, "status": "fulfilled"}]	cm79jurj20000bmtg2c56qjsn	2025-02-19 10:28:29.787	2025-02-19 10:28:29.787
cm7bs119600018xpmscptx22d	{https://themidnightspa.com/categories/sleep-for-different-lifestyles,https://themidnightspa.com/categories/healing-sleep-energy,https://themidnightspa.com/categories/relaxation-stress-relief,https://themidnightspa.com/categories/sleep-tips-techniques}	URL_UPDATED	[{"url": "https://themidnightspa.com/categories/sleep-for-different-lifestyles", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/categories/sleep-for-different-lifestyles"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/categories/healing-sleep-energy", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/categories/healing-sleep-energy"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/categories/relaxation-stress-relief", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/categories/relaxation-stress-relief"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/categories/sleep-tips-techniques", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/categories/sleep-tips-techniques"}}, "success": true}, "status": "fulfilled"}]	cm79jurj20000bmtg2c56qjsn	2025-02-19 10:34:51.93	2025-02-19 10:34:51.93
cm7bs19sp00038xpmxa2u6f1v	{https://themidnightspa.com/videos/5-hour-sleep-music-with-delta-waves-for-deep-sleep-insomnia-relief-relaxing-music,https://themidnightspa.com/videos/sleep-instantly-delta-waves-fireplace-ambience-for-deep-relaxation-and-anxiety-relief,https://themidnightspa.com/videos/relaxing-waterfall-sounds-piano-music-4-hour-stress-relief-sleep-and-calm-nature-ambience,https://themidnightspa.com/videos/5-hours-of-relaxing-fireplace-ambience-cozy-crackling-fire-for-sleep-stress-relief-focus,https://themidnightspa.com/videos/snow-sleep-calm-music-for-insomnia-relief-and-deep-sleep,https://themidnightspa.com/videos/snowy-sleep-vibe-relaxing-music-to-lull-you-into-dream-land,https://themidnightspa.com/videos/relaxing-insomnia-rain-sounds-sleep-focus-and-relaxation-aid}	URL_UPDATED	[{"url": "https://themidnightspa.com/videos/5-hour-sleep-music-with-delta-waves-for-deep-sleep-insomnia-relief-relaxing-music", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/videos/5-hour-sleep-music-with-delta-waves-for-deep-sleep-insomnia-relief-relaxing-music"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/videos/sleep-instantly-delta-waves-fireplace-ambience-for-deep-relaxation-and-anxiety-relief", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/videos/sleep-instantly-delta-waves-fireplace-ambience-for-deep-relaxation-and-anxiety-relief"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/videos/relaxing-waterfall-sounds-piano-music-4-hour-stress-relief-sleep-and-calm-nature-ambience", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/videos/relaxing-waterfall-sounds-piano-music-4-hour-stress-relief-sleep-and-calm-nature-ambience"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/videos/5-hours-of-relaxing-fireplace-ambience-cozy-crackling-fire-for-sleep-stress-relief-focus", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/videos/5-hours-of-relaxing-fireplace-ambience-cozy-crackling-fire-for-sleep-stress-relief-focus"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/videos/snow-sleep-calm-music-for-insomnia-relief-and-deep-sleep", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/videos/snow-sleep-calm-music-for-insomnia-relief-and-deep-sleep"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/videos/snowy-sleep-vibe-relaxing-music-to-lull-you-into-dream-land", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/videos/snowy-sleep-vibe-relaxing-music-to-lull-you-into-dream-land"}}, "success": true}, "status": "fulfilled"}, {"url": "https://themidnightspa.com/videos/relaxing-insomnia-rain-sounds-sleep-focus-and-relaxation-aid", "value": {"data": {"urlNotificationMetadata": {"url": "https://themidnightspa.com/videos/relaxing-insomnia-rain-sounds-sleep-focus-and-relaxation-aid"}}, "success": true}, "status": "fulfilled"}]	cm79jurj20000bmtg2c56qjsn	2025-02-19 10:35:03.001	2025-02-19 10:35:03.001
cm7bygivv0001z4iioy3agim1	{https://themidnightspa.com/posts/unlock-the-power-of-sleep-your-guide-to-a-restful-night}	URL_UPDATED	{"status": "submitted"}	cm79jurj20000bmtg2c56qjsn	2025-02-19 13:34:52.315	2025-02-19 13:34:52.315
cm7bykjoi0003z4iiu2dvz7gn	{https://themidnightspa.com/posts/unlock-the-power-of-sleep-your-guide-to-a-restful-night}	URL_UPDATED	{"status": "submitted"}	cm79jurj20000bmtg2c56qjsn	2025-02-19 13:37:59.971	2025-02-19 13:37:59.971
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."SiteSettings" (id, "siteName", "siteTitle", "siteDescription", "siteKeywords", "ogTitle", "ogDescription", "ogImage", "twitterHandle", "twitterCardType", "organizationName", "organizationLogo", "contactEmail", "contactPhone", "contactAddress", "googleAnalyticsId", "googleSiteVerification", "robotsTxt", "sitemapXml", favicon, "createdAt", "updatedAt") FROM stdin;
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
cm73nnd59000cfzn7ur5rvrvj	mounir.bennassar@gmail.com	$2a$12$tYhJ3aB2AJ7CIw/B6bDgSuAqS1oexfXfDm1vnMkKxMZIOLwsfs5oy	\N	2025-02-13 18:10:06.286	2025-02-13 18:10:06.286	f	PENDING
cm7bp89cc0000r49hf1jzyq9u	rafif@clicksalesmedia.com	$2a$12$tEhXJvzDVC9.14H7r38nz.mzH3S7WRi9.fZU3SsCOzYNyL3k8y7pq	\N	2025-02-19 09:16:30.157	2025-02-19 10:14:29.832	t	PENDING
cm79jurj20000bmtg2c56qjsn	mounir@clicksalesmedia.com	$2a$12$rtlylorJtGMn5.m1WizuPezr4KLvl8/n5cCdVVCuEP5mHOoLEmhH.	Super Admin	2025-02-17 21:10:30.11	2025-02-19 13:25:20.493	t	SUPER_ADMIN
\.


--
-- Data for Name: Video; Type: TABLE DATA; Schema: public; Owner: mounirbennassar
--

COPY public."Video" (id, title, slug, description, "youtubeUrl", "seoTitle", "seoDescription", "seoKeywords", published, "createdAt", "updatedAt", "authorId") FROM stdin;
cm74uz6ef0001c6xe97c81xz6	Relaxing Insomnia Rain Sounds | Sleep, Focus, and Relaxation Aid	relaxing-insomnia-rain-sounds-sleep-focus-and-relaxation-aid	Struggling with insomnia, stress, or lack of focus? Let these Relaxing Insomnia Rain Sounds guide you to a state of deep relaxation and restful sleep. The gentle, soothing sounds of rain create the perfect ambiance for sleep, meditation, or focus. Whether you're battling insomnia, need to unwind after a long day, or want to improve your concentration, this video is your ultimate relaxation aid.\n\n➟ Why These Rain Sounds?\n\n-Insomnia Relief: The calming rhythm of rain helps you fall asleep faster and stay asleep longer, naturally.\n\n-Stress & Anxiety Reduction: Rain sounds lower cortisol levels, promoting relaxation and mental clarity.\n\n-Focus & Productivity: Perfect background noise for studying, working, or any task requiring concentration.\n\n-Meditation & Mindfulness: Enhances your meditation practice by creating a serene, distraction-free environment.\n\n➟ Perfect For:\n\nDeep Sleep: Let the gentle rain sounds lull you into a restful night's sleep.\n\nFocus & Study: Improve concentration and productivity with calming background noise.\n\nStress Relief: Escape the chaos of daily life and find peace in the soothing sounds of rain.\n\nMeditation & Yoga: Create a tranquil atmosphere for mindfulness and relaxation practices.\n\n📌 How to Use:\nPlay this video at a low volume in your bedroom, office, or meditation space. Let the relaxing rain sounds wash away your stress and guide you into a state of calm and focus.\n\n🔗 Download or Stream:\nAvailable for streaming on YouTube, so you can enjoy these calming rain sounds anytime, anywhere. Perfect for creating a peaceful atmosphere at home, work, or on the go.\n\n#RainSoundsForSleep #InsomniaRelief #RelaxingRainSounds #SleepAid #StressRelief #FocusMusic #CalmingSounds #MeditationMusic #DeepSleep #RainSoundsForRelaxation #SleepBetter #AnxietyRelief #NatureSounds #RelaxationAid #SoothingRain	https://www.youtube.com/watch?v=e3NUr2qG0wM	Relaxing Insomnia Rain Sounds | Sleep, Focus, and Relaxation Aid	Struggling with insomnia, stress, or lack of focus? Let these Relaxing Insomnia Rain Sounds guide you to a state of deep relaxation and restful sleep. The gentle, soothing sounds of rain create the perfect ambiance for sleep, meditation, or focus. Whether you're battling insomnia, need to unwind after a long day, or want to improve your concentration, this video is your ultimate relaxation aid.\n	rain music,rain music sleep	t	2025-02-14 14:23:00.898	2025-02-14 14:23:00.898	cm73nnd59000cfzn7ur5rvrvj
cm74zz1uw0003c6xeyycj693r	Snowy Sleep Vibe: Relaxing Music to Lull You into Dreamland 🌬️❄️	snowy-sleep-vibe-relaxing-music-to-lull-you-into-dream-land	Experience the serene world of snowy sleep vibes through this captivating music video crafted to lull you into a peaceful slumber. Inspired by the calming essence of winter, this video offers a tranquil escape perfect for unwinding and enhancing your sleep quality. \nDiscover how soothing sounds can transform your nightly routine, making each night a tranquil journey. Join others who have found solace in these gentle tunes—listen now!\n#insomnia #SleepAid #SnowyVibes #StressRelief #RelaxingMusic #SoothingSounds	https://www.youtube.com/watch?v=5gYyZLfxCDY	Snowy Sleep Vibe: Relaxing Music to Lull You into Dreamland	Experience the serene world of snowy sleep vibes through this captivating music video crafted to lull you into a peaceful slumber. Inspired by the calming essence of winter, this video offers a tranquil escape perfect for unwinding and enhancing your sleep quality. \nDiscover how soothing sounds can transform your nightly routine, making each night a tranquil journey. Join others who have found solace in these gentle tunes—listen now!\n#insomnia #SleepAid #SnowyVibes #StressRelief #RelaxingMusic #SoothingSounds	sleep,sleep music,insomnia music	t	2025-02-14 16:42:53.096	2025-02-14 16:42:53.096	cm73nnd59000cfzn7ur5rvrvj
cm75014k90005c6xevj53tb9w	Snow Sleep | Calm Music for Insomnia Relief and Deep Sleep	snow-sleep-calm-music-for-insomnia-relief-and-deep-sleep	Relax and unwind with 4 hours of calm snow-inspired sleep music, crafted to help you overcome insomnia, reduce stress, and achieve deep, restful sleep. Let the soothing melodies and gentle snowy visuals create the perfect remedy for relaxation, stress relief, and better sleep.\nPerfect for sleeping, studying, or meditation. \nStart your journey to a peaceful mind and body today. \nSubscribe for more calming music videos and natural sleep remedies! #SleepMusic #StressRelief #CalmMusic	https://www.youtube.com/watch?v=Ik2dSqKESSk	Snow Sleep | Calm Music for Insomnia Relief and Deep Sleep	Relax and unwind with 4 hours of calm snow-inspired sleep music, crafted to help you overcome insomnia, reduce stress, and achieve deep, restful sleep. Let the soothing melodies and gentle snowy visuals create the perfect remedy for relaxation, stress relief, and better sleep.\nPerfect for sleeping, studying, or meditation. \nStart your journey to a peaceful mind and body today. \nSubscribe for more calming music videos and natural sleep remedies! #SleepMusic #StressRelief #CalmMusic	calm music,sleep music,relax music	t	2025-02-14 16:44:29.913	2025-02-14 16:44:29.913	cm73nnd59000cfzn7ur5rvrvj
cm7502sle0007c6xe7lhl40nq	5 Hours of Relaxing Fireplace Ambience | Cozy Crackling Fire for Sleep, Stress Relief & Focus	5-hours-of-relaxing-fireplace-ambience-cozy-crackling-fire-for-sleep-stress-relief-focus	Immerse yourself in 5 hours of calming fireplace ambience with soothing crackling sounds and a cozy glow, perfect for sleep, relaxation, and focus. This long-play video is designed to help you:\n\nSleep Better: Drift off quickly with the peaceful crackling of the fire.\nReduce Stress: Unwind and meditate with the warm, comforting ambiance.\n\nWhether you’re winding down for the night, reading a book, or seeking a cozy background, this fireplace video transforms your space into a tranquil retreat. Sit back, relax, and let the flickering flames take you to a state of calm.\n\nDon’t forget to like, comment, and subscribe to support the channel and enjoy more relaxing videos like this!\n\n#RelaxingFireplace  #CozyAmbience  #CracklingFire  #SleepSounds  #StressRelief  \n#LongRelaxationVideo	https://www.youtube.com/watch?v=S-iEp7xqS24	5 Hours of Relaxing Fireplace Ambience | Cozy Crackling Fire for Sleep, Stress Relief & Focus	Immerse yourself in 5 hours of calming fireplace ambience with soothing crackling sounds and a cozy glow, perfect for sleep, relaxation, and focus. This long-play video is designed to help you:\n\nSleep Better: Drift off quickly with the peaceful crackling of the fire.\nReduce Stress: Unwind and meditate with the warm, comforting ambiance.\n\nWhether you’re winding down for the night, reading a book, or seeking a cozy background, this fireplace video transforms your space into a tranquil retreat. Sit back, relax, and let the flickering flames take you to a state of calm.\n\nDon’t forget to like, comment, and subscribe to support the channel and enjoy more relaxing videos like this!	snow music, calm music, sleep songs, 	t	2025-02-14 16:45:47.709	2025-02-14 16:45:47.709	cm73nnd59000cfzn7ur5rvrvj
cm7507y4w0009c6xej8r3nzgd	Relaxing Waterfall Sounds & Piano Music | 4-Hour Stress Relief, Sleep, and Calm Nature Ambience	relaxing-waterfall-sounds-piano-music-4-hour-stress-relief-sleep-and-calm-nature-ambience	Immerse yourself in the perfect blend of relaxing waterfall sounds and calming piano music in this 4-hour video. Designed for stress relief, deep sleep, or creating a peaceful atmosphere, this serene scene features a gently cascading waterfall, a crystal-clear pool, and lush greenery under a twilight sky with a glowing crescent moon and twinkling stars.\n#WaterfallSounds #PianoMusic #StressRelief #NatureAmbience #RelaxingMusic #SleepMusic #CalmMind #MeditationMusic #DeepSleep #NatureTherapy	https://www.youtube.com/watch?v=aRV8AHdiN04	Relaxing Waterfall Sounds & Piano Music | 4-Hour Stress Relief, Sleep, and Calm Nature Ambience	Immerse yourself in the perfect blend of relaxing waterfall sounds and calming piano music in this 4-hour video. Designed for stress relief, deep sleep, or creating a peaceful atmosphere, this serene scene features a gently cascading waterfall, a crystal-clear pool, and lush greenery under a twilight sky with a glowing crescent moon and twinkling stars.	music to make you sleep,listen to meditation music,calming music,sounds to make you sleep,music to fall asleep,fast sleep music	t	2025-02-14 16:49:48.176	2025-02-14 16:49:48.176	cm73nnd59000cfzn7ur5rvrvj
cm750ap3d000bc6xen2x12zmw	Sleep Instantly | Delta Waves & Fireplace Ambience for Deep Relaxation and Anxiety Relief	sleep-instantly-delta-waves-fireplace-ambience-for-deep-relaxation-and-anxiety-relief	Struggling to fall asleep or relax? This 5-hour delta waves and fireplace sounds video is designed to help you fall asleep fast, stay asleep, and wake up feeling refreshed. Delta waves are scientifically proven to promote deep sleep, while the soothing crackle of a fireplace creates a cozy, calming atmosphere perfect for stress relief and relaxation.\n#DeltaWaves #FireplaceSounds #DeepSleep #SleepMusic #InsomniaRelief #StressRelief #Relaxation #FallAsleepFast #AnxietyRelief #CalmMind	https://www.youtube.com/watch?v=SdH80KA_wW8	Sleep Instantly | Delta Waves & Fireplace Ambience for Deep Relaxation and Anxiety Relief	Struggling to fall asleep or relax? This 5-hour delta waves and fireplace sounds video is designed to help you fall asleep fast, stay asleep, and wake up feeling refreshed. Delta waves are scientifically proven to promote deep sleep, while the soothing crackle of a fireplace creates a cozy, calming atmosphere perfect for stress relief and relaxation.	fireplace crackling,sound fire noises,rain and fire sounds,rain fire sounds,fireplace rain sound,fire and rain sounds,fire crackling sound,fireplace crackle sound	t	2025-02-14 16:51:56.42	2025-02-14 16:51:56.42	cm73nnd59000cfzn7ur5rvrvj
cm750fo0u000dc6xewmjiuado	5-Hour Sleep Music with Delta Waves for Deep Sleep | Insomnia Relief, Relaxing Music	5-hour-sleep-music-with-delta-waves-for-deep-sleep-insomnia-relief-relaxing-music	Struggling with insomnia or stress? This 5-hour sleep music with delta waves is designed to help you fall asleep fast, stay asleep, and wake up refreshed. Delta waves are scientifically proven to promote deep sleep and relaxation, making this video perfect for anyone seeking insomnia relief or a calming bedtime routine.\n#SleepMusic #DeltaWaves #DeepSleep #InsomniaRelief #RelaxingSounds #FallAsleepFast #SleepBetter #CalmMind #StressRelief #SleepMeditation	https://www.youtube.com/watch?v=O0JLr6FugLY&t=1s	5-Hour Sleep Music with Delta Waves for Deep Sleep | Insomnia Relief, Relaxing Music	Struggling with insomnia or stress? This 5-hour sleep music with delta waves is designed to help you fall asleep fast, stay asleep, and wake up refreshed. Delta waves are scientifically proven to promote deep sleep and relaxation, making this video perfect for anyone seeking insomnia relief or a calming bedtime routine.	sleep music,free rain sounds download,white music for sleeping,songs that make you sleep instantly,soft music to sleep by,best sounds for deep sleep,deep sleep music sleeping music for deep sleeping,free relaxing sounds for sleep	t	2025-02-14 16:55:48.318	2025-02-14 16:55:48.318	cm73nnd59000cfzn7ur5rvrvj
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
8c573f22-9146-4c10-9daa-5ca65fcfd9cc	9bdd11a47cd592138a02e45c1aafc4cf95bb6fea43e8afa767268d3095dcc062	2025-02-13 12:33:55.237293+00	20250212230419_init	\N	\N	2025-02-13 12:33:55.230471+00	1
97656ce8-443f-4037-8042-1002a5eecb9a	296e0e4567704f7f314905bfda8afa86f204bfffbcef0023ff2dbe0ed43f0ad7	2025-02-13 12:33:55.247332+00	20250212233321_add_categories	\N	\N	2025-02-13 12:33:55.237662+00	1
a46d0207-85b9-441c-8f49-f4c9914b4705	59455742fdb083670f53b0003bbe3c47fe657da84f065f51e8db76b5801027f9	2025-02-13 12:33:55.254599+00	20250213001349_add_posts	\N	\N	2025-02-13 12:33:55.24777+00	1
3363f2df-2797-49bb-ae0d-c4ecd1e6499a	e13d5f8d080e95e3b27bd08674ccd027b0e14746660ed26b7e5ba5475d37d9d1	2025-02-13 12:33:55.807192+00	20250213123355_add_products_and_bundles	\N	\N	2025-02-13 12:33:55.793696+00	1
31ccde96-ff5d-4248-a844-35810a997628	900d863da4bd79a8bb35f1b63e43038e8f0c7d4f8858f2b82dcd48f8d059296d	2025-02-13 13:06:24.688111+00	20250213130624_add_type_to_category	\N	\N	2025-02-13 13:06:24.686136+00	1
dbe65c8b-189d-4cc1-b391-dc48264c58a6	ddb2d862e225fd7161e9957b459ce0bfbd2f0614a3654266e08eadc25472d0bb	2025-02-13 13:19:35.312125+00	20250213131935_separate_post_and_product_categories	\N	\N	2025-02-13 13:19:35.299883+00	1
440c5eed-4428-4f9e-8441-9f44cd059315	b1e8a9837eadd0c8110f8c1326fcdf3c6319679b92be4d79ba28a88955bdd4e1	2025-02-14 19:05:05.353685+00	20250214190505_add_site_settings	\N	\N	2025-02-14 19:05:05.34528+00	1
4af0b4fc-f13e-4120-8128-6ac8ecb070c1	0f2620e517b3e531b5abec2b2a70a4ea32aa850ff6506a52ab6793673398ebde	2025-02-14 19:22:00.407404+00	20250214192200_add_site_settings	\N	\N	2025-02-14 19:22:00.404788+00	1
e66714a5-dce7-4514-94a8-73603f0a52dc	c8d2614bf7214daac3c4869443e0f94779f0f0853749549c47d795f296a1f083	2025-02-14 19:37:17.357048+00	20250214193717_add_site_settings	\N	\N	2025-02-14 19:37:17.354939+00	1
ac8a4adf-b5f0-4497-b11d-e51b812680cf	92d6d8c8629b881d2f43d939c597b77590ac37a8419127589bd5fc57e3caa49c	2025-02-14 19:46:29.928089+00	20250214194629_add_newsletter_system	\N	\N	2025-02-14 19:46:29.90876+00	1
74352863-8d1d-496f-b9ea-621e73bd3032	034a8bb8be0b279b197d475229917a43bae4a087a772f45ed578f1baffd03d8a	2025-02-17 21:07:54.57208+00	20250217210754_add_user_roles	\N	\N	2025-02-17 21:07:54.567158+00	1
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

ALTER TABLE ONLY public."SiteSettings"
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


--
-- PostgreSQL database dump complete
--

