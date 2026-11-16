// Node tests for core.js (kinship, editing, removal). Run: node tests/core.test.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const code = fs.readFileSync(path.join(__dirname, '..', 'core.js'), 'utf8');
vm.runInThisContext(code + '\n;globalThis.__api={describeRelation,findPersonById,getAllPeople,planRemoval,removePerson,addChildTo,addSpouseTo,getTreeRoots,isYearOnlyBirthday};');
const A = globalThis.__api;
let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; } catch (e) { fail++; console.error('FAIL', name, '-', e.message); } }
function eq(a, b) { if (a !== b) throw new Error(`expected ${b}, got ${a}`); }
const ME = 244;
const rel = id => A.describeRelation(ME, id);

t('older brother', () => { eq(rel(242).title, 'Older brother'); eq(rel(242).term, '哥哥'); });
t('mother-side aunt is 姨妈', () => { eq(rel(105).term, '姨妈'); });
t('one root couple', () => eq(A.getTreeRoots().length, 1));
t('founding couple cannot be removed', () => eq(A.planRemoval(1).allowed, false));
t('year-only birthday', () => { eq(A.isYearOnlyBirthday({d:1,m:1,y:1990}), true); eq(A.isYearOnlyBirthday({d:14,m:3,y:1990}), false); });
t('add child then relation is daughter', () => {
  const kid = A.addChildTo(ME, { name: 'Test Baby', gender: 'female' });
  eq(A.describeRelation(ME, kid.id).term, '女儿');
  A.removePerson(kid.id);
  eq(A.findPersonById(kid.id), undefined);
});
t('removing a person with children removes descendants', () => {
  const n = A.getAllPeople().length;
  A.removePerson(ME);
  if (A.getAllPeople().length >= n) throw new Error('nothing removed');
});

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
