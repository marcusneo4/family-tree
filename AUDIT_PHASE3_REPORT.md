# Phase 3: Backend & API Stability Report

**Date:** March 4, 2025  
**Scope:** Static servers, data persistence, integrity

---

## Architecture Note

This app has **no traditional backend API**. It uses:
- **server.js** (Node) or **server.py** (Python) — static file servers only
- **localStorage** — all family data persisted client-side
- No database, no REST endpoints

---

## Issues Found and Fixes Applied

### server.js

| Issue | Severity | Fix |
|-------|----------|-----|
| **Path traversal** | High | Resolve path with `path.resolve()`, ensure `resolvedPath.startsWith(ROOT_DIR)` before serving; reject with 403 if outside root |
| **Binary files sent as utf-8** | Medium | Detect binary MIME types; pass `undefined` (Buffer) instead of `'utf-8'` for images |
| **Incorrect `.jpg` MIME** | Low | Changed to `image/jpeg`; added `.jpeg` |
| **500 error exposes internals** | Low | Return generic "500 - Server Error"; log details to console only |
| **URL parsing** | — | Use `URL` for safe pathname extraction; strip query/hash |

### server.py

| Issue | Severity | Fix |
|-------|----------|-----|
| **Bare `except`** | Medium | Replaced with `except OSError` (typical for webbrowser.open) |
| **Misleading CORS comment** | Low | Updated to describe actual Cache-Control behavior |

### script.js (Data Layer)

| Issue | Severity | Fix |
|-------|----------|-----|
| **saveData: no QuotaExceededError** | Medium | Wrapped in try/catch; show user toast when storage is full |
| **loadData: weak structure validation** | Medium | Added `isValidFamilyData()` to check generations/couples/people shape |
| **toggleDarkMode: no try/catch** | Low | Wrapped `localStorage.setItem` in try/catch |
| **openStatsModal/closeStatsModal** | Low | Null check for modal before `classList` |

---

## Files Modified

- `server.js` — Path safety, binary handling, MIME, error messages
- `server.py` — Exception handling, comment fix
- `script.js` — `saveData` QuotaExceededError, `isValidFamilyData()`, dark mode, stats modal

---

## Unchanged (By Design)

- **samplePhotos** — Unused constant; left as-is (dead code)
- **CDN SRI** — No subresource integrity hashes; optional future improvement
- **Python path traversal** — `SimpleHTTPRequestHandler` with `directory=` restricts to project dir
