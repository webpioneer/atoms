'use strict';

/* =========================================================
   Atoms — an Atomic Habits–inspired habit tracker (PWA)
   All data lives in localStorage on this device.
   ========================================================= */

const KEY = 'atomic-habits:v1';
const COLORS = ['#1f7a6b', '#e07a2f', '#3b6fd8', '#b4467a', '#7a5cc7', '#4c8c2b', '#c9a227', '#d0453c'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PRINCIPLES = [
  ['Systems over goals', 'Goals set the direction; systems make the progress. Fall in love with the process you repeat every day.'],
  ['Every action is a vote', 'Each time you show up, you cast a vote for the person you want to become. You don\'t need a unanimous vote, just a majority.'],
  ['1% better', 'Tiny improvements compound. Getting 1% better each day makes you roughly 37× better after a year.'],
  ['Never miss twice', 'Missing once is an accident. Missing twice is the start of a new habit. If you slipped yesterday, today matters most.'],
  ['The two-minute rule', 'Scale a new habit down until it takes two minutes. Master the art of showing up before you optimize.'],
  ['Habit stacking', 'Anchor a new habit to one you already do: "After I [current habit], I will [new habit]."'],
  ['Design your environment', 'Make the cues of good habits visible and the cues of bad habits invisible. Environment beats motivation.'],
  ['Make it satisfying', 'What is immediately rewarded is repeated. Give yourself a small win the moment you finish.'],
  ['The plateau of latent potential', 'Results lag behind effort. Keep going through the valley of disappointment; the work is being stored.'],
  ['Identity first', 'The goal is not to read a book, it\'s to become a reader. Decide who you want to be, then prove it with small wins.'],
  ['Reduce friction', 'Lower the number of steps between you and good habits. Increase the steps between you and bad ones.'],
  ['Don\'t break the chain', 'A visual record of progress is satisfying on its own. Seeing the streak makes you want to keep it.'],
];

const QUOTES = [
  'You do not rise to the level of your goals. You fall to the level of your systems.',
  'Every action you take is a vote for the type of person you wish to become.',
  'Habits are the compound interest of self-improvement.',
];

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
};

/* ---------- Date helpers ---------- */
const pad = n => String(n).padStart(2, '0');
const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const daysBetween = (a, b) => Math.round((b - a) / 86400000);
const fmtLong = d => d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
const fmtShort = d => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const fmtTime = t => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

/* ---------- Misc helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-5);
const pct = x => `${Math.round(x * 100)}%`;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

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
    if (s && s.version) return { ...defaultState(), ...s };
  } catch (_) { /* fall through */ }
  return defaultState();
}
let state = load();
const ui = { date: today(), lastRoute: '' };

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { toast('Could not save — storage is full'); }
}

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
  const t = today();
  for (let i = 0; i < n; i++) {
    const d = addDays(t, -i);
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
  if (s === '0123456') return 'Every day';
  if (s === '12345') return 'Weekdays';
  if (s === '06') return 'Weekends';
  return [...days].sort().map(i => DAY_SHORT[i]).join(' · ');
}

function cueLine(h) {
  const bits = [];
  if (h.stack) bits.push(`After ${h.stack}`);
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
  const html = fn(a, b);
  $('#view').innerHTML = html;

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
  const t = today();
  const isToday = dkey(d) === dkey(t);
  const habits = activeHabits().filter(h => existedOn(h, d));
  const due = habits.filter(h => isScheduled(h, d))
    .sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const extra = habits.filter(h => !isScheduled(h, d));
  const done = due.filter(h => isDone(h, d)).length;
  const ratio = due.length ? done / due.length : 0;
  const C = 2 * Math.PI * 28;
  const p = PRINCIPLES[(daysBetween(new Date(2024, 0, 1), t)) % PRINCIPLES.length];
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  let body;
  if (!state.habits.length) {
    body = `
      <div class="card empty">
        <div class="art">⚛︎</div>
        <h3>Start with one tiny habit</h3>
        <p>Pick something so small you can't say no. Two minutes is enough — the point is to show up.</p>
        <a class="btn primary" href="#/habit/new">${I.plus} Create your first habit</a>
      </div>`;
  } else {
    body = `
      ${due.length ? `<ul class="habit-list">${due.map(h => habitRow(h, d, isToday)).join('')}</ul>`
        : `<div class="card empty"><p>Nothing scheduled ${isToday ? 'today' : 'on this day'}. Enjoy the rest.</p></div>`}
      ${extra.length ? `<h2>Not scheduled — bonus votes</h2>
        <ul class="habit-list">${extra.map(h => habitRow(h, d, false)).join('')}</ul>` : ''}
    `;
  }

  const jk = dkey(d);
  return `
    <header class="today-head">
      <div class="titles">
        <div class="eyebrow">${isToday ? greet : 'Looking back'}</div>
        <h1>${esc(fmtLong(d))}</h1>
      </div>
      ${due.length ? `
      <div class="ring" aria-label="${done} of ${due.length} done">
        <svg viewBox="0 0 68 68"><circle class="track" cx="34" cy="34" r="28"/>
          <circle class="bar" cx="34" cy="34" r="28" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - ratio)}"/></svg>
        <div class="label">${done}/${due.length}</div>
      </div>` : ''}
    </header>

    <div class="daynav">
      <button class="icon-btn" data-action="day" data-delta="-1" aria-label="Previous day">${I.left}</button>
      <span class="lbl">${isToday ? 'Today' : `<button class="btn sm" data-action="day" data-delta="0">Back to today</button>`}</span>
      <button class="icon-btn" data-action="day" data-delta="1" aria-label="Next day" ${isToday ? 'disabled' : ''}>${I.right}</button>
    </div>

    ${body}

    <h2>Reflection</h2>
    <textarea data-journal="${jk}" placeholder="What went well? What made a habit harder than it should be? One small tweak for tomorrow…">${esc(state.journal[jk] || '')}</textarea>

    <h2>Today's principle</h2>
    <div class="card principle"><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></div>

    ${state.habits.length ? `<a class="fab" href="#/habit/new" aria-label="New habit">${I.plus}</a>` : ''}
  `;
}

