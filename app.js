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
  sparkle: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5L8 5.5z"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  camera: '<svg viewBox="0 0 24 24"><path d="M3 8h3l2-2h8l2 2h3v12H3z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  log: '<svg viewBox="0 0 24 24"><path d="M5 4h11l3 3v13H5z"/><path d="M8 10h8M8 14h8M8 18h5"/></svg>',
  stop: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
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
  coach: [],      // [{ role: 'user'|'assistant', content }]
  prayerLog: {},  // { 'YYYY-MM-DD': { fajr: true, … } }
  entries: {},    // { habitId: { 'YYYY-MM-DD': { note, link, fields, sets, photos } } }
  counts: {},     // { habitId: { 'YYYY-MM-DD': number } } for measured (count) habits
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

const fmtDur = m => {
  if (!m) return '';
  const h = Math.floor(m / 60), r = m % 60;
  return h ? `${h} h${r ? ` ${pad(r)}` : ''}` : `${m} ${t('minUnit')}`;
};
const endTime = (tm, m) => {
  const [h, mi] = tm.split(':').map(Number);
  const x = (h * 60 + mi + m) % 1440;
  return `${pad(Math.floor(x / 60))}:${pad(x % 60)}`;
};

/* ---------- Habit logic ---------- */
const habitById = id => state.habits.find(h => h.id === id);
const activeHabits = () => state.habits.filter(h => !h.archived);
const existedOn = (h, d) => dkey(d) >= h.createdAt;
const isScheduled = (h, d) => existedOn(h, d) && !isWeekly(h) && h.days.includes(d.getDay());
const isDone = (h, d) => !!state.log[dkey(d)]?.[h.id];
const isCount = h => h.goalCount > 0;
const isWeekly = h => h.sched === 'weekly' && h.perWeek > 0;
function weekCountDone(h, wkStart) { let c = 0; const tk = dkey(today()); for (let i = 0; i < 7; i++) { const d = addDays(wkStart, i); if (dkey(d) > tk) break; if (existedOn(h, d) && isDone(h, d)) c++; } return c; }
const weeklyMet = (h, wkStart) => weekCountDone(h, wkStart) >= h.perWeek;
const getCount = (h, d) => (state.counts?.[h.id]?.[dkey(d)]) || 0;
function setCount(h, d, n) {
  const k = dkey(d); n = Math.max(0, Math.round(n));
  state.counts ||= {}; (state.counts[h.id] ||= {})[k] = n;
  if (!n) delete state.counts[h.id][k];
  setDone(h, d, n >= h.goalCount);  // reuse all streak/rate/ring logic
}

function setDone(h, d, val) {
  const k = dkey(d);
  if (val) { (state.log[k] ||= {})[h.id] = true; }
  else if (state.log[k]) {
    delete state.log[k][h.id];
    if (!Object.keys(state.log[k]).length) delete state.log[k];
  }
  save();
}

function weeklyStreak(h) {
  let n = 0, wk = weekStartMon(today());
  if (weeklyMet(h, wk)) n++;
  wk = addDays(wk, -7);
  for (let i = 0; i < 520 && addDays(wk, 6) >= parseKey(h.createdAt); i++, wk = addDays(wk, -7)) { if (weeklyMet(h, wk)) n++; else break; }
  return n;
}
function currentStreak(h) {
  if (isWeekly(h)) return weeklyStreak(h);
  let d = today(), n = 0;
  if (!isDone(h, d)) d = addDays(d, -1); // today still pending doesn't break the chain
  for (let i = 0; i < 3660 && existedOn(h, d); i++, d = addDays(d, -1)) {
    if (isDone(h, d)) n++;
    else if (isScheduled(h, d)) break;
  }
  return n;
}

function bestStreak(h) {
  if (isWeekly(h)) {
    let best = 0, run = 0;
    for (let wk = weekStartMon(parseKey(h.createdAt)); wk <= weekStartMon(today()); wk = addDays(wk, 7)) {
      if (weeklyMet(h, wk)) { run++; best = Math.max(best, run); }
      else if (dkey(wk) !== dkey(weekStartMon(today()))) run = 0;
    }
    return best;
  }
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
  if (isWeekly(h)) {
    const weeks = Math.max(1, Math.round(n / 7)); let met = 0, tot = 0, wk = weekStartMon(today());
    for (let i = 0; i < weeks && addDays(wk, 6) >= parseKey(h.createdAt); i++, wk = addDays(wk, -7)) {
      if (i === 0 && !weeklyMet(h, wk)) continue; tot++; if (weeklyMet(h, wk)) met++;
    }
    return tot ? met / tot : 0;
  }
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
  if (isWeekly(h)) return false;
  let p = addDays(d, -1);
  for (let i = 0; i < 7 && existedOn(h, p); i++, p = addDays(p, -1)) {
    if (isScheduled(h, p)) return !isDone(h, p);
  }
  return false;
}

function schedText(h) { return isWeekly(h) ? t('perWeekShort', h.perWeek) : scheduleLabel(h.days); }
function scheduleLabel(days) {
  const s = [...days].sort().join('');
  if (s === '0123456') return t('everyDay');
  if (s === '12345') return t('weekdays');
  if (s === '06') return t('weekends');
  return [...days].sort().map(dayShort).join(' · ');
}

function cueLine(h) {
  const bits = [];
  if (h.afterPrayer && PRAYERS.includes(h.afterPrayer)) bits.push(t('afterX', t('prayer_' + h.afterPrayer)));
  else if (h.stack) bits.push(t('afterX', h.stack));
  if (h.time) bits.push(h.duration ? `${fmtTime(h.time)}–${fmtTime(endTime(h.time, h.duration))}` : fmtTime(h.time));
  else if (h.duration) bits.push(fmtDur(h.duration));
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
  coach: viewCoach,
  prayers: viewPrayers,
  review: viewReview,
};

function render() {
  const hash = location.hash || '#/today';
  const [, route = 'today', a, b] = hash.split('/');
  const fn = routes[route] || viewToday;
  $('#view').innerHTML = fn(a, b);

  const tab = { habit: 'habits', h: 'habits', goal: 'goals', scorecard: 'more', laws: 'more', prayers: 'today' }[route] || route;
  document.querySelectorAll('.tabbar a').forEach(el => {
    if (el.dataset.tab === tab) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });

  if (ui.lastRoute !== hash) { window.scrollTo(0, 0); ui.lastRoute = hash; }
  autosize();
  hydratePhotos();
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
  const weeklyH = habits.filter(h => isWeekly(h));
  const extra = habits.filter(h => !isScheduled(h, d) && !isWeekly(h));
  const pts = prayerTimes(d);
  const canAnchor = h => h.afterPrayer && PRAYERS.includes(h.afterPrayer) && pts && pts[h.afterPrayer];
  const anytime = [], timed = [], anchored = [];
  for (const h of due) { if (canAnchor(h)) anchored.push(h); else if (h.time) timed.push(h); else anytime.push(h); }
  const timeline = [
    ...timed.map(h => ({ at: h.time, html: () => habitRow(h, d, isToday) })),
    ...anchored.map(h => ({ at: hhmm(new Date(pts[h.afterPrayer].getTime() + PRAYER_BLOCK * 60000)), html: () => habitRow(h, d, isToday) })),
    ...(pts ? PRAYERS.map(p => ({ at: hhmm(pts[p]), html: () => prayerRow(p, pts, d, isToday) })) : []),
  ].sort((a, b) => a.at.localeCompare(b.at));
  const prayedN = pts ? PRAYERS.filter(p => state.prayerLog[dkey(d)]?.[p]).length : 0;
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
      ${pts ? `<ul class="habit-list" style="margin-top:12px">${timeline.map(x => x.html()).join('')}</ul>` : ''}
      ${installCard()}`;
  } else {
    body = `
      ${anytime.length ? `<h2 class="sec">${esc(t('anytime'))}</h2>
        <ul class="habit-list">${anytime.map(h => habitRow(h, d, isToday)).join('')}</ul>` : ''}
      ${timeline.length ? `${anytime.length ? `<h2 class="sec">${esc(t('throughDay'))}</h2>` : ''}
        <ul class="habit-list">${timeline.map(x => x.html()).join('')}</ul>` : ''}
      ${weeklyH.length ? `<h2 class="sec">${esc(t('weeklySection'))}</h2>
        <ul class="habit-list">${weeklyH.map(h => weeklyRow(h, d, isToday)).join('')}</ul>` : ''}
      ${!anytime.length && !timeline.length && !weeklyH.length ? `<div class="card empty"><p>${esc(t(isToday ? 'nothingToday' : 'nothingThatDay'))}</p></div>` : ''}
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
        ${pts ? `<a class="prayer-sum" href="#/prayers">${I.moon}${esc(t('prayersCount', prayedN, PRAYERS.length))}</a>` : ''}
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
  const count = isCount(h) ? getCount(h, d) : 0;
  const chips = [];
  if (isBreak) chips.push(`<span class="chip break">${esc(t('breakingChip'))}</span>`);
  else if (h.twoMin) chips.push(`<span class="chip">${esc(t('twoMinChip', h.twoMin))}</span>`);
  if (canWarn && !done && missedPrevious(h, d)) chips.push(`<span class="chip warn">${esc(t('neverMissTwice'))}</span>`);
  const meta = isBreak ? (h.identity ? t('iAmX', h.identity) : t('markResisted')) : cueLine(h);
  if (isCount(h)) chips.unshift(`<button class="chip countchip" data-action="count-set" data-id="${h.id}" data-date="${dkey(d)}">${count}/${h.goalCount}${h.unit ? ' ' + esc(h.unit) : ''}</button>`);
  const canTime = !isBreak && h.duration && !h.logType && !done && dkey(d) === dkey(today());
  const canLog = !isBreak && h.logType && dkey(d) === dkey(today());
  if (h.logType && hasLog(h.id) && !chips.some(c => c.includes('break'))) { /* entries indicator handled in meta */ }
  return `
    <li class="habit ${done ? 'is-done' : ''}" style="--c:${esc(h.color)}" data-hid="${h.id}">
      ${isCount(h)
        ? `<button class="check count ${done ? 'full' : ''}" data-action="count-add" data-id="${h.id}" data-date="${dkey(d)}" aria-label="${esc(t('addUnit', h.unit || ''))}">
             <svg viewBox="0 0 48 48" class="cring"><circle cx="24" cy="24" r="21"/><circle cx="24" cy="24" r="21" class="cbar" style="stroke-dasharray:${2*Math.PI*21};stroke-dashoffset:${2*Math.PI*21*(1-Math.min(1,count/h.goalCount))}"/></svg>
             <span class="cnum">${done ? I.check : count}</span></button>`
        : `<button class="check" data-action="toggle" data-id="${h.id}" data-date="${dkey(d)}"
             aria-pressed="${done}" aria-label="${esc(t(isBreak ? 'resistedAria' : 'doneAria', h.name))}">${I.check}</button>`}
      <a class="habit-body" href="#/h/${h.id}">
        <span class="habit-name">${esc(h.name)}</span>
        ${meta ? `<span class="habit-meta">${esc(meta)}</span>` : ''}
        ${chips.length ? `<span class="chips">${chips.join('')}</span>` : ''}
      </a>
      ${canLog ? `<button class="play logbtn" data-action="log-open" data-id="${h.id}" data-date="${dkey(d)}" aria-label="${esc(t('logToday', h.name))}">${I.log}</button>` : ''}
      ${canTime ? `<button class="play" data-action="timer-open" data-id="${h.id}" aria-label="${esc(t('startTimer', h.name))}">${I.play}</button>` : ''}
      <span class="streak ${s >= 3 ? 'hot' : ''}" title="${esc(t('streakTitle'))}">${I.flame}${s}</span>
    </li>`;
}

