# Next.js 15.2 Upgrade Fixes

## Dynamic Route Parameters Change

In Next.js 15.2, the `params` object in dynamic routes is now a Promise that needs to be awaited before accessing its properties. This is a breaking change from previous versions.

### Files Updated

We've updated the following files to fix this issue:

1. `app/categories/[slug]/[subcategorySlug]/page.tsx`
2. `app/categories/[slug]/[subcategorySlug]/SubCategoryClient.tsx`
3. `app/categories/[slug]/page.tsx`
4. `app/videos/[slug]/page.tsx`
5. `app/api/categories/[categoryId]/route.ts`
6. `app/api/dashboard/products/categories/[categoryId]/route.ts`
7. `app/api/dashboard/products/[id]/route.ts`
8. `app/posts/[slug]/page.tsx`
9. `app/api/videos/[id]/route.ts`
10. `app/api/videos/slug/[slug]/route.ts`
11. `app/(dashboard)/dashboard/categories/edit/[categoryId]/page.tsx`
12. `app/api/posts/[id]/route.ts`
13. `app/api/posts/slug/[slug]/route.ts`
14. `app/(dashboard)/dashboard/videos/edit/[id]/page.tsx`
15. `app/(dashboard)/dashboard/(shop)/products/categories/edit/[categoryId]/page.tsx`
16. `app/api/products/[productId]/route.ts`
17. `app/shop/[slug]/page.tsx`
18. `app/subcategories/[slug]/page.tsx`
19. `app/(dashboard)/dashboard/posts/edit/[id]/page.tsx`
20. `app/api/shop/products/[slug]/route.ts`

### Pattern Used

For each file, we've applied the following pattern:

```typescript
// Before
export async function someFunction({ params }) {
  const value = params.someProperty;
  // ...
}

// After
export async function someFunction({ params }) {
  const resolvedParams = await params;
  const value = resolvedParams.someProperty;
  // ...
}
```

This change ensures that the route parameters are properly resolved before being accessed, which is required in Next.js 15.2.

## Other Next.js 15.2 Changes

We've also made the following changes to ensure compatibility with Next.js 15.2:

1. Updated `next.config.js` to remove deprecated `serverActions` configuration
2. Kept other experimental features that are still supported

## Testing

After making these changes, the application should work correctly with Next.js 15.2. You should test the following:

1. Navigation to dynamic routes
2. API endpoints with dynamic parameters
3. Form submissions that use dynamic routes
4. Server actions (if used)

If you encounter any other issues, please refer to the [Next.js 15.2 upgrade guide](https://nextjs.org/docs/messages/sync-dynamic-apis) for more information. 