'use strict';

/* =========================================================
   Atoms — an Atomic Habits–inspired habit tracker (PWA)
   All data lives in localStorage on this device.
   Strings live in i18n.js (English + French).
   ========================================================= */

const KEY = 'atomic-habits:v1';
const COLORS = ['#1f7a6b', '#e07a2f', '#3b6fd8', '#b4467a', '#7a5cc7', '#4c8c2b', '#c9a227', '#d0453c'];
const LANGS = { en: 'English', fr: 'Français' };

/* ---------- Icons ---------- */
const I = {
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1 3.5 5 5.5 5 11a5 5 0 0 1-10 0c0-2.4 1.1-3.9 2.2-5 .2 1.6.9 2.7 2 3.2C11.6 8.4 11 5 12 2z"/></svg>',
  left: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 20V8M6 14l6-6 6 6M4 4h16"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  archive: '<svg viewBox="0 0 24 24"><path d="M3 4h18v4H3zM5 8v12h14V8M10 12h4"/></svg>',
  globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
};

/* ---------- Misc helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-5);

/* ---------- State ---------- */
const defaultState = () => ({
  version: 1,
  habits: [],
  log: {},        // { 'YYYY-MM-DD': { habitId: true } }
  goals: [],
  scorecard: [],
  journal: {},    // { 'YYYY-MM-DD': 'text' }
  settings: {},
});

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.version) return { ...defaultState(), ...s, settings: { ...(s.settings || {}) } };
  } catch (_) { /* fall through */ }
  return defaultState();
}
let state = load();
const ui = { date: today(), lastRoute: '' };

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { toast(t('storageFull')); }
}

/* ---------- i18n ---------- */
const detectLang = () => ((navigator.languages || [navigator.language || 'en']).find(l => /^(fr|en)/i.test(l)) || 'en').slice(0, 2).toLowerCase();
const lang = () => (STRINGS[state.settings.lang] ? state.settings.lang : detectLang());
const locale = () => (lang() === 'fr' ? 'fr-FR' : undefined);
function t(key, ...args) {
  const v = STRINGS[lang()][key] ?? STRINGS.en[key];
  return typeof v === 'function' ? v(...args) : v;
}
const pct = x => new Intl.NumberFormat(locale(), { style: 'percent', maximumFractionDigits: 0 }).format(x);
const num = (x, d = 2) => new Intl.NumberFormat(locale(), { minimumFractionDigits: d, maximumFractionDigits: d }).format(x);
const dayShort = i => { const s = new Date(2024, 0, 7 + i).toLocaleDateString(locale(), { weekday: 'short' }).replace('.', ''); return s[0].toUpperCase() + s.slice(1); };

function applyLangChrome() {
  document.documentElement.lang = lang();
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
}