function weeklyRow(h, d, isToday) {
  const wk = weekStartMon(d);
  const c = weekCountDone(h, wk), met = c >= h.perWeek, todayDone = isDone(h, d), sN = currentStreak(h);
  return `
    <li class="habit ${todayDone ? 'is-done' : ''}" style="--c:${esc(h.color)}" data-hid="${h.id}">
      <button class="check" data-action="toggle" data-id="${h.id}" data-date="${dkey(d)}" aria-pressed="${todayDone}" aria-label="${esc(t('doneAria', h.name))}">${I.check}</button>
      <a class="habit-body" href="#/h/${h.id}">
        <span class="habit-name">${esc(h.name)}</span>
        ${h.identity ? `<span class="habit-meta">${esc(t('iAmX', h.identity))}</span>` : (cueLine(h) ? `<span class="habit-meta">${esc(cueLine(h))}</span>` : '')}
        <span class="chips"><span class="chip ${met ? 'break' : ''}">${c}/${h.perWeek} ${esc(t('thisWeekShort'))}</span></span>
      </a>
      <span class="streak ${sN >= 3 ? 'hot' : ''}" title="${esc(t('streakTitle'))}">${I.flame}${sN}</span>
    </li>`;
}
function viewHabits() {
  const act = activeHabits();
  const arch = state.habits.filter(h => h.archived);
  const card = h => `
    <a class="habit" href="#/h/${h.id}" style="--c:${esc(h.color)};text-decoration:none">
      <span class="habit-body">
        <span class="habit-name">${esc(h.name)}</span>
        <span class="habit-meta">${h.identity ? `${esc(t('iAmX', h.identity))} · ` : ''}${esc(schedText(h))}</span>
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

    <form class="form" data-form="habit" data-id="${h ? h.id : ''}" data-type="${v.type}" data-sched="${v.sched === 'weekly' ? 'weekly' : 'days'}" autocomplete="off">
      <fieldset>
        <div class="segmented" role="radiogroup" aria-label="${esc(t('habitType'))}">
          <input type="radio" id="t-build" name="type" value="build" ${v.type !== 'break' ? 'checked' : ''}><label for="t-build">${esc(t('buildHabit'))}</label>
          <input type="radio" id="t-break" name="type" value="break" ${v.type === 'break' ? 'checked' : ''}><label for="t-break">${esc(t('breakHabit'))}</label>
        </div>
      </fieldset>
${h ? '' : `
      <fieldset class="law ai-box">
        <legend><span class="law-title">${I.sparkle} ${esc(t('aiFillTitle'))}</span></legend>
        <p class="hint">${esc(t('aiFillHint'))}</p>
        <textarea id="ai-idea" class="short" rows="2" placeholder="${esc(t('aiIdeaPh'))}"></textarea>
        <button class="btn" type="button" style="margin-top:10px" data-action="ai-fill">${I.sparkle} ${esc(t('aiFill'))}</button>
        <div data-ai-panel="form" style="margin-top:10px">${aiPanel('form')}</div>
      </fieldset>`}

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
          <label class="field"><span>${esc(t('duration'))}</span><span class="suffix"><input type="number" name="duration" min="1" max="720" step="1" inputmode="numeric" value="${esc(v.duration || '')}" placeholder="20" /><em>${esc(t('minUnit'))}</em></span></label>
        </div>
        <label class="field"><span>${esc(t('afterPrayerLabel'))}</span>
          <select name="afterPrayer">
            <option value="">${esc(t('afterPrayerNone'))}</option>
            ${PRAYERS.map(pr => `<option value="${pr}" ${v.afterPrayer === pr ? 'selected' : ''}>${esc(t('prayer_' + pr))}</option>`).join('')}
          </select>
          <small>${esc(t('afterPrayerHint'))}</small></label>
        ${f('location', 'location', 'locationPh')}
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
        <legend><span class="law-title">${esc(t('trackingLabel'))}</span></legend>
        <p class="hint">${esc(t('logTypeHint'))}</p>
        <label class="field"><span>${esc(t('logTypeField'))}</span>
          <select name="logType">
            ${LOG_TYPES.map(lt => `<option value="${lt}" ${(v.logType||'')===lt?'selected':''}>${esc(t('log_'+(lt||'none')))}</option>`).join('')}
          </select></label>
        <div class="two">
          <label class="field"><span>${esc(t('goalCountLabel'))}</span><input type="number" name="goalCount" min="1" max="100000" inputmode="numeric" value="${esc(v.goalCount || '')}" placeholder="${esc(t('goalCountPh'))}"></label>
          <label class="field"><span>${esc(t('unitLabel'))}</span><input type="text" name="unit" value="${esc(v.unit || '')}" placeholder="${esc(t('unitPh'))}" list="unit-list"><datalist id="unit-list"><option value="glasses"><option value="g"><option value="steps"><option value="min"><option value="pages"><option value="reps"></datalist></label>
        </div>
        <label class="field"><span>${esc(t('stepLabel'))}</span><input type="number" name="step" min="1" max="10000" inputmode="numeric" value="${esc(v.step || '')}" placeholder="1"><small>${esc(t('stepHint'))}</small></label>
      </fieldset>

      <fieldset class="law">
        <legend><span class="law-title">${esc(t('scheduleColor'))}</span></legend>
        <div class="segmented" role="radiogroup" aria-label="${esc(t('schedMode'))}">
          <input type="radio" id="sched-days" name="sched" value="days" ${v.sched !== 'weekly' ? 'checked' : ''}><label for="sched-days">${esc(t('schedDays'))}</label>
          <input type="radio" id="sched-weekly" name="sched" value="weekly" ${v.sched === 'weekly' ? 'checked' : ''}><label for="sched-weekly">${esc(t('schedWeekly'))}</label>
        </div>
        <label class="field sched-weekly-only"><span>${esc(t('perWeekLabel'))}</span><input type="number" name="perWeek" min="1" max="7" inputmode="numeric" value="${esc(v.perWeek || 3)}"><small>${esc(t('perWeekHint'))}</small></label>
        <div class="days sched-days-only" role="group" aria-label="${esc(t('days'))}" style="margin-top:10px">
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
      <p>${t('cWill', B(h.name), h.time && B(fmtTime(h.time)), h.location && B(h.location), h.duration && B(fmtDur(h.duration)))}</p>
      ${h.afterPrayer && PRAYERS.includes(h.afterPrayer) ? `<p>${t('cAfterPrayer', B(t('prayer_' + h.afterPrayer)), B(h.twoMin || h.name))}</p>`
        : h.stack ? `<p>${t('cStack', B(h.stack), B(h.twoMin || h.name))}</p>` : ''}`;

  const names = t(isBreak ? 'lawsBreak' : 'lawsBuild');
  const vals = isBreak
    ? [h.l1, h.l2b, h.l3b, h.l4b]
    : [[h.stack && t('afterX', h.stack), h.time && fmtTime(h.time), h.duration && fmtDur(h.duration), h.location].filter(Boolean).join(' · '),
       h.l2, [h.twoMin && t('twoMinChip', h.twoMin), h.l3].filter(Boolean).join(' — '), h.l4];

  return `
    <a class="back" href="#/habits">${I.left} ${esc(t('habits'))}</a>
    <header class="page-head">
      <div><div class="eyebrow">${esc(t(isBreak ? 'breakingLbl' : 'building'))} · ${esc(schedText(h))}${h.archived ? ` · ${esc(t('archivedLbl'))}` : ''}</div>
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

    ${logSection(h)}

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
    <header class="page-head"><div><h1>${esc(t('progress'))}</h1><div class="sub">${esc(t('progressSub'))}</div></div>
      <a class="btn sm" href="#/review">${esc(t('weeklyReview'))}</a></header>

    <div class="stats three">
      <div class="stat"><b>${allVotes}</b><span>${esc(t('totalVotes'))}</span></div>
      <div class="stat"><b>${pct(avg30)}</b><span>${esc(t('avg30'))}</span></div>
      <div class="stat"><b>${showUpDays}</b><span>${esc(t('activeDays'))}</span></div>
    </div>

    <h2>${esc(t('last30'))}</h2>
    <div class="card">${chart}</div>

    <h2>${esc(t('habits14'))}</h2>
    <div class="card">${rows}</div>

    ${prayerProgress()}

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

    <h2>${esc(t('coach'))}</h2>
    <div class="card">
      <p class="small muted" style="margin-top:0">${esc(t('aiPrivacy'))}</p>
      <div data-ai-panel="more">${aiPanel('more')}</div>
      ${state.settings.aiModel ? `<button class="btn sm danger" style="margin-top:10px" data-action="ai-remove">${I.trash} ${esc(t('aiRemove'))}</button>` : ''}
    </div>

    <h2>${esc(t('tools'))}</h2>
    <div class="card">
      <ul class="menu">
        <li><a href="#/review"><span class="ico">${I.up}</span><span>${esc(t('weeklyReview'))}<small>${esc(t('reviewSub'))}</small></span></a></li>
        <li><a href="#/prayers"><span class="ico">${I.moon}</span><span>${esc(t('prayers'))}<small>${esc(t('prayersMenuSub'))}</small></span></a></li>
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

function weekStartMon(d) { const x = new Date(d); const off = (x.getDay() + 6) % 7; x.setDate(x.getDate() - off); x.setHours(0,0,0,0); return x; }
function viewReview() {
  const td = today();
  const act = activeHabits();
  if (!act.length) return `<a class="back" href="#/progress">${I.left} ${esc(t('progress'))}</a><header class="page-head"><h1>${esc(t('weeklyReview'))}</h1></header><div class="card empty"><p>${esc(t('progressEmpty'))}</p></div>`;

  let sched = 0, done = 0;
  const per = act.map(h => {
    let hs = 0, hd = 0;
    for (let i = 0; i < 7; i++) { const d = addDays(td, -i); if (!isScheduled(h, d)) continue; if (i === 0 && !isDone(h, d)) continue; hs++; if (isDone(h, d)) hd++; }
    sched += hs; done += hd;
    return { h, hs, hd, rate: hs ? hd / hs : null, streak: currentStreak(h) };
  });
  const overall = sched ? done / sched : 0;
  const C = 2 * Math.PI * 34;
  const rated = per.filter(x => x.rate != null && x.hs >= 2).sort((a, b) => b.rate - a.rate);
  const best = rated[0], worst = rated.length > 1 ? rated[rated.length - 1] : null;

  const wd = Array.from({ length: 7 }, () => ({ s: 0, d: 0 }));
  for (let i = 1; i <= 56; i++) { const d = addDays(td, -i); for (const h of act) { if (!isScheduled(h, d)) continue; wd[d.getDay()].s++; if (isDone(h, d)) wd[d.getDay()].d++; } }
  const wdR = wd.map((x, i) => ({ i, r: x.s ? x.d / x.s : null, s: x.s })).filter(x => x.r != null && x.s >= 3).sort((a, b) => b.r - a.r);
  const strong = wdR[0];

  const votes = {};
  for (let i = 0; i < 7; i++) { const d = addDays(td, -i); for (const h of act) if (isDone(h, d)) { const k = h.identity || ''; votes[k] = (votes[k] || 0) + 1; } }
  const vRows = Object.entries(votes).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  const weekVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const wk = weekStartMon(td);
  const rkey = 'review:' + dkey(wk);
  const perDone = per.filter(x => x.hd > 0 || x.hs > 0);

  return `
    <a class="back" href="#/progress">${I.left} ${esc(t('progress'))}</a>
    <header class="page-head"><div><h1>${esc(t('weeklyReview'))}</h1><div class="sub">${esc(t('weekOf', fmtShort(wk)))}</div></div></header>

    <div class="card" style="display:flex;align-items:center;gap:16px">
      <div class="ring" style="width:84px;height:84px;flex:none">
        <svg viewBox="0 0 84 84"><circle class="track" cx="42" cy="42" r="34"/><circle class="bar" cx="42" cy="42" r="34" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - overall)}"/></svg>
        <div class="label" style="font-size:19px">${pct(overall)}</div>
      </div>
      <div><b style="font-family:var(--serif);font-size:19px">${esc(t('last7'))}</b>
        <div class="muted small">${done}/${sched} ${esc(t('completedUnit'))} · ${weekVotes} ${esc(t('votesLower'))}</div></div>
    </div>

    ${best ? `<div class="stats" style="margin-top:12px">
      <div class="stat"><b style="font-size:15px">${esc(best.h.name)}</b><span>${esc(t('onFire'))} ${pct(best.rate)}</span></div>
      ${worst ? `<div class="stat"><b style="font-size:15px">${esc(worst.h.name)}</b><span>${esc(t('needsLove'))} ${pct(worst.rate)}</span></div>` : ''}
      ${strong ? `<div class="stat"><b style="font-size:15px">${esc(dayShort(strong.i))}</b><span>${esc(t('strongestDay'))}</span></div>` : ''}
    </div>` : ''}

    <h2>${esc(t('thisWeekHabits'))}</h2>
    <div class="card">
      ${perDone.map(x => `<div class="prog-row" style="--c:${esc(x.h.color)}">
        <span class="name">${esc(x.h.name)}</span>
        <span class="streak ${x.streak >= 3 ? 'hot' : ''}">${I.flame}${x.streak}</span>
        <span class="pct">${x.hd}/${x.hs}</span></div>`).join('') || `<p class="muted small" style="margin:0">${esc(t('noData'))}</p>`}
    </div>

    ${vRows.length ? `<h2>${esc(t('votesThisWeek'))}</h2><div class="card">
      ${vRows.map(([k, n]) => `<div class="prog-row"><span class="name">${k ? esc(t('iAmX', k)) : `<span class="muted">${esc(t('noIdentity'))}</span>`}</span><span class="pct">${n}</span></div>`).join('')}
    </div>` : ''}

    <h2>${esc(t('reviewReflect'))}</h2>
    <textarea data-journal="${rkey}" placeholder="${esc(t('reviewReflectPh'))}">${esc(state.journal[rkey] || '')}</textarea>
    <p class="quote">${esc(t('q', t('quotes')[1]))}</p>
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
  'count-add'(el) {
    const h = habitById(el.dataset.id); if (!h) return;
    const d = parseKey(el.dataset.date);
    const was = isDone(h, d);
    setCount(h, d, getCount(h, d) + (h.step || 1));
    navigator.vibrate?.(8);
    if (!was && isDone(h, d)) { const msg = h.identity ? t('voteFor', h.identity) : t('vote'); toast(msg); }
    rerender();
  },
  'count-set'(el) {
    const h = habitById(el.dataset.id); if (!h) return;
    const d = parseKey(el.dataset.date);
    const v = prompt(t('enterAmount', h.unit || ''), String(getCount(h, d)));
    if (v === null) return;
    const n = parseInt(v, 10);
    if (isNaN(n)) return;
    setCount(h, d, n); rerender();
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
  async export() {
    const photos = {};
    for (const id of collectPhotoIds()) { const b = await photoGet(id); if (b) photos[id] = await blobToDataURL(b); }
    const blob = new Blob([JSON.stringify({ ...state, photos }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `atoms-backup-${dkey(today())}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t('backupDl'));
  },
  reset() {
    if (!confirm(t('eraseConfirm'))) return;
    const { lang: keepLang, aiModel } = state.settings;
    state = defaultState();
    if (keepLang) state.settings.lang = keepLang;
    if (aiModel) state.settings.aiModel = aiModel;
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
  if (el.name === 'sched' && el.form?.dataset.form === 'habit') el.form.dataset.sched = el.value;
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
      logType: LOG_TYPES.includes(get('logType')) ? get('logType') : '',
      sched: get('sched') === 'weekly' ? 'weekly' : 'days',
      perWeek: Math.min(7, Math.max(1, parseInt(get('perWeek'), 10) || 3)),
      goalCount: Math.max(0, parseInt(get('goalCount'), 10) || 0) || null,
      unit: get('unit'), step: Math.max(1, parseInt(get('step'), 10) || 1),
      afterPrayer: PRAYERS.includes(get('afterPrayer')) ? get('afterPrayer') : '',
      time: PRAYERS.includes(get('afterPrayer')) ? '' : get('time'),
      duration: Math.min(720, Math.max(0, parseInt(get('duration'), 10) || 0)) || null,
      location: get('location'),
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
  r.onload = async () => {
    try {
      const data = JSON.parse(r.result);
      if (!data || !Array.isArray(data.habits) || typeof data.log !== 'object') throw new Error('bad');
      if (!confirm(t('importConfirm', data.habits.length))) return;
      const photos = data.photos || {};
      delete data.photos;
      for (const id in photos) { try { await photoPut(id, dataURLtoBlob(photos[id])); } catch (_) {} }
      state = { ...defaultState(), ...data, settings: { ...(data.settings || {}) } };
      save(); applyLangChrome(); toast(t('restoredBackup')); location.hash = '#/today'; render();
    } catch (_) { toast(t('invalidBackup')); }
  };
  r.readAsText(file);
}

/* =========================================================
   On-device AI coach — WebLLM on WebGPU. Model weights are
   downloaded once and cached by the browser; prompts and
   answers never leave the phone.
   ========================================================= */
// Qwen2.5 1.5B Instruct (Apache-2.0): the smallest model that gave sensible, on-topic
// habit advice and form suggestions in English and French during testing.
const AI_MODELS = {
  standard: { id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC', mb: 880, name: 'Qwen2.5 1.5B' },
};
const ai = { status: 'idle', progress: 0, engine: null, worker: null, model: null, error: '', busy: false, loading: null, lib: null };
const aiKey = () => 'standard';
if (state.settings.aiModel && !AI_MODELS[state.settings.aiModel]) delete state.settings.aiModel;
const aiLib = async () => (ai.lib ||= await import('./vendor/web-llm.js'));

async function webgpuOk() {
  if (!navigator.gpu) return false;
  try { return !!(await navigator.gpu.requestAdapter()); } catch (_) { return false; }
}

function aiEnsure() {
  const key = aiKey();
  if (ai.status === 'ready' && ai.model === key) return Promise.resolve(true);
  if (ai.status === 'loading') return ai.loading;
  ai.loading = (async () => {
    if (!(await webgpuOk())) { ai.status = 'unsupported'; aiRefresh(); return false; }
    ai.status = 'loading'; ai.progress = 0; ai.error = ''; aiRefresh();
    aiWake();
    try {
      const lib = await aiLib();
      ai.worker?.terminate(); ai.engine = null;
      ai.worker = new Worker('llm-worker.js', { type: 'module' });
      ai.engine = await lib.CreateWebWorkerMLCEngine(ai.worker, AI_MODELS[key].id, {
        initProgressCallback: r => { ai.progress = r.progress || 0; aiProgress(); },
      });
      ai.model = key; ai.status = 'ready';
      state.settings.aiModel = key; save();
      aiWakeRelease(); aiRefresh();
      return true;
    } catch (e) {
      ai.worker?.terminate(); ai.worker = null; ai.engine = null;
      ai.status = 'error'; ai.error = String(e?.message || e).slice(0, 160);
      aiWakeRelease(); aiRefresh();
      return false;
    }
  })();
  return ai.loading;
}

// Android/iOS pause web apps when the screen locks, which stalls the long first
// download. Keep the screen awake while the model downloads and loads.
let aiWakeLock = null;
async function aiWake() {
  try { if (!aiWakeLock && navigator.wakeLock && document.visibilityState === 'visible') { aiWakeLock = await navigator.wakeLock.request('screen'); aiWakeLock.addEventListener('release', () => { aiWakeLock = null; }); } } catch (_) { /* optional */ }
}
function aiWakeRelease() { try { aiWakeLock?.release(); } catch (_) { /* ignore */ } aiWakeLock = null; }

/** Re-open a model downloaded in an earlier session, without ever starting a fresh download. */
async function aiAutoStart() {
  if (ai.status !== 'idle' || !state.settings.aiModel) return;
  try {
    const lib = await aiLib();
    if (await lib.hasModelInCache(AI_MODELS[state.settings.aiModel].id)) aiEnsure();
    else { delete state.settings.aiModel; save(); aiRefresh(); }
  } catch (_) { /* leave idle */ }
}

function aiPanel(where) {
  const s = ai.status;
  if (s === 'loading') {
    const p = Math.round(ai.progress * 100);
    return `<div class="meter"><i style="width:${p}%"></i></div><p class="small muted" data-ai-pct>${esc(t('aiLoading'))} ${p}%</p>
      ${state.settings.aiModel ? '' : `<p class="small ai-note">${esc(t('aiKeepOpen'))}</p>`}`;
  }
  if (s === 'unsupported') return `<p class="small ai-warn">${esc(t('aiUnsupported'))}</p>`;
  if (s === 'error') return `<p class="small ai-warn">${esc(t('aiError', ai.error))}</p><button class="btn sm" data-action="ai-start">${esc(t('retry'))}</button>`;
  if (s === 'ready') return where === 'more' ? `<p class="small" style="margin:0">✓ ${esc(t('aiModelLbl', AI_MODELS[ai.model].name))}</p>` : '';
  if (state.settings.aiModel) {
    return where === 'form' ? '' : `<button class="btn primary block" data-action="ai-start">${I.sparkle} ${esc(t('aiStart'))}</button>`;
  }
  return `
    <button class="btn primary block" data-action="ai-start">${I.sparkle} ${esc(t('aiDownload', AI_MODELS[aiKey()].mb))}</button>
    <p class="small muted" style="margin:8px 0 0">${esc(t('aiWifi'))}</p>`;
}
function aiRefresh() {
  document.querySelectorAll('[data-ai-panel]').forEach(el => { el.innerHTML = aiPanel(el.dataset.aiPanel); });
}
function aiProgress() {
  const p = Math.round(ai.progress * 100);
  document.querySelectorAll('[data-ai-panel] .meter i').forEach(i => { i.style.width = p + '%'; });
  document.querySelectorAll('[data-ai-pct]').forEach(el => { el.textContent = `${t('aiLoading')} ${p}%`; });
}

function coachContext() {
  const hl = activeHabits().map(h => `- ${h.name}${h.identity ? ` (${t('iAmX', h.identity)})` : ''}${h.type === 'break' ? ` · ${t('breakingChip')}` : ''} · ${schedText(h)}${h.time ? ` · ${h.time}` : ''}${h.duration ? ` · ${fmtDur(h.duration)}` : ''} · ${t('days30')}: ${pct(rate(h, 30))} · ${t('streak')}: ${currentStreak(h)}`).join('\n');
  const gl = state.goals.map(g => `- ${g.title}${g.why ? ` — ${g.why}` : ''}`).join('\n');
  const pts = prayerTimes(today());
  const pl = pts ? `\n- ${t('prayerTimesToday')}: ${PRAYERS.map(p => `${t('prayer_' + p)} ${hhmm(pts[p])}`).join(', ')}` : '';
  return t('aiSystem', (hl || t('aiNone')) + pl, gl || t('aiNone'));
}

function fmtMsg(text) {
  return esc(text.trim()).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/^#{1,4}\s*/gm, '');
}
const typing = '<span class="typing" aria-label="…"><i></i><i></i><i></i></span>';
const bubble = m => `<div class="msg ${m.role}">${m.content ? fmtMsg(m.content) : typing}</div>`;

function viewCoach() {
  const msgs = state.coach || [];
  setTimeout(aiAutoStart, 0);
  return `
    <header class="page-head">
      <div><h1>${esc(t('coach'))}</h1><div class="sub">${esc(t('coachSub'))}</div></div>
      ${msgs.length && !ai.busy ? `<button class="btn sm" data-action="coach-clear">${esc(t('clearChat'))}</button>` : ''}
    </header>
    <div class="card ai-intro">
      <p class="small muted" style="margin:0">🔒 ${esc(t('aiPrivacy'))}</p>
      <div data-ai-panel="coach">${aiPanel('coach')}</div>
    </div>
    <div class="chat" id="chat">${msgs.length ? msgs.map(bubble).join('') : `
      <p class="muted small">${esc(t('coachEmpty'))}</p>
      <div class="suggest">${t('coachSuggestions').map(q => `<button class="chip-btn" data-action="coach-suggest">${esc(q)}</button>`).join('')}</div>`}
    </div>
    <form class="composer" data-form="coach">
      <textarea name="q" rows="1" placeholder="${esc(t('coachPh'))}" aria-label="${esc(t('coachPh'))}">${esc(ui.coachDraft || '')}</textarea>
      ${ai.busy
        ? `<button class="icon-btn primary" type="button" data-action="coach-stop" aria-label="${esc(t('stop'))}">${I.stop}</button>`
        : `<button class="icon-btn primary" type="submit" aria-label="${esc(t('send'))}">${I.send}</button>`}
    </form>`;
}

const onCoach = () => (location.hash || '').startsWith('#/coach');
const scrollChat = () => { if (onCoach()) window.scrollTo(0, document.body.scrollHeight); };

async function coachAsk(text) {
  text = (text || '').trim();
  if (!text || ai.busy) return;
  if (!state.settings.aiModel && ai.status !== 'ready') { ui.coachDraft = text; toast(t('aiNeedDownload')); return; }
  state.coach ||= [];
  state.coach.push({ role: 'user', content: text });
  const reply = { role: 'assistant', content: '' };
  state.coach.push(reply);
  ui.coachDraft = '';
  ai.busy = true;
  save(); rerender(); scrollChat();
  try {
    if (!(await aiEnsure())) { state.coach.splice(-2); ui.coachDraft = text; return; }
    const history = state.coach.slice(-11, -1).map(({ role, content }) => ({ role, content }));
    const stream = await ai.engine.chat.completions.create({
      messages: [{ role: 'system', content: coachContext() }, ...history],
      stream: true, temperature: 0.6, max_tokens: 350,
    });
    for await (const chunk of stream) {
      reply.content += chunk.choices[0]?.delta?.content || '';
      const el = document.querySelector('#chat .msg.assistant:last-child');
      if (el) { el.innerHTML = reply.content ? fmtMsg(reply.content) : typing; scrollChat(); }
    }
  } catch (e) {
    if (!reply.content) reply.content = t('aiBadOutput');
  } finally {
    ai.busy = false;
    state.coach = state.coach.filter(m => m.content).slice(-40);
    save();
    if (onCoach()) { rerender(); scrollChat(); }
  }
}

async function aiFill(btn) {
  const form = btn.closest('form');
  const type = form.dataset.type;
  const ideaEl = $('#ai-idea');
  const idea = ideaEl.value.trim() || form.querySelector('[name="name"]').value.trim();
  if (!idea) { toast(t('aiNeedIdea')); ideaEl.focus(); return; }
  if (!state.settings.aiModel && ai.status !== 'ready') { toast(t('aiNeedDownload')); return; }
  if (ai.busy) return;
  const label = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = `${I.sparkle} ${esc(t('aiFilling'))}`;
  ai.busy = true;
  try {
    if (!(await aiEnsure())) return;
    const fields = type === 'break'
      ? { name: 'name', identity: 'identity', hideCue: 'l1', reframe: 'l2b', friction: 'l3b', accountability: 'l4b' }
      : { name: 'name', identity: 'identity', time: 'time', duration: 'duration', location: 'location', stack: 'stack', twoMin: 'twoMin', pair: 'l2', prime: 'l3', reward: 'l4' };
    const properties = {};
    for (const k in fields) properties[k] = { type: k === 'duration' ? 'integer' : 'string' };
    const schema = JSON.stringify({ type: 'object', properties, required: Object.keys(fields) });
    const res = await ai.engine.chat.completions.create({
      messages: [
        { role: 'user', content: t('aiFillPrompt', type, t('aiFillExample')[type][0]) },
        { role: 'assistant', content: t('aiFillExample')[type][1] },
        { role: 'user', content: t('aiFillPrompt', type, idea) },
      ],
      response_format: { type: 'json_object', schema }, temperature: 0.4, max_tokens: 450,
    });
    let data;
    try { data = JSON.parse(res.choices[0].message.content); } catch (_) { toast(t('aiBadOutput')); return; }
    let n = 0;
    for (const [k, field] of Object.entries(fields)) {
      const input = form.querySelector(`[name="${field}"]`);
      let val = data[k];
      if (!input || input.value.trim() || val == null || val === '') continue;
      if (k === 'time') {
        const m = String(val).match(/^(\d{1,2})[:h](\d{2})/);
        if (!m || +m[1] > 23 || +m[2] > 59) continue;
        val = `${pad(+m[1])}:${m[2]}`;
      }
      if (k === 'duration') { val = Math.round(Number(val)); if (!(val > 0 && val <= 720)) continue; }
      val = String(val).trim();
      if (k === 'identity') val = val.replace(/^(i am|je suis)\s+/i, '');
      if (k === 'stack') val = val.replace(/^(after i|après)\s+/i, '');
      input.value = val;
      input.classList.remove('ai-filled'); void input.offsetWidth; input.classList.add('ai-filled');
      n++;
    }
    toast(t(n ? 'aiFilled' : 'aiBadOutput'));
  } catch (_) {
    toast(t('aiBadOutput'));
  } finally {
    ai.busy = false; btn.disabled = false; btn.innerHTML = label;
  }
}

/* =========================================================
   Habit timer — counts down the habit's duration (or two
   minutes) and checks the habit off when time is up.
   Uses timestamps, so it stays correct if the app is
   backgrounded or reloaded.
   ========================================================= */
const TIMER_KEY = 'atoms-timer';
let timer = (() => { try { return JSON.parse(localStorage.getItem(TIMER_KEY)); } catch (_) { return null; } })();
let timerTick = null, wakeLock = null, audioCtx = null;

function saveTimer() { if (timer) localStorage.setItem(TIMER_KEY, JSON.stringify(timer)); else localStorage.removeItem(TIMER_KEY); }
function timerLeft() { return !timer ? 0 : timer.endsAt ? Math.max(0, (timer.endsAt - Date.now()) / 1000) : timer.left; }
const mmss = sec => { sec = Math.ceil(sec); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`; };

async function keepAwake() {
  try { if (!wakeLock && navigator.wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch (_) { /* optional */ }
}
function beep() {
  if (!audioCtx) return;
  [0, 0.25].forEach(at => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination);
    const t0 = audioCtx.currentTime + at;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    o.start(t0); o.stop(t0 + 0.2);
  });
}

function openTimer(id) {
  const h = habitById(id);
  if (!h || !h.duration) return;
  if (!timer || timer.id !== id) { timer = { id, total: h.duration * 60, left: h.duration * 60, endsAt: null, started: false }; saveTimer(); }
  renderTimer();
}
function startTimer(sec) {
  try { audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume?.(); } catch (_) { /* no sound */ }
  timer = { ...timer, total: sec, left: sec, endsAt: Date.now() + sec * 1000, started: true };
  saveTimer(); keepAwake(); renderTimer();
}
function pauseTimer() {
  if (timer.endsAt) { timer.left = timerLeft(); timer.endsAt = null; }
  else { timer.endsAt = Date.now() + timer.left * 1000; keepAwake(); }
  saveTimer(); renderTimer();
}
function closeTimer() {
  timer = null; saveTimer();
  clearInterval(timerTick); timerTick = null;
  wakeLock?.release?.(); wakeLock = null;
  const root = $('#timer'); root.innerHTML = ''; root.hidden = true;
}
function finishTimer() {
  const h = timer && habitById(timer.id);
  closeTimer();
  if (h && !isDone(h, today())) {
    setDone(h, today(), true);
    navigator.vibrate?.([200, 100, 200]); beep();
    toast(t('timerDone'));
  }
  rerender();
}

function renderTimer() {
  const h = timer && habitById(timer.id);
  const root = $('#timer');
  if (!h) { closeTimer(); return; }
  const C = 2 * Math.PI * 100;
  root.hidden = false;
  root.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(h.name)}" style="--c:${esc(h.color)}">
      <button class="del sheet-close" data-action="timer-close" aria-label="${esc(t(timer.started ? 'cancel' : 'close'))}">×</button>
      <div class="eyebrow">${esc(h.identity ? t('iAmX', h.identity) : t('duration'))}</div>
      <h2 style="margin:4px 0 0">${esc(h.name)}</h2>
      <div class="timer-ring">
        <svg viewBox="0 0 220 220"><circle class="track" cx="110" cy="110" r="100"/>
          <circle class="bar" id="timer-bar" cx="110" cy="110" r="100" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg>
        <div class="timer-time" id="timer-time" role="timer">${mmss(timerLeft())}</div>
      </div>
      ${timer.started ? `
        <div class="form-actions" style="margin-top:0">
          <button class="btn" data-action="timer-pause">${esc(t(timer.endsAt ? 'pause' : 'resume'))}</button>
          <button class="btn primary" data-action="timer-finish">${I.check} ${esc(t('finishNow'))}</button>
        </div>` : `
        <div class="stack-btns">
          <button class="btn primary block" data-action="timer-start" data-sec="${h.duration * 60}">${I.play} ${esc(t('timerFull', fmtDur(h.duration)))}</button>
          ${h.duration > 2 ? `<button class="btn block" data-action="timer-start" data-sec="120">${esc(t('timerTwo'))}${h.twoMin ? ` · ${esc(h.twoMin)}` : ''}</button>` : ''}
        </div>
        <p class="small muted" style="margin:12px 0 0">${esc(t('timerHint'))}</p>`}
    </div>`;
  const tick = () => {
    if (!timer) return;
    const left = timerLeft();
    const el = $('#timer-time'), bar = $('#timer-bar');
    if (el) el.textContent = mmss(left);
    if (bar) bar.style.strokeDashoffset = String(C * (1 - left / timer.total));
    if (timer.endsAt && left <= 0) finishTimer();
  };
  clearInterval(timerTick);
  tick();
  if (timer && timer.endsAt) timerTick = setInterval(tick, 250);
}

/* ---------- Coach, AI & timer actions ---------- */
Object.assign(actions, {
  'ai-start'() { aiEnsure(); },
  'ai-fill'(el) { aiFill(el); },
  async 'ai-remove'() {
    if (!confirm(t('aiRemoveConfirm'))) return;
    const key = state.settings.aiModel;
    try { await ai.engine?.unload?.(); } catch (_) { /* ignore */ }
    ai.worker?.terminate();
    Object.assign(ai, { status: 'idle', engine: null, worker: null, model: null, progress: 0 });
    try { if (key) await (await aiLib()).deleteModelAllInfoInCache(AI_MODELS[key].id); } catch (_) { /* ignore */ }
    delete state.settings.aiModel; save();
    toast(t('aiRemoved')); rerender();
  },
  'coach-suggest'(el) { coachAsk(el.textContent); },
  'coach-stop'() { try { ai.engine?.interruptGenerate(); } catch (_) { /* ignore */ } },
  'coach-clear'() { state.coach = []; save(); ai.engine?.resetChat?.().catch?.(() => {}); rerender(); },
  'timer-open'(el) { openTimer(el.dataset.id); },
  'timer-start'(el) { startTimer(Number(el.dataset.sec)); },
  'timer-pause'() { pauseTimer(); },
  'timer-finish'() { finishTimer(); },
  'timer-close'() { closeTimer(); },
});
forms.coach = f => coachAsk(f.elements.q.value);

document.addEventListener('input', e => {
  if (e.target.name === 'q' && e.target.closest('.composer')) ui.coachDraft = e.target.value;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.target.closest?.('.composer')) {
    e.preventDefault(); e.target.form.requestSubmit();
  }
  if (e.key === 'Escape' && timer && !$('#timer').hidden && !timer.started) closeTimer();
});

/* =========================================================
   Prayer times — computed on-device with Adhan (MIT) from
   the phone's location. Each prayer is a 15-minute block.
   ========================================================= */
const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_AR = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
const PRAYER_BLOCK = 15;
const PRAYER_COLOR = '#2b6c8f';
const PRAYER_METHODS = {
  mwl: () => adhan.CalculationMethod.MuslimWorldLeague(),
  uoif: () => new adhan.CalculationParameters('Other', 12, 12),
  morocco: () => new adhan.CalculationParameters('Other', 19, 17),
  egyptian: () => adhan.CalculationMethod.Egyptian(),
  karachi: () => adhan.CalculationMethod.Karachi(),
  ummalqura: () => adhan.CalculationMethod.UmmAlQura(),
  dubai: () => adhan.CalculationMethod.Dubai(),
  qatar: () => adhan.CalculationMethod.Qatar(),
  kuwait: () => adhan.CalculationMethod.Kuwait(),
  moonsighting: () => adhan.CalculationMethod.MoonsightingCommittee(),
  isna: () => adhan.CalculationMethod.NorthAmerica(),
  singapore: () => adhan.CalculationMethod.Singapore(),
  turkey: () => adhan.CalculationMethod.Turkey(),
  tehran: () => adhan.CalculationMethod.Tehran(),
};
const TZ_METHOD = {
  'Europe/Paris': 'uoif', 'Africa/Casablanca': 'morocco', 'Africa/El_Aaiun': 'morocco',
  'Asia/Riyadh': 'ummalqura', 'Asia/Dubai': 'dubai', 'Asia/Muscat': 'dubai', 'Asia/Qatar': 'qatar',
  'Asia/Kuwait': 'kuwait', 'Asia/Bahrain': 'kuwait', 'Africa/Cairo': 'egyptian',
  'Asia/Karachi': 'karachi', 'Asia/Kolkata': 'karachi', 'Asia/Dhaka': 'karachi',
  'Europe/Istanbul': 'turkey', 'Asia/Tehran': 'tehran',
  'Asia/Singapore': 'singapore', 'Asia/Kuala_Lumpur': 'singapore', 'Asia/Jakarta': 'singapore',
};
const currentTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (_) { return ''; } };
function autoMethod() {
  const tz = currentTz();
  return TZ_METHOD[tz] || (/^America\//.test(tz) ? 'moonsighting' : 'mwl');
}
const prayerCfg = () => (state.settings.prayer ||= { on: false, autoLoc: true, madhab: 'shafi', adj: {} });
const prayerMethod = () => (PRAYER_METHODS[prayerCfg().method] ? prayerCfg().method : autoMethod());
const hhmm = dt => `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

function prayerTimes(d) {
  const c = state.settings.prayer;
  if (!c || !c.on || c.lat == null || typeof adhan === 'undefined') return null;
  try {
    const coords = new adhan.Coordinates(c.lat, c.lng);
    const params = PRAYER_METHODS[prayerMethod()]();
    params.madhab = c.madhab === 'hanafi' ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.recommended(coords);
    params.polarCircleResolution = adhan.PolarCircleResolution.AqrabYaum;
    for (const p of PRAYERS) params.adjustments[p] = (params.adjustments[p] || 0) + (Number(c.adj?.[p]) || 0);
    const pt = new adhan.PrayerTimes(coords, new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12), params);
    if (PRAYERS.some(p => !(pt[p] instanceof Date) || isNaN(pt[p]))) return null;
    return { fajr: pt.fajr, sunrise: pt.sunrise, dhuhr: pt.dhuhr, asr: pt.asr, maghrib: pt.maghrib, isha: pt.isha };
  } catch (_) { return null; }
}

const fmtIn = ms => { const m = Math.max(1, Math.round(ms / 60000)); return m >= 60 ? `${Math.floor(m / 60)} h ${pad(m % 60)}` : `${m} ${t('minUnit')}`; };

function prayerRow(p, pts, d, isToday) {
  const k = dkey(d);
  const done = !!state.prayerLog[k]?.[p];
  const start = pts[p], end = new Date(start.getTime() + PRAYER_BLOCK * 60000);
  const now = new Date();
  const chips = [];
  if (isToday && !done) {
    const next = PRAYERS.find(x => pts[x] > now);
    if (now >= start && now < end) chips.push(`<span class="chip now">${esc(t('prayerNow'))}</span>`);
    else if (next === p) chips.push(`<span class="chip">${esc(t('prayerIn', fmtIn(start - now)))}</span>`);
  }
  const meta = `${fmtTime(hhmm(start))}–${fmtTime(hhmm(end))}${p === 'fajr' && pts.sunrise ? ` · ${t('sunrise')} ${fmtTime(hhmm(pts.sunrise))}` : ''}`;
  return `
    <li class="habit prayer ${done ? 'is-done' : ''}" style="--c:${PRAYER_COLOR}">
      <button class="check" data-action="pray" data-p="${p}" data-date="${k}" aria-pressed="${done}" aria-label="${esc(t('prayed', t('prayer_' + p)))}">${I.check}</button>
      <a class="habit-body" href="#/prayers">
        <span class="habit-name">${esc(t('prayer_' + p))} <span class="ar" lang="ar">${PRAYER_AR[p]}</span></span>
        <span class="habit-meta">${esc(meta)}</span>
        ${chips.length ? `<span class="chips">${chips.join('')}</span>` : ''}
      </a>
      <span class="moon" aria-hidden="true">${I.moon}</span>
    </li>`;
}

function relTime(ms) {
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: 'auto' });
  const m = Math.round((ms - Date.now()) / 60000);
  if (Math.abs(m) < 60) return rtf.format(m, 'minute');
  const h = Math.round(m / 60);
  return Math.abs(h) < 24 ? rtf.format(h, 'hour') : rtf.format(Math.round(h / 24), 'day');
}

function prayerLocate(silent) {
  if (!navigator.geolocation) { if (!silent) toast(t('locUnavailable')); return; }
  if (ui.locating) return;
  ui.locating = true;
  if (!silent) rerender();
  navigator.geolocation.getCurrentPosition(pos => {
    const c = prayerCfg();
    c.lat = +pos.coords.latitude.toFixed(3);
    c.lng = +pos.coords.longitude.toFixed(3);
    c.locAt = Date.now(); c.tz = currentTz();
    ui.locating = false; save();
    if (!silent) toast(t('locUpdated'));
    const route = location.hash || '#/today';
    if (!silent || route === '#/today' || route === '#/prayers') rerender();
  }, err => {
    ui.locating = false;
    if (!silent) { toast(t(err.code === 1 ? 'locDenied' : 'locFailed')); rerender(); }
  }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60000 });
}

