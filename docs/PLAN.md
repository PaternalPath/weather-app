# Fortune-500 Quality Upgrade Plan

## Current State Audit

### Framework

- **Next.js**: 16.1.1 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5
- **Tailwind CSS**: 4

### Current Scripts

| Script    | Command      | Status       |
| --------- | ------------ | ------------ |
| dev       | `next dev`   | ✅ Works     |
| build     | `next build` | ✅ Works     |
| start     | `next start` | ✅ Works     |
| lint      | `eslint`     | ✅ Works     |
| typecheck | ❌ Missing   | Needs adding |
| test      | ❌ Missing   | Needs adding |

### Current API Approach

- **Client-only**: UI calls Open-Meteo API directly from browser
- **Provider**: Open-Meteo (free, no API key required)
- **Caching**: 10-minute localStorage cache
- **Demo data**: Pre-seeded locations only (no demo weather provider)

### Known Issues

1. No `typecheck` script
2. No `test` script
3. No test framework configured (no Vitest/Jest)
4. No Playwright for E2E tests
5. No server API route - client calls external API directly
6. No demo weather provider (just demo locations)
7. No `.env.example` file
8. No Prettier config (package installed but not configured)
9. No CI/CD pipeline
10. No rate limiting or abuse protection

### What's Already Good

- Clean component architecture
- TypeScript strict mode enabled
- Tailwind v4 properly configured
- Good error/loading/empty states exist
- Mobile-first layout implemented
- Accessibility basics present (ARIA labels, focus states)
- Comprehensive ARCHITECTURE.md exists

---

## Implementation Plan

### Step 1: Standardize Scripts and Tooling

- [x] Add `typecheck` script (`tsc --noEmit`)
- [x] Add `test` script (Vitest)
- [x] Add `.nvmrc` with Node 20 LTS
- [x] Add Prettier config (`.prettierrc`)
- [x] Format all files

### Step 2: Weather Provider Architecture

- [x] Create provider interface: `src/lib/weather/provider.ts`
- [x] Create Open-Meteo provider: `src/lib/weather/providers/open-meteo.ts`
- [x] Create demo provider: `src/lib/weather/providers/demo.ts`
- [x] Create server route: `src/app/api/weather/route.ts`
- [x] Add Zod schemas for request/response validation
- [x] Update UI to call `/api/weather` instead of direct API calls

### Step 3: Caching + Reliability

- [x] Implement server-side in-memory cache with TTL
- [x] Add simple rate limiting (IP-based)
- [x] Add request timeout handling
- [x] Return structured error JSON with user-friendly messages

### Step 4: UI Polish

- [x] Add input clear button to search
- [x] Add recent searches (localStorage, limit 5)
- [x] Add C/F toggle in header (already exists in settings)
- [x] Verify accessibility: labels, aria-labels, focus states
- [x] Minor typography/spacing improvements if needed

### Step 5: Tests

- [x] Configure Vitest
- [x] Unit tests: Zod validation schemas
- [x] Unit tests: Demo provider returns expected shape
- [x] Unit tests: Cache behavior
- [x] Configure Playwright
- [x] E2E test: Home page loads
- [x] E2E test: Search demo location works
- [x] E2E test: Error state displays correctly

### Step 6: CI + Docs + Vercel

- [x] Create GitHub Actions workflow (lint, typecheck, test, build)
- [x] Update README.md with screenshots/GIF placeholder, setup instructions
- [x] Update docs/architecture.md with new data flow
- [x] Create `.env.example`
- [x] Final verification: all scripts pass on clean install

---

## Verification Checklist

```bash
# All must pass on clean machine:
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

## Deliverables

- PR-ready branch with all changes
- Professional README
- Working CI/CD
- Demo mode that works without API keys
