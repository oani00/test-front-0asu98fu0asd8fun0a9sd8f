# LLM Quick Reference – Plataforma de Excursões Locais

**Read this first.** For full design, architecture, and API details, see [design.md](./design.md).

## Summary

Angular 17 web app connecting local tour operators (microempresas) with travelers. Users browse and subscribe to excursions (passeios/viagens); admins manage excursions and users. Auth via localStorage; backend at `http://localhost:3000` (Node.js + Express + MongoDB).

## Key File Paths

| Purpose | Path |
|--------|------|
| Routes | `src/app/app.routes.ts` |
| Data models | `src/app/models/excursion.ts` |
| Excursion CRUD & API | `src/app/services/excursion.service.ts` |
| Auth (login) | `src/app/services/login.service.ts` |
| Sign-up | `src/app/services/sign-up.service.ts` |
| Admin operations | `src/app/services/admin.service.ts` |
| Avatar / profile picture | `src/app/services/avatar.service.ts` |
| Navbar | `src/app/components/navbar/` |
| Global styles | `src/styles.css` |
| Environment config | `src/environments/environment.ts` |

## Pages (route components)

| Route | Component | Path |
|-------|-----------|------|
| `/initial` | Landing | `src/app/pages/initial-page/` |
| `/login` | Login | `src/app/pages/login/` |
| `/sign-up` | Registration | `src/app/pages/sign-up/` |
| `/menu-general` | Catalog (passeios/viagens) | `src/app/pages/menu-general/` |
| `/excursion-detail/:id` | Excursion details | `src/app/pages/excursion-detail/` |
| `/user` | User profile, avatar, subscriptions | `src/app/pages/user/` |
| `/admin` | Admin CRUD | `src/app/pages/admin/` |
| `/support` | Support | `src/app/pages/support/` |

## Task → Files

| Task | Look at |
|------|---------|
| Auth, login flow | `login.service.ts`, `login.component.ts` |
| User registration | `sign-up.service.ts`, `sign-up.component.ts` |
| Excursion list, filters | `excursion.service.ts`, `menu-general.component.ts` |
| Excursion details, subscribe | `excursion.service.ts`, `excursion-detail.component.ts` |
| Avatar, profile picture | `avatar.service.ts`, `user.component.ts`, `navbar.component.ts` |
| Admin CRUD | `admin.service.ts`, `admin-page.component.ts` |
| Navigation, layout | `navbar.component.ts`, `app.component.ts` |
| Data shapes | `models/excursion.ts` |

## Conventions

- **Standalone components** (no NgModules)
- **Bootstrap 5.3** + ng-bootstrap for UI
- **RxJS** for reactive flows
- **localStorage** for current user (until JWT)
- **User types**: `'user'` (regular) vs `'admin'`

## Quick Start

```bash
npm install
ng serve          # Frontend at http://localhost:4200
# Backend must run separately at http://localhost:3000
```