/** Quietly refresh the position when the app opens, if the user already granted access. */
async function prayerAutoLocate() {
  const c = state.settings.prayer;
  if (!c?.on || c.autoLoc === false || !navigator.permissions?.query) return;
  const stale = !c.locAt || Date.now() - c.locAt > 30 * 60000 || c.tz !== currentTz();
  if (!stale) return;
  try {
    const perm = await navigator.permissions.query({ name: 'geolocation' });
    if (perm.state === 'granted') prayerLocate(true);
  } catch (_) { /* not supported */ }
}

function viewPrayers() {
  const c = prayerCfg();
  const pts = prayerTimes(today());
  const methodName = k => t('methods')[k];
  return `
    <a class="back" href="#/today">${I.left} ${esc(t('today'))}</a>
    <header class="page-head"><div><h1>${esc(t('prayers'))}</h1><div class="sub">${esc(t('prayersSub'))}</div></div></header>

    <div class="card">
      <label class="switch-row"><span>${esc(t('prayerShow'))}</span>
        <input type="checkbox" class="switch" data-prayer="on" ${c.on ? 'checked' : ''}></label>
    </div>

    ${c.on ? `
    <h2>${esc(t('yourLocation'))}</h2>
    <div class="card">
      ${c.lat != null ? `
        <div class="row"><span class="ico-inline">${I.pin}</span><b>${num(Math.abs(c.lat), 3)}° ${c.lat >= 0 ? 'N' : 'S'} · ${num(Math.abs(c.lng), 3)}° ${c.lng >= 0 ? 'E' : (lang() === 'fr' ? 'O' : 'W')}</b></div>
        <p class="small muted" style="margin:4px 0 12px">${c.locAt ? esc(t('locUpdatedAgo', relTime(c.locAt))) : ''}${c.tz ? ` · ${esc(c.tz.replace(/_/g, ' '))}` : ''}</p>`
      : `<p class="small muted" style="margin-top:0">${esc(t('locNone'))}</p>`}
      <button class="btn ${c.lat == null ? 'primary' : ''} block" data-action="prayer-locate" ${ui.locating ? 'disabled' : ''}>${I.pin} ${esc(t(ui.locating ? 'locating' : c.lat == null ? 'useLocation' : 'updateLocation'))}</button>
      <label class="check-row"><input type="checkbox" data-prayer="autoLoc" ${c.autoLoc !== false ? 'checked' : ''}> ${esc(t('autoLoc'))}</label>
      <details class="more-opts">
        <summary>${esc(t('manualCoords'))}</summary>
        <form class="two" data-form="prayer-coords" style="margin-top:10px">
          <label class="field"><span>${esc(t('latitude'))}</span><input type="text" inputmode="decimal" name="lat" value="${c.lat ?? ''}" placeholder="48.857"></label>
          <label class="field"><span>${esc(t('longitude'))}</span><input type="text" inputmode="decimal" name="lng" value="${c.lng ?? ''}" placeholder="2.352"></label>
          <button class="btn sm" type="submit" style="grid-column:1/-1">${esc(t('saveT2'))}</button>
        </form>
      </details>
    </div>

    ${pts ? `
    <h2>${esc(t('today'))}</h2>
    <div class="card">
      <ul class="times">
        ${PRAYERS.map(p => `<li><span>${esc(t('prayer_' + p))} <span class="ar" lang="ar">${PRAYER_AR[p]}</span></span><b>${esc(fmtTime(hhmm(pts[p])))}</b></li>
          ${p === 'fajr' ? `<li class="muted"><span>${esc(t('sunrise'))}</span><span>${esc(fmtTime(hhmm(pts.sunrise)))}</span></li>` : ''}`).join('')}
      </ul>
    </div>` : ''}

    <h2>${esc(t('calcMethod'))}</h2>
    <div class="card">
      <label class="field" style="margin-top:0"><span>${esc(t('calcMethod'))}</span>
        <select data-prayer="method">
          <option value="" ${!PRAYER_METHODS[c.method] ? 'selected' : ''}>${esc(t('methodAuto', methodName(autoMethod())))}</option>
          ${Object.keys(PRAYER_METHODS).map(k => `<option value="${k}" ${c.method === k ? 'selected' : ''}>${esc(methodName(k))}</option>`).join('')}
        </select></label>
      <label class="field"><span>${esc(t('asrLabel'))}</span>
        <select data-prayer="madhab">
          <option value="shafi" ${c.madhab !== 'hanafi' ? 'selected' : ''}>${esc(t('asrShafi'))}</option>
          <option value="hanafi" ${c.madhab === 'hanafi' ? 'selected' : ''}>${esc(t('asrHanafi'))}</option>
        </select></label>
      <details class="more-opts">
        <summary>${esc(t('adjustMinutes'))}</summary>
        <p class="small muted">${esc(t('adjustHint'))}</p>
        <div class="adj">${PRAYERS.map(p => `
          <label class="field"><span>${esc(t('prayer_' + p))}</span><span class="suffix">
            <input type="number" inputmode="numeric" min="-30" max="30" step="1" data-prayer="adj" data-p="${p}" value="${Number(c.adj?.[p]) || 0}"><em>${esc(t('minUnit'))}</em></span></label>`).join('')}
        </div>
      </details>
    </div>` : ''}
  `;
}

