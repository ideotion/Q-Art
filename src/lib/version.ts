/**
 * Build stamp. `APP_VERSION` tracks package.json (bumped at release); the commit
 * is injected at build via NEXT_PUBLIC_GIT_COMMIT when available, so a diagnostics
 * bundle pins the exact code (docs/diagnostics.md §Build stamp).
 */
export const APP_VERSION = "0.0.1";
export const GIT_COMMIT: string | undefined = process.env.NEXT_PUBLIC_GIT_COMMIT || undefined;
