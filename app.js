/**
 * Family Tree – app: state, views, sheets. Needs core.js loaded first.
 */
'use strict';

const SETTINGS_KEY = 'familyTreeSettings';
const DEFAULT_SETTINGS = { meId: null, meSkipped: false, theme: 'auto', showPhotos: false, view: 'family', quizBest: 0 };

const state = {
    view: 'family',
    focusId: null,
    query: '',
    filter: 'all',        // 'all' | 'bloodline' | 'gen:N'
    branch: 'all',
    sort: 'tree',         // 'tree' | 'name'
    treeScope: 'all',     // 'all' | branch key
    collapsed: new Set(),
    settings: Object.assign({}, DEFAULT_SETTINGS),
    dirty: new Set(['family', 'people', 'tree'])
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Settings ---------- */

function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) Object.assign(state.settings, JSON.parse(raw));
        else if (localStorage.getItem('darkMode') === 'true') state.settings.theme = 'dark'; // from the old app
    } catch (err) { /* private mode or corrupt value: keep defaults */ }
}

function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings)); } catch (err) { /* ignore */ }
}

function applyTheme() {
    const theme = state.settings.theme;
    document.documentElement.dataset.theme = theme;
    const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#121715' : '#EEF1EC';
}

/* ---------- Icons (inline, so the app works offline) ---------- */

const ICONS = {
    family: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14.2c2.6.1 4.5 1.8 4.5 4.3"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    tree: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18"/><path d="M6.5 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    more: '<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    share: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 13v6h14v-6"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    chevron: '<path d="M9 5l7 7-7 7"/>',
    down: '<path d="M5 9l7 7 7-7"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    download: '<path d="M12 4v11M8 11l4 4 4-4"/><path d="M5 19h14"/>',
    upload: '<path d="M12 16V5M8 9l4-4 4 4"/><path d="M5 19h14"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M12 9v11M4 13h16"/><path d="M12 9c-3 0-4-4-1.5-4S12 9 12 9zm0 0c3 0 4-4 1.5-4S12 9 12 9z"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
    chart: '<path d="M5 20V10M12 20V4M19 20v-8"/>',
    print: '<path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><rect x="7" y="14" width="10" height="6"/>',
    trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
    addchild: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20c0-3.6 2.8-6 6.5-6"/><path d="M18 14v6M15 17h6"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    focus: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>',
    images: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>'
};

function icon(name) {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
}

/* ---------- Small view helpers ---------- */

function avatar(person, size = 'md') {
    const cls = `avatar avatar-${size}${person.passedOn ? ' is-past' : ''}`;
    const initials = escapeHtml(getInitials(person.name));
    const photo = sanitizePhotoUrl(person.photo);
    if (state.settings.showPhotos && photo) {
        return `<span class="${cls}"><img src="${escapeHtml(photo)}" alt="" loading="lazy" decoding="async" data-initials="${initials}"></span>`;
    }
    return `<span class="${cls}"><span class="avatar-initials" aria-hidden="true">${initials}</span></span>`;
}

// A photo that fails to load falls back to initials instead of a broken-image icon.
document.addEventListener('error', ev => {
    const img = ev.target;
    if (!(img instanceof HTMLImageElement) || !img.closest('.avatar')) return;
    const span = document.createElement('span');
    span.className = 'avatar-initials';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = img.dataset.initials || '?';
    img.replaceWith(span);
}, true);

function sealHtml(label = 'Soon bloodline') {
    return `<span class="seal" role="img" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">孙</span>`;
}

function displayName(person) {
    return escapeHtml(person.name || 'Unnamed');
}

function relationFor(person) {
    const meId = state.settings.meId;
    if (!meId || !findPersonById(meId)) return null;
    return describeRelation(meId, person.id);
}

function relationLine(person) {
    const rel = relationFor(person);
    if (!rel || rel.kind === 'none') return '';
    return rel.title;
}

function genLabel(index) {
    return `Generation ${index + 1}`;
}

/* ---------- Toasts ---------- */

let toastTimer = null;

function showToast(message, options = {}) {
    const host = $('#toast');
    if (!host) return;
    clearTimeout(toastTimer);
    host.className = `toast${options.type === 'error' ? ' is-error' : ''}`;
    host.innerHTML = `<span class="toast-text">${escapeHtml(message)}</span>`;
    if (options.action) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toast-action';
        btn.textContent = options.action.label;
        btn.addEventListener('click', () => { hideToast(); options.action.run(); });
        host.appendChild(btn);
    }
    try {
        if (host.matches(':popover-open')) host.hidePopover();
        host.showPopover();
    } catch (err) { host.style.display = 'flex'; }
    toastTimer = setTimeout(hideToast, options.duration || (options.action ? 7000 : 3500));
}

function hideToast() {
    const host = $('#toast');
    if (!host) return;
    try { if (host.matches(':popover-open')) host.hidePopover(); } catch (err) { /* ignore */ }
    host.style.display = '';
}

/* ---------- Saving, undo ---------- */

function persist() {
    const result = saveFamilyData(localStorage);
    if (!result.ok) {
        showToast(result.quota
            ? 'Storage is full, so this change was not saved. Remove a photo or back up and clear old data.'
            : 'Could not save on this device.', { type: 'error', duration: 6000 });
    }
    return result.ok;
}

function markAllDirty() { ['family', 'people', 'tree'].forEach(v => state.dirty.add(v)); }

/**
 * Run a change to the family data with undo.
 * @param {string} message shown after the change, with an Undo button
 * @param {() => void} change
 */
function mutate(message, change) {
    const before = JSON.stringify(familyData);
    change();
    persist();
    markAllDirty();
    renderCurrent();
    showToast(message, {
        action: {
            label: 'Undo',
            run: () => {
                setFamilyData(JSON.parse(before));
                persist();
                markAllDirty();
                if (!findPersonById(state.focusId)) state.focusId = null;
                renderCurrent();
                showToast('Change undone');
            }
        }
    });
}

/* =====================================================================
 * Navigation
 * ===================================================================== */

const VIEWS = ['family', 'people', 'tree'];