function prayerProgress() {
  const c = state.settings.prayer;
  if (!c?.on) return '';
  const td = today();
  const since = c.since || dkey(td);
  const rows = PRAYERS.map(p => {
    let dots = '', sched = 0, done = 0;
    for (let i = 13; i >= 0; i--) {
      const d = addDays(td, -i), k = dkey(d);
      const did = !!state.prayerLog[k]?.[p];
      const counts = k >= since && (i > 0 || did);
      if (counts) { sched++; if (did) done++; }
      dots += `<i class="${did ? 'd' : counts ? '' : 'o'}"></i>`;
    }
    return `<a class="prog-row" href="#/prayers" style="--c:${PRAYER_COLOR}"><span class="name">${esc(t('prayer_' + p))}</span>
      <span class="dots" aria-hidden="true">${dots}</span><span class="pct">${pct(sched ? done / sched : 0)}</span></a>`;
  }).join('');
  return `<h2>${esc(t('prayers14'))}</h2><div class="card">${rows}</div>`;
}

Object.assign(actions, {
  pray(el) {
    const k = el.dataset.date, p = el.dataset.p;
    const now = !state.prayerLog[k]?.[p];
    if (now) { (state.prayerLog[k] ||= {})[p] = true; navigator.vibrate?.(12); }
    else { delete state.prayerLog[k][p]; if (!Object.keys(state.prayerLog[k]).length) delete state.prayerLog[k]; }
    save(); rerender();
  },
  'prayer-locate'() { prayerLocate(false); },
});
forms['prayer-coords'] = f => {
  const lat = parseFloat(String(f.elements.lat.value).replace(',', '.'));
  const lng = parseFloat(String(f.elements.lng.value).replace(',', '.'));
  if (!(lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)) { toast(t('coordsInvalid')); return; }
  const c = prayerCfg();
  Object.assign(c, { lat: +lat.toFixed(3), lng: +lng.toFixed(3), locAt: Date.now(), tz: currentTz(), autoLoc: false });
  save(); toast(t('locUpdated')); rerender();
};
document.addEventListener('change', e => {
  const el = e.target, key = el.dataset?.prayer;
  if (!key) return;
  const c = prayerCfg();
  if (key === 'on') {
    c.on = el.checked;
    if (c.on && !c.since) c.since = dkey(today());
    if (c.on && c.lat == null) { save(); rerender(); prayerLocate(false); return; }
  }
  if (key === 'autoLoc') c.autoLoc = el.checked;
  if (key === 'method') c.method = el.value || null;
  if (key === 'madhab') c.madhab = el.value;
  if (key === 'adj') { (c.adj ||= {})[el.dataset.p] = Math.max(-30, Math.min(30, parseInt(el.value, 10) || 0)); }
  save(); rerender();
});

