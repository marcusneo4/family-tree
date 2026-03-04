# Phase 2: Frontend Functional Testing & Debugging Report

**Date:** March 4, 2025  
**Scope:** Interactive components, state management, error handling

---

## Summary of Issues Found and Fixes Applied

### 1. **Null/Undefined DOM Access**

| Location | Issue | Fix |
|----------|-------|-----|
| `setupEventListeners` | `closeBtn`, `cancelBtn`, `form` used without null checks | Wrapped in `if (el)` before assigning handlers |
| `setupEventListeners` | `galleryPrevBtn`, `galleryNextBtn` | Added null check; `gallery.scrollBy` guarded |
| `setupEventListeners` | `exportMenu` in document click handler | Added `if (exportMenu)` before `classList.remove` |
| `setupEventListeners` | `exportBtn.onclick` toggles `exportMenu` | Guarded with `if (exportBtn && exportMenu)` |
| `openModal` | `relationField = getElementById('relation').closest(...)` | Safe access: `relationEl ? relationEl.closest(...) : null` |
| `openModalForAddChild` | Same for relation field | Same safe access |
| `openModalForAddSpouse` | Same for relation field | Same safe access |
| `drawConnectionLines` | `svg`, `treeContainer`, `treeElement` | Early return if any are null |
| `setupPanAndZoom` | `treeWrapper`, `treeContainer` | Early return if null |
| `closeModal` | `modal.style.display` | `if (modal)` guard |
| `closeProfileSidebar` | `profileSidebar.classList` | `if (profileSidebar)` guard |
| `filterTree` | `card.querySelector('.person-name')` | Optional chaining `nameEl?.textContent` |

### 2. **Form Validation & Error Handling**

| Location | Issue | Fix |
|----------|-------|-----|
| `saveMember` | Empty name could pass (e.g. spaces only) | Trim + validation; show error toast, focus input |
| `saveMember` | Add child: `findGenerationAndCoupleIndex` returns null | Show user-friendly error toast |
| `saveMember` | Add spouse: same | Same |
| `saveMember` | Edit: invalid `editId` or person not found | Validation + error toasts |
| `saveMember` | `Math.max(...[])` = -Infinity → broken newId | Added `getNextPersonId()` helper |
| `saveProfileFromSidebar` | Empty first+last name | Validate fullName; show error if empty |
| `saveProfileFromSidebar` | Invalid/missing personId | Early validation + error toasts |
| `openModalForAddChild` | Invalid parentId | Validate before opening; show error |
| `openModalForAddSpouse` | Person not found | Validate before opening; show error |

### 3. **Edge Cases & Robustness**

| Location | Issue | Fix |
|----------|-------|-----|
| `editPerson` | `closest('.person-card')` could return null | Null check before parse + `editPerson` |
| `editPerson` | Invalid personId (NaN) | Parse and validate before calling |
| `openProfileSidebar` | Invalid personId (NaN, string) | Parse and validate at entry |
| `openProfileSidebar` | Missing DOM elements | Early return with error toast |
| `window.onclick` | `event.target == modal` (loose equality) | Changed to `event.target === modal` |
| Fullscreen | Icon not updated when user exits via Escape | Added `fullscreenchange` listener |
| Fullscreen | `requestFullscreen` error only in console | Replaced with `showToast` for user feedback |

### 4. **Safe ID Generation**

- **Issue:** `Math.max(...getAllPeople().map(p => p.id), 0)` when no people returns `-Infinity`, so `newId` could be invalid.
- **Fix:** New `getNextPersonId()` filters valid numeric IDs and returns `1` when the list is empty.

### 5. **Optional Chaining**

- `filterTree`: `card.querySelector('.person-name')` → `(nameEl?.textContent || '').toLowerCase()` to avoid TypeError when `.person-name` is missing.

---

## Files Modified

- `script.js` — All Phase 2 changes

---

## Testing Recommendations

1. **Add Child:** Open profile → Add Child → Submit with empty name → expect error toast.
2. **Add Spouse:** Same flow with invalid/missing person.
3. **Profile Save:** Clear first and last name, save → expect error toast.
4. **Gallery:** Remove `#photoGallery` from DOM (via dev tools) → click prev/next → no crash.
5. **Fullscreen:** Enter fullscreen, press Escape → icon should switch back to expand.
6. **New ID:** With empty `getAllPeople()`, add member → newId should be 1.