/* ---------- Date helpers ---------- */
function pad(n) { return String(n).padStart(2, '0'); }
function dkey(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parseKey(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
function today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
const daysBetween = (a, b) => Math.round((b - a) / 86400000);
const fmtLong = d => { const s = d.toLocaleDateString(locale(), { weekday: 'long', month: 'long', day: 'numeric' }); return s[0].toUpperCase() + s.slice(1); };
const fmtShort = d => d.toLocaleDateString(locale(), { month: 'short', day: 'numeric' });
const fmtTime = tm => {
  if (!tm) return '';
  const [h, m] = tm.split(':').map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' });
};

/* ---------- Habit logic ---------- */
const habitById = id => state.habits.find(h => h.id === id);
const activeHabits = () => state.habits.filter(h => !h.archived);
const existedOn = (h, d) => dkey(d) >= h.createdAt;
const isScheduled = (h, d) => existedOn(h, d) && h.days.includes(d.getDay());
const isDone = (h, d) => !!state.log[dkey(d)]?.[h.id];

function setDone(h, d, val) {
  const k = dkey(d);
  if (val) { (state.log[k] ||= {})[h.id] = true; }
  else if (state.log[k]) {
    delete state.log[k][h.id];
    if (!Object.keys(state.log[k]).length) delete state.log[k];
  }
  save();
}

function currentStreak(h) {
  let d = today(), n = 0;
  if (!isDone(h, d)) d = addDays(d, -1); // today still pending doesn't break the chain
  for (let i = 0; i < 3660 && existedOn(h, d); i++, d = addDays(d, -1)) {
    if (isDone(h, d)) n++;
    else if (isScheduled(h, d)) break;
  }
  return n;
}

function bestStreak(h) {
  let best = 0, run = 0;
  const end = today();
  for (let d = parseKey(h.createdAt); d <= end; d = addDays(d, 1)) {
    if (isDone(h, d)) { run++; best = Math.max(best, run); }
    else if (isScheduled(h, d) && dkey(d) !== dkey(end)) run = 0;
  }
  return best;
}

/** completion rate over the last `n` days (today counts only if done) */
function rate(h, n) {
  let sched = 0, done = 0;
  const td = today();
  for (let i = 0; i < n; i++) {
    const d = addDays(td, -i);
    if (!isScheduled(h, d)) continue;
    if (i === 0 && !isDone(h, d)) continue;
    sched++; if (isDone(h, d)) done++;
  }
  return sched ? done / sched : 0;
}

function totalVotes(h) {
  let n = 0;
  for (const k in state.log) if (state.log[k][h.id]) n++;
  return n;
}

/** Was the previous scheduled day (before d) missed? → "never miss twice" */
function missedPrevious(h, d) {
  let p = addDays(d, -1);
  for (let i = 0; i < 7 && existedOn(h, p); i++, p = addDays(p, -1)) {
    if (isScheduled(h, p)) return !isDone(h, p);
  }
  return false;
}

function scheduleLabel(days) {
  const s = [...days].sort().join('');
  if (s === '0123456') return t('everyDay');
  if (s === '12345') return t('weekdays');
  if (s === '06') return t('weekends');
  return [...days].sort().map(dayShort).join(' · ');
}

function cueLine(h) {
  const bits = [];
  if (h.stack) bits.push(t('afterX', h.stack));
  if (h.time) bits.push(fmtTime(h.time));
  if (h.location) bits.push(h.location);
  return bits.join(' · ');
}

/* =========================================================
   Router
   ========================================================= */
const routes = {
  today: viewToday,
  habits: viewHabits,
  habit: (a, b) => a === 'new' ? viewHabitForm() : a === 'edit' ? viewHabitForm(b) : viewHabits(),
  h: viewHabitDetail,
  progress: viewProgress,
  goals: viewGoals,
  goal: (a, b) => a === 'new' ? viewGoalForm() : viewGoalForm(b),
  more: viewMore,
  scorecard: viewScorecard,
  laws: viewLaws,
};

function render() {
  const hash = location.hash || '#/today';
  const [, route = 'today', a, b] = hash.split('/');
  const fn = routes[route] || viewToday;
  $('#view').innerHTML = fn(a, b);

  const tab = { habit: 'habits', h: 'habits', goal: 'goals', scorecard: 'more', laws: 'more' }[route] || route;
  document.querySelectorAll('.tabbar a').forEach(el => {
    if (el.dataset.tab === tab) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });

  if (ui.lastRoute !== hash) { window.scrollTo(0, 0); ui.lastRoute = hash; }
  autosize();
}
window.addEventListener('hashchange', render);

function rerender() {
  const y = window.scrollY;
  render();
  window.scrollTo(0, y);
}

/* =========================================================
   Views
   ========================================================= */

function viewToday() {
  const d = ui.date;
  const td = today();
  const isToday = dkey(d) === dkey(td);
  const habits = activeHabits().filter(h => existedOn(h, d));
  const due = habits.filter(h => isScheduled(h, d))
    .sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const extra = habits.filter(h => !isScheduled(h, d));
  const done = due.filter(h => isDone(h, d)).length;
  const ratio = due.length ? done / due.length : 0;
  const C = 2 * Math.PI * 28;
  const principles = t('principles');
  const p = principles[daysBetween(new Date(2024, 0, 1), td) % principles.length];
  const hour = new Date().getHours();
  const greet = t(hour < 12 ? 'greetMorning' : hour < 18 ? 'greetAfternoon' : 'greetEvening');

  let body;
  if (!state.habits.length) {
    body = `
      <div class="card empty">
        <div class="art">⚛︎</div>
        <h3>${esc(t('emptyTitle'))}</h3>
        <p>${esc(t('emptyBody'))}</p>
        <a class="btn primary" href="#/habit/new">${I.plus} ${esc(t('createFirst'))}</a>
      </div>
      ${installCard()}`;
  } else {
    body = `
      ${due.length ? `<ul class="habit-list">${due.map(h => habitRow(h, d, isToday)).join('')}</ul>`
        : `<div class="card empty"><p>${esc(t(isToday ? 'nothingToday' : 'nothingThatDay'))}</p></div>`}
      ${extra.length ? `<h2>${esc(t('bonus'))}</h2>
        <ul class="habit-list">${extra.map(h => habitRow(h, d, false)).join('')}</ul>` : ''}
    `;
  }

  const jk = dkey(d);
  return `
    <header class="today-head">
      <div class="titles">
        <div class="eyebrow">${esc(isToday ? greet : t('lookingBack'))}</div>
        <h1>${esc(fmtLong(d))}</h1>
      </div>
      ${due.length ? `
      <div class="ring" aria-label="${esc(t('ringLabel', done, due.length))}">
        <svg viewBox="0 0 68 68"><circle class="track" cx="34" cy="34" r="28"/>
          <circle class="bar" cx="34" cy="34" r="28" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - ratio)}"/></svg>
        <div class="label">${done}/${due.length}</div>
      </div>` : ''}
    </header>

    <div class="daynav">
      <button class="icon-btn" data-action="day" data-delta="-1" aria-label="${esc(t('prevDay'))}">${I.left}</button>
      <span class="lbl">${isToday ? esc(t('today')) : `<button class="btn sm" data-action="day" data-delta="0">${esc(t('backToToday'))}</button>`}</span>
      <button class="icon-btn" data-action="day" data-delta="1" aria-label="${esc(t('nextDay'))}" ${isToday ? 'disabled' : ''}>${I.right}</button>
    </div>

    ${body}

    <h2>${esc(t('reflection'))}</h2>
    <textarea data-journal="${jk}" placeholder="${esc(t('reflectionPh'))}">${esc(state.journal[jk] || '')}</textarea>

    <h2>${esc(t('todaysPrinciple'))}</h2>
    <div class="card principle"><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></div>

    ${state.habits.length ? `<a class="fab" href="#/habit/new" aria-label="${esc(t('newHabit'))}">${I.plus}</a>` : ''}
  `;
}

function habitRow(h, d, canWarn) {
  const done = isDone(h, d);
  const s = currentStreak(h);
  const isBreak = h.type === 'break';
  const chips = [];
  if (isBreak) chips.push(`<span class="chip break">${esc(t('breakingChip'))}</span>`);
  else if (h.twoMin) chips.push(`<span class="chip">${esc(t('twoMinChip', h.twoMin))}</span>`);
  if (canWarn && !done && missedPrevious(h, d)) chips.push(`<span class="chip warn">${esc(t('neverMissTwice'))}</span>`);
  const meta = isBreak ? (h.identity ? t('iAmX', h.identity) : t('markResisted')) : cueLine(h);
  return `
    <li class="habit ${done ? 'is-done' : ''}" style="--c:${esc(h.color)}" data-hid="${h.id}">
      <button class="check" data-action="toggle" data-id="${h.id}" data-date="${dkey(d)}"
        aria-pressed="${done}" aria-label="${esc(t(isBreak ? 'resistedAria' : 'doneAria', h.name))}">${I.check}</button>
      <a class="habit-body" href="#/h/${h.id}">
        <span class="habit-name">${esc(h.name)}</span>
        ${meta ? `<span class="habit-meta">${esc(meta)}</span>` : ''}
        ${chips.length ? `<span class="chips">${chips.join('')}</span>` : ''}
      </a>
      <span class="streak ${s >= 3 ? 'hot' : ''}" title="${esc(t('streakTitle'))}">${I.flame}${s}</span>
    </li>`;
}