/* =========================================================
   Logbook — per-day entries with photos, structured fields,
   links, and workout sets. Photos are stored on-device in
   IndexedDB; everything is bundled into export/import.
   ========================================================= */

const LOG_TYPES = ['', 'note', 'reading', 'writing', 'workout', 'leetcode', 'photo'];

/* ---- IndexedDB photo store ---- */
const DB_NAME = 'atoms-media', PHOTO_STORE = 'photos';
let _dbP;
function idb() {
  return _dbP || (_dbP = new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(PHOTO_STORE)) r.result.createObjectStore(PHOTO_STORE); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
}
async function photoPut(id, blob) { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction(PHOTO_STORE, 'readwrite'); tx.objectStore(PHOTO_STORE).put(blob, id); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); }
async function photoGet(id) { const db = await idb(); return new Promise((res) => { const tx = db.transaction(PHOTO_STORE, 'readonly'); const rq = tx.objectStore(PHOTO_STORE).get(id); rq.onsuccess = () => res(rq.result || null); rq.onerror = () => res(null); }); }
async function photoDel(id) { const db = await idb(); return new Promise((res) => { const tx = db.transaction(PHOTO_STORE, 'readwrite'); tx.objectStore(PHOTO_STORE).delete(id); tx.oncomplete = () => res(); tx.onerror = () => res(); }); }