function setView(view, options = {}) {
    if (!VIEWS.includes(view)) view = 'family';
    state.view = view;
    state.settings.view = view;
    saveSettings();
    VIEWS.forEach(v => {
        const section = $(`#view-${v}`);
        if (section) section.hidden = v !== view;
    });
    $$('.tab').forEach(tab => {
        const active = tab.dataset.view === view;
        tab.classList.toggle('is-active', active);
        if (active) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current');
    });
    renderCurrent();
    if (options.updateHash !== false) writeHash(options.replace);
    const heading = $(`#view-${view} h1, #view-${view} [data-focus-target]`);
    if (options.focusHeading && heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
}

function writeHash(replace) {
    let hash = `#${state.view}`;
    if (state.view === 'family' && state.focusId != null) hash = `#family/${state.focusId}`;
    if (state.view === 'tree' && state.treeScope !== 'all') hash = `#tree/${state.treeScope}`;
    if (location.hash === hash) return;
    try {
        history[replace ? 'replaceState' : 'pushState'](null, '', hash);
    } catch (err) { /* file:// in some browsers */ }
}

function readHash() {
    const [view, arg] = location.hash.replace(/^#/, '').split('/');
    if (view === 'p' && arg) {
        const id = parseInt(arg, 10);
        if (findPersonById(id)) return { view: 'family', focusId: id, openProfile: id };
    }
    if (view === 'family') {
        const id = parseInt(arg, 10);
        return { view: 'family', focusId: findPersonById(id) ? id : null };
    }
    if (view === 'tree') return { view: 'tree', treeScope: arg || 'all' };
    if (view === 'people') return { view: 'people' };
    return null;
}

function focusPerson(id, options = {}) {
    if (!findPersonById(id)) return;
    state.focusId = id;
    state.dirty.add('family');
    if (state.view !== 'family') setView('family', options);
    else { renderCurrent(); writeHash(options.replace); }
    const main = $('#main');
    if (main) main.scrollTo ? main.scrollTo({ top: 0 }) : (main.scrollTop = 0);
    window.scrollTo(0, 0);
}

function renderCurrent() {
    renderHeader();
    if (!state.dirty.has(state.view)) return;
    state.dirty.delete(state.view);
    if (state.view === 'family') renderFamily();
    else if (state.view === 'people') renderPeople();
    else if (state.view === 'tree') renderTree();
}

function renderHeader() {
    const btn = $('#photosBtn');
    if (btn) {
        const on = state.settings.showPhotos;
        btn.setAttribute('aria-pressed', String(on));
        btn.innerHTML = `${icon(on ? 'eye' : 'eyeoff')}<span class="btn-label">Photos ${on ? 'on' : 'off'}</span>`;
    }
}

/* =====================================================================
 * Family view: one person at the centre
 * ===================================================================== */

function defaultFocusId() {
    const me = state.settings.meId;
    if (me && findPersonById(me)) return me;
    const first = familyData.generations?.[0]?.couples?.[0]?.people?.[0];
    return first ? first.id : (getAllPeople()[0] || {}).id;
}

function tile(person, subOverride) {
    const sub = subOverride !== undefined ? subOverride : (relationLine(person) || getLifeSummary(person));
    return `<button type="button" class="tile${person.passedOn ? ' is-past' : ''}" data-focus="${person.id}">
        ${avatar(person, 'md')}
        <span class="tile-name">${displayName(person)}</span>
        ${sub ? `<span class="tile-sub">${escapeHtml(sub)}</span>` : ''}
    </button>`;
}

function partnerLabel(status) {
    if (status === 'dating') return 'Dating';
    if (status === 'bf_gf') return 'Partner';
    return 'Married to';
}

function renderFamily() {
    const host = $('#view-family');
    if (!findPersonById(state.focusId)) state.focusId = defaultFocusId();
    const p = findPersonById(state.focusId);
    if (!p) { host.innerHTML = '<p class="empty">No one is in the tree yet.</p>'; return; }

    const meId = state.settings.meId;
    const rel = relationFor(p);
    const parents = findParentsOfPerson(p.id);
    const spouse = getSpouse(p.id);
    const siblings = getSiblings(p.id);
    const kids = getChildrenOfPerson(p.id);
    const isBlood = computeBloodlineIdSet().has(p.id);
    const life = getLifeSummary(p);
    const status = getEffectiveRelationshipStatus(p);

    let relationHtml = '';
    if (meId === p.id) relationHtml = '<p class="focus-relation"><strong>This is you</strong></p>';
    else if (rel && rel.kind !== 'none') {
        const term = rel.term ? `<span class="term" lang="zh-Hans">${escapeHtml(rel.term)}</span>${rel.pinyin ? ` <span class="pinyin">${escapeHtml(rel.pinyin)}</span>` : ''}` : '';
        relationHtml = `<p class="focus-relation"><strong>Your ${escapeHtml(rel.title.toLowerCase())}</strong>${rel.detail ? `<span class="muted"> · ${escapeHtml(rel.detail)}</span>` : ''}${term ? `<span class="term-line">${term}</span>` : ''}</p>`;
    } else if (!meId) {
        relationHtml = '<p class="focus-relation"><button type="button" class="link-btn" data-act="pick-me">Choose who you are</button> to see how everyone is related to you.</p>';
    }

    let html = '';
    if (parents.length) {
        html += `<section class="group" aria-labelledby="g-parents"><h2 id="g-parents" class="group-title">Parents</h2><div class="tiles">${parents.map(x => tile(x)).join('')}</div></section>`;
    }

    html += `<article class="focus-card${p.passedOn ? ' is-past' : ''}" aria-labelledby="focus-name">
        <div class="focus-top">
            ${avatar(p, 'xl')}
            <div class="focus-id">
                <h1 id="focus-name" class="focus-name" data-focus-target>${displayName(p)}</h1>
                ${p.chineseName ? `<p class="focus-zh" lang="zh-Hans">${escapeHtml(p.chineseName)}</p>` : ''}
                <p class="focus-meta">${[genLabel(getGenerationIndex(p.id)), life, p.passedOn ? 'Passed on' : ''].filter(Boolean).map(escapeHtml).join(' · ')}</p>
            </div>
            ${isBlood ? sealHtml() : ''}
        </div>
        ${relationHtml}
        ${spouse ? `<div class="partner"><span class="partner-label">${escapeHtml(partnerLabel(status))}</span>${tile(spouse)}</div>` : ''}
        <div class="focus-actions">
            <button type="button" class="btn btn-primary" data-act="open" data-id="${p.id}">${icon('user')}Open profile</button>
            <button type="button" class="btn" data-act="add-child" data-id="${p.id}">${icon('addchild')}Add child</button>
            ${meId && meId !== p.id ? `<button type="button" class="btn btn-quiet" data-focus="${meId}">${icon('focus')}Back to me</button>` : ''}
        </div>
    </article>`;

    if (siblings.length) {
        html += `<section class="group" aria-labelledby="g-sibs"><h2 id="g-sibs" class="group-title">Brothers and sisters <span class="count">${siblings.length}</span></h2><div class="tiles tiles-scroll">${siblings.map(x => tile(x)).join('')}</div></section>`;
    }
    if (kids.length) {
        html += `<section class="group" aria-labelledby="g-kids"><h2 id="g-kids" class="group-title">Children <span class="count">${kids.length}</span></h2><div class="tiles">${kids.map(x => tile(x)).join('')}</div></section>`;
    } else {
        html += `<section class="group"><h2 class="group-title">Children</h2><p class="empty-line">No children listed.</p></section>`;
    }
    host.innerHTML = html;
}

/* =====================================================================
 * People view: search and filter
 * ===================================================================== */

function personMatchesQuery(person, q) {
    if (!q) return true;
    const hay = [person.name, person.chineseName, person.nickname].filter(Boolean).join(' ').toLowerCase();
    return q.split(/\s+/).every(part => hay.includes(part));
}

function renderPeopleControls() {
    const bloodline = computeBloodlineIdSet();
    const gens = familyData.generations.length;
    const chips = [{ id: 'all', label: 'Everyone' }, { id: 'bloodline', label: 'Soon bloodline' }];
    for (let i = 0; i < gens; i++) chips.push({ id: `gen:${i}`, label: `Gen ${i + 1}` });
    $('#peopleChips').innerHTML = chips.map(c =>
        `<button type="button" class="chip${state.filter === c.id ? ' is-active' : ''}" data-filter="${c.id}" aria-pressed="${state.filter === c.id}">${escapeHtml(c.label)}</button>`).join('');
    const sel = $('#branchSelect');
    sel.innerHTML = '<option value="all">All branches</option>' + getBranches().map(b =>
        `<option value="${escapeHtml(b.key)}"${state.branch === b.key ? ' selected' : ''}>${escapeHtml(b.label)}’s branch</option>`).join('');
    $$('#sortToggle [data-sort]').forEach(btn => {
        const on = btn.dataset.sort === state.sort;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', String(on));
    });
    return bloodline;
}

function renderPeople() {
    const bloodline = renderPeopleControls();
    const q = state.query.trim().toLowerCase();
    const branch = state.branch === 'all' ? null : getBranches().find(b => b.key === state.branch);
    let people = getTreeOrderedPeople().filter(p => {
        if (!personMatchesQuery(p, q)) return false;
        if (state.filter === 'bloodline' && !bloodline.has(p.id)) return false;
        if (state.filter.startsWith('gen:') && getGenerationIndex(p.id) !== parseInt(state.filter.slice(4), 10)) return false;
        if (branch && !branch.ids.has(p.id)) return false;
        return true;
    });
    if (state.sort === 'name') people = people.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const list = $('#peopleList');
    const status = $('#peopleStatus');
    status.textContent = people.length === 1 ? '1 person' : `${people.length} people`;

    if (!people.length) {
        list.innerHTML = `<li class="empty"><p>No one matches “${escapeHtml(state.query.trim())}”.</p><button type="button" class="btn" data-act="clear-filters">Clear search and filters</button></li>`;
        return;
    }

    let html = '';
    let lastLetter = '';
    people.forEach(p => {
        if (state.sort === 'name') {
            const letter = (p.name || '?')[0].toUpperCase();
            if (letter !== lastLetter) { html += `<li class="letter" aria-hidden="true">${escapeHtml(letter)}</li>`; lastLetter = letter; }
        }
        const rel = relationFor(p);
        const sub = [rel && rel.kind !== 'none' ? rel.title : '', rel && rel.term ? rel.term : ''].filter(Boolean).join(' · ');
        html += `<li><button type="button" class="row${p.passedOn ? ' is-past' : ''}" data-act="open" data-id="${p.id}">
            ${avatar(p, 'md')}
            <span class="row-main"><span class="row-name">${displayName(p)}${p.chineseName ? ` <span class="row-zh" lang="zh-Hans">${escapeHtml(p.chineseName)}</span>` : ''}</span>
            <span class="row-sub">${escapeHtml(sub || genLabel(getGenerationIndex(p.id)))}</span></span>
            <span class="row-end">${escapeHtml(getLifeSummary(p))}</span>
        </button></li>`;
    });
    list.innerHTML = html;
}

/* =====================================================================
 * Tree view: pan, zoom, fold branches
 * ===================================================================== */

const TREE_MIN_SCALE = 0.25;
const TREE_MAX_SCALE = 2;
const tv = { x: 0, y: 0, scale: 1, moved: false, pointers: new Map(), pinchDist: 0, pinchScale: 1 };

function countBelow(couple) {
    return getDescendantCouples(couple).reduce((n, c) => n + c.people.length, 0);
}

function treeCard(person, bloodline) {
    const life = getLifeSummary(person);
    return `<button type="button" class="t-card${person.passedOn ? ' is-past' : ''}${bloodline.has(person.id) ? ' is-blood' : ''}" data-act="open" data-id="${person.id}">
        ${avatar(person, 'sm')}
        <span class="t-name">${displayName(person)}</span>
        ${life ? `<span class="t-sub">${escapeHtml(life)}</span>` : ''}
    </button>`;
}

function treeNode(couple, bloodline) {
    const key = coupleKey(couple);
    const kids = getChildCouples(couple);
    const folded = state.collapsed.has(key);
    let html = `<div class="t-node"><div class="t-couple${couple.people.length > 1 ? ' is-pair' : ''}">${couple.people.map(p => treeCard(p, bloodline)).join('')}</div>`;
    if (kids.length) {
        const label = `${folded ? 'Show' : 'Hide'} ${countBelow(couple)} below ${couple.people.map(p => p.name).join(' and ')}`;
        html += `<button type="button" class="t-fold${folded ? ' is-folded' : ''}" data-fold="${escapeHtml(key)}" aria-expanded="${!folded}" aria-label="${escapeHtml(label)}">${folded ? `+${countBelow(couple)}` : icon('minus')}</button>`;
        if (!folded) html += `<div class="t-children">${kids.map(c => `<div class="t-branch">${treeNode(c, bloodline)}</div>`).join('')}</div>`;
    }
    return html + '</div>';
}

function initCollapsedFor(scope) {
    state.collapsed = new Set();
    if (scope !== 'all') return;
    // Show the founders and their children; fold everything further down.
    getTreeRoots().forEach(root => getChildCouples(root).forEach(c => {
        if (getChildCouples(c).length) state.collapsed.add(coupleKey(c));
    }));
}

function renderTreeChips() {
    const chips = [{ key: 'all', label: 'Everyone' }].concat(getBranches().map(b => ({ key: b.key, label: b.label })));
    $('#treeChips').innerHTML = chips.map(c =>
        `<button type="button" class="chip${state.treeScope === c.key ? ' is-active' : ''}" data-tree-scope="${escapeHtml(c.key)}" aria-pressed="${state.treeScope === c.key}">${escapeHtml(c.label)}</button>`).join('');
}

function buildTreeHtml() {
    const bloodline = computeBloodlineIdSet();
    let roots = getTreeRoots();
    let from = '';
    if (state.treeScope !== 'all') {
        const branch = getBranches().find(b => b.key === state.treeScope);
        if (branch) {
            roots = [branch.couple];
            const parents = getParentCouple(branch.link.id);
            if (parents) from = `<p class="t-from">Children of ${parents.people.map(p => displayName(p)).join(' and ')}</p>`;
        } else {
            state.treeScope = 'all';
        }
    }
    return from + roots.map(r => treeNode(r, bloodline)).join('');
}

/** @param {boolean} [keepView] keep the current pan and zoom (used when folding a branch) */
function renderTree(keepView = false) {
    renderTreeChips();
    $('#treeCanvas').innerHTML = buildTreeHtml();
    if (keepView) applyTreeTransform();
    else requestAnimationFrame(fitTree);
}

function applyTreeTransform() {
    const canvas = $('#treeCanvas');
    if (canvas) canvas.style.transform = `translate(${tv.x}px, ${tv.y}px) scale(${tv.scale})`;
}

function fitTree() {
    const stage = $('#treeStage'), canvas = $('#treeCanvas');
    if (!stage || !canvas || !stage.clientWidth) return;
    canvas.style.transform = 'none';
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    const sw = stage.clientWidth, sh = stage.clientHeight;
    const fit = Math.min(1, (sw - 24) / w, (sh - 24) / h);
    tv.scale = Math.max(fit, state.treeScope === 'all' ? 0.45 : 0.35);
    const firstCouple = canvas.querySelector('.t-couple');
    let centreX = w / 2;
    if (firstCouple) centreX = firstCouple.offsetLeft + firstCouple.offsetWidth / 2;
    const scaledW = w * tv.scale;
    tv.x = scaledW <= sw ? (sw - scaledW) / 2 : sw / 2 - centreX * tv.scale;
    tv.y = 12;
    applyTreeTransform();
}

function zoomTreeAt(clientX, clientY, factor) {
    const stage = $('#treeStage');
    const rect = stage.getBoundingClientRect();
    const px = clientX - rect.left, py = clientY - rect.top;
    const next = Math.min(TREE_MAX_SCALE, Math.max(TREE_MIN_SCALE, tv.scale * factor));
    const ratio = next / tv.scale;
    tv.x = px - (px - tv.x) * ratio;
    tv.y = py - (py - tv.y) * ratio;
    tv.scale = next;
    applyTreeTransform();
}

function zoomTreeCentre(factor) {
    const rect = $('#treeStage').getBoundingClientRect();
    zoomTreeAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
}

function setupTreeGestures() {
    const stage = $('#treeStage');
    if (!stage) return;
    let drag = null;

    stage.addEventListener('pointerdown', ev => {
        if (ev.pointerType === 'mouse' && ev.button !== 0) return;
        tv.pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
        tv.moved = false;
        if (tv.pointers.size === 1) drag = { x: ev.clientX, y: ev.clientY, startX: ev.clientX, startY: ev.clientY, tx: tv.x, ty: tv.y };
        if (tv.pointers.size === 2) {
            const [a, b] = Array.from(tv.pointers.values());
            tv.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
            tv.pinchScale = tv.scale;
            drag = null;
        }
    });

    window.addEventListener('pointermove', ev => {
        if (!tv.pointers.has(ev.pointerId)) return;
        tv.pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
        if (tv.pointers.size === 2) {
            const [a, b] = Array.from(tv.pointers.values());
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (tv.pinchDist > 0) {
                const target = Math.min(TREE_MAX_SCALE, Math.max(TREE_MIN_SCALE, tv.pinchScale * dist / tv.pinchDist));
                zoomTreeAt((a.x + b.x) / 2, (a.y + b.y) / 2, target / tv.scale);
            }
            tv.moved = true;
            return;
        }
        if (!drag) return;
        const dx = ev.clientX - drag.startX, dy = ev.clientY - drag.startY;
        if (!tv.moved && Math.hypot(dx, dy) < 6) return;
        tv.moved = true;
        stage.classList.add('is-panning');
        tv.x = drag.tx + dx;
        tv.y = drag.ty + dy;
        applyTreeTransform();
    });

    const end = ev => {
        tv.pointers.delete(ev.pointerId);
        if (tv.pointers.size === 0) { drag = null; stage.classList.remove('is-panning'); }
        if (tv.pointers.size === 1) {
            const [rest] = Array.from(tv.pointers.values());
            drag = { x: rest.x, y: rest.y, startX: rest.x, startY: rest.y, tx: tv.x, ty: tv.y };
        }
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    // A drag must not count as a tap on a card.
    stage.addEventListener('click', ev => {
        if (tv.moved) { ev.preventDefault(); ev.stopPropagation(); tv.moved = false; }
    }, true);

    stage.addEventListener('wheel', ev => {
        ev.preventDefault();
        zoomTreeAt(ev.clientX, ev.clientY, ev.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    stage.addEventListener('keydown', ev => {
        const step = 60;
        const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
        if (moves[ev.key]) { ev.preventDefault(); tv.x += moves[ev.key][0]; tv.y += moves[ev.key][1]; applyTreeTransform(); }
        else if (ev.key === '+' || ev.key === '=') zoomTreeCentre(1.2);
        else if (ev.key === '-') zoomTreeCentre(1 / 1.2);
        else if (ev.key === '0') fitTree();
    });

    window.addEventListener('resize', () => { if (state.view === 'tree') fitTree(); });
}

function setTreeScope(scope) {
    state.treeScope = scope;
    initCollapsedFor(scope);
    state.dirty.add('tree');
    renderCurrent();
    writeHash();
}

function toggleFold(key) {
    if (state.collapsed.has(key)) state.collapsed.delete(key); else state.collapsed.add(key);
    renderTree(true);
}

/* Print: fit the whole tree on the page. */
function printTree() {
    const wasView = state.view, wasScope = state.treeScope;
    state.treeScope = 'all';
    state.collapsed = new Set();
    state.dirty.add('tree');
    setView('tree', { updateHash: false });
    const stage = $('#treeStage'), canvas = $('#treeCanvas');
    canvas.style.transform = 'none';
    const scale = Math.min(1, 1000 / canvas.offsetWidth);
    stage.style.setProperty('--print-scale', String(scale));
    stage.style.setProperty('--print-h', `${Math.ceil(canvas.offsetHeight * scale)}px`);
    document.body.classList.add('is-printing');
    const restore = () => {
        document.body.classList.remove('is-printing');
        window.removeEventListener('afterprint', restore);
        state.treeScope = wasScope;
        initCollapsedFor(wasScope);
        state.dirty.add('tree');
        setView(wasView, { updateHash: false });
    };
    window.addEventListener('afterprint', restore);
    window.print();
}

/* =====================================================================
 * Dialogs (native <dialog>: focus trap and Esc come for free)
 * ===================================================================== */

function openDialog(id, html) {
    const dlg = document.getElementById(id);
    if (!dlg) return null;
    if (html !== undefined) dlg.innerHTML = html;
    if (!dlg.open) dlg.showModal();
    return dlg;
}

function closeDialog(id) {
    const dlg = document.getElementById(id);
    if (dlg && dlg.open) dlg.close();
}

function closeAllDialogs() {
    $$('dialog[open]').forEach(d => d.close());
}

function sheetHead(title, extra = '') {
    return `<div class="sheet-head"><h2 class="sheet-title">${title}</h2>${extra}<button type="button" class="icon-btn" data-close aria-label="Close">${icon('close')}</button></div>`;
}

let confirmResolve = null;

/** @returns {Promise<boolean>} */
function askConfirm({ title, body, confirmLabel = 'Continue', danger = false }) {
    return new Promise(resolve => {
        confirmResolve = resolve;
        const dlg = openDialog('confirmDlg', `<div class="sheet-body">
            <h2 class="sheet-title">${escapeHtml(title)}</h2>
            <p class="confirm-body">${escapeHtml(body)}</p>
            <div class="sheet-actions">
                <button type="button" class="btn" data-confirm="no">Cancel</button>
                <button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-confirm="yes">${escapeHtml(confirmLabel)}</button>
            </div></div>`);
        const noBtn = dlg.querySelector('[data-confirm="no"]');
        if (noBtn) noBtn.focus();
    });
}

function settleConfirm(value) {
    const resolve = confirmResolve;
    confirmResolve = null;
    closeDialog('confirmDlg');
    if (resolve) resolve(value);
}

/* =====================================================================
 * Profile sheet
 * ===================================================================== */

function formatBirthdayLong(person) {
    const b = parseBirthday(person.birthday);
    if (!b) return Number.isFinite(person.age) ? `About ${getBirthYear(person)}` : '';
    if (isYearOnlyBirthday(b)) return String(b.y);
    return new Date(b.y, b.m - 1, b.d).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

function miniTile(person) {
    return `<button type="button" class="tile tile-sm${person.passedOn ? ' is-past' : ''}" data-act="open" data-id="${person.id}">
        ${avatar(person, 'sm')}<span class="tile-name">${displayName(person)}</span></button>`;
}

function openProfile(id) {
    const p = findPersonById(id);
    if (!p) return;
    state.profileId = id;
    const meId = state.settings.meId;
    const rel = relationFor(p);
    const parents = findParentsOfPerson(id);
    const spouse = getSpouse(id);
    const kids = getChildrenOfPerson(id);
    const isBlood = computeBloodlineIdSet().has(id);
    const branch = getBranches().find(b => b.ids.has(id));
    const born = formatBirthdayLong(p);
    const hasRealDate = (() => { const b = parseBirthday(p.birthday); return b && !isYearOnlyBirthday(b); })();
    const canAddPartner = findCoupleForPerson(id) && findCoupleForPerson(id).people.length < 2;

    const facts = [
        ['Born', born],
        ['Age', p.passedOn ? '' : (getPersonAge(p) !== null ? `${getPersonAge(p)} years` : '')],
        ['Passed on', p.passedOn ? (p.deathYear ? String(p.deathYear) : 'Yes') : ''],
        ['Also called', p.nickname || ''],
        ['Status', getEffectiveRelationshipStatus(p) !== 'single' || spouse ? getRelationshipLabel(getEffectiveRelationshipStatus(p)) : ''],
        ['Generation', genLabel(getGenerationIndex(id)).replace('Generation ', '')],
        ['Branch', branch ? `${branch.label}’s branch` : '']
    ].filter(([, v]) => v);

    let relHtml = '';
    if (meId === id) relHtml = '<div class="rel-box"><strong>This is you</strong></div>';
    else if (rel && rel.kind !== 'none') {
        relHtml = `<div class="rel-box"><div><span class="rel-label">Your</span> <strong>${escapeHtml(rel.title.toLowerCase())}</strong>${rel.detail ? `<div class="muted">${escapeHtml(rel.detail)}</div>` : ''}</div>
            ${rel.term ? `<div class="rel-term"><span class="term" lang="zh-Hans">${escapeHtml(rel.term)}</span>${rel.pinyin ? `<span class="pinyin">${escapeHtml(rel.pinyin)}</span>` : ''}<span class="muted">${rel.custom ? 'What you call them' : 'What to call them'}</span></div>` : ''}</div>`;
    } else if (!meId) {
        relHtml = '<div class="rel-box"><button type="button" class="link-btn" data-act="pick-me">Choose who you are</button> to see how you are related.</div>';
    }

    const html = `<div class="sheet-body profile${p.passedOn ? ' is-past' : ''}">
        ${sheetHead('Profile')}
        <div class="profile-top">
            ${avatar(p, 'xl')}
            <div class="profile-id">
                <h3 class="profile-name">${displayName(p)}</h3>
                ${p.chineseName ? `<p class="focus-zh" lang="zh-Hans">${escapeHtml(p.chineseName)}</p>` : ''}
                <p class="focus-meta">${[getLifeSummary(p), p.passedOn ? 'In memory' : ''].filter(Boolean).map(escapeHtml).join(' · ')}</p>
            </div>
            ${isBlood ? sealHtml() : ''}
        </div>
        ${relHtml}
        <div class="profile-primary">
            <button type="button" class="btn btn-primary" data-act="edit" data-id="${id}">${icon('edit')}Edit</button>
            <button type="button" class="btn" data-act="show-family" data-id="${id}">${icon('family')}Family view</button>
        </div>
        ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join('')}</dl>` : ''}
        ${p.bio ? `<section class="bio"><h4 class="group-title">About</h4><p>${escapeHtml(p.bio).replace(/\n/g, '<br>')}</p></section>` : ''}
        ${parents.length ? `<section><h4 class="group-title">Parents</h4><div class="tiles tiles-sm">${parents.map(miniTile).join('')}</div></section>` : ''}
        ${spouse ? `<section><h4 class="group-title">Partner</h4><div class="tiles tiles-sm">${miniTile(spouse)}</div></section>` : ''}
        ${kids.length ? `<section><h4 class="group-title">Children <span class="count">${kids.length}</span></h4><div class="tiles tiles-sm">${kids.map(miniTile).join('')}</div></section>` : ''}
        <div class="action-list">
            ${meId === id ? '' : `<button type="button" data-act="set-me" data-id="${id}">${icon('user')}This is me</button>`}
            <button type="button" data-act="add-child" data-id="${id}">${icon('addchild')}Add child</button>
            ${canAddPartner ? `<button type="button" data-act="add-partner" data-id="${id}">${icon('heart')}Add partner</button>` : ''}
            <button type="button" data-act="share" data-id="${id}">${icon('share')}Share link</button>
            ${hasRealDate && !p.passedOn ? `<button type="button" data-act="ics" data-id="${id}">${icon('calendar')}Add birthday to calendar</button>` : ''}
            <button type="button" class="is-danger" data-act="remove" data-id="${id}">${icon('trash')}Remove from tree</button>
        </div>
    </div>`;
    openDialog('profileDlg', html);
}

/* =====================================================================
 * Add and edit
 * ===================================================================== */

let editCtx = null;

function openEdit(ctx) {
    editCtx = Object.assign({}, ctx);
    let person = {}, title = '';
    if (ctx.mode === 'edit') {
        person = findPersonById(ctx.id);
        if (!person) return;
        title = `Edit ${escapeHtml(person.name)}`;
        editCtx.photo = person.photo || null;
    } else if (ctx.mode === 'child') {
        const parent = findPersonById(ctx.parentId);
        if (!parent) return;
        title = `Add a child of ${escapeHtml(parent.name)}`;
        editCtx.photo = null;
    } else {
        const existing = findPersonById(ctx.personId);
        if (!existing) return;
        if (!findCoupleForPerson(ctx.personId) || findCoupleForPerson(ctx.personId).people.length >= 2) {
            showToast(`${existing.name} already has a partner in the tree.`, { type: 'error' });
            return;
        }
        title = `Add a partner for ${escapeHtml(existing.name)}`;
        person = { gender: existing.gender === 'female' ? 'male' : 'female', relationshipStatus: 'married' };
        editCtx.photo = null;
    }
    const isEdit = ctx.mode === 'edit';
    const gender = person.gender || (ctx.mode === 'child' ? '' : 'male');
    const status = person.id !== undefined ? getEffectiveRelationshipStatus(person) : (person.relationshipStatus || 'single');
    const html = `<form class="sheet-body edit-form" id="editForm" novalidate>
        ${sheetHead(title)}
        <div class="photo-edit">
            <div id="editPhotoPreview">${editPhotoPreview(person)}</div>
            <div class="photo-buttons">
                <label class="btn" for="f-photo-file">${icon('camera')}Take or choose photo</label>
                <input type="file" id="f-photo-file" accept="image/*" hidden>
                <button type="button" class="btn" data-act="pick-family-photo">${icon('images')}Family photos</button>
                <button type="button" class="btn btn-quiet" data-act="clear-photo" id="clearPhotoBtn"${editCtx.photo ? '' : ' hidden'}>Remove photo</button>
            </div>
        </div>
        <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="off" required value="${escapeHtml(person.name || '')}"><p class="field-error" id="f-name-err" role="alert"></p></div>
        <div class="field-row">
            <div class="field"><label for="f-zh">Chinese name <span class="optional">optional</span></label><input id="f-zh" type="text" lang="zh-Hans" autocomplete="off" value="${escapeHtml(person.chineseName || '')}"></div>
            <div class="field"><label for="f-nick">Nickname <span class="optional">optional</span></label><input id="f-nick" type="text" autocomplete="off" value="${escapeHtml(person.nickname || '')}"></div>
        </div>
        <fieldset class="field"><legend>Gender</legend>
            <div class="seg" role="radiogroup">
                <label><input type="radio" name="gender" value="male"${gender === 'male' ? ' checked' : ''}><span>Male</span></label>
                <label><input type="radio" name="gender" value="female"${gender === 'female' ? ' checked' : ''}><span>Female</span></label>
            </div>
            <p class="field-error" id="f-gender-err" role="alert"></p>
        </fieldset>
        <div class="field"><label for="f-bday">Birthday <span class="optional">optional</span></label><input id="f-bday" type="text" inputmode="numeric" placeholder="dd/mm/yyyy" autocomplete="off" maxlength="10" value="${escapeHtml(person.birthday || '')}" aria-describedby="f-bday-help f-bday-err"><p class="hint" id="f-bday-help">If you only know the year, use 01/01/yyyy. Reminders skip those.</p><p class="field-error" id="f-bday-err" role="alert"></p></div>
        ${isEdit || ctx.mode === 'partner' ? `<div class="field"><label for="f-status">Relationship</label><select id="f-status">
            ${[['single', 'Single'], ['bf_gf', 'Boyfriend or girlfriend'], ['dating', 'Dating'], ['married', 'Married']].map(([v, l]) => `<option value="${v}"${status === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>` : ''}
        <div class="field"><label class="check"><input type="checkbox" id="f-passed"${person.passedOn ? ' checked' : ''}><span>Passed on</span></label></div>
        <div class="field" id="f-death-wrap"${person.passedOn ? '' : ' hidden'}><label for="f-death">Year they passed on <span class="optional">optional</span></label><input id="f-death" type="text" inputmode="numeric" maxlength="4" value="${person.deathYear || ''}"></div>
        <div class="field"><label for="f-call">What you call them <span class="optional">optional</span></label><input id="f-call" type="text" lang="zh-Hans" autocomplete="off" placeholder="Overrides the suggested term" value="${escapeHtml(person.callName || '')}"></div>
        <div class="field"><label for="f-bio">About <span class="optional">optional</span></label><textarea id="f-bio" rows="4">${escapeHtml(person.bio || '')}</textarea></div>
        <div class="sheet-actions sticky">
            <button type="button" class="btn" data-close>Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Save changes' : 'Add to tree'}</button>
        </div>
    </form>`;
    openDialog('editDlg', html);
    const nameInput = $('#f-name');
    if (nameInput && !isEdit) nameInput.focus();
}

function editPhotoPreview(person) {
    const draft = Object.assign({}, person, { photo: editCtx ? editCtx.photo : person.photo });
    const photo = sanitizePhotoUrl(draft.photo);
    if (photo) return `<span class="avatar avatar-xl"><img src="${escapeHtml(photo)}" alt="Current photo" data-initials="${escapeHtml(getInitials(draft.name))}"></span>`;
    return `<span class="avatar avatar-xl"><span class="avatar-initials" aria-hidden="true">${escapeHtml(getInitials(draft.name || ''))}</span></span>`;
}

function refreshEditPhoto() {
    const host = $('#editPhotoPreview');
    if (host) host.innerHTML = editPhotoPreview({ name: ($('#f-name') || {}).value || '' });
    const clear = $('#clearPhotoBtn');
    if (clear) clear.hidden = !editCtx.photo;
}

/** Shrink and square-crop a chosen photo so it is small enough to keep on the device. */
function resizeImage(file, size = 320) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const side = Math.min(img.naturalWidth, img.naturalHeight);
            const sx = (img.naturalWidth - side) / 2, sy = (img.naturalHeight - side) / 2;
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = Math.min(size, side);
            canvas.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that image.')); };
        img.src = url;
    });
}

function formatBirthdayInput(input) {
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    let out = digits;
    if (digits.length > 4) out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    input.value = out;
}

function setFieldError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message || '';
}

function saveEdit() {
    const name = $('#f-name').value.trim();
    const birthday = $('#f-bday').value.trim();
    const genderInput = $('input[name="gender"]:checked');
    ['f-name-err', 'f-bday-err', 'f-gender-err'].forEach(id => setFieldError(id, ''));
    let firstBad = null;
    if (!name) { setFieldError('f-name-err', 'Enter a name.'); firstBad = firstBad || $('#f-name'); }
    if (birthday && !parseBirthday(birthday)) { setFieldError('f-bday-err', 'Use dd/mm/yyyy, like 14/03/1987.'); firstBad = firstBad || $('#f-bday'); }
    if (!genderInput) { setFieldError('f-gender-err', 'Choose male or female.'); firstBad = firstBad || $('input[name="gender"]'); }
    if (firstBad) { firstBad.focus(); return; }

    const statusEl = $('#f-status');
    const fields = {
        name,
        chineseName: $('#f-zh').value,
        nickname: $('#f-nick').value,
        callName: $('#f-call').value,
        gender: genderInput.value,
        birthday,
        passedOn: $('#f-passed').checked,
        deathYear: $('#f-passed').checked ? $('#f-death').value : null,
        photo: editCtx.photo,
        bio: $('#f-bio').value
    };
    if (statusEl) fields.relationshipStatus = statusEl.value;
    const ctx = editCtx;
    closeDialog('editDlg');
    if (ctx.mode === 'edit') {
        mutate(`Saved ${name}`, () => updatePerson(ctx.id, fields));
    } else if (ctx.mode === 'child') {
        let created = null;
        mutate(`Added ${name}`, () => { created = addChildTo(ctx.parentId, fields); });
        if (created) { closeDialog('profileDlg'); focusPerson(created.id); }
    } else {
        let created = null;
        mutate(`Added ${name}`, () => { created = addSpouseTo(ctx.personId, fields); });
        if (!created) showToast('That person already has a partner in the tree.', { type: 'error' });
    }
    if (state.profileId && $('#profileDlg').open) openProfile(state.profileId);
}

function openFamilyPhotoPicker() {
    const html = `<div class="sheet-body">${sheetHead('Family photos')}
        <p class="hint">Photos from the “Family pics” folder.</p>
        <div class="photo-grid">${FAMILY_PHOTO_FILES.map(file => {
            const path = `Family%20pics/${encodeURIComponent(file)}`;
            const label = file.replace(/\.jpe?g$/i, '');
            return `<button type="button" class="photo-pick" data-photo="${escapeHtml(path)}" aria-label="${escapeHtml(label)}"><img src="${escapeHtml(path)}" alt="" loading="lazy"><span>${escapeHtml(label)}</span></button>`;
        }).join('')}</div></div>`;
    openDialog('photoDlg', html);
}

/* =====================================================================
 * Who am I, menu, backup
 * ===================================================================== */

function openMePicker(first = false) {
    const html = `<div class="sheet-body">
        ${sheetHead(first ? 'Welcome. Who are you?' : 'Who are you?')}
        <p class="hint">Pick yourself once and the app shows how everyone is related to you, and what to call them. This stays on this device.</p>
        <div class="searchbox">${icon('search')}<input id="meSearch" type="search" placeholder="Search for your name" autocomplete="off" aria-label="Search for your name"></div>
        <ul class="plain-list" id="meList">${meListHtml('')}</ul>
        <div class="sheet-actions"><button type="button" class="btn" data-act="skip-me">${first ? 'Not now' : 'Cancel'}</button></div>
    </div>`;
    openDialog('meDlg', html);
}

function meListHtml(query) {
    const q = query.trim().toLowerCase();
    const people = getTreeOrderedPeople().filter(p => personMatchesQuery(p, q)).slice(0, 60);
    if (!people.length) return '<li class="empty-line">No one matches that name.</li>';
    return people.map(p => `<li><button type="button" class="row" data-act="set-me" data-id="${p.id}">${avatar(p, 'sm')}<span class="row-main"><span class="row-name">${displayName(p)}</span><span class="row-sub">${escapeHtml(genLabel(getGenerationIndex(p.id)))}</span></span></button></li>`).join('');
}

function setMe(id) {
    state.settings.meId = id;
    state.settings.meSkipped = false;
    saveSettings();
    markAllDirty();
    closeDialog('meDlg');
    focusPerson(id, { replace: true });
    const p = findPersonById(id);
    showToast(`You are ${p ? p.name : 'set'}. Everyone is now shown relative to you.`);
}

function openMenu() {
    const me = findPersonById(state.settings.meId);
    const theme = state.settings.theme;
    const photosOn = state.settings.showPhotos;
    const html = `<div class="sheet-body menu">
        ${sheetHead('Menu')}
        <div class="menu-group">
            <div class="menu-row"><span>Show photos</span><button type="button" role="switch" aria-checked="${photosOn}" class="switch${photosOn ? ' is-on' : ''}" data-act="toggle-photos"><span class="sr-only">Show photos</span></button></div>
            <div class="menu-row"><span>Appearance</span><div class="seg seg-sm" role="group" aria-label="Appearance">
                ${['auto', 'light', 'dark'].map(t => `<button type="button" class="${theme === t ? 'is-active' : ''}" aria-pressed="${theme === t}" data-theme-set="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div></div>
        </div>
        <div class="action-list">
            <button type="button" data-act="pick-me">${icon('user')}<span>${me ? `You are ${escapeHtml(me.name)}` : 'Choose who you are'}</span><em>Change</em></button>
            <button type="button" data-act="birthdays">${icon('gift')}Birthdays</button>
            <button type="button" data-act="quiz">${icon('quiz')}Photo quiz</button>
            <button type="button" data-act="stats">${icon('chart')}Family statistics</button>
        </div>
        <h3 class="group-title">Your data</h3>
        <div class="action-list">
            <button type="button" data-act="export">${icon('download')}Back up family data</button>
            <button type="button" data-act="import">${icon('upload')}Restore from backup</button>
            <button type="button" data-act="print">${icon('print')}Print or save tree as PDF</button>
            <button type="button" data-act="match-photos">${icon('images')}Match photos to names</button>
            <button type="button" class="is-danger" data-act="remove-photos">${icon('trash')}Remove all photos</button>
            <button type="button" class="is-danger" data-act="reset-data">${icon('undo')}Reset to the original tree</button>
        </div>
        <p class="hint">Everything is stored on this device only. Back up before changing phones or clearing browser data.</p>
    </div>`;
    openDialog('menuDlg', html);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportBackup() {
    const payload = Object.assign({}, familyData, { exportedAt: new Date().toISOString() });
    const day = new Date().toISOString().slice(0, 10);
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `soon-family-backup-${day}.json`);
    showToast('Backup saved to your downloads.');
}

async function importBackup(file) {
    let parsed;
    try { parsed = JSON.parse(await file.text()); } catch (err) { parsed = null; }
    if (!isValidFamilyData(parsed)) {
        showToast('That file is not a family tree backup.', { type: 'error' });
        return;
    }
    const count = parsed.generations.reduce((n, g) => n + g.couples.reduce((m, c) => m + c.people.length, 0), 0);
    const ok = await askConfirm({ title: 'Restore this backup?', body: `This replaces the current tree with the ${count} people in the backup. You can undo right after.`, confirmLabel: 'Restore' });
    if (!ok) return;
    closeAllDialogs();
    mutate('Backup restored', () => {
        delete parsed.exportedAt;
        parsed.dataVersion = DEFAULT_DATA_VERSION;
        setFamilyData(parsed);
        state.focusId = null;
        if (!findPersonById(state.settings.meId)) { state.settings.meId = null; saveSettings(); }
    });
}

/* ---------- Share, calendar ---------- */

function personLink(id) {
    return `${location.href.split('#')[0]}#p/${id}`;
}

async function sharePerson(id) {
    const p = findPersonById(id);
    if (!p) return;
    const url = personLink(id);
    if (navigator.share) {
        try { await navigator.share({ title: p.name, text: `${p.name} in the Soon family tree`, url }); return; } catch (err) { if (err && err.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url); showToast('Link copied'); }
    catch (err) { showToast(url, { duration: 8000 }); }
}

function addBirthdayToCalendar(id) {
    const p = findPersonById(id);
    const b = p && parseBirthday(p.birthday);
    if (!p || !b || isYearOnlyBirthday(b)) { showToast('Add a full birthday first, not just the year.', { type: 'error' }); return; }
    const pad = n => String(n).padStart(2, '0');
    const year = new Date().getFullYear();
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Soon family tree//EN', 'BEGIN:VEVENT',
        `UID:birthday-${p.id}@soon-family-tree`, `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, '')}`,
        `DTSTART;VALUE=DATE:${year}${pad(b.m)}${pad(b.d)}`, 'RRULE:FREQ=YEARLY',
        `SUMMARY:${p.name.replace(/[,;\\]/g, ' ')}'s birthday`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    downloadBlob(new Blob([ics], { type: 'text/calendar' }), `${p.name.replace(/[^a-z0-9]+/gi, '-')}-birthday.ics`);
}

/* ---------- Birthdays and statistics ---------- */

function openBirthdays() {
    const upcoming = getUpcomingBirthdays(90);
    const body = upcoming.length
        ? `<ul class="plain-list">${upcoming.map(({ person, date, daysAway, turning }) => `<li><button type="button" class="row" data-act="open" data-id="${person.id}">${avatar(person, 'sm')}
            <span class="row-main"><span class="row-name">${displayName(person)}</span><span class="row-sub">${date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })} · turns ${turning}</span></span>
            <span class="row-end">${daysAway === 0 ? 'Today' : daysAway === 1 ? 'Tomorrow' : `in ${daysAway} days`}</span></button></li>`).join('')}</ul>`
        : `<div class="empty"><p>No birthdays in the next 90 days.</p><p class="hint">Only full dates count. Many people here have just a year saved (01/01/yyyy). Open a profile and add their exact birthday to get reminders.</p></div>`;
    openDialog('infoDlg', `<div class="sheet-body">${sheetHead('Birthdays')}${body}</div>`);
}

function openStats() {
    const people = getAllPeople();
    const bloodline = computeBloodlineIdSet();
    const living = people.filter(p => !p.passedOn);
    const withAge = living.map(p => ({ p, age: getPersonAge(p) })).filter(x => x.age !== null);
    const oldest = withAge.slice().sort((a, b) => b.age - a.age)[0];
    const youngest = withAge.slice().sort((a, b) => a.age - b.age)[0];
    const branches = getBranches().map(b => ({ label: b.label, n: b.ids.size })).sort((a, b) => b.n - a.n);
    const perGen = familyData.generations.map((g, i) => ({ i, n: g.couples.reduce((n, c) => n + c.people.length, 0) }));
    const maxGen = Math.max(...perGen.map(g => g.n), 1);
    const html = `<div class="sheet-body">${sheetHead('Family statistics')}
        <div class="stat-grid">
            <div class="stat"><strong>${people.length}</strong><span>people</span></div>
            <div class="stat"><strong>${familyData.generations.length}</strong><span>generations</span></div>
            <div class="stat"><strong>${bloodline.size}</strong><span>in the Soon bloodline</span></div>
            <div class="stat"><strong>${people.filter(p => sanitizePhotoUrl(p.photo)).length}</strong><span>with photos</span></div>
        </div>
        <h3 class="group-title">People in each generation</h3>
        <ul class="bars">${perGen.map(g => `<li><span>Generation ${g.i + 1}</span><span class="bar"><span style="width:${Math.round(g.n / maxGen * 100)}%"></span></span><span class="bar-n">${g.n}</span></li>`).join('')}</ul>
        <dl class="facts">
            ${oldest ? `<div><dt>Oldest</dt><dd>${displayName(oldest.p)}, ${oldest.age}</dd></div>` : ''}
            ${youngest ? `<div><dt>Youngest</dt><dd>${displayName(youngest.p)}, ${youngest.age}</dd></div>` : ''}
            ${branches[0] ? `<div><dt>Largest branch</dt><dd>${escapeHtml(branches[0].label)}’s, ${branches[0].n} people</dd></div>` : ''}
        </dl></div>`;
    openDialog('infoDlg', html);
}

/* =====================================================================
 * Photo quiz: tap the right name
 * ===================================================================== */

const quiz = { scopeKey: 'all', questions: [], index: 0, score: 0, misses: [] };

function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
}

function quizPool(scopeKey) {
    const branch = scopeKey === 'all' ? null : getBranches().find(b => b.key === scopeKey);
    return getAllPeople().filter(p => sanitizePhotoUrl(p.photo) && (!branch || branch.ids.has(p.id)));
}

function openQuizSetup() {
    const branches = getBranches();
    const html = `<div class="sheet-body">${sheetHead('Photo quiz')}
        <p>You see a photo and pick the right name. Ten questions a round.</p>
        <div class="field"><label for="quizScope">Who to include</label><select id="quizScope">
            <option value="all">Everyone with a photo (${quizPool('all').length})</option>
            ${branches.map(b => `<option value="${escapeHtml(b.key)}">${escapeHtml(b.label)}’s branch (${quizPool(b.key).length})</option>`).join('')}</select></div>
        ${state.settings.quizBest ? `<p class="hint">Your best score: ${state.settings.quizBest} out of 10.</p>` : ''}
        <div class="sheet-actions"><button type="button" class="btn" data-close>Cancel</button><button type="button" class="btn btn-primary" data-act="quiz-start">Start</button></div></div>`;
    openDialog('quizDlg', html);
}

function startQuiz() {
    const scopeEl = $('#quizScope');
    if (scopeEl) quiz.scopeKey = scopeEl.value;
    const pool = quizPool(quiz.scopeKey);
    if (pool.length < 4) {
        showToast('Pick a bigger group. The quiz needs at least 4 people with photos.', { type: 'error' });
        return;
    }
    const everyone = getAllPeople();
    quiz.questions = shuffle(pool).slice(0, 10).map(person => {
        const similar = shuffle(everyone.filter(o => o.id !== person.id && o.name !== person.name && o.gender === person.gender && getGenerationIndex(o.id) === getGenerationIndex(person.id)));
        const others = shuffle(everyone.filter(o => o.id !== person.id && o.name !== person.name));
        const wrong = [];
        [...similar, ...others].forEach(o => { if (wrong.length < 3 && !wrong.some(w => w.name === o.name)) wrong.push(o); });
        return { person, options: shuffle([person, ...wrong]) };
    });
    quiz.index = 0; quiz.score = 0; quiz.misses = [];
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = quiz.questions[quiz.index];
    if (!q) { renderQuizResults(); return; }
    const photo = escapeHtml(sanitizePhotoUrl(q.person.photo));
    const html = `<div class="sheet-body quiz">${sheetHead(`Question ${quiz.index + 1} of ${quiz.questions.length}`)}
        <div class="quiz-photo"><img src="${photo}" alt="Photo of a family member. Choose the matching name."></div>
        <div class="quiz-options" role="group" aria-label="Who is this?">${q.options.map(o => `<button type="button" class="btn quiz-option" data-answer="${o.id}">${displayName(o)}</button>`).join('')}</div>
        <p class="quiz-feedback" id="quizFeedback" role="status" aria-live="polite"></p>
        <div class="sheet-actions"><span class="muted">Score ${quiz.score}</span><button type="button" class="btn btn-primary" id="quizNext" hidden data-act="quiz-next">${quiz.index === quiz.questions.length - 1 ? 'See results' : 'Next'}</button></div></div>`;
    openDialog('quizDlg', html);
}

function answerQuiz(id) {
    const q = quiz.questions[quiz.index];
    if (!q || $('#quizNext').hidden === false) return;
    const right = id === q.person.id;
    if (right) quiz.score++; else quiz.misses.push(q.person);
    $$('.quiz-option').forEach(btn => {
        const optionId = parseInt(btn.dataset.answer, 10);
        btn.disabled = true;
        if (optionId === q.person.id) btn.classList.add('is-right');
        else if (optionId === id) btn.classList.add('is-wrong');
    });
    $('#quizFeedback').textContent = right ? 'Correct.' : `It’s ${q.person.name}.`;
    const next = $('#quizNext');
    next.hidden = false;
    next.focus();
}

function renderQuizResults() {
    if (quiz.score > (state.settings.quizBest || 0) && quiz.questions.length === 10) { state.settings.quizBest = quiz.score; saveSettings(); }
    const total = quiz.questions.length;
    const html = `<div class="sheet-body">${sheetHead('Results')}
        <p class="quiz-score"><strong>${quiz.score}</strong> out of ${total}</p>
        ${quiz.misses.length ? `<h3 class="group-title">Worth another look</h3><div class="tiles tiles-sm">${quiz.misses.map(p => `<button type="button" class="tile tile-sm" data-act="open" data-id="${p.id}"><span class="avatar avatar-sm"><img src="${escapeHtml(sanitizePhotoUrl(p.photo))}" alt=""></span><span class="tile-name">${displayName(p)}</span></button>`).join('')}</div>` : '<p>No misses. Impressive.</p>'}
        <div class="sheet-actions"><button type="button" class="btn" data-close>Done</button><button type="button" class="btn btn-primary" data-act="quiz-start">Play again</button></div></div>`;
    openDialog('quizDlg', html);
}

/* =====================================================================
 * Actions and events
 * ===================================================================== */

async function removeFlow(id) {
    const p = findPersonById(id);
    const plan = planRemoval(id);
    if (!p || !plan) return;
    if (!plan.allowed) { showToast(plan.reason, { type: 'error' }); return; }
    const others = plan.ids.length - 1;
    const body = others > 0
        ? `This also removes ${others} ${others === 1 ? 'person' : 'people'} connected to ${p.name} (partner and descendants). You can undo right after.`
        : `${p.name} will be taken out of the tree. You can undo right after.`;
    const ok = await askConfirm({ title: `Remove ${p.name}?`, body, confirmLabel: 'Remove', danger: true });
    if (!ok) return;
    closeAllDialogs();
    mutate(others > 0 ? `Removed ${p.name} and ${others} more` : `Removed ${p.name}`, () => removePerson(id));
}

function togglePhotos() {
    state.settings.showPhotos = !state.settings.showPhotos;
    saveSettings();
    markAllDirty();
    renderCurrent();
    if ($('#menuDlg').open) openMenu();
}

async function removeAllPhotos() {
    const ok = await askConfirm({ title: 'Remove all photos?', body: 'Every person goes back to initials. Your photo files are not deleted. You can undo right after.', confirmLabel: 'Remove photos', danger: true });
    if (!ok) return;
    closeAllDialogs();
    mutate('Removed all photos', () => getAllPeople().forEach(p => { p.photo = null; p.noPhoto = true; }));
}

function matchPhotos() {
    closeAllDialogs();
    let count = 0;
    mutate('Matching photos…', () => { count = assignPhotosFromFolder(true); });
    showToast(count ? `Matched ${count} photo${count === 1 ? '' : 's'} to names` : 'Every name that has a photo is already matched');
}

async function resetData() {
    const ok = await askConfirm({ title: 'Reset to the original tree?', body: 'This replaces everything you added or changed with the starting family. You can undo right after.', confirmLabel: 'Reset', danger: true });
    if (!ok) return;
    closeAllDialogs();
    mutate('Tree reset to the original', () => { setFamilyData(deepClone(DEFAULT_FAMILY_DATA)); assignPhotosFromFolder(); state.focusId = null; });
}

function handleAction(act, id) {
    switch (act) {
        case 'open': openProfile(id); break;
        case 'edit': openEdit({ mode: 'edit', id }); break;
        case 'show-family': closeAllDialogs(); focusPerson(id); break;
        case 'set-me': if (id != null) setMe(id); break;
        case 'pick-me': closeDialog('menuDlg'); openMePicker(); break;
        case 'skip-me': state.settings.meSkipped = true; saveSettings(); closeDialog('meDlg'); break;
        case 'add-child': openEdit({ mode: 'child', parentId: id }); break;
        case 'add-partner': openEdit({ mode: 'partner', personId: id }); break;
        case 'share': sharePerson(id); break;
        case 'ics': addBirthdayToCalendar(id); break;
        case 'remove': removeFlow(id); break;
        case 'toggle-photos': togglePhotos(); break;
        case 'birthdays': closeDialog('menuDlg'); openBirthdays(); break;
        case 'quiz': closeDialog('menuDlg'); openQuizSetup(); break;
        case 'quiz-start': startQuiz(); break;
        case 'quiz-next': quiz.index++; renderQuizQuestion(); break;
        case 'stats': closeDialog('menuDlg'); openStats(); break;
        case 'export': exportBackup(); break;
        case 'import': $('#importInput').click(); break;
        case 'print': closeAllDialogs(); setTimeout(printTree, 150); break;
        case 'match-photos': matchPhotos(); break;
        case 'remove-photos': removeAllPhotos(); break;
        case 'reset-data': resetData(); break;
        case 'clear-filters': state.query = ''; state.filter = 'all'; state.branch = 'all'; $('#peopleSearch').value = ''; state.dirty.add('people'); renderCurrent(); break;
        case 'pick-family-photo': openFamilyPhotoPicker(); break;
        case 'clear-photo': if (editCtx) { editCtx.photo = null; refreshEditPhoto(); } break;
        default: break;
    }
}

function setupEvents() {
    document.addEventListener('click', ev => {
        const t = ev.target;
        if (!(t instanceof Element)) return;

        const close = t.closest('[data-close]');
        if (close) { const dlg = close.closest('dialog'); if (dlg) dlg.close(); return; }

        const confirmBtn = t.closest('[data-confirm]');
        if (confirmBtn) { settleConfirm(confirmBtn.dataset.confirm === 'yes'); return; }

        const tab = t.closest('.tab');
        if (tab) { setView(tab.dataset.view, { focusHeading: true }); return; }

        const focus = t.closest('[data-focus]');
        if (focus) { closeAllDialogs(); focusPerson(parseInt(focus.dataset.focus, 10)); return; }

        const filter = t.closest('[data-filter]');
        if (filter) { state.filter = filter.dataset.filter; state.dirty.add('people'); renderCurrent(); return; }

        const sort = t.closest('[data-sort]');
        if (sort) { state.sort = sort.dataset.sort; state.dirty.add('people'); renderCurrent(); return; }

        const scope = t.closest('[data-tree-scope]');
        if (scope) { setTreeScope(scope.dataset.treeScope); return; }

        const fold = t.closest('[data-fold]');
        if (fold) { toggleFold(fold.dataset.fold); return; }

        const theme = t.closest('[data-theme-set]');
        if (theme) { state.settings.theme = theme.dataset.themeSet; saveSettings(); applyTheme(); openMenu(); return; }

        const photo = t.closest('[data-photo]');
        if (photo && editCtx) { editCtx.photo = photo.dataset.photo; closeDialog('photoDlg'); refreshEditPhoto(); return; }

        const answer = t.closest('[data-answer]');
        if (answer) { answerQuiz(parseInt(answer.dataset.answer, 10)); return; }

        const act = t.closest('[data-act]');
        if (act) {
            const id = act.dataset.id !== undefined ? parseInt(act.dataset.id, 10) : undefined;
            handleAction(act.dataset.act, id);
            return;
        }

        const byId = t.closest('button[id]');
        if (!byId) return;
        switch (byId.id) {
            case 'photosBtn': togglePhotos(); break;
            case 'menuBtn': openMenu(); break;
            case 'zoomInBtn': zoomTreeCentre(1.25); break;
            case 'zoomOutBtn': zoomTreeCentre(1 / 1.25); break;
            case 'fitBtn': fitTree(); break;
            case 'peopleClear': state.query = ''; $('#peopleSearch').value = ''; state.dirty.add('people'); renderCurrent(); $('#peopleSearch').focus(); break;
            default: break;
        }
    });

    // Tap outside a sheet closes it.
    $$('dialog').forEach(dlg => {
        dlg.addEventListener('click', ev => { if (ev.target === dlg) dlg.close(); });
        dlg.addEventListener('close', () => {
            if (dlg.id === 'confirmDlg' && confirmResolve) settleConfirm(false);
        });
    });

    document.addEventListener('input', ev => {
        const t = ev.target;
        if (t.id === 'peopleSearch') {
            state.query = t.value; state.dirty.add('people'); renderCurrent();
            $('#peopleClear').hidden = !t.value;
        } else if (t.id === 'f-bday') {
            formatBirthdayInput(t);
        } else if (t.id === 'meSearch') {
            $('#meList').innerHTML = meListHtml(t.value);
        } else if (t.id === 'f-passed') {
            $('#f-death-wrap').hidden = !t.checked;
        }
    });

    document.addEventListener('change', async ev => {
        const t = ev.target;
        if (t.id === 'branchSelect') { state.branch = t.value; state.dirty.add('people'); renderCurrent(); }
        else if (t.id === 'f-passed') { $('#f-death-wrap').hidden = !t.checked; }
        else if (t.id === 'f-photo-file' && t.files && t.files[0]) {
            try { editCtx.photo = await resizeImage(t.files[0]); refreshEditPhoto(); }
            catch (err) { showToast(err.message, { type: 'error' }); }
        } else if (t.id === 'importInput' && t.files && t.files[0]) {
            await importBackup(t.files[0]);
            t.value = '';
        }
    });

    document.addEventListener('submit', ev => {
        if (ev.target.id === 'editForm') { ev.preventDefault(); saveEdit(); }
    });

    window.addEventListener('popstate', applyHash);
    window.addEventListener('hashchange', applyHash);
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
}

function applyHash() {
    const h = readHash();
    if (!h) return;
    if (h.view === 'family') {
        if (h.focusId != null) state.focusId = h.focusId;
        state.dirty.add('family');
    }
    if (h.view === 'tree' && h.treeScope !== state.treeScope) {
        state.treeScope = (h.treeScope === 'all' || getBranches().some(b => b.key === h.treeScope)) ? h.treeScope : 'all';
        initCollapsedFor(state.treeScope);
        state.dirty.add('tree');
    }
    setView(h.view, { updateHash: false });
    if (h.openProfile) openProfile(h.openProfile);
}

/* =====================================================================
 * Start
 * ===================================================================== */

function init() {
    loadSettings();
    applyTheme();
    const loaded = loadFamilyData(localStorage);
    applyDataFixes();
    const matched = assignPhotosFromFolder();
    if (loaded.reset || matched > 0) persist();
    setupEvents();
    setupTreeGestures();
    initCollapsedFor('all');

    const h = readHash();
    if (h && h.focusId != null) state.focusId = h.focusId;
    if (h && h.view === 'tree') { state.treeScope = h.treeScope; initCollapsedFor(h.treeScope); }
    const view = (h && h.view) || state.settings.view || 'family';
    setView(view, { replace: true, updateHash: !!h });
    if (h && h.openProfile) openProfile(h.openProfile);

    if (loaded.reset) showToast('The family data was updated to the latest version. Your earlier saved changes were replaced.', { duration: 6000 });
    else if (!state.settings.meId && !state.settings.meSkipped && !(h && h.openProfile)) openMePicker(true);

    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
        navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
    }
}

document.addEventListener('DOMContentLoaded', init);
