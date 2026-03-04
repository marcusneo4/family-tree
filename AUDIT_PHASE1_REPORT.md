# Phase 1: Visual, UI/UX, and Asset Audit Report

**Date:** March 4, 2025  
**Scope:** Images, layout, clipping, usability, dark mode consistency

---

## Summary of Issues Found

### CRITICAL

1. **Profile Photo Empty `src`** — `index.html` line 119
2. **No Image Error Handling** — Broken images show ugly icon
3. **Modal & Profile Sidebar Ignore Dark Mode** — Hardcoded white backgrounds
4. **Mobile: App Title Completely Hidden** — Users lose context at 768px

### HIGH

5. **Profile Photo Missing `alt`** — Accessibility failure
6. **Person Name Overflow** — Long names can break layout
7. **Gallery Nav Buttons Ignore Dark Mode** — Hardcoded white/gray
8. **Form Elements Hardcoded Colors** — Labels, inputs don't adapt to dark mode

### MEDIUM

9. **Duplicate CSS on `.person-placeholder`** — `cursor` and `transition` declared twice
10. **Gallery Label Contrast in Dark Mode** — `#999` on dark bg = poor contrast

### LOW (Optimization Suggestions)

11. **Lazy Loading** — Consider `loading="lazy"` for gallery images
12. **SVG `preserveAspectRatio`** — tree.svg could add explicit ratio (optional)

---

## Detailed Findings & Fixes

### Issue 1: Profile Photo Empty `src`
**File:** `index.html`  
**Problem:** `<img id="profilePhoto" src="" alt="">` — Empty `src` can cause some browsers to issue an unnecessary request or show a broken image border.  
**Impact:** Minor visual glitch, wasted request.  
**Fix:** Use `src` with a transparent 1x1 data URI or keep empty but add `style="display:none"` by default (already toggled by JS). Better: use a data URI for a transparent pixel.

### Issue 2: No Image Error Handling
**File:** `script.js`  
**Problem:** Person photos, gallery photos, and profile photos have no `onerror` handler. If a file is missing (404) or path is wrong, users see a broken image icon.  
**Impact:** Poor UX when photos fail to load.  
**Fix:** Add `onerror` handler to fall back to placeholder/initials when image fails.

### Issue 3: Modal & Profile Sidebar Ignore Dark Mode
**File:** `styles.css`  
**Problem:** `.modal-content { background-color: white }`, `.profile-sidebar { background-color: white }`, form labels `#333`, `.close` color `#000`, etc. These ignore `body.dark-mode`.  
**Impact:** Jarring white panels in dark mode; inconsistent experience.  
**Fix:** Replace hardcoded colors with CSS variables (`var(--bg-primary)`, `var(--text-primary)`).

### Issue 4: Mobile App Title Completely Hidden
**File:** `styles.css` (around line 988)  
**Problem:** `@media (max-width: 768px) { .app-title span { display: none } }` — Hides ALL title text including "Soon Family Tree 孙", leaving only the 32px tree logo.  
**Impact:** Users on mobile don't know which app they're viewing.  
**Fix:** Show shortened text like "Family Tree" or "Soon Tree" instead of hiding entirely.

### Issue 5: Profile Photo Missing `alt`
**File:** `script.js` (openProfileSidebar)  
**Problem:** When setting `profilePhoto.src = person.photo`, the `alt` attribute is never set.  
**Impact:** Screen readers and broken images lack context.  
**Fix:** Set `profilePhoto.alt = person.name` when showing a photo.

### Issue 6: Person Name Overflow
**File:** `styles.css`  
**Problem:** `.person-name` has no `overflow`, `text-overflow`, or `word-break`. Very long names could overflow the 200px card.  
**Impact:** Layout break, text clipping on small cards.  
**Fix:** Add `word-break: break-word` and `overflow-wrap: break-word` for long names.

### Issue 7: Gallery Nav Buttons Ignore Dark Mode
**File:** `styles.css`  
**Problem:** `.gallery-nav-btn` uses `background: white`, `border: 1px solid #e0e0e0`, `color: #666`.  
**Impact:** Inconsistent with dark theme.  
**Fix:** Use CSS variables.

### Issue 8: Form Elements Hardcoded Colors
**File:** `styles.css`  
**Problem:** Modal and profile form labels, inputs, titles use `#333`, `#666`, `#e0e0e0`.  
**Impact:** Dark mode forms remain light-themed.  
**Fix:** Use `var(--text-primary)`, `var(--border-color)`, etc.

### Issue 9: Duplicate CSS on `.person-placeholder`
**File:** `styles.css`  
**Problem:** `cursor: pointer` and `transition: all 0.3s ease` appear twice in the same rule.  
**Impact:** Code cleanliness only.  
**Fix:** Remove duplicates.

### Issue 10: Gallery Label Contrast in Dark Mode
**File:** `styles.css`  
**Problem:** `.gallery-label { color: #999 }` — No dark-mode override.  
**Impact:** Low contrast on dark background.  
**Fix:** Use `var(--text-tertiary)`.

---

## Files Modified (Applied)

- `index.html` — Profile photo: transparent 1x1 data URI + initial display:none
- `styles.css` — Dark mode (modal, profile sidebar, gallery, forms), overflow (person-name), mobile title fix, duplicate CSS removed, gallery label/scrollbar
- `script.js` — Image error handling (person cards, profile, gallery), profile photo alt, loading="lazy", handlePhotoError()