/* ---- Image capture → resized JPEG blob ---- */
function resizeImage(file, max = 1400, quality = 0.82) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      c.toBlob(b => b ? res(b) : rej(new Error('encode')), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('load')); };
    img.src = url;
  });
}

/* ---- Display: hydrate <img data-photo="id"> from IndexedDB ---- */
const _photoURLs = new Map();
async function hydratePhotos() {
  for (const el of document.querySelectorAll('img[data-photo]')) {
    const id = el.dataset.photo;
    if (el.dataset.loaded) continue;
    el.dataset.loaded = '1';
    if (_photoURLs.has(id)) { el.src = _photoURLs.get(id); continue; }
    const blob = await photoGet(id);
    if (blob) { const u = URL.createObjectURL(blob); _photoURLs.set(id, u); el.src = u; }
  }
}
const blobToDataURL = b => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); });
function dataURLtoBlob(d) { const [m, b64] = d.split(','); const mime = (m.match(/:(.*?);/) || [])[1] || 'image/jpeg'; const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: mime }); }

/* ---- Entry model ---- */
const getEntry = (hid, k) => state.entries?.[hid]?.[k] || null;
function setEntry(hid, k, entry) { state.entries ||= {}; (state.entries[hid] ||= {})[k] = entry; save(); }
function collectPhotoIds() { const ids = []; for (const hid in (state.entries || {})) for (const k in state.entries[hid]) (state.entries[hid][k].photos || []).forEach(id => ids.push(id)); return ids; }
function hasLog(hid) { const m = state.entries?.[hid]; return m && Object.keys(m).length; }
function entriesFor(hid) { const m = state.entries?.[hid] || {}; return Object.keys(m).sort().reverse().map(k => ({ k, e: m[k] })); }