function viewHabits() {
  const act = activeHabits();
  const arch = state.habits.filter(h => h.archived);
  const card = h => `
    <a class="habit" href="#/h/${h.id}" style="--c:${esc(h.color)};text-decoration:none">
      <span class="habit-body">
        <span class="habit-name">${esc(h.name)}</span>
        <span class="habit-meta">${h.identity ? `${esc(t('iAmX', h.identity))} · ` : ''}${esc(scheduleLabel(h.days))}</span>
      </span>
      <span class="streak ${currentStreak(h) >= 3 ? 'hot' : ''}">${I.flame}${currentStreak(h)}</span>
    </a>`;
  return `
    <header class="page-head">
      <div><h1>${esc(t('habits'))}</h1><div class="sub">${esc(t('activeHabits', act.length))}</div></div>
      <a class="btn primary sm" href="#/habit/new">${I.plus} ${esc(t('new'))}</a>
    </header>
    ${act.length ? `<div class="habit-list">${act.map(card).join('')}</div>` : `
      <div class="card empty"><p>${esc(t('noHabits'))}</p>
      <a class="btn primary" href="#/habit/new">${I.plus} ${esc(t('newHabit'))}</a></div>`}
    ${arch.length ? `<h2>${esc(t('archived'))}</h2><div class="habit-list">${arch.map(card).join('')}</div>` : ''}
  `;
}

