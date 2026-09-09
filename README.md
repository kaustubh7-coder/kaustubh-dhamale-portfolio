# Kaustubh Dhamale — Portfolio Website

A production-ready full-stack portfolio for an Azure Cloud Support Engineer, built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- **Modern dark UI** with Azure-inspired design language
- **Admin panel** — manage projects, skills, and contact messages
- **Database-driven** skills and projects sections
- **Contact form** with rate limiting, validation, and database storage
- **Auth.js (NextAuth v5)** — secure JWT-based admin authentication
- **Prisma ORM** with PostgreSQL
- **Framer Motion** animations with reduced-motion support
- **SEO** — metadata, sitemap, robots.txt, Open Graph
- **Docker** — containerised for production deployment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Auth | Auth.js / NextAuth v5 |
| Validation | Zod |
| Password | bcryptjs |
| Deployment | Docker + docker-compose |

---

## Project Structure

```
├── app/
│   ├── page.tsx                 # Public portfolio (server component)
│   ├── layout.tsx               # Root layout + SEO metadata
│   ├── sitemap.ts               # Auto-generated sitemap
│   ├── robots.ts                # robots.txt
│   ├── not-found.tsx            # 404 page
│   ├── admin/                   # Admin panel pages
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── skills/page.tsx
│   │   └── messages/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/  # Auth.js handler
│       ├── contact/             # Public contact form
│       ├── projects/            # Public projects
│       ├── skills/              # Public skills
│       └── admin/               # Protected admin APIs
│           ├── projects/
│           ├── skills/
│           └── messages/
├── components/
│   ├── ui/                      # Shared UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── AnimatedSection.tsx
│   │   └── SectionHeader.tsx
│   ├── sections/                # Portfolio sections
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Certifications.tsx
│   │   └── Contact.tsx
│   └── admin/                   # Admin components
│       ├── AdminSidebar.tsx
│       ├── AdminProjectsClient.tsx
│       ├── AdminSkillsClient.tsx
│       └── AdminMessagesClient.tsx
├── lib/
│   ├── prisma.ts                # Prisma client singleton
│   ├── auth.ts                  # NextAuth configuration
│   ├── utils.ts                 # Utility functions
│   ├── validations.ts           # Zod schemas
│   └── rate-limit.ts            # In-memory rate limiting
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
├── public/
│   └── resume.pdf               # Resume download
├── middleware.ts                # Route protection
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL (or use Docker Compose)
- npm

### 1. Clone and install

```bash
git clone <your-repo>
cd portfolio-kaustubh-dhamale
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_db"
AUTH_SECRET="your-32-char-secret"   # openssl rand -base64 32
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_EMAIL="your@email.com"
ADMIN_PASSWORD="your-secure-password"
```

### 3. Database setup

```bash
# Start Postgres locally, then:
npx prisma migrate dev --name init

# Seed with admin user, skills, and initial project:
npm run db:seed
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Docker Deployment

```bash
# Start everything (Postgres + Next.js app)
docker-compose up -d

# Run migrations inside the container
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app node -e "
  const { PrismaClient } = require('@prisma/client');
  const bcrypt = require('bcryptjs');
  // ... or use the seed script
"
```

---

## Production Build

```bash
npm run build
npm start
```

---

## Admin Setup

1. Run the seed: `npm run db:seed`
2. Go to `/admin/login`
3. Login with the credentials from your `.env.local`:
   - Email: `ADMIN_EMAIL`
   - Password: `ADMIN_PASSWORD`

### Admin capabilities:

| Section | Actions |
|---|---|
| Projects | Create, Read, Update, Delete, Mark Featured |
| Skills | Create, Read, Update, Delete, Set Proficiency |
| Messages | View, Mark Read/Unread, Delete, Reply |
| Dashboard | Overview stats, Recent messages |

---

## Resume

Place your resume PDF at `public/resume.pdf` to enable the Download Resume button.

---

## Security Notes

- Admin routes are protected by middleware + server-side session checks
- Passwords hashed with bcryptjs (12 rounds)
- JWT-based sessions with 24h expiry
- Input validated with Zod on all API routes
- Rate limiting on contact form (3 per hour per IP)
- SQL injection protection via Prisma parameterised queries
- Admin panel excluded from search engine indexing
- No secrets in client-side code

---

## Deployment Platforms

Compatible with:

- **Vercel** — `npm run build` + zero-config deployment
- **Railway** — add `DATABASE_URL` environment variable
- **Render** — Docker or Node.js service
- **AWS EC2 / Azure VM** — Docker Compose
- **Any VPS** — Docker Compose

---

## License

MIT