function habitRow(h, d, canWarn) {
  const done = isDone(h, d);
  const s = currentStreak(h);
  const isBreak = h.type === 'break';
  const chips = [];
  if (isBreak) chips.push(`<span class="chip break">Breaking</span>`);
  else if (h.twoMin) chips.push(`<span class="chip">2-min: ${esc(h.twoMin)}</span>`);
  if (canWarn && !done && missedPrevious(h, d)) chips.push(`<span class="chip warn">Never miss twice</span>`);
  const meta = isBreak ? (h.identity ? `I am ${h.identity}` : 'Mark when you resisted today') : cueLine(h);
  return `
    <li class="habit ${done ? 'is-done' : ''}" style="--c:${esc(h.color)}" data-hid="${h.id}">
      <button class="check" data-action="toggle" data-id="${h.id}" data-date="${dkey(d)}"
        aria-pressed="${done}" aria-label="${isBreak ? 'Resisted' : 'Done'}: ${esc(h.name)}">${I.check}</button>
      <a class="habit-body" href="#/h/${h.id}">
        <span class="habit-name">${esc(h.name)}</span>
        ${meta ? `<span class="habit-meta">${esc(meta)}</span>` : ''}
        ${chips.length ? `<span class="chips">${chips.join('')}</span>` : ''}
      </a>
      <span class="streak ${s >= 3 ? 'hot' : ''}" title="Current streak">${I.flame}${s}</span>
    </li>`;
}

function viewHabits() {
  const act = activeHabits();
  const arch = state.habits.filter(h => h.archived);
  const card = h => `
    <a class="habit" href="#/h/${h.id}" style="--c:${esc(h.color)};text-decoration:none">
      <span class="habit-body">
        <span class="habit-name">${esc(h.name)}</span>
        <span class="habit-meta">${h.identity ? `I am ${esc(h.identity)} · ` : ''}${esc(scheduleLabel(h.days))}</span>
      </span>
      <span class="streak ${currentStreak(h) >= 3 ? 'hot' : ''}">${I.flame}${currentStreak(h)}</span>
    </a>`;
  return `
    <header class="page-head">
      <div><h1>Habits</h1><div class="sub">${plural(act.length, 'active habit')}</div></div>
      <a class="btn primary sm" href="#/habit/new">${I.plus} New</a>
    </header>
    ${act.length ? `<div class="habit-list">${act.map(card).join('')}</div>` : `
      <div class="card empty"><p>No habits yet. Start with something that takes two minutes.</p>
      <a class="btn primary" href="#/habit/new">${I.plus} New habit</a></div>`}
    ${arch.length ? `<h2>Archived</h2><div class="habit-list">${arch.map(card).join('')}</div>` : ''}
  `;
}