/* ---- Workout: read last weights for an exercise ---- */
function lastWeight(hid, exName, beforeKey) {
  const m = state.entries?.[hid] || {};
  for (const k of Object.keys(m).sort().reverse()) {
    if (beforeKey && k >= beforeKey) continue;
    const sets = (m[k].sets || []).filter(s => s.ex === exName && s.weight);
    if (sets.length) return sets[sets.length - 1].weight;
  }
  return '';
}
const sessionForDate = (h, d) => (h.program?.dayMap?.[d.getDay()]) || 'push';

/* =========================================================
   Entry editor (bottom sheet)
   ========================================================= */
let editing = null; // { hid, dateKey, photos:[], session }

function openEntry(hid, dateKey) {
  const h = habitById(hid);
  if (!h) return;
  const ex = getEntry(hid, dateKey) || {};
  editing = { hid, dateKey, photos: [...(ex.photos || [])], session: ex.session || (h.logType === 'workout' ? sessionForDate(h, parseKey(dateKey)) : ''), draft: null };
  renderEntry();
}
function closeEntry() { editing = null; const r = $('#modal'); r.hidden = true; r.innerHTML = ''; }

function photoStrip() {
  return `<div class="photos">
    ${editing.photos.map(id => `<div class="ph"><img data-photo="${id}" alt=""><button class="ph-x" data-action="entry-delphoto" data-pid="${id}" aria-label="${esc(t('remove'))}">×</button></div>`).join('')}
    <button class="ph-add" data-action="entry-addphoto" aria-label="${esc(t('addPhoto'))}">${I.camera}<span>${esc(t('addPhoto'))}</span></button>
  </div>
  <input type="file" accept="image/*" capture="environment" id="entry-file" hidden>`;
}

function captureDraft() {
  if (!editing) return;
  const d = editing.draft || (editing.draft = {});
  ['e-book', 'e-page', 'e-language', 'e-note', 'e-link', 'e-title', 'e-words'].forEach(id => { const el = document.getElementById(id); if (el) d[id] = el.value; });
  if (document.querySelector('#modal .exercise')) {
    const sets = [];
    document.querySelectorAll('#modal .exercise .setrow').forEach(row => { const w = row.querySelector('.w'), r = row.querySelector('.r'); sets.push({ ex: w.dataset.ex, weight: w.value, reps: r.value }); });
    d.sets = sets;
  }
  if (document.querySelector('#modal .problem')) {
    d.problems = [...document.querySelectorAll('#modal .problem')].map(row => ({
      title: row.querySelector('.p-title').value, difficulty: row.querySelector('.p-diff').value,
      topic: row.querySelector('.p-topic').value, status: row.querySelector('.p-status').value,
      note: row.querySelector('.p-note').value,
    }));
  }
}
function renderEntry() {
  const h = habitById(editing.hid);
  const ex = getEntry(editing.hid, editing.dateKey) || {};
  const f = ex.fields || {};
  const dr = editing.draft || {};
  const gv = (id, fb) => (id in dr ? dr[id] : fb);
  const d = parseKey(editing.dateKey);
  let body = '';

  if (h.logType === 'reading') {
    body = `
      <label class="field"><span>${esc(t('fBook'))}</span><input type="text" id="e-book" value="${esc(gv('e-book', f.book || ''))}" placeholder="${esc(t('fBookPh'))}"></label>
      <div class="two">
        <label class="field"><span>${esc(t('fPage'))}</span><input type="text" inputmode="numeric" id="e-page" value="${esc(gv('e-page', f.page || ''))}" placeholder="e.g. 42"></label>
        <label class="field"><span>${esc(t('fLanguage'))}</span><input type="text" id="e-language" value="${esc(gv('e-language', f.language || ''))}" placeholder="${esc(t('fLanguagePh'))}" list="lang-list">
          <datalist id="lang-list"><option value="English"><option value="Français"><option value="العربية"></datalist></label>
      </div>
      <label class="field"><span>${esc(t('fNotes'))}</span><textarea id="e-note" class="short" placeholder="${esc(t('fReadNotePh'))}">${esc(gv('e-note', ex.note || ''))}</textarea></label>`;
  } else if (h.logType === 'writing') {
    body = `
      <label class="field"><span>${esc(t('fLink'))}</span><input type="url" id="e-link" value="${esc(gv('e-link', ex.link || ''))}" placeholder="https://…"></label>
      <label class="field"><span>${esc(t('fWhat'))}</span><input type="text" id="e-title" value="${esc(gv('e-title', f.title || ''))}" placeholder="${esc(t('fWhatPh'))}"></label>
      <label class="field"><span>${esc(t('fWords'))}</span><input type="text" inputmode="numeric" id="e-words" value="${esc(gv('e-words', f.words || ''))}" placeholder="e.g. 500"></label>
      <label class="field"><span>${esc(t('fNotes'))}</span><textarea id="e-note" class="short" placeholder="${esc(t('fWriteNotePh'))}">${esc(gv('e-note', ex.note || ''))}</textarea></label>`;
  } else if (h.logType === 'workout') {
    const sess = editing.session;
    const exs = (h.program?.sessions?.[sess]) || [];
    const prevSets = (editing.draft && editing.draft.sets) ? editing.draft.sets : (ex.sets || []);
    const rows = exs.map((pe, i) => {
      const done = prevSets.filter(s => s.ex === pe.name);
      const n = Math.max(pe.sets || 3, done.length);
      const last = lastWeight(editing.hid, pe.name, editing.dateKey);
      let setRows = '';
      for (let si = 0; si < n; si++) {
        const s = done[si] || {};
        setRows += `<div class="setrow">
          <span class="setn">${si + 1}</span>
          <input type="text" inputmode="decimal" class="w" data-ex="${esc(pe.name)}" value="${esc(s.weight || '')}" placeholder="${last ? esc(last) : t('kg')}" aria-label="${esc(t('weight'))}">
          <em>×</em>
          <input type="text" inputmode="numeric" class="r" data-ex="${esc(pe.name)}" value="${esc(s.reps || '')}" placeholder="${esc(pe.reps || '')}" aria-label="${esc(t('reps'))}">
        </div>`;
      }
      return `<div class="exercise"><div class="ex-head"><b>${esc(pe.name)}</b><span class="muted small">${esc(pe.sets)}×${esc(pe.reps)}${last ? ` · ${t('last')} ${esc(last)}` : ''}</span></div>${setRows}</div>`;
    }).join('');
    const ramp = h.program?.rampWeeks && daysBetween(parseKey(h.createdAt), d) < h.program.rampWeeks * 7
      ? `<p class="ai-note small">${esc(t('rampNote'))}</p>` : '';
    body = `
      <div class="seg-pick">${['push','pull','legs'].map(sv => `<button class="pill ${sess===sv?'on':''}" data-action="entry-session" data-s="${sv}">${esc(t('sess_'+sv))}</button>`).join('')}</div>
      ${ramp}
      <div class="exercises">${exs.length ? rows : `<p class="muted small">${esc(t('noProgram'))}</p>`}</div>
      <label class="field"><span>${esc(t('fNotes'))}</span><textarea id="e-note" class="short" placeholder="${esc(t('fWorkoutNotePh'))}">${esc(gv('e-note', ex.note || ''))}</textarea></label>`;
  } else if (h.logType === 'leetcode') {
    const probs = dr.problems ? dr.problems : (ex.problems && ex.problems.length ? ex.problems : [{ title:'', difficulty:'med', topic:'', status:'solved', note:'' }]);
    const rows = probs.map((pr, i) => `
      <div class="problem" data-i="${i}">
        <div class="p-row1">
          <input class="p-title" value="${esc(pr.title || '')}" placeholder="${esc(t('pTitlePh'))}">
          <select class="p-diff" aria-label="${esc(t('difficulty'))}">${['easy','med','hard'].map(dd => `<option value="${dd}" ${pr.difficulty===dd?'selected':''}>${esc(t('diff_'+dd))}</option>`).join('')}</select>
          <button class="p-x" data-action="leet-del" data-i="${i}" aria-label="${esc(t('remove'))}">×</button>
        </div>
        <div class="p-row2">
          <input class="p-topic" value="${esc(pr.topic || '')}" placeholder="${esc(t('pTopicPh'))}" list="topic-list">
          <select class="p-status" aria-label="${esc(t('status'))}">${['solved','review','stuck'].map(st => `<option value="${st}" ${pr.status===st?'selected':''}>${esc(t('st_'+st))}</option>`).join('')}</select>
        </div>
        <input class="p-note" value="${esc(pr.note || '')}" placeholder="${esc(t('pNotePh'))}">
      </div>`).join('');
    body = `
      <div class="problems">${rows}</div>
      <button class="btn sm" type="button" data-action="leet-add" style="margin-top:8px">${I.plus} ${esc(t('addProblem'))}</button>
      <datalist id="topic-list">${['Arrays','Hashing','Two pointers','Sliding window','Stack','Binary search','Linked list','Trees','Graphs','DP','Greedy','Backtracking','Heap','Intervals','Bit manipulation','Math'].map(x=>`<option value="${x}">`).join('')}</datalist>
      <label class="field"><span>${esc(t('fNotes'))}</span><textarea id="e-note" class="short" placeholder="${esc(t('fLeetNotePh'))}">${esc(gv('e-note', ex.note || ''))}</textarea></label>`;
  } else if (h.logType === 'photo') {
    body = `<p class="muted small" style="margin-top:0">${esc(t('photoLogHint'))}</p>
      <label class="field"><span>${esc(t('fNotes'))}</span><textarea id="e-note" class="short" placeholder="${esc(t('fPhotoNotePh'))}">${esc(gv('e-note', ex.note || ''))}</textarea></label>`;
  } else {
    body = `<label class="field"><span>${esc(t('fNotes'))}</span><textarea id="e-note" class="short" placeholder="${esc(t('fNotePh'))}">${esc(gv('e-note', ex.note || ''))}</textarea></label>`;
  }

  const r = $('#modal');
  r.hidden = false;
  r.innerHTML = `
    <div class="sheet logsheet" role="dialog" aria-modal="true" aria-label="${esc(h.name)}" style="--c:${esc(h.color)}">
      <button class="del sheet-close" data-action="entry-close" aria-label="${esc(t('close'))}">×</button>
      <div class="eyebrow">${esc(fmtLong(d))}</div>
      <h2 style="margin:2px 0 14px">${esc(h.name)}</h2>
      <div class="log-body">
        ${body}
        <div class="field"><span>${esc(t('photos'))}</span>${photoStrip()}</div>
      </div>
      <div class="form-actions" style="margin-top:16px">
        ${getEntry(editing.hid, editing.dateKey) ? `<button class="btn" data-action="entry-del">${I.trash}</button>` : ''}
        <button class="btn primary" data-action="entry-save" style="flex:1">${I.check} ${esc(t('saveLog'))}</button>
      </div>
    </div>`;
  hydratePhotos();
  const f2 = $('#entry-file'); if (f2) f2.onchange = onEntryFile;
  document.querySelectorAll('#modal textarea').forEach(fit);
}