function viewHabitForm(id) {
  const h = id ? habitById(id) : null;
  if (id && !h) return notFound();
  const v = h || { type: 'build', days: [0, 1, 2, 3, 4, 5, 6], color: COLORS[state.habits.length % COLORS.length] };
  const identities = [...new Set(state.habits.map(x => x.identity).filter(Boolean))];
  const f = (name, label, ph, hint = '') => `
    <label class="field"><span>${esc(t(label))}</span>
      <input type="text" name="${name}" value="${esc(v[name])}" placeholder="${esc(t(ph))}" autocomplete="off" />
      ${hint ? `<small>${esc(t(hint))}</small>` : ''}</label>`;
  const law = (n, title, inner, cls) => `
    <fieldset class="law ${cls}">
      <legend><span class="num">${n}</span><span class="law-title">${esc(t(title))}</span></legend>
      <p class="hint">${esc(t(title + 'Hint'))}</p>${inner}
    </fieldset>`;

  return `
    <a class="back" href="${h ? `#/h/${h.id}` : '#/habits'}">${I.left} ${esc(t('back'))}</a>
    <header class="page-head"><h1>${esc(t(h ? 'editHabit' : 'newHabit'))}</h1></header>

    <form class="form" data-form="habit" data-id="${h ? h.id : ''}" data-type="${v.type}" autocomplete="off">
      <fieldset>
        <div class="segmented" role="radiogroup" aria-label="${esc(t('habitType'))}">
          <input type="radio" id="t-build" name="type" value="build" ${v.type !== 'break' ? 'checked' : ''}><label for="t-build">${esc(t('buildHabit'))}</label>
          <input type="radio" id="t-break" name="type" value="break" ${v.type === 'break' ? 'checked' : ''}><label for="t-break">${esc(t('breakHabit'))}</label>
        </div>
      </fieldset>

      <fieldset class="law">
        <legend><span class="law-title">${esc(t('whoBecome'))}</span></legend>
        <p class="hint">${esc(t('whoHint'))}</p>
        <label class="field"><span>${esc(t('habitLabel'))}</span>
          <input type="text" name="name" required value="${esc(v.name)}" placeholder="${esc(t(v.type === 'break' ? 'habitPhBreak' : 'habitPhBuild'))}" /></label>
        <label class="field"><span>${esc(t('identity'))}</span>
          <div class="prefix"><em>${esc(t('iAm'))}</em><input type="text" name="identity" list="identities" value="${esc(v.identity)}" placeholder="${esc(t('identityPh'))}" /></div>
          <datalist id="identities">${identities.map(x => `<option value="${esc(x)}">`).join('')}</datalist></label>
      </fieldset>

      ${law(1, 'law1b', `
        <div class="two">
          <label class="field"><span>${esc(t('time'))}</span><input type="time" name="time" value="${esc(v.time)}" /></label>
          ${f('location', 'location', 'locationPh')}
        </div>
        ${f('stack', 'stackLabel', 'stackPh', 'stackHint')}
      `, 'only-build')}
      ${law(1, 'law1k', f('l1', 'hideCue', 'hideCuePh'), 'only-break')}

      ${law(2, 'law2b', f('l2', 'pairLabel', 'pairPh'), 'only-build')}
      ${law(2, 'law2k', f('l2b', 'reframe', 'reframePh'), 'only-break')}

      ${law(3, 'law3b', f('twoMin', 'twoMinLabel', 'twoMinPh') + f('l3', 'primeLabel', 'primePh'), 'only-build')}
      ${law(3, 'law3k', f('l3b', 'frictionLabel', 'frictionPh'), 'only-break')}

      ${law(4, 'law4b', f('l4', 'rewardLabel', 'rewardPh'), 'only-build')}
      ${law(4, 'law4k', f('l4b', 'accountLabel', 'accountPh'), 'only-break')}

      <fieldset class="law">
        <legend><span class="law-title">${esc(t('scheduleColor'))}</span></legend>
        <div class="days" role="group" aria-label="${esc(t('days'))}">
          ${[0, 1, 2, 3, 4, 5, 6].map(i => { const n = dayShort(i); return `<input type="checkbox" id="d${i}" name="days" value="${i}" ${v.days.includes(i) ? 'checked' : ''}><label for="d${i}">${esc(n[0])}<span class="sr">${esc(n.slice(1))}</span></label>`; }).join('')}
        </div>
        <div class="field"><span>${esc(t('color'))}</span>
          <div class="swatches" role="radiogroup" aria-label="${esc(t('color'))}">
            ${COLORS.map((c, i) => `<input type="radio" id="c${i}" name="color" value="${c}" ${v.color === c ? 'checked' : ''}><label for="c${i}" style="--sw:${c}" aria-label="${esc(t('colorN', i + 1))}"></label>`).join('')}
          </div>
        </div>
      </fieldset>

      <div class="form-actions">
        <button class="btn primary" type="submit">${esc(t(h ? 'saveChanges' : 'createHabit'))}</button>
      </div>
      ${h ? `
      <div class="form-actions">
        <button class="btn" type="button" data-action="archive" data-id="${h.id}">${I.archive} ${esc(t(h.archived ? 'restore' : 'archive'))}</button>
        <button class="btn danger" type="button" data-action="delete-habit" data-id="${h.id}">${I.trash} ${esc(t('delete'))}</button>
      </div>` : ''}
    </form>
  `;
}

function viewHabitDetail(id) {
  const h = habitById(id);
  if (!h) return notFound();
  const isBreak = h.type === 'break';
  const s = currentStreak(h), best = bestStreak(h), votes = totalVotes(h), r30 = rate(h, 30);
  const B = x => `<b>${esc(x)}</b>`;

  const contract = isBreak ? `
      <p>${t('cIAm', B(h.identity || t('someoneInControl')))}</p>
      <p>${t('cStop', B(h.name))}</p>` : `
      ${h.identity ? `<p>${t('cIAm', B(h.identity))}</p>` : ''}
      <p>${t('cWill', B(h.name), h.time && B(fmtTime(h.time)), h.location && B(h.location))}</p>
      ${h.stack ? `<p>${t('cStack', B(h.stack), B(h.twoMin || h.name))}</p>` : ''}`;

  const names = t(isBreak ? 'lawsBreak' : 'lawsBuild');
  const vals = isBreak
    ? [h.l1, h.l2b, h.l3b, h.l4b]
    : [[h.stack && t('afterX', h.stack), h.time && fmtTime(h.time), h.location].filter(Boolean).join(' · '),
       h.l2, [h.twoMin && t('twoMinChip', h.twoMin), h.l3].filter(Boolean).join(' — '), h.l4];

  return `
    <a class="back" href="#/habits">${I.left} ${esc(t('habits'))}</a>
    <header class="page-head">
      <div><div class="eyebrow">${esc(t(isBreak ? 'breakingLbl' : 'building'))} · ${esc(scheduleLabel(h.days))}${h.archived ? ` · ${esc(t('archivedLbl'))}` : ''}</div>
      <h1>${esc(h.name)}</h1></div>
      <a class="icon-btn" href="#/habit/edit/${h.id}" aria-label="${esc(t('edit'))}">${I.edit}</a>
    </header>

    <div class="card contract">${contract}</div>

    <h2>${esc(t('stats'))}</h2>
    <div class="stats">
      <div class="stat"><b>${s}</b><span>${esc(t('streak'))}</span></div>
      <div class="stat"><b>${best}</b><span>${esc(t('best'))}</span></div>
      <div class="stat"><b>${pct(r30)}</b><span>${esc(t('days30'))}</span></div>
      <div class="stat"><b>${votes}</b><span>${esc(t('votes'))}</span></div>
    </div>

    <h2>${esc(t('history'))}</h2>
    <div class="card" style="--c:${esc(h.color)}">
      ${heatmap(h, Math.min(26, Math.max(10, Math.ceil((daysBetween(parseKey(h.createdAt), today()) + 7) / 7))))}
      <div class="legend">
        <span><i style="background:${esc(h.color)}"></i>${esc(t(isBreak ? 'legendResisted' : 'legendDone'))}</span>
        <span><i style="background:var(--danger-soft)"></i>${esc(t('missed'))}</span>
        <span><i style="box-shadow:inset 0 0 0 1px var(--line)"></i>${esc(t('restDay'))}</span>
      </div>
      <p class="small muted" style="margin-top:8px">${esc(t('tapToFix'))}</p>
    </div>

    <h2>${esc(t('fourLaws'))}</h2>
    <div class="laws-grid">
      ${names.map((n, i) => `<div class="card"><div class="eyebrow">${i + 1} · ${esc(n)}</div><p>${vals[i] ? esc(vals[i]) : `<span class="muted">${esc(t('notSet'))} — <a href="#/habit/edit/${h.id}">${esc(t('add'))}</a></span>`}</p></div>`).join('')}
    </div>
  `;
}

function heatmap(h, weeks) {
  const td = today();
  const first = addDays(td, -td.getDay() - (weeks - 1) * 7);
  const last = addDays(td, 6 - td.getDay());
  const labels = { done: t('legendDone'), missed: t('missed'), off: t('restDay'), '': t('pending') };
  let cells = '';
  for (let d = first; d <= last; d = addDays(d, 1)) {
    const k = dkey(d);
    let cls;
    if (d > td) cls = 'future';
    else if (!existedOn(h, d)) cls = 'before';
    else if (isDone(h, d)) cls = 'done';
    else if (isScheduled(h, d)) cls = k === dkey(td) ? '' : 'missed';
    else cls = 'off';
    const dis = cls === 'future' || cls === 'before';
    cells += `<button class="${cls} ${k === dkey(td) ? 'is-today' : ''}" ${dis ? 'disabled tabindex="-1"' : `data-action="toggle" data-id="${h.id}" data-date="${k}"`} title="${esc(fmtShort(d))}" aria-label="${esc(fmtShort(d))}${dis ? '' : `: ${esc(labels[cls])}`}"></button>`;
  }
  return `<div class="heatmap-wrap"><div class="heatmap">${cells}</div></div>`;
}

function viewProgress() {
  const act = activeHabits();
  if (!act.length) {
    return `<header class="page-head"><h1>${esc(t('progress'))}</h1></header>
      <div class="card empty"><p>${esc(t('progressEmpty'))}</p>
      <a class="btn primary" href="#/habit/new">${I.plus} ${esc(t('newHabit'))}</a></div>`;
  }
  const td = today();

  const series = [];
  for (let i = 29; i >= 0; i--) {
    const d = addDays(td, -i);
    const due = act.filter(h => isScheduled(h, d));
    const done = due.filter(h => isDone(h, d)).length;
    series.push({ d, v: due.length ? done / due.length : null });
  }
  const W = 300, H = 130, bw = W / 30;
  const bars = series.map((p, i) => {
    const v = p.v ?? 0;
    const bh = Math.max(v * (H - 18), 2);
    return `<rect class="bar ${v ? '' : 'zero'}" x="${i * bw + 1}" y="${H - 14 - bh}" width="${bw - 2}" height="${bh}" rx="1.5"><title>${esc(fmtShort(p.d))}: ${esc(p.v == null ? t('nothingSched') : pct(p.v))}</title></rect>`;
  }).join('');
  const chart = `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(t('chartLabel'))}">
      <line class="axis" x1="0" x2="${W}" y1="${H - 13}" y2="${H - 13}"/>${bars}
      <text x="0" y="${H - 2}">${esc(fmtShort(series[0].d))}</text>
      <text x="${W}" y="${H - 2}" text-anchor="end">${esc(t('today'))}</text></svg>`;

  const allVotes = Object.values(state.log).reduce((n, day) => n + Object.keys(day).length, 0);
  const valid = series.filter(p => p.v != null);
  const avg30 = valid.length ? valid.reduce((n, p) => n + p.v, 0) / valid.length : 0;
  const showUpDays = Object.keys(state.log).length;
  const firstDay = state.habits.reduce((m, h) => h.createdAt < m ? h.createdAt : m, dkey(td));
  const span = daysBetween(parseKey(firstDay), td) + 1;
  const missed = Math.max(span - showUpDays, 0);

  const byId = {};
  for (const h of state.habits) {
    const k = h.identity || '';
    byId[k] = (byId[k] || 0) + totalVotes(h);
  }
  const idRows = Object.entries(byId).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  const maxV = Math.max(1, ...idRows.map(r => r[1]));

  const rows = act.map(h => {
    let dots = '';
    for (let i = 13; i >= 0; i--) {
      const d = addDays(td, -i);
      dots += `<i class="${isDone(h, d) ? 'd' : isScheduled(h, d) ? '' : 'o'}"></i>`;
    }
    return `<a class="prog-row" href="#/h/${h.id}" style="--c:${esc(h.color)}">
      <span class="name">${esc(h.name)}</span><span class="dots" aria-hidden="true">${dots}</span>
      <span class="pct">${pct(rate(h, 30))}</span></a>`;
  }).join('');

  return `
    <header class="page-head"><div><h1>${esc(t('progress'))}</h1><div class="sub">${esc(t('progressSub'))}</div></div></header>

    <div class="stats three">
      <div class="stat"><b>${allVotes}</b><span>${esc(t('totalVotes'))}</span></div>
      <div class="stat"><b>${pct(avg30)}</b><span>${esc(t('avg30'))}</span></div>
      <div class="stat"><b>${showUpDays}</b><span>${esc(t('activeDays'))}</span></div>
    </div>

    <h2>${esc(t('last30'))}</h2>
    <div class="card">${chart}</div>

    <h2>${esc(t('habits14'))}</h2>
    <div class="card">${rows}</div>

    <h2>${esc(t('identityVotes'))}</h2>
    <div class="card">
      ${idRows.length ? idRows.map(([k, n]) => `
        <div class="identity-row">
          <div class="row"><span>${k ? esc(t('iAmX', k)) : `<span class="muted">${esc(t('noIdentity'))}</span>`}</span><b>${n}</b></div>
          <div class="meter"><i style="width:${(n / maxV) * 100}%"></i></div>
        </div>`).join('') : `<p class="muted small">${esc(t('firstVote'))}</p>`}
    </div>

    <h2>${esc(t('power1'))}</h2>
    <div class="card">
      <p class="small muted">${esc(t('power1Body', showUpDays, fmtShort(parseKey(firstDay))))}</p>
      <div class="compound">
        <div class="up"><b>${num(Math.pow(1.01, showUpDays) * Math.pow(0.99, missed))}×</b><span class="small muted">${esc(t('whereYouAre'))}</span></div>
        <div class="up"><b>${num(37.78)}×</b><span class="small muted">${esc(t('afterYear'))}</span></div>
      </div>
    </div>
  `;
}

function viewGoals() {
  const goals = state.goals;
  const card = g => {
    const ms = g.milestones || [];
    const msDone = ms.filter(m => m.done).length;
    const linked = (g.habitIds || []).map(habitById).filter(Boolean);
    const sys = linked.length ? linked.reduce((n, h) => n + rate(h, 30), 0) / linked.length : null;
    const progress = ms.length ? msDone / ms.length : (sys ?? 0);
    const left = g.target ? daysBetween(today(), parseKey(g.target)) : null;
    return `
      <div class="card goal">
        <div class="row"><h3 style="flex:1">${esc(g.title)}</h3>
          <a class="icon-btn" href="#/goal/${g.id}" aria-label="${esc(t('editGoal'))}">${I.edit}</a></div>
        ${g.why ? `<p class="why">${esc(g.why)}</p>` : ''}
        <div class="meta"><span>${esc(ms.length ? t('msCount', msDone, ms.length) : t('systemConsistency'))}</span>
          <span>${left == null ? '' : esc(left >= 0 ? t('daysLeft', left) : t('daysPast', -left))}</span></div>
        <div class="meter"><i style="width:${progress * 100}%"></i></div>
        ${ms.length ? `<ul class="milestones">${ms.map((m, i) => `
          <li><button class="${m.done ? 'done' : ''}" data-action="milestone" data-id="${g.id}" data-i="${i}" aria-pressed="${!!m.done}">
            <span class="box">${I.check}</span><span>${esc(m.text)}</span></button></li>`).join('')}</ul>` : ''}
        ${linked.length ? `
        <div class="system">
          <div class="eyebrow">${esc(t('systemLine', pct(sys)))}</div>
          ${linked.map(h => `<a class="prog-row" href="#/h/${h.id}" style="--c:${esc(h.color)}"><span class="name">${esc(h.name)}</span><span class="streak ${currentStreak(h) >= 3 ? 'hot' : ''}">${I.flame}${currentStreak(h)}</span><span class="pct">${pct(rate(h, 30))}</span></a>`).join('')}
        </div>` : ''}
      </div>`;
  };
  return `
    <header class="page-head">
      <div><h1>${esc(t('goals'))}</h1><div class="sub">${esc(t('goalsSub'))}</div></div>
      <a class="btn primary sm" href="#/goal/new">${I.plus} ${esc(t('new'))}</a>
    </header>
    ${goals.length ? goals.map(card).join('') : `
      <div class="card empty"><p>${esc(t('goalsEmpty'))}</p>
      <a class="btn primary" href="#/goal/new">${I.plus} ${esc(t('newGoal'))}</a></div>`}
    <p class="quote">${esc(t('q', t('quotes')[0]))}</p>
  `;
}

function viewGoalForm(id) {
  const g = id ? state.goals.find(x => x.id === id) : null;
  if (id && !g) return notFound();
  const v = g || { habitIds: [], milestones: [] };
  return `
    <a class="back" href="#/goals">${I.left} ${esc(t('goals'))}</a>
    <header class="page-head"><h1>${esc(t(g ? 'editGoal' : 'newGoal'))}</h1></header>
    <form class="form" data-form="goal" data-id="${g ? g.id : ''}">
      <fieldset class="law">
        <label class="field"><span>${esc(t('goal'))}</span><input type="text" name="title" required value="${esc(v.title)}" placeholder="${esc(t('goalPh'))}" /></label>
        <label class="field"><span>${esc(t('why'))}</span><input type="text" name="why" value="${esc(v.why)}" placeholder="${esc(t('whyPh'))}" /></label>
        <label class="field"><span>${esc(t('targetDate'))}</span><input type="date" name="target" value="${esc(v.target)}" /></label>
      </fieldset>
      <fieldset class="law">
        <legend><span class="law-title">${esc(t('milestones'))}</span></legend>
        <p class="hint">${esc(t('milestonesHint'))}</p>
        <textarea name="milestones" placeholder="${esc(t('milestonesPh')).replace(/\n/g, '&#10;')}">${esc((v.milestones || []).map(m => m.text).join('\n'))}</textarea>
      </fieldset>
      <fieldset class="law">
        <legend><span class="law-title">${esc(t('yourSystem'))}</span></legend>
        <p class="hint">${esc(t('systemHint'))}</p>
        ${activeHabits().length ? `<div class="checklist">${activeHabits().map(h => `
          <label><input type="checkbox" name="habits" value="${h.id}" ${v.habitIds.includes(h.id) ? 'checked' : ''}> ${esc(h.name)}</label>`).join('')}</div>`
        : `<p class="small muted">${t('noHabitsCreate')}</p>`}
      </fieldset>
      <div class="form-actions"><button class="btn primary" type="submit">${esc(t(g ? 'saveGoal' : 'createGoal'))}</button></div>
      ${g ? `<div class="form-actions"><button class="btn danger" type="button" data-action="delete-goal" data-id="${g.id}">${I.trash} ${esc(t('deleteGoal'))}</button></div>` : ''}
    </form>
  `;
}

const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function installCard() {
  if (isStandalone()) return '';
  const how = ui.installPrompt
    ? `<button data-action="install"><span class="ico">${I.phone}</span><span>${esc(t('installApp'))}<small>${esc(t('installAppSub'))}</small></span></button>`
    : `<div class="row" style="padding:6px 4px"><span class="ico">${I.phone}</span><span class="small">${t(isIOS() ? 'installIos' : 'installAndroid')}</span></div>`;
  return `<h2>${esc(t('install'))}</h2><div class="card"><ul class="menu"><li>${how}</li></ul></div>`;
}

function viewMore() {
  return `
    <header class="page-head"><h1>${esc(t('more'))}</h1></header>

    <div class="card">
      <div class="row" style="margin-bottom:10px"><span class="ico-inline">${I.globe}</span><b>${esc(t('language'))}</b></div>
      <div class="segmented" role="radiogroup" aria-label="${esc(t('language'))}">
        ${Object.entries(LANGS).map(([k, n]) => `<input type="radio" id="lang-${k}" name="lang" value="${k}" ${lang() === k ? 'checked' : ''}><label for="lang-${k}" lang="${k}">${n}</label>`).join('')}
      </div>
    </div>

    ${installCard()}

    <h2>${esc(t('tools'))}</h2>
    <div class="card">
      <ul class="menu">
        <li><a href="#/scorecard"><span class="ico">${I.list}</span><span>${esc(t('scorecard'))}<small>${esc(t('scorecardSub'))}</small></span></a></li>
        <li><a href="#/laws"><span class="ico">${I.book}</span><span>${esc(t('lawsMenu'))}<small>${esc(t('lawsMenuSub'))}</small></span></a></li>
      </ul>
    </div>

    <h2>${esc(t('yourData'))}</h2>
    <div class="card">
      <ul class="menu">
        <li><button data-action="export"><span class="ico">${I.down}</span><span>${esc(t('exportT'))}<small>${esc(t('exportSub'))}</small></span></button></li>
        <li><label><span class="ico">${I.up}</span><span>${esc(t('importT'))}<small>${esc(t('importSub'))}</small></span>
          <input type="file" accept="application/json,.json" data-action="import" hidden></label></li>
        <li><button data-action="reset" class="danger"><span class="ico">${I.trash}</span><span>${esc(t('erase'))}</span></button></li>
      </ul>
    </div>
    <p class="small muted" style="margin-top:12px">${esc(t('localNote'))}</p>

    <p class="quote">${esc(t('q', t('quotes')[2]))}</p>
    <p class="small muted" style="text-align:center">${t('inspired')}</p>
  `;
}

function viewScorecard() {
  const list = state.scorecard;
  const counts = { '+': 0, '-': 0, '=': 0 };
  list.forEach(x => { if (x.rating) counts[x.rating]++; });
  return `
    <a class="back" href="#/more">${I.left} ${esc(t('more'))}</a>
    <header class="page-head"><div><h1>${esc(t('scorecard'))}</h1>
      <div class="sub">${esc(t('scSub'))}</div></div></header>

    <div class="stats three">
      <div class="stat"><b style="color:var(--accent)">${counts['+']}</b><span>${esc(t('good'))}</span></div>
      <div class="stat"><b>${counts['=']}</b><span>${esc(t('neutral'))}</span></div>
      <div class="stat"><b style="color:var(--danger)">${counts['-']}</b><span>${esc(t('bad'))}</span></div>
    </div>

    <h2>${esc(t('yourDay'))}</h2>
    <div class="card">
      ${list.length ? `<ul class="score-list">${list.map(x => `
        <li><span class="txt">${esc(x.text)}</span>
          <span class="rate" role="group" aria-label="${esc(t('rate'))}">
            ${[['+', 'p', 'goodA'], ['=', 'z', 'neutralA'], ['-', 'n', 'badA']].map(([r, c, l]) =>
              `<button class="${c}" data-action="rate" data-id="${x.id}" data-r="${r}" aria-pressed="${x.rating === r}" aria-label="${esc(t(l))}">${r === '-' ? '−' : r}</button>`).join('')}
          </span>
          <button class="del" data-action="del-score" data-id="${x.id}" aria-label="${esc(t('remove'))}">×</button></li>`).join('')}</ul>`
      : `<p class="muted small" style="margin:0 0 4px">${esc(t('scExample'))}</p>`}
      <form class="row" data-form="score" style="margin-top:12px">
        <input type="text" name="text" placeholder="${esc(t('addBehavior'))}" required autocomplete="off" />
        <button class="btn primary" type="submit" aria-label="${esc(t('add'))}">${I.plus}</button>
      </form>
    </div>
    <p class="small muted" style="margin-top:12px">${esc(t('scNote'))}</p>
  `;
}

function viewLaws() {
  return `
    <a class="back" href="#/more">${I.left} ${esc(t('more'))}</a>
    <header class="page-head"><div><h1>${esc(t('fourLaws'))}</h1>
      <div class="sub">${esc(t('lawsIntro'))}</div></div></header>
    <div class="stack">
      ${t('lawsRef').map(([b, k, bi, ki], i) => `
        <div class="card ref"><div class="eyebrow">${esc(t('lawN', i + 1))}</div>
          <div class="pair">
            <div><h3>${esc(b)}</h3><ul>${bi.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
            <div><h3 class="muted">${esc(k)}</h3><ul>${ki.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
          </div></div>`).join('')}
    </div>
  `;
}

function notFound() {
  return `<div class="card empty"><p>${esc(t('notFound'))}</p><a class="btn" href="#/today">${esc(t('goToday'))}</a></div>`;
}

/* =========================================================
   Actions
   ========================================================= */
const actions = {
  toggle(el) {
    const h = habitById(el.dataset.id);
    if (!h) return;
    const d = parseKey(el.dataset.date);
    const now = !isDone(h, d);
    setDone(h, d, now);
    if (now) {
      navigator.vibrate?.(12);
      const s = currentStreak(h);
      const msg = h.identity ? t('voteFor', h.identity) : t('vote');
      toast(s >= 2 && dkey(d) === dkey(today()) ? msg + t('streakSuffix', s) : msg);
    }
    rerender();
    if (now) document.querySelector(`.habit[data-hid="${h.id}"]`)?.classList.add('pop');
  },
  day(el) {
    const delta = Number(el.dataset.delta);
    const next = delta === 0 ? today() : addDays(ui.date, delta);
    if (next > today()) return;
    ui.date = next;
    rerender();
  },
  archive(el) {
    const h = habitById(el.dataset.id);
    h.archived = !h.archived; save();
    toast(t(h.archived ? 'archivedT' : 'restoredT'));
    location.hash = `#/h/${h.id}`;
  },
  'delete-habit'(el) {
    const h = habitById(el.dataset.id);
    if (!confirm(t('deleteConfirm', h.name))) return;
    state.habits = state.habits.filter(x => x.id !== h.id);
    for (const k in state.log) { delete state.log[k][h.id]; if (!Object.keys(state.log[k]).length) delete state.log[k]; }
    state.goals.forEach(g => { g.habitIds = (g.habitIds || []).filter(x => x !== h.id); });
    save(); toast(t('deletedT')); location.hash = '#/habits';
  },
  milestone(el) {
    const g = state.goals.find(x => x.id === el.dataset.id);
    const m = g.milestones[Number(el.dataset.i)];
    m.done = !m.done; save();
    if (m.done) { navigator.vibrate?.(12); toast(t('milestoneT')); }
    rerender();
  },
  'delete-goal'(el) {
    if (!confirm(t('deleteGoalConfirm'))) return;
    state.goals = state.goals.filter(x => x.id !== el.dataset.id);
    save(); location.hash = '#/goals';
  },
  rate(el) {
    const x = state.scorecard.find(s => s.id === el.dataset.id);
    x.rating = x.rating === el.dataset.r ? null : el.dataset.r;
    save(); rerender();
  },
  'del-score'(el) {
    state.scorecard = state.scorecard.filter(s => s.id !== el.dataset.id);
    save(); rerender();
  },
  export() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `atoms-backup-${dkey(today())}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t('backupDl'));
  },
  reset() {
    if (!confirm(t('eraseConfirm'))) return;
    const keepLang = state.settings.lang;
    state = defaultState();
    if (keepLang) state.settings.lang = keepLang;
    save(); toast(t('erasedT')); location.hash = '#/today'; render();
  },
  async install() {
    if (!ui.installPrompt) return;
    ui.installPrompt.prompt();
    await ui.installPrompt.userChoice;
    ui.installPrompt = null; rerender();
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el || el.tagName === 'INPUT') return;
  const fn = actions[el.dataset.action];
  if (fn) { e.preventDefault(); fn(el); }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.name === 'type' && el.form?.dataset.form === 'habit') el.form.dataset.type = el.value;
  if (el.name === 'lang') { state.settings.lang = el.value; save(); applyLangChrome(); rerender(); }
  if (el.dataset.action === 'import' && el.files[0]) importFile(el.files[0]);
});

let journalT;
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.journal) {
    clearTimeout(journalT);
    journalT = setTimeout(() => {
      if (el.value.trim()) state.journal[el.dataset.journal] = el.value; else delete state.journal[el.dataset.journal];
      save();
    }, 300);
  }
  if (el.tagName === 'TEXTAREA') fit(el);
});

/* ---------- Forms ---------- */
const forms = {
  habit(f) {
    const fd = new FormData(f);
    const days = fd.getAll('days').map(Number);
    if (!days.length) { toast(t('pickDay')); return; }
    const get = k => (fd.get(k) || '').toString().trim();
    const id = f.dataset.id;
    const existing = id ? habitById(id) : null;
    const h = existing || { id: uid(), createdAt: dkey(today()), archived: false };
    Object.assign(h, {
      type: get('type') || 'build', name: get('name'),
      identity: get('identity').replace(/^(i am|je suis)\s+/i, ''),
      time: get('time'), location: get('location'),
      stack: get('stack').replace(/^(after i|après)\s+/i, ''),
      twoMin: get('twoMin'), l1: get('l1'), l2: get('l2'), l2b: get('l2b'), l3: get('l3'), l3b: get('l3b'),
      l4: get('l4'), l4b: get('l4b'), days, color: get('color') || COLORS[0],
    });
    if (!existing) state.habits.push(h);
    save();
    toast(t(existing ? 'savedT' : 'createdT'));
    location.hash = existing ? `#/h/${h.id}` : '#/today';
  },
  goal(f) {
    const fd = new FormData(f);
    const id = f.dataset.id;
    const existing = id ? state.goals.find(x => x.id === id) : null;
    const g = existing || { id: uid(), createdAt: dkey(today()) };
    const prev = new Map((g.milestones || []).map(m => [m.text, m.done]));
    Object.assign(g, {
      title: fd.get('title').trim(), why: fd.get('why').trim(), target: fd.get('target'),
      habitIds: fd.getAll('habits'),
      milestones: fd.get('milestones').split('\n').map(s => s.trim()).filter(Boolean).map(text => ({ text, done: !!prev.get(text) })),
    });
    if (!existing) state.goals.push(g);
    save(); toast(t(existing ? 'goalSaved' : 'goalCreated'));
    location.hash = '#/goals';
  },
  score(f) {
    const text = new FormData(f).get('text').trim();
    if (!text) return;
    state.scorecard.push({ id: uid(), text, rating: null });
    save(); rerender();
    $('[data-form="score"] input')?.focus();
  },
};
document.addEventListener('submit', e => {
  const f = e.target;
  const fn = forms[f.dataset.form];
  if (fn) { e.preventDefault(); fn(f); }
});

