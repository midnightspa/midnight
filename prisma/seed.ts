import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user if it doesn't exist
  const adminEmail = 'admin@themidnightspa.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await hash('admin123', 10),
        name: 'Admin',
        role: 'SUPER_ADMIN',
        isApproved: true,
      },
    });
  }

  // Create categories
  const categories = [
    {
      title: 'Massage Therapy',
      description: 'Discover our range of massage therapy services',
      slug: 'massage-therapy',
      seoTitle: 'Massage Therapy Services | The Midnight Spa',
      seoDescription: 'Experience relaxation with our professional massage therapy services',
      seoKeywords: 'massage therapy, relaxation, spa services',
      subcategories: [
        {
          title: 'Swedish Massage',
          description: 'Traditional Swedish massage techniques',
          slug: 'swedish-massage',
          seoTitle: 'Swedish Massage | The Midnight Spa',
          seoDescription: 'Relax with our Swedish massage therapy',
        },
        {
          title: 'Deep Tissue Massage',
          description: 'Deep tissue massage for muscle relief',
          slug: 'deep-tissue-massage',
          seoTitle: 'Deep Tissue Massage | The Midnight Spa',
          seoDescription: 'Experience deep tissue massage therapy',
        },
      ],
    },
    {
      title: 'Facial Treatments',
      description: 'Luxurious facial treatments for all skin types',
      slug: 'facial-treatments',
      seoTitle: 'Facial Treatments | The Midnight Spa',
      seoDescription: 'Rejuvenate your skin with our facial treatments',
      seoKeywords: 'facial treatments, skincare, spa',
      subcategories: [
        {
          title: 'Anti-Aging Facial',
          description: 'Anti-aging facial treatments',
          slug: 'anti-aging-facial',
          seoTitle: 'Anti-Aging Facial | The Midnight Spa',
          seoDescription: 'Turn back time with our anti-aging facial treatments',
        },
        {
          title: 'Hydrating Facial',
          description: 'Hydrating facial treatments',
          slug: 'hydrating-facial',
          seoTitle: 'Hydrating Facial | The Midnight Spa',
          seoDescription: 'Restore moisture with our hydrating facial treatments',
        },
      ],
    },
  ];

  for (const category of categories) {
    const { subcategories, ...categoryData } = category;
    const createdCategory = await prisma.postCategory.upsert({
      where: { slug: category.slug },
      update: categoryData,
      create: categoryData,
    });

    if (subcategories) {
      for (const subcategory of subcategories) {
        await prisma.postSubCategory.upsert({
          where: { slug: subcategory.slug },
          update: {
            ...subcategory,
            categoryId: createdCategory.id,
          },
          create: {
            ...subcategory,
            categoryId: createdCategory.id,
          },
        });
      }
    }
  }

  // Create some sample posts
  const posts = [
    {
      title: 'Benefits of Regular Massage',
      slug: 'benefits-of-regular-massage',
      content: 'Regular massage therapy can help reduce stress, improve circulation, and promote overall wellness...',
      excerpt: 'Discover the many health benefits of regular massage therapy',
      published: true,
      seoTitle: 'Benefits of Regular Massage | The Midnight Spa',
      seoDescription: 'Learn about the health benefits of regular massage therapy',
      seoKeywords: 'massage benefits, wellness, health',
      categorySlug: 'massage-therapy',
    },
    {
      title: 'Skincare Tips for Winter',
      slug: 'skincare-tips-for-winter',
      content: 'During winter months, your skin needs extra care and attention...',
      excerpt: 'Essential skincare tips to keep your skin healthy during winter',
      published: true,
      seoTitle: 'Winter Skincare Tips | The Midnight Spa',
      seoDescription: 'Learn how to protect your skin during winter',
      seoKeywords: 'winter skincare, skin protection, beauty tips',
      categorySlug: 'facial-treatments',
    },
  ];

  const adminUser = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (adminUser) {
    for (const post of posts) {
      const { categorySlug, ...postData } = post;
      const category = await prisma.postCategory.findUnique({
        where: { slug: categorySlug },
      });

      if (category) {
        await prisma.post.upsert({
          where: { slug: post.slug },
          update: {
            ...postData,
            categoryId: category.id,
            authorId: adminUser.id,
          },
          create: {
            ...postData,
            categoryId: category.id,
            authorId: adminUser.id,
          },
        });
      }
    }
  }

  // Create site settings if they don't exist
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: 'The Midnight Spa',
        siteTitle: 'The Midnight Spa - Luxury Spa & Wellness Center',
        siteDescription: 'Experience luxury spa treatments and wellness services',
        siteKeywords: 'spa, massage, facial, wellness, luxury spa',
        ogTitle: 'The Midnight Spa',
        ogDescription: 'Luxury Spa & Wellness Center',
        twitterHandle: '@midnightspa',
        twitterCardType: 'summary_large_image',
        organizationName: 'The Midnight Spa',
        contactEmail: 'contact@themidnightspa.com',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 