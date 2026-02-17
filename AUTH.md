### Classic Auth + Rate Limit – Quick Steps

#### 1. Neon PostgreSQL
- **Create project** on Neon and a database.
- **Copy connection string** (`postgresql://...`).
- In your project `.env` set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require"
```

#### 2. Install Dependencies

```bash
npm install next-auth@beta @prisma/client @auth/prisma-adapter bcryptjs
npm install -D prisma
```

#### 3. Prisma Init & Schema

```bash
npx prisma init
```

In `prisma/schema.prisma`:
- `datasource db` → `provider = "postgresql"`, `url = env("DATABASE_URL")`
- Add models:
  - `User` with: `id`, `email` (unique), `password` (hashed), `name`, timestamps.
  - `Account`, `Session`, `VerificationToken` (NextAuth standard).
  - `ImageColorization` with `userId`, `colorizedAt`, optional `imageUrl` for rate limit tracking.

Push schema to Neon:

```bash
npx prisma db push
npx prisma generate
```

#### 4. Prisma Client Helper

Create `lib/prisma.ts`:
- Export a singleton `prisma = new PrismaClient()` (with the usual `globalThis` pattern for dev).

#### 5. NextAuth Core Config (Credentials Only for Now)

Create `lib/auth.ts`:
- Use `PrismaAdapter(prisma)`.
- `session.strategy = "database"`.
- Add `Credentials` provider that:
  - Looks up user by `email`.
  - Uses `bcrypt.compare` to verify `password`.
  - Returns `{ id, email, name, image }` on success.
- `callbacks.session` adds `user.id` into `session.user`.

Create `types/next-auth.d.ts`:
- Extend `Session` so `session.user.id: string` is available.

Create `app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
```

#### 6. Registration API

Create `app/api/register/route.ts`:
- Accept JSON `{ email, password, name }`.
- Validate input and check if user already exists.
- Hash password with `bcrypt.hash(...)`.
- `prisma.user.create({ data: { email, password: hashed, name } })`.
- Return success / error JSON.

#### 7. Register & Login Pages

- `app/[locale]/register/page.tsx`:
  - Client form → `fetch('/api/register', { method: 'POST', body: JSON.stringify(...), headers: { 'Content-Type': 'application/json' } })`.
- `app/[locale]/login/page.tsx`:
  - Client form → `signIn('credentials', { email, password, redirect: true, callbackUrl: '/[locale]' })`.
- Add Navbar links to `/[locale]/login` and `/[locale]/register`.

#### 8. Rate Limiting (3 Colorizations / Day)

Create `lib/rate-limit.ts`:
- `const DAILY_LIMIT = 3`.
- `checkRateLimit(userId)`:
  - Count `ImageColorization` between today 00:00 and tomorrow 00:00.
  - Return `{ allowed, remaining, total }`.
- `recordColorization(userId, imageUrl?)`:
  - Insert row in `ImageColorization`.

Update `app/api/colorize/route.ts`:
- Get session via `auth()`, require `session.user.id`.
- Call `checkRateLimit(userId)`; if not allowed → return `429` with message.
- On success, call `recordColorization(userId, imageUrl)` and include remaining/total in JSON response.

#### 9. Protect Colorize Page

- In `app/[locale]/coloriser/page.tsx` (server component wrapper):
  - Call `auth()`; if no user → `redirect('/[locale]/login')`.
  - Optionally fetch `checkRateLimit(userId)` and pass to a client component to display remaining quota.

#### 10. Later: Add Google OAuth (Preview)

When ready:
- Add `Google()` to `providers` array in `lib/auth.ts`.
- Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.
- Add a “Sign in with Google” button: `signIn('google')`.