function importFile(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      if (!data || !Array.isArray(data.habits) || typeof data.log !== 'object') throw new Error('bad');
      if (!confirm(t('importConfirm', data.habits.length))) return;
      state = { ...defaultState(), ...data, settings: { ...(data.settings || {}) } };
      save(); applyLangChrome(); toast(t('restoredBackup')); location.hash = '#/today'; render();
    } catch (_) { toast(t('invalidBackup')); }
  };
  r.readAsText(file);
}

/* ---------- UI utilities ---------- */
let toastT;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove('show'), 2200);
}
function fit(el) { el.style.height = 'auto'; el.style.height = Math.max(el.scrollHeight + 2, 90) + 'px'; }
function autosize() { document.querySelectorAll('textarea').forEach(fit); }

/* ---------- Lifecycle ---------- */
let lastDay = dkey(today());
function checkDayChange() {
  const k = dkey(today());
  if (k !== lastDay) { if (dkey(ui.date) === lastDay) ui.date = today(); lastDay = k; rerender(); }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDayChange(); });
setInterval(checkDayChange, 60000);

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); ui.installPrompt = e; rerender(); });
window.addEventListener('appinstalled', () => { ui.installPrompt = null; rerender(); });
window.addEventListener('storage', e => { if (e.key === KEY) { state = load(); applyLangChrome(); rerender(); } });

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
navigator.storage?.persist?.();

applyLangChrome();
render();