function viewHabitForm(id) {
  const h = id ? habitById(id) : null;
  if (id && !h) return notFound();
  const v = h || { type: 'build', days: [0, 1, 2, 3, 4, 5, 6], color: COLORS[state.habits.length % COLORS.length] };
  const identities = [...new Set(state.habits.map(x => x.identity).filter(Boolean))];
  const f = (name, label, ph, hint = '', cls = '') => `
    <label class="field ${cls}"><span>${label}</span>
      <input type="text" name="${name}" value="${esc(v[name])}" placeholder="${esc(ph)}" autocomplete="off" />
      ${hint ? `<small>${hint}</small>` : ''}</label>`;
  const law = (n, title, hint, inner, cls = '') => `
    <fieldset class="law ${cls}">
      <legend><span class="num">${n}</span><span class="law-title">${title}</span></legend>
      <p class="hint">${hint}</p>${inner}
    </fieldset>`;

  return `
    <a class="back" href="${h ? `#/h/${h.id}` : '#/habits'}">${I.left} Back</a>
    <header class="page-head"><h1>${h ? 'Edit habit' : 'New habit'}</h1></header>

    <form class="form" data-form="habit" data-id="${h ? h.id : ''}" data-type="${v.type}" autocomplete="off">
      <fieldset>
        <div class="segmented" role="radiogroup" aria-label="Habit type">
          <input type="radio" id="t-build" name="type" value="build" ${v.type !== 'break' ? 'checked' : ''}><label for="t-build">Build a habit</label>
          <input type="radio" id="t-break" name="type" value="break" ${v.type === 'break' ? 'checked' : ''}><label for="t-break">Break a habit</label>
        </div>
      </fieldset>

      <fieldset class="law">
        <legend><span class="law-title">Who do you want to become?</span></legend>
        <p class="hint">Identity-based habits stick. Every completion is a vote for this person.</p>
        <label class="field"><span>Habit</span>
          <input type="text" name="name" required value="${esc(v.name)}" placeholder="${v.type === 'break' ? 'e.g. No phone in bed' : 'e.g. Read'}" /></label>
        <label class="field"><span>Identity</span>
          <div class="prefix"><em>I am</em><input type="text" name="identity" list="identities" value="${esc(v.identity)}" placeholder="a reader / someone who…" /></div>
          <datalist id="identities">${identities.map(x => `<option value="${esc(x)}">`).join('')}</datalist></label>
      </fieldset>

      ${law(1, 'Make it obvious', 'Implementation intention: “I will [habit] at [time] in [location].” Or stack it on something you already do.', `
        <div class="two">
          <label class="field"><span>Time</span><input type="time" name="time" value="${esc(v.time)}" /></label>
          ${f('location', 'Location', 'e.g. the couch')}
        </div>
        ${f('stack', 'Habit stack — after I…', 'e.g. pour my morning coffee', 'After I [current habit], I will [new habit].')}
      `, 'only-build')}
      ${law(1, 'Make it invisible', 'Remove the cues. Out of sight, out of mind.', `
        ${f('l1', 'How will you hide the cue?', 'e.g. Charge my phone in the kitchen')}
      `, 'only-break')}

      ${law(2, 'Make it attractive', 'Temptation bundling: pair it with something you enjoy. Join a culture where it\'s normal.', `
        ${f('l2', 'Pair it with…', 'e.g. My favorite podcast only while walking')}
      `, 'only-build')}
      ${law(2, 'Make it unattractive', 'Reframe it. Highlight the benefits of avoiding it.', `
        ${f('l2b', 'Reframe', 'e.g. Sleep is my superpower; scrolling steals it')}
      `, 'only-break')}

      ${law(3, 'Make it easy', 'Reduce friction. Scale it down to a two-minute version — just show up.', `
        ${f('twoMin', 'Two-minute version', 'e.g. Read one page')}
        ${f('l3', 'Prime the environment', 'e.g. Put the book on my pillow')}
      `, 'only-build')}
      ${law(3, 'Make it difficult', 'Increase friction. Use a commitment device.', `
        ${f('l3b', 'Add friction', 'e.g. Log out of apps; use a timer lock')}
      `, 'only-break')}

      ${law(4, 'Make it satisfying', 'What is immediately rewarded is repeated. Tracking it here is part of the reward.', `
        ${f('l4', 'Immediate reward', 'e.g. Tea after I finish')}
      `, 'only-build')}
      ${law(4, 'Make it unsatisfying', 'Add an immediate cost. An accountability partner or a habit contract helps.', `
        ${f('l4b', 'Accountability', 'e.g. Text Sam every time I slip')}
      `, 'only-break')}

      <fieldset class="law">
        <legend><span class="law-title">Schedule & color</span></legend>
        <div class="days" role="group" aria-label="Days">
          ${DAY_SHORT.map((n, i) => `<input type="checkbox" id="d${i}" name="days" value="${i}" ${v.days.includes(i) ? 'checked' : ''}><label for="d${i}">${n[0]}<span class="sr">${n.slice(1)}</span></label>`).join('')}
        </div>
        <div class="field"><span>Color</span>
          <div class="swatches" role="radiogroup" aria-label="Color">
            ${COLORS.map((c, i) => `<input type="radio" id="c${i}" name="color" value="${c}" ${v.color === c ? 'checked' : ''}><label for="c${i}" style="--sw:${c}" aria-label="Color ${i + 1}"></label>`).join('')}
          </div>
        </div>
      </fieldset>

      <div class="form-actions">
        <button class="btn primary" type="submit">${h ? 'Save changes' : 'Create habit'}</button>
      </div>
      ${h ? `
      <div class="form-actions">
        <button class="btn" type="button" data-action="archive" data-id="${h.id}">${I.archive} ${h.archived ? 'Restore' : 'Archive'}</button>
        <button class="btn danger" type="button" data-action="delete-habit" data-id="${h.id}">${I.trash} Delete</button>
      </div>` : ''}
    </form>
  `;
}

function viewHabitDetail(id) {
  const h = habitById(id);
  if (!h) return notFound();
  const isBreak = h.type === 'break';
  const s = currentStreak(h), best = bestStreak(h), votes = totalVotes(h), r30 = rate(h, 30);

  const contract = isBreak ? `
      <p>I am <b>${esc(h.identity || 'someone in control')}</b>.</p>
      <p>I will stop <b>${esc(h.name)}</b>.</p>` : `
      ${h.identity ? `<p>I am <b>${esc(h.identity)}</b>.</p>` : ''}
      <p>I will <b>${esc(h.name)}</b>${h.time ? ` at <b>${esc(fmtTime(h.time))}</b>` : ''}${h.location ? ` in <b>${esc(h.location)}</b>` : ''}.</p>
      ${h.stack ? `<p>After I <b>${esc(h.stack)}</b>, I will <b>${esc(h.twoMin || h.name)}</b>.</p>` : ''}`;

  const laws = isBreak
    ? [['Invisible', h.l1], ['Unattractive', h.l2b], ['Difficult', h.l3b], ['Unsatisfying', h.l4b]]
    : [['Obvious', [h.stack && `After I ${h.stack}`, h.time && fmtTime(h.time), h.location].filter(Boolean).join(' · ')],
       ['Attractive', h.l2], ['Easy', [h.twoMin && `2-min: ${h.twoMin}`, h.l3].filter(Boolean).join(' — ')], ['Satisfying', h.l4]];

  return `
    <a class="back" href="#/habits">${I.left} Habits</a>
    <header class="page-head">
      <div><div class="eyebrow">${isBreak ? 'Breaking' : 'Building'} · ${esc(scheduleLabel(h.days))}${h.archived ? ' · Archived' : ''}</div>
      <h1>${esc(h.name)}</h1></div>
      <a class="icon-btn" href="#/habit/edit/${h.id}" aria-label="Edit">${I.edit}</a>
    </header>

    <div class="card contract">${contract}</div>

    <h2>Stats</h2>
    <div class="stats">
      <div class="stat"><b>${s}</b><span>Streak</span></div>
      <div class="stat"><b>${best}</b><span>Best</span></div>
      <div class="stat"><b>${pct(r30)}</b><span>30 days</span></div>
      <div class="stat"><b>${votes}</b><span>Votes</span></div>
    </div>

    <h2>History</h2>
    <div class="card" style="--c:${esc(h.color)}">
      ${heatmap(h, Math.min(26, Math.max(10, Math.ceil((daysBetween(parseKey(h.createdAt), today()) + 7) / 7))))}
      <div class="legend">
        <span><i style="background:${esc(h.color)}"></i>${isBreak ? 'Resisted' : 'Done'}</span>
        <span><i style="background:var(--danger-soft)"></i>Missed</span>
        <span><i style="box-shadow:inset 0 0 0 1px var(--line)"></i>Rest day</span>
      </div>
      <p class="small muted" style="margin-top:8px">Tap a day to fix your record.</p>
    </div>

    <h2>The Four Laws</h2>
    <div class="laws-grid">
      ${laws.map(([t, val], i) => `<div class="card"><div class="eyebrow">${i + 1} · ${t}</div><p>${val ? esc(val) : '<span class="muted">Not set — <a href="#/habit/edit/' + h.id + '">add</a></span>'}</p></div>`).join('')}
    </div>
  `;
}

function heatmap(h, weeks) {
  const t = today();
  const first = addDays(t, -t.getDay() - (weeks - 1) * 7);
  let cells = '';
  for (let d = first; d <= addDays(t, 6 - t.getDay()); d = addDays(d, 1)) {
    const k = dkey(d);
    let cls;
    if (d > t) cls = 'future';
    else if (!existedOn(h, d)) cls = 'before';
    else if (isDone(h, d)) cls = 'done';
    else if (isScheduled(h, d)) cls = k === dkey(t) ? '' : 'missed';
    else cls = 'off';
    const dis = cls === 'future' || cls === 'before';
    cells += `<button class="${cls} ${k === dkey(t) ? 'is-today' : ''}" ${dis ? 'disabled tabindex="-1"' : `data-action="toggle" data-id="${h.id}" data-date="${k}"`} title="${esc(fmtShort(d))}" aria-label="${esc(fmtShort(d))}: ${cls || 'pending'}"></button>`;
  }
  return `<div class="heatmap-wrap"><div class="heatmap">${cells}</div></div>`;
}

function viewProgress() {
  const act = activeHabits();
  if (!act.length) {
    return `<header class="page-head"><h1>Progress</h1></header>
      <div class="card empty"><p>Your progress shows up here once you start tracking.</p>
      <a class="btn primary" href="#/habit/new">${I.plus} New habit</a></div>`;
  }
  const t = today();

  // Daily completion % over last 30 days
  const series = [];
  for (let i = 29; i >= 0; i--) {
    const d = addDays(t, -i);
    const due = act.filter(h => isScheduled(h, d));
    const done = due.filter(h => isDone(h, d)).length;
    series.push({ d, v: due.length ? done / due.length : null });
  }
  const W = 300, H = 130, bw = W / 30;
  const bars = series.map((p, i) => {
    const v = p.v ?? 0;
    const bh = Math.max(v * (H - 18), 2);
    return `<rect class="bar ${v ? '' : 'zero'}" x="${i * bw + 1}" y="${H - 14 - bh}" width="${bw - 2}" height="${bh}" rx="1.5"><title>${esc(fmtShort(p.d))}: ${p.v == null ? 'nothing scheduled' : pct(p.v)}</title></rect>`;
  }).join('');
  const chart = `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Daily completion, last 30 days">
      <line class="axis" x1="0" x2="${W}" y1="${H - 13}" y2="${H - 13}"/>${bars}
      <text x="0" y="${H - 2}">${esc(fmtShort(series[0].d))}</text>
      <text x="${W}" y="${H - 2}" text-anchor="end">Today</text></svg>`;

  const allVotes = Object.values(state.log).reduce((n, day) => n + Object.keys(day).length, 0);
  const valid = series.filter(p => p.v != null);
  const avg30 = valid.length ? valid.reduce((n, p) => n + p.v, 0) / valid.length : 0;
  const showUpDays = Object.keys(state.log).length;
  const firstDay = state.habits.reduce((m, h) => h.createdAt < m ? h.createdAt : m, dkey(t));
  const span = daysBetween(parseKey(firstDay), t) + 1;
  const missed = Math.max(span - showUpDays, 0);

  // Identity votes
  const byId = {};
  for (const h of state.habits) {
    const k = h.identity || 'Unlabeled';
    byId[k] = (byId[k] || 0) + totalVotes(h);
  }
  const idRows = Object.entries(byId).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  const maxV = Math.max(1, ...idRows.map(r => r[1]));

  const rows = act.map(h => {
    let dots = '';
    for (let i = 13; i >= 0; i--) {
      const d = addDays(t, -i);
      dots += `<i class="${isDone(h, d) ? 'd' : isScheduled(h, d) ? '' : 'o'}"></i>`;
    }
    return `<a class="prog-row" href="#/h/${h.id}" style="--c:${esc(h.color)}">
      <span class="name">${esc(h.name)}</span><span class="dots" aria-hidden="true">${dots}</span>
      <span class="pct">${pct(rate(h, 30))}</span></a>`;
  }).join('');

  return `
    <header class="page-head"><div><h1>Progress</h1><div class="sub">Small wins, compounding.</div></div></header>

    <div class="stats three">
      <div class="stat"><b>${allVotes}</b><span>Total votes</span></div>
      <div class="stat"><b>${pct(avg30)}</b><span>30-day avg</span></div>
      <div class="stat"><b>${showUpDays}</b><span>Active days</span></div>
    </div>

    <h2>Last 30 days</h2>
    <div class="card">${chart}</div>

    <h2>Habits · last 14 days</h2>
    <div class="card">${rows}</div>

    <h2>Identity votes</h2>
    <div class="card">
      ${idRows.length ? idRows.map(([k, n]) => `
        <div class="identity-row">
          <div class="row"><span>${k === 'Unlabeled' ? '<span class="muted">No identity set</span>' : `I am ${esc(k)}`}</span><b>${n}</b></div>
          <div class="meter"><i style="width:${(n / maxV) * 100}%"></i></div>
        </div>`).join('') : '<p class="muted small">Complete a habit to cast your first vote.</p>'}
    </div>

    <h2>The power of 1%</h2>
    <div class="card">
      <p class="small muted">You've shown up on ${plural(showUpDays, 'day')} since ${esc(fmtShort(parseKey(firstDay)))}. If each of those made you 1% better, and each missed day 1% worse:</p>
      <div class="compound">
        <div class="up"><b>${(Math.pow(1.01, showUpDays) * Math.pow(0.99, missed)).toFixed(2)}×</b><span class="small muted">where you are</span></div>
        <div class="up"><b>37.78×</b><span class="small muted">after a year of 1% days</span></div>
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
          <a class="icon-btn" href="#/goal/${g.id}" aria-label="Edit goal">${I.edit}</a></div>
        ${g.why ? `<p class="why">${esc(g.why)}</p>` : ''}
        <div class="meta"><span>${ms.length ? `${msDone}/${ms.length} milestones` : 'System consistency'}</span>
          <span>${left == null ? '' : left >= 0 ? `${plural(left, 'day')} left` : `${plural(-left, 'day')} past target`}</span></div>
        <div class="meter"><i style="width:${progress * 100}%"></i></div>
        ${ms.length ? `<ul class="milestones">${ms.map((m, i) => `
          <li><button class="${m.done ? 'done' : ''}" data-action="milestone" data-id="${g.id}" data-i="${i}" aria-pressed="${!!m.done}">
            <span class="box">${I.check}</span><span>${esc(m.text)}</span></button></li>`).join('')}</ul>` : ''}
        ${linked.length ? `
        <div class="system">
          <div class="eyebrow">The system · ${pct(sys)} consistent (30d)</div>
          ${linked.map(h => `<a class="prog-row" href="#/h/${h.id}" style="--c:${esc(h.color)}"><span class="name">${esc(h.name)}</span><span class="streak ${currentStreak(h) >= 3 ? 'hot' : ''}">${I.flame}${currentStreak(h)}</span><span class="pct">${pct(rate(h, 30))}</span></a>`).join('')}
        </div>` : ''}
      </div>`;
  };
  return `
    <header class="page-head">
      <div><h1>Goals</h1><div class="sub">Goals set direction. Habits get you there.</div></div>
      <a class="btn primary sm" href="#/goal/new">${I.plus} New</a>
    </header>
    ${goals.length ? goals.map(card).join('') : `
      <div class="card empty"><p>Set a goal, then attach the habits — the system — that will carry you to it.</p>
      <a class="btn primary" href="#/goal/new">${I.plus} New goal</a></div>`}
    <p class="quote">“${esc(QUOTES[0])}”</p>
  `;
}

function viewGoalForm(id) {
  const g = id ? state.goals.find(x => x.id === id) : null;
  if (id && !g) return notFound();
  const v = g || { habitIds: [], milestones: [] };
  return `
    <a class="back" href="#/goals">${I.left} Goals</a>
    <header class="page-head"><h1>${g ? 'Edit goal' : 'New goal'}</h1></header>
    <form class="form" data-form="goal" data-id="${g ? g.id : ''}">
      <fieldset class="law">
        <label class="field"><span>Goal</span><input type="text" name="title" required value="${esc(v.title)}" placeholder="e.g. Run a half marathon" /></label>
        <label class="field"><span>Why it matters</span><input type="text" name="why" value="${esc(v.why)}" placeholder="e.g. To feel strong and have energy for my kids" /></label>
        <label class="field"><span>Target date (optional)</span><input type="date" name="target" value="${esc(v.target)}" /></label>
      </fieldset>
      <fieldset class="law">
        <legend><span class="law-title">Milestones</span></legend>
        <p class="hint">One per line. Small, concrete checkpoints.</p>
        <textarea name="milestones" placeholder="Run 5k without stopping&#10;Run 10k&#10;Sign up for the race">${esc((v.milestones || []).map(m => m.text).join('\n'))}</textarea>
      </fieldset>
      <fieldset class="law">
        <legend><span class="law-title">Your system</span></legend>
        <p class="hint">Which daily habits move you toward this goal?</p>
        ${activeHabits().length ? `<div class="checklist">${activeHabits().map(h => `
          <label><input type="checkbox" name="habits" value="${h.id}" ${v.habitIds.includes(h.id) ? 'checked' : ''}> ${esc(h.name)}</label>`).join('')}</div>`
        : `<p class="small muted">No habits yet — <a href="#/habit/new">create one</a> first.</p>`}
      </fieldset>
      <div class="form-actions"><button class="btn primary" type="submit">${g ? 'Save goal' : 'Create goal'}</button></div>
      ${g ? `<div class="form-actions"><button class="btn danger" type="button" data-action="delete-goal" data-id="${g.id}">${I.trash} Delete goal</button></div>` : ''}
    </form>
  `;
}

function viewMore() {
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  return `
    <header class="page-head"><h1>More</h1></header>
    <div class="card">
      <ul class="menu">
        <li><a href="#/scorecard"><span class="ico">${I.list}</span><span>Habit Scorecard<small>Become aware of your current habits</small></span></a></li>
        <li><a href="#/laws"><span class="ico">${I.book}</span><span>The Four Laws<small>Cheat sheet for building and breaking habits</small></span></a></li>
      </ul>
    </div>
    <h2>Your data</h2>
    <div class="card">
      <ul class="menu">
        <li><button data-action="export"><span class="ico">${I.down}</span><span>Export backup<small>Download everything as a JSON file</small></span></button></li>
        <li><label><span class="ico">${I.up}</span><span>Import backup<small>Replace current data from a JSON file</small></span>
          <input type="file" accept="application/json,.json" data-action="import" hidden></label></li>
        <li><button data-action="reset" class="danger"><span class="ico">${I.trash}</span><span>Erase all data</span></button></li>
      </ul>
    </div>
    <p class="small muted" style="margin-top:12px">Everything is stored only on this device. Export a backup now and then.</p>
    ${standalone ? '' : `
    <h2>Install</h2>
    <div class="card">
      <ul class="menu"><li>${ui.installPrompt
        ? `<button data-action="install"><span class="ico">${I.phone}</span><span>Install app<small>Add Atoms to your home screen</small></span></button>`
        : `<div class="row" style="padding:6px 4px"><span class="ico">${I.phone}</span><span class="small">On iPhone: tap <b>Share</b> → <b>Add to Home Screen</b>. On Android/desktop Chrome: use <b>Install app</b> from the browser menu.</span></div>`}</li></ul>
    </div>`}
    <p class="quote">“${esc(QUOTES[2])}”</p>
    <p class="small muted" style="text-align:center">Inspired by <i>Atomic Habits</i> by James Clear. Not affiliated.</p>
  `;
}

function viewScorecard() {
  const list = state.scorecard;
  const counts = { '+': 0, '-': 0, '=': 0 };
  list.forEach(x => { if (x.rating) counts[x.rating]++; });
  return `
    <a class="back" href="#/more">${I.left} More</a>
    <header class="page-head"><div><h1>Habit Scorecard</h1>
      <div class="sub">List what you do in a typical day, in order. Rate each: does it serve the person you want to become?</div></div></header>

    <div class="stats three">
      <div class="stat"><b style="color:var(--accent)">${counts['+']}</b><span>Good (+)</span></div>
      <div class="stat"><b>${counts['=']}</b><span>Neutral (=)</span></div>
      <div class="stat"><b style="color:var(--danger)">${counts['-']}</b><span>Bad (−)</span></div>
    </div>

    <h2>Your day</h2>
    <div class="card">
      ${list.length ? `<ul class="score-list">${list.map(x => `
        <li><span class="txt">${esc(x.text)}</span>
          <span class="rate" role="group" aria-label="Rate">
            ${[['+', 'p', 'Good'], ['=', 'z', 'Neutral'], ['-', 'n', 'Bad']].map(([r, c, l]) =>
              `<button class="${c}" data-action="rate" data-id="${x.id}" data-r="${r}" aria-pressed="${x.rating === r}" aria-label="${l}">${r === '-' ? '−' : r}</button>`).join('')}
          </span>
          <button class="del" data-action="del-score" data-id="${x.id}" aria-label="Remove">×</button></li>`).join('')}</ul>`
      : '<p class="muted small" style="margin:0 0 4px">e.g. Wake up · Check phone · Make coffee · Scroll news · Shower…</p>'}
      <form class="row" data-form="score" style="margin-top:12px">
        <input type="text" name="text" placeholder="Add a behavior…" required autocomplete="off" />
        <button class="btn primary" type="submit" aria-label="Add">${I.plus}</button>
      </form>
    </div>
    <p class="small muted" style="margin-top:12px">The goal isn't to judge — it's to notice. Turn a “−” into a habit to break, or stack a new habit after a “+”.</p>
  `;
}

function viewLaws() {
  const box = (n, b, k, bi, ki) => `
    <div class="card ref"><div class="eyebrow">Law ${n}</div>
      <div class="pair">
        <div><h3>${b}</h3><ul>${bi.map(x => `<li>${x}</li>`).join('')}</ul></div>
        <div><h3 class="muted">${k}</h3><ul>${ki.map(x => `<li>${x}</li>`).join('')}</ul></div>
      </div></div>`;
  return `
    <a class="back" href="#/more">${I.left} More</a>
    <header class="page-head"><div><h1>The Four Laws</h1>
      <div class="sub">Cue → Craving → Response → Reward. To build a habit, follow the law; to break one, invert it.</div></div></header>
    <div class="stack">
      ${box(1, 'Make it obvious', 'Make it invisible',
        ['Fill out a Habit Scorecard', 'Implementation intention: “I will [X] at [time] in [place]”', 'Habit stacking: “After [current], I will [new]”', 'Make good cues visible'],
        ['Remove cues from your environment', 'Keep temptations out of sight'])}
      ${box(2, 'Make it attractive', 'Make it unattractive',
        ['Temptation bundling', 'Join a culture where it\'s the normal behavior', 'Do something you enjoy right before'],
        ['Reframe: highlight the benefits of avoiding it'])}
      ${box(3, 'Make it easy', 'Make it difficult',
        ['Reduce friction', 'Prime the environment', 'Two-minute rule', 'Automate where you can'],
        ['Increase friction', 'Use a commitment device'])}
      ${box(4, 'Make it satisfying', 'Make it unsatisfying',
        ['Give yourself an immediate reward', 'Track it — don\'t break the chain', 'Never miss twice'],
        ['Get an accountability partner', 'Create a habit contract'])}
    </div>
  `;
}

function notFound() {
  return `<div class="card empty"><p>That item doesn't exist anymore.</p><a class="btn" href="#/today">Go to Today</a></div>`;
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
      const msg = h.identity ? `+1 vote for “I am ${h.identity}”` : `+1 vote`;
      toast(s >= 2 && dkey(d) === dkey(today()) ? `${msg} · ${s}-day streak` : msg);
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
    toast(h.archived ? 'Habit archived' : 'Habit restored');
    location.hash = `#/h/${h.id}`;
  },
  'delete-habit'(el) {
    const h = habitById(el.dataset.id);
    if (!confirm(`Delete “${h.name}” and its entire history? Archiving keeps the history.`)) return;
    state.habits = state.habits.filter(x => x.id !== h.id);
    for (const k in state.log) { delete state.log[k][h.id]; if (!Object.keys(state.log[k]).length) delete state.log[k]; }
    state.goals.forEach(g => { g.habitIds = (g.habitIds || []).filter(x => x !== h.id); });
    save(); toast('Habit deleted'); location.hash = '#/habits';
  },
  milestone(el) {
    const g = state.goals.find(x => x.id === el.dataset.id);
    const m = g.milestones[Number(el.dataset.i)];
    m.done = !m.done; save();
    if (m.done) { navigator.vibrate?.(12); toast('Milestone reached'); }
    rerender();
  },
  'delete-goal'(el) {
    if (!confirm('Delete this goal?')) return;
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
    toast('Backup downloaded');
  },
  reset() {
    if (!confirm('Erase all habits, goals and history from this device? This cannot be undone.')) return;
    state = defaultState(); save(); toast('All data erased'); location.hash = '#/today'; render();
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
  if (el.dataset.action === 'import' && el.files[0]) importFile(el.files[0]);
});