async function onEntryFile(e) {
  const file = e.target.files[0];
  if (!file || !editing) return;
  try {
    const blob = await resizeImage(file);
    const id = 'ph_' + uid();
    captureDraft();
    await photoPut(id, blob);
    editing.photos.push(id);
    renderEntry();
  } catch (_) { toast(t('photoFailed')); }
}

function gatherEntry() {
  const h = habitById(editing.hid);
  const val = id => ($('#' + id)?.value || '').trim();
  const e = { photos: [...editing.photos] };
  const note = val('e-note'); if (note) e.note = note;
  if (h.logType === 'reading') { e.fields = { book: val('e-book'), page: val('e-page'), language: val('e-language') }; }
  else if (h.logType === 'writing') { if (val('e-link')) e.link = val('e-link'); e.fields = { title: val('e-title'), words: val('e-words') }; }
  else if (h.logType === 'workout') {
    e.session = editing.session;
    const sets = [];
    document.querySelectorAll('#modal .exercise').forEach(ex => {
      ex.querySelectorAll('.setrow').forEach(row => {
        const w = row.querySelector('.w'), r = row.querySelector('.r');
        if ((w.value || '').trim() || (r.value || '').trim()) sets.push({ ex: w.dataset.ex, weight: w.value.trim(), reps: r.value.trim() });
      });
    });
    e.sets = sets;
  } else if (h.logType === 'leetcode') {
    const probs = [];
    document.querySelectorAll('#modal .problem').forEach(row => {
      const title = row.querySelector('.p-title').value.trim();
      if (!title) return;
      probs.push({ title, difficulty: row.querySelector('.p-diff').value, topic: row.querySelector('.p-topic').value.trim(), status: row.querySelector('.p-status').value, note: row.querySelector('.p-note').value.trim() });
    });
    e.problems = probs;
  }
  return e;
}

Object.assign(actions, {
  'log-open'(el) { openEntry(el.dataset.id, el.dataset.date); },
  'entry-close'() { closeEntry(); },
  'entry-addphoto'() { $('#entry-file')?.click(); },
  async 'entry-delphoto'(el) { captureDraft(); const pid = el.dataset.pid; editing.photos = editing.photos.filter(x => x !== pid); await photoDel(pid); renderEntry(); },
  'entry-session'(el) { captureDraft(); if (editing.draft) delete editing.draft.sets; editing.session = el.dataset.s; renderEntry(); },
  'leet-add'() { captureDraft(); editing.draft = editing.draft || {}; editing.draft.problems = editing.draft.problems || []; editing.draft.problems.push({ title:'', difficulty:'med', topic:'', status:'solved', note:'' }); renderEntry(); },
  'leet-del'(el) { captureDraft(); const i = +el.dataset.i; editing.draft = editing.draft || {}; editing.draft.problems = editing.draft.problems || []; editing.draft.problems.splice(i, 1); if (!editing.draft.problems.length) editing.draft.problems.push({ title:'', difficulty:'med', topic:'', status:'solved', note:'' }); renderEntry(); },
  'leet-resolve'(el) { const e = getEntry(el.dataset.hid, el.dataset.k); const i = +el.dataset.i; if (e?.problems?.[i]) { e.problems[i].status = 'solved'; save(); toast(t('logSaved')); rerender(); } },
  'entry-save'() {
    const e = gatherEntry();
    setEntry(editing.hid, editing.dateKey, e);
    const h = habitById(editing.hid);
    if (!isDone(h, parseKey(editing.dateKey))) setDone(h, parseKey(editing.dateKey), true);
    navigator.vibrate?.(12);
    toast(t('logSaved'));
    closeEntry(); rerender();
  },
  async 'entry-del'() {
    const e = getEntry(editing.hid, editing.dateKey);
    if (!confirm(t('delLogConfirm'))) return;
    for (const pid of (e?.photos || [])) await photoDel(pid);
    if (state.entries?.[editing.hid]) { delete state.entries[editing.hid][editing.dateKey]; save(); }
    closeEntry(); rerender();
  },
});

/* ---- Detail page: log history ---- */
function photoThumbs(photos) {
  if (!photos || !photos.length) return '';
  return `<div class="thumbs">${photos.map(id => `<img data-photo="${id}" alt="" loading="lazy">`).join('')}</div>`;
}
function entryLine(h, k, e) {
  const d = parseKey(k);
  const date = `<span class="muted small">${esc(fmtShort(d))}</span>`;
  const f = e.fields || {};
  if (h.logType === 'reading')
    return `<div class="logrow">${date}<div>${f.book ? `<b>${esc(f.book)}</b>` : ''}${f.page ? ` · ${t('pageN', esc(f.page))}` : ''}${f.language ? ` <span class="chip">${esc(f.language)}</span>` : ''}${e.note ? `<div class="small">${esc(e.note)}</div>` : ''}${photoThumbs(e.photos)}</div></div>`;
  if (h.logType === 'writing')
    return `<div class="logrow">${date}<div>${f.title ? `<b>${esc(f.title)}</b>` : ''}${f.words ? ` · ${esc(f.words)} ${t('wordsUnit')}` : ''}${e.link ? `<div><a href="${esc(e.link)}" target="_blank" rel="noopener">${esc(e.link.replace(/^https?:\/\//, '').slice(0, 40))}</a></div>` : ''}${e.note ? `<div class="small">${esc(e.note)}</div>` : ''}${photoThumbs(e.photos)}</div></div>`;
  if (h.logType === 'workout') {
    const byEx = {};
    (e.sets || []).forEach(s => { (byEx[s.ex] ||= []).push(s); });
    const lines = Object.entries(byEx).map(([ex, ss]) => `<div class="small"><b>${esc(ex)}</b> — ${ss.map(s => `${esc(s.weight || '?')}${t('kg')}×${esc(s.reps || '?')}`).join(', ')}</div>`).join('');
    return `<div class="logrow">${date}<div><b>${esc(t('sess_' + (e.session || 'push')))}</b>${e.sets?.length ? '' : ` · ${esc(t('rest'))}`}${lines}${e.note ? `<div class="small muted">${esc(e.note)}</div>` : ''}${photoThumbs(e.photos)}</div></div>`;
  }
  if (h.logType === 'leetcode') {
    const ps = e.problems || [];
    const b = ps.map(pr => `<div class="small"><b>${esc(pr.title)}</b> <span class="chip diff-${esc(pr.difficulty)}">${esc(t('diff_' + pr.difficulty))}</span>${pr.topic ? ` · ${esc(pr.topic)}` : ''} <span class="muted">${esc(t('st_' + pr.status))}</span>${pr.note ? `<div class="muted">${esc(pr.note)}</div>` : ''}</div>`).join('');
    return `<div class="logrow">${date}<div>${ps.length ? b : `<span class="muted small">${esc(t('rest'))}</span>`}${e.note ? `<div class="small muted">${esc(e.note)}</div>` : ''}${photoThumbs(e.photos)}</div></div>`;
  }
  return `<div class="logrow">${date}<div>${e.note ? `<div>${esc(e.note)}</div>` : ''}${photoThumbs(e.photos)}</div></div>`;
}
function logSection(h) {
  if (!h.logType) return '';
  const rows = entriesFor(h.id);
  if (h.logType === 'photo') {
    const all = rows.flatMap(({ k, e }) => (e.photos || []).map(id => ({ id, k })));
    return `<h2>${esc(t('gallery'))}</h2><div class="card">${all.length
      ? `<div class="gallery">${all.map(p => `<figure><img data-photo="${p.id}" alt="" loading="lazy"><figcaption>${esc(fmtShort(parseKey(p.k)))}</figcaption></figure>`).join('')}</div>`
      : `<p class="muted small" style="margin:0">${esc(t('noLogs'))}</p>`}</div>`;
  }
  if (h.logType === 'leetcode') {
    const seen = {};
    for (const { k, e } of rows) (e.problems || []).forEach((pr, i) => { if (!pr.title) return; const key = pr.title.toLowerCase(); if (!seen[key]) seen[key] = { k, i, pr }; });
    const revisit = Object.values(seen).filter(x => x.pr.status === 'review' || x.pr.status === 'stuck');
    const solvedCount = Object.values(seen).filter(x => x.pr.status === 'solved').length;
    const queue = revisit.length ? `<h2>${esc(t('toRevisit'))} · ${revisit.length}</h2><div class="card">${revisit.map(x => `
      <div class="logrow"><div style="flex:1"><b>${esc(x.pr.title)}</b> <span class="chip diff-${esc(x.pr.difficulty)}">${esc(t('diff_' + x.pr.difficulty))}</span>${x.pr.topic ? ` · <span class="small muted">${esc(x.pr.topic)}</span>` : ''} <span class="chip ${x.pr.status === 'stuck' ? 'warn' : ''}">${esc(t('st_' + x.pr.status))}</span>${x.pr.note ? `<div class="small muted">${esc(x.pr.note)}</div>` : ''}</div>
      <button class="btn sm" data-action="leet-resolve" data-hid="${h.id}" data-k="${x.k}" data-i="${x.i}">${esc(t('markSolved'))}</button></div>`).join('')}</div>` : '';
    return `${queue}<h2>${esc(t('logbook'))} · ${solvedCount} ${esc(t('solvedUnit'))}</h2><div class="card">${rows.length
      ? rows.slice(0, 40).map(({ k, e }) => entryLine(h, k, e)).join('')
      : `<p class="muted small" style="margin:0">${esc(t('noLogs'))}</p>`}</div>`;
  }
  return `<h2>${esc(t('logbook'))}</h2><div class="card">${rows.length
    ? rows.slice(0, 30).map(({ k, e }) => entryLine(h, k, e)).join('')
    : `<p class="muted small" style="margin:0">${esc(t('noLogs'))}</p>`}</div>`;
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
function fit(el) {
  const min = el.closest('.composer') ? 40 : el.classList.contains('short') ? 60 : 90;
  el.style.height = 'auto';
  el.style.height = Math.min(Math.max(el.scrollHeight + 2, min), el.closest('.composer') ? 140 : 1000) + 'px';
}
function autosize() { document.querySelectorAll('textarea').forEach(fit); }

/* ---------- Lifecycle ---------- */
let lastDay = dkey(today());
function checkDayChange() {
  const k = dkey(today());
  if (k !== lastDay) { if (dkey(ui.date) === lastDay) ui.date = today(); lastDay = k; rerender(); }
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  checkDayChange();
  prayerAutoLocate();
  if (ai.status === 'loading') aiWake();
  if (timer?.endsAt) { if (timerLeft() <= 0) finishTimer(); else keepAwake(); }
});
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
if (timer) renderTimer();
prayerAutoLocate();
