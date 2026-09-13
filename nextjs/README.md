<<<<<<< HEAD
# Almajrah — Next.js + Tailwind CSS

Complete frontend application rebuilt with Tailwind CSS utilities.

## Structure

```text
almajrah/
├── app/
│   ├── (website)/
│   │   ├── page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── industries/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── company/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── blog/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── home/
│   ├── layout/
│   ├── shared/
│   └── admin/
├── lib/
├── public/
├── tailwind.config.ts
├── postcss.config.js
└── package.json
```

## Important

`app/globals.css` contains only the three Tailwind directives. Page/component styling is written with Tailwind utility classes. Animations are defined in `tailwind.config.ts` and consumed through Tailwind classes.

The approved home hero keeps:

- 3 synchronized hero slides
- cosmic globe/orbit scene
- ERP image scene
- mobile/app image scene
- title typing animation
- description typing after title
- parallax motion
- English/Arabic language switch
- LTR/RTL support
- technology marquee
- scroll reveal effects

## Run

```powershell
npm install
npm run dev
```

Website:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin
```

## NestJS API

Set the future API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

The NestJS backend can remain a separate backend project and connect to this frontend through the API URL above.
=======
# almajrah
>>>>>>> 9f40dbe3fda3a402a819d6a6058e5ef7b1aada00
