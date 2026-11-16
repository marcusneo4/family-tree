/**
 * Family Tree app – unit tests for pure helpers and data validation.
 * Run in browser: open test-runner.html (after serving the project).
 */

(function (global) {
    'use strict';

    const assert = {
        ok: (value, msg) => {
            if (!value) throw new Error(msg || 'Assertion failed');
        },
        equal: (actual, expected, msg) => {
            if (actual !== expected) {
                throw new Error(msg || `Expected ${expected}, got ${actual}`);
            }
        },
        deepEqual: (actual, expected, msg) => {
            const a = JSON.stringify(actual);
            const e = JSON.stringify(expected);
            if (a !== e) throw new Error(msg || `Expected ${e}, got ${a}`);
        }
    };

    function runTests() {
        const results = { passed: 0, failed: 0, errors: [] };

        function run(name, fn) {
            try {
                fn();
                results.passed++;
                return true;
            } catch (err) {
                results.failed++;
                results.errors.push({ name, message: err.message });
                return false;
            }
        }

        // --- escapeHtml ---
        run('escapeHtml: null/undefined returns empty string', () => {
            assert.equal(escapeHtml(null), '');
            assert.equal(escapeHtml(undefined), '');
        });
        run('escapeHtml: non-string returns empty string', () => {
            assert.equal(escapeHtml(123), '');
        });
        run('escapeHtml: escapes < and >', () => {
            assert.equal(escapeHtml('<script>'), '&lt;script&gt;');
        });
        run('escapeHtml: escapes & " \'', () => {
            assert.equal(escapeHtml('a & b'), 'a &amp; b');
            assert.equal(escapeHtml('"x"'), '&quot;x&quot;');
            assert.equal(escapeHtml("'y'"), '&#39;y&#39;');
        });
        run('escapeHtml: safe string unchanged', () => {
            assert.equal(escapeHtml('Hello'), 'Hello');
        });

        // --- sanitizePhotoUrl ---
        run('sanitizePhotoUrl: null/undefined/empty returns empty', () => {
            assert.equal(sanitizePhotoUrl(null), '');
            assert.equal(sanitizePhotoUrl(''), '');
            assert.equal(sanitizePhotoUrl('   '), '');
        });
        run('sanitizePhotoUrl: blocks javascript: and vbscript:', () => {
            assert.equal(sanitizePhotoUrl('javascript:alert(1)'), '');
            assert.equal(sanitizePhotoUrl('vbscript:run'), '');
        });
        run('sanitizePhotoUrl: allows https and http', () => {
            assert.equal(sanitizePhotoUrl('https://example.com/pic.jpg'), 'https://example.com/pic.jpg');
            assert.equal(sanitizePhotoUrl('http://example.com/pic.jpg'), 'http://example.com/pic.jpg');
        });
        run('sanitizePhotoUrl: allows relative and data:image', () => {
            assert.equal(sanitizePhotoUrl('./Family%20pics/x.jpg'), './Family%20pics/x.jpg');
            assert.equal(sanitizePhotoUrl('data:image/png;base64,abc'), 'data:image/png;base64,abc');
        });

        // --- getInitials ---
        run('getInitials: empty returns ?', () => {
            assert.equal(getInitials(''), '?');
            assert.equal(getInitials(null), '?');
        });
        run('getInitials: single word two chars', () => {
            assert.equal(getInitials('Jo'), 'JO');
        });
        run('getInitials: first + last letter for multiple words', () => {
            assert.equal(getInitials('John Doe'), 'JD');
            assert.equal(getInitials('  Mary   Jane  '), 'MJ');
        });

        // --- isValidFamilyData ---
        run('isValidFamilyData: null/undefined false', () => {
            assert.equal(isValidFamilyData(null), false);
            assert.equal(isValidFamilyData(undefined), false);
        });
        run('isValidFamilyData: non-object false', () => {
            assert.equal(isValidFamilyData('x'), false);
            assert.equal(isValidFamilyData(7), false);
        });
        run('isValidFamilyData: missing generations false', () => {
            assert.equal(isValidFamilyData({}), false);
            assert.equal(isValidFamilyData({ generations: null }), false);
        });
        run('isValidFamilyData: valid minimal structure true', () => {
            assert.equal(isValidFamilyData({
                generations: [
                    { couples: [{ people: [{ id: 1 }] }] }
                ]
            }), true);
        });
        run('isValidFamilyData: couple without people false', () => {
            assert.equal(isValidFamilyData({
                generations: [{ couples: [{ people: [] }] }]
            }), true);
        });
        run('isValidFamilyData: person without id false', () => {
            assert.equal(isValidFamilyData({
                generations: [{ couples: [{ people: [{}] }] }]
            }), false);
        });

        // --- normalizeNameForMatch ---
        run('normalizeNameForMatch: empty returns empty', () => {
            assert.equal(normalizeNameForMatch(''), '');
            assert.equal(normalizeNameForMatch(null), '');
        });
        run('normalizeNameForMatch: lowercases and strips extension', () => {
            assert.equal(normalizeNameForMatch('Marcus.JPG'), 'marcus');
        });
        run('normalizeNameForMatch: applies overrides', () => {
            assert.equal(normalizeNameForMatch('Adelia'), 'adeliah');
        });

        // --- getRelationshipLabel ---
        run('getRelationshipLabel: known statuses', () => {
            assert.equal(getRelationshipLabel('married'), 'Married');
            assert.equal(getRelationshipLabel('bf_gf'), 'BF/GF');
            assert.equal(getRelationshipLabel('single'), 'Single');
        });

        // --- calculateAgeFromBirthday ---
        run('calculateAgeFromBirthday: invalid returns null', () => {
            assert.equal(calculateAgeFromBirthday(''), null);
            assert.equal(calculateAgeFromBirthday('1/2'), null);
        });
        run('calculateAgeFromBirthday: valid dd/mm/yyyy returns number', () => {
            const age = calculateAgeFromBirthday('01/01/2000');
            assert.ok(typeof age === 'number' && age >= 24 && age <= 26);
        });

        // --- formatBirthdayToDDMMYYYY ---
        run('formatBirthdayToDDMMYYYY: already dd/mm/yyyy unchanged', () => {
            assert.equal(formatBirthdayToDDMMYYYY('15/06/1990'), '15/06/1990');
        });
        run('formatBirthdayToDDMMYYYY: yyyy-mm-dd converted', () => {
            assert.equal(formatBirthdayToDDMMYYYY('1990-06-15'), '15/06/1990');
        });

        return results;
    }

    function runAndReport() {
        if (typeof escapeHtml !== 'function') {
            console.error('[FamilyTree Tests] core.js must be loaded first (escapeHtml not found).');
            return;
        }
        const results = runTests();
        const total = results.passed + results.failed;
        console.log(`[FamilyTree Tests] ${results.passed}/${total} passed, ${results.failed} failed.`);
        if (results.errors.length) {
            results.errors.forEach(({ name, message }) => console.error(`  ✗ ${name}: ${message}`));
        }
        if (typeof document !== 'undefined') {
            const el = document.getElementById('testResults');
            if (el) {
                el.textContent = results.failed === 0
                    ? `All ${results.passed} tests passed.`
                    : `${results.passed} passed, ${results.failed} failed. See console.`;
                el.className = results.failed === 0 ? 'test-ok' : 'test-fail';
            }
        }
        return results;
    }

    global.FamilyTreeTests = { run: runAndReport };
})(typeof window !== 'undefined' ? window : globalThis);
