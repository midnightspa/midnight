# Midnight Spa

A luxury spa website built with Next.js 15.2, Prisma, and PostgreSQL.

## Prerequisites

- Node.js 18.17 or later
- PostgreSQL 14 or later
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd midnight
```

2. Install dependencies and set up the database:

```bash
./scripts/setup.sh
```

This script will:
- Install all dependencies
- Generate the Prisma client
- Create the database if it doesn't exist
- Push the schema to the database
- Seed the database with initial data

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Database Management

- **Generate Prisma Client**: `npm run prisma:generate`
- **Push Schema Changes**: `npm run db:push`
- **Open Prisma Studio**: `npm run db:studio`
- **Seed Database**: `npm run db:seed`
- **Create Admin User**: `npm run create-admin`

## Build for Production

```bash
npm run build
```

## Start Production Server

```bash
npm start
```

## Technologies Used

- **Next.js 15.2**: React framework with App Router
- **Prisma**: ORM for database access
- **PostgreSQL**: Database
- **TailwindCSS**: Utility-first CSS framework
- **NextAuth.js**: Authentication
- **TypeScript**: Type-safe JavaScript

## Project Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable React components
- `lib/`: Utility functions and shared code
- `prisma/`: Database schema and migrations
- `public/`: Static assets
- `scripts/`: Utility scripts for development and deployment
- `types/`: TypeScript type definitions

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: URL of the application
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXT_PUBLIC_BASE_URL`: Base URL for SEO and API endpoints

## License

[MIT](LICENSE)
