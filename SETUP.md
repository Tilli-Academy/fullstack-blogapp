# Full Stack Blog - Setup Guide

This project uses **Next.js**, **NextAuth**, **PostgreSQL**, and **Prisma**.

## Prerequisites

- Node.js 18+ installed
- A PostgreSQL database (local or cloud)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

You have several options:

### Option A: Use Neon (Recommended - Free & Easy)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string

### Option B: Use Railway

1. Go to [railway.app](https://railway.app)
2. Sign up and create a new project
3. Add PostgreSQL database
4. Copy the connection string

### Option C: Use Vercel Postgres

1. Go to your Vercel dashboard
2. Create a Postgres database
3. Copy the connection string

### Option D: Local PostgreSQL

Install PostgreSQL locally:

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb blog
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb blog
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

## Step 3: Configure Environment Variables

Update your `.env` file with your database connection string:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secure AUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Step 4: Push Database Schema

Run the following command to create all database tables:

```bash
npx prisma db push
```

This will create the following tables:
- `users` - User accounts
- `profiles` - User profiles with username and role
- `posts` - Blog posts
- `comments` - Post comments
- `likes` - Post likes
- NextAuth tables (`accounts`, `sessions`, `verification_tokens`)

## Step 5: Create an Admin User

You'll need to create an account and manually set it as admin:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Go to [http://localhost:3000/signup](http://localhost:3000/signup)

3. Create an account

4. Open Prisma Studio to update your role:
   ```bash
   npx prisma studio
   ```

5. Go to the `profiles` table

6. Find your profile and change `role` from `USER` to `ADMIN`

7. Refresh your browser - you should now see the Admin link in the navbar

## Step 6: Start Developing!

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Public Features (No Login Required)
- ✅ View all published blog posts
- ✅ Read individual blog posts

### User Features (Login Required)
- ✅ Comment on blog posts
- ✅ Like/unlike blog posts
- ✅ Delete your own comments

### Admin Features
- ✅ Create, edit, and delete blog posts
- ✅ Publish/unpublish posts
- ✅ Delete any comment
- ✅ View dashboard with statistics

## Prisma Commands

### View and Edit Database
```bash
npx prisma studio
```

### Reset Database (⚠️ Deletes all data)
```bash
npx prisma db push --force-reset
```

### Generate Prisma Client (after schema changes)
```bash
npx prisma generate
```

## Troubleshooting

### Database Connection Issues

If you see "Can't reach database server":

1. Check your `DATABASE_URL` in `.env`
2. Make sure PostgreSQL is running
3. Verify the database exists
4. Check your credentials (username/password)

### NextAuth Issues

If login doesn't work:

1. Make sure `AUTH_SECRET` is set in `.env`
2. Check that `NEXTAUTH_URL` matches your app URL
3. Clear browser cookies and try again

### Prisma Issues

If Prisma commands fail:

1. Run `npx prisma generate` to regenerate the client
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Project Structure

```
full_stack_blog/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   │   ├── page.js        # Home page
│   │   └── blog/          # Blog posts
│   ├── (auth)/            # Auth pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   └── admin/             # Admin pages (protected)
│       ├── page.js        # Dashboard
│       ├── posts/         # Manage posts
│       └── comments/      # Manage comments
├── components/            # Reusable components
├── actions/               # Server actions
│   ├── auth.js           # Authentication
│   ├── posts.js          # Post operations
│   ├── comments.js       # Comment operations
│   └── likes.js          # Like operations
├── lib/                   # Utilities
│   └── prisma.js         # Prisma client
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma     # Database schema
├── auth.js                # NextAuth configuration
└── middleware.js          # Route protection
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes & Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth v5
- **Deployment**: Vercel (recommended)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add your environment variables:
   - `DATABASE_URL` (use Vercel Postgres or Neon)
   - `AUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your production URL, e.g., `https://yourblog.vercel.app`)
5. Deploy!

After deployment:
1. Run `npx prisma db push` to create tables
2. Create an admin account via the signup page
3. Use Prisma Studio to set the admin role

---

Happy blogging! 🎉