let journalT;
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.journal) {
    clearTimeout(journalT);
    journalT = setTimeout(() => {
      const v = el.value.trim();
      if (v) state.journal[el.dataset.journal] = el.value; else delete state.journal[el.dataset.journal];
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
    if (!days.length) { toast('Pick at least one day'); return; }
    const get = k => (fd.get(k) || '').toString().trim();
    const id = f.dataset.id;
    const existing = id ? habitById(id) : null;
    const h = existing || { id: uid(), createdAt: dkey(today()), archived: false };
    Object.assign(h, {
      type: get('type') || 'build', name: get('name'), identity: get('identity').replace(/^i am\s+/i, ''),
      time: get('time'), location: get('location'), stack: get('stack').replace(/^after i\s+/i, ''),
      twoMin: get('twoMin'), l1: get('l1'), l2: get('l2'), l2b: get('l2b'), l3: get('l3'), l3b: get('l3b'),
      l4: get('l4'), l4b: get('l4b'), days, color: get('color') || COLORS[0],
    });
    if (!existing) state.habits.push(h);
    save();
    toast(existing ? 'Saved' : 'Habit created — start with two minutes');
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
    save(); toast(existing ? 'Goal saved' : 'Goal created');
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
      if (!confirm(`Replace current data with this backup (${plural(data.habits.length, 'habit')})?`)) return;
      state = { ...defaultState(), ...data };
      save(); toast('Backup restored'); location.hash = '#/today'; render();
    } catch (_) { toast('That file isn\'t a valid backup'); }
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
// Roll "today" over at midnight / when the app is resumed on a new day.
let lastDay = dkey(today());
function checkDayChange() {
  const k = dkey(today());
  if (k !== lastDay) { if (dkey(ui.date) === lastDay) ui.date = today(); lastDay = k; rerender(); }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDayChange(); });
setInterval(checkDayChange, 60000);

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); ui.installPrompt = e; });
window.addEventListener('storage', e => { if (e.key === KEY) { state = load(); rerender(); } });

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
navigator.storage?.persist?.();

render();
