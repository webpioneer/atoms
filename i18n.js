'use strict';
/* UI strings. Values are plain strings or functions that take arguments.
   Strings marked (html) may contain markup; everything else is escaped by the caller. */

const STRINGS = {
  en: {
    // Tabs
    tabToday: 'Today', tabHabits: 'Habits', tabProgress: 'Progress', tabGoals: 'Goals', tabMore: 'More',

    // Today
    greetMorning: 'Good morning', greetAfternoon: 'Good afternoon', greetEvening: 'Good evening',
    lookingBack: 'Looking back', today: 'Today', backToToday: 'Back to today',
    prevDay: 'Previous day', nextDay: 'Next day',
    ringLabel: (d, n) => `${d} of ${n} done`,
    emptyTitle: 'Start with one tiny habit',
    emptyBody: 'Pick something so small you can’t say no. Two minutes is enough — the point is to show up.',
    createFirst: 'Create your first habit',
    nothingToday: 'Nothing scheduled today. Enjoy the rest.',
    nothingThatDay: 'Nothing scheduled on this day.',
    bonus: 'Not scheduled — bonus votes',
    anytime: 'Anytime', throughDay: 'Through the day',
    reflection: 'Reflection',
    reflectionPh: 'What went well? What made a habit harder than it should be? One small tweak for tomorrow…',
    todaysPrinciple: 'Today’s principle',
    newHabit: 'New habit',
    breakingChip: 'Breaking', neverMissTwice: 'Never miss twice',
    twoMinChip: x => `2-min: ${x}`,
    markResisted: 'Mark when you resisted today',
    doneAria: x => `Done: ${x}`, resistedAria: x => `Resisted: ${x}`,
    streakTitle: 'Current streak',
    iAm: 'I am', iAmX: x => `I am ${x}`,
    afterX: x => `After ${x}`,

    // Habits list
    habits: 'Habits', activeHabits: n => `${n} active habit${n === 1 ? '' : 's'}`, new: 'New',
    noHabits: 'No habits yet. Start with something that takes two minutes.',
    archived: 'Archived',
    everyDay: 'Every day', weekdays: 'Weekdays', weekends: 'Weekends',

    // Habit form
    back: 'Back', editHabit: 'Edit habit',
    buildHabit: 'Build a habit', breakHabit: 'Break a habit', habitType: 'Habit type',
    whoBecome: 'Who do you want to become?',
    whoHint: 'Identity-based habits stick. Every completion is a vote for this person.',
    habitLabel: 'Habit', habitPhBuild: 'e.g. Read', habitPhBreak: 'e.g. No phone in bed',
    identity: 'Identity', identityPh: 'a reader / someone who…',
    law1b: 'Make it obvious', law1bHint: 'Implementation intention: “I will [habit] at [time] in [location].” Or stack it on something you already do.',
    time: 'Time', location: 'Location', locationPh: 'e.g. the couch',
    afterPrayerLabel: 'After a prayer', afterPrayerNone: '— none —',
    afterPrayerHint: 'Pins this habit right after that prayer each day — its time follows the prayer automatically.',
    cAfterPrayer: (p, act) => `After I pray ${p}, I will ${act}.`,
    stackLabel: 'Habit stack — after I…', stackPh: 'e.g. pour my morning coffee', stackHint: 'After I [current habit], I will [new habit].',
    law1k: 'Make it invisible', law1kHint: 'Remove the cues. Out of sight, out of mind.',
    hideCue: 'How will you hide the cue?', hideCuePh: 'e.g. Charge my phone in the kitchen',
    law2b: 'Make it attractive', law2bHint: 'Temptation bundling: pair it with something you enjoy. Join a culture where it’s normal.',
    pairLabel: 'Pair it with…', pairPh: 'e.g. My favorite podcast only while walking',
    law2k: 'Make it unattractive', law2kHint: 'Reframe it. Highlight the benefits of avoiding it.',
    reframe: 'Reframe', reframePh: 'e.g. Sleep is my superpower; scrolling steals it',
    law3b: 'Make it easy', law3bHint: 'Reduce friction. Scale it down to a two-minute version — just show up.',
    twoMinLabel: 'Two-minute version', twoMinPh: 'e.g. Read one page',
    primeLabel: 'Prime the environment', primePh: 'e.g. Put the book on my pillow',
    law3k: 'Make it difficult', law3kHint: 'Increase friction. Use a commitment device.',
    frictionLabel: 'Add friction', frictionPh: 'e.g. Log out of apps; use a timer lock',
    law4b: 'Make it satisfying', law4bHint: 'What is immediately rewarded is repeated. Tracking it here is part of the reward.',
    rewardLabel: 'Immediate reward', rewardPh: 'e.g. Tea after I finish',
    law4k: 'Make it unsatisfying', law4kHint: 'Add an immediate cost. An accountability partner or a habit contract helps.',
    accountLabel: 'Accountability', accountPh: 'e.g. Text Sam every time I slip',
    scheduleColor: 'Schedule & color', days: 'Days', color: 'Color', colorN: i => `Color ${i}`,
    saveChanges: 'Save changes', createHabit: 'Create habit',
    archive: 'Archive', restore: 'Restore', delete: 'Delete',

    // Habit detail
    building: 'Building', breakingLbl: 'Breaking', archivedLbl: 'Archived', edit: 'Edit',
    someoneInControl: 'someone in control',
    cIAm: x => `I am ${x}.`,
    cStop: x => `I will stop ${x}.`,
    cWill: (name, time, loc, dur) => `I will ${name}${time ? ` at ${time}` : ''}${dur ? ` for ${dur}` : ''}${loc ? ` in ${loc}` : ''}.`,
    cStack: (stack, act) => `After I ${stack}, I will ${act}.`,
    stats: 'Stats', streak: 'Streak', best: 'Best', days30: '30 days', votes: 'Votes',
    history: 'History', legendDone: 'Done', legendResisted: 'Resisted', missed: 'Missed', restDay: 'Rest day',
    pending: 'pending', tapToFix: 'Tap a day to fix your record.',
    fourLaws: 'The Four Laws',
    lawsBuild: ['Obvious', 'Attractive', 'Easy', 'Satisfying'],
    lawsBreak: ['Invisible', 'Unattractive', 'Difficult', 'Unsatisfying'],
    notSet: 'Not set', add: 'add',

    // Progress
    progress: 'Progress', progressSub: 'Small wins, compounding.',
    progressEmpty: 'Your progress shows up here once you start tracking.',
    totalVotes: 'Total votes', avg30: '30-day avg', activeDays: 'Active days',
    last30: 'Last 30 days', habits14: 'Habits · last 14 days',
    identityVotes: 'Identity votes', noIdentity: 'No identity set', firstVote: 'Complete a habit to cast your first vote.',
    power1: 'The power of 1%',
    power1Body: (n, date) => `You’ve shown up on ${n} day${n === 1 ? '' : 's'} since ${date}. If each of those made you 1% better, and each missed day 1% worse:`,
    whereYouAre: 'where you are', afterYear: 'after a year of 1% days',
    nothingSched: 'nothing scheduled', chartLabel: 'Daily completion, last 30 days',

    // Goals
    goals: 'Goals', goalsSub: 'Goals set direction. Habits get you there.',
    goalsEmpty: 'Set a goal, then attach the habits — the system — that will carry you to it.',
    newGoal: 'New goal', editGoal: 'Edit goal',
    goal: 'Goal', goalPh: 'e.g. Run a half marathon',
    why: 'Why it matters', whyPh: 'e.g. To feel strong and have energy for my kids',
    targetDate: 'Target date (optional)',
    milestones: 'Milestones', milestonesHint: 'One per line. Small, concrete checkpoints.',
    milestonesPh: 'Run 5k without stopping\nRun 10k\nSign up for the race',
    yourSystem: 'Your system', systemHint: 'Which daily habits move you toward this goal?',
    noHabitsCreate: 'No habits yet — <a href="#/habit/new">create one</a> first.', // (html)
    saveGoal: 'Save goal', createGoal: 'Create goal', deleteGoal: 'Delete goal',
    msCount: (d, n) => `${d}/${n} milestones`, systemConsistency: 'System consistency',
    daysLeft: n => `${n} day${n === 1 ? '' : 's'} left`, daysPast: n => `${n} day${n === 1 ? '' : 's'} past target`,
    systemLine: p => `The system · ${p} consistent (30d)`,

    // More
    more: 'More', language: 'Language', tools: 'Tools',
    scorecard: 'Habit Scorecard', scorecardSub: 'Become aware of your current habits',
    lawsMenu: 'The Four Laws', lawsMenuSub: 'Cheat sheet for building and breaking habits',
    yourData: 'Your data',
    exportT: 'Export backup', exportSub: 'Download everything as a JSON file',
    importT: 'Import backup', importSub: 'Replace current data from a JSON file',
    erase: 'Erase all data',
    localNote: 'Everything is stored only on this device. Export a backup now and then.',
    install: 'Add to home screen', installApp: 'Install app', installAppSub: 'Add Atoms to your home screen',
    installIos: 'In <b>Safari</b>, tap <b>Share</b> <span aria-hidden="true">⬆︎</span> then <b>Add to Home Screen</b>.', // (html)
    installAndroid: 'In <b>Chrome</b>, tap the <b>⋮</b> menu then <b>Install app</b> or <b>Add to Home screen</b>.', // (html)
    inspired: 'Inspired by <i>Atomic Habits</i> by James Clear. Not affiliated.', // (html)

    // Scorecard page
    scSub: 'List what you do in a typical day, in order. Rate each: does it serve the person you want to become?',
    good: 'Good (+)', neutral: 'Neutral (=)', bad: 'Bad (−)',
    goodA: 'Good', neutralA: 'Neutral', badA: 'Bad', rate: 'Rate',
    yourDay: 'Your day', scExample: 'e.g. Wake up · Check phone · Make coffee · Scroll news · Shower…',
    addBehavior: 'Add a behavior…', remove: 'Remove',
    scNote: 'The goal isn’t to judge — it’s to notice. Turn a “−” into a habit to break, or stack a new habit after a “+”.',

    // Laws page
    lawsIntro: 'Cue → Craving → Response → Reward. To build a habit, follow the law; to break one, invert it.',
    lawN: n => `Law ${n}`,
    lawsRef: [
      ['Make it obvious', 'Make it invisible',
        ['Fill out a Habit Scorecard', 'Implementation intention: “I will [X] at [time] in [place]”', 'Habit stacking: “After [current], I will [new]”', 'Make good cues visible'],
        ['Remove cues from your environment', 'Keep temptations out of sight']],
      ['Make it attractive', 'Make it unattractive',
        ['Temptation bundling', 'Join a culture where it’s the normal behavior', 'Do something you enjoy right before'],
        ['Reframe: highlight the benefits of avoiding it']],
      ['Make it easy', 'Make it difficult',
        ['Reduce friction', 'Prime the environment', 'Two-minute rule', 'Automate where you can'],
        ['Increase friction', 'Use a commitment device']],
      ['Make it satisfying', 'Make it unsatisfying',
        ['Give yourself an immediate reward', 'Track it — don’t break the chain', 'Never miss twice'],
        ['Get an accountability partner', 'Create a habit contract']],
    ],

    notFound: 'That item doesn’t exist anymore.', goToday: 'Go to Today',

    // Toasts & dialogs
    voteFor: x => `+1 vote for “I am ${x}”`, vote: '+1 vote', streakSuffix: n => ` · ${n}-day streak`,
    archivedT: 'Habit archived', restoredT: 'Habit restored',
    deleteConfirm: x => `Delete “${x}” and its entire history? Archiving keeps the history.`,
    deletedT: 'Habit deleted', milestoneT: 'Milestone reached',
    deleteGoalConfirm: 'Delete this goal?', backupDl: 'Backup downloaded',
    eraseConfirm: 'Erase all habits, goals and history from this device? This cannot be undone.',
    erasedT: 'All data erased', savedT: 'Saved', createdT: 'Habit created — start with two minutes',
    goalSaved: 'Goal saved', goalCreated: 'Goal created', pickDay: 'Pick at least one day',
    importConfirm: n => `Replace current data with this backup (${n} habit${n === 1 ? '' : 's'})?`,
    restoredBackup: 'Backup restored', invalidBackup: 'That file isn’t a valid backup',
    storageFull: 'Could not save — storage is full',

    // Logbook
    trackingLabel: 'Tracking', logTypeField: 'What to log each time',
    logTypeHint: 'Beyond a simple check, log details each day — sets, pages, links, or photos.',
    log_none: 'Just a check', log_note: 'A note', log_reading: 'Reading (book, page, language)',
    log_writing: 'Writing (link / words)', log_workout: 'Workout (sets & reps)', log_photo: 'Progress photos',
    log_leetcode: 'LeetCode (problems & review)',
    pTitlePh: 'Problem name or #', pTopicPh: 'Pattern / topic', pNotePh: 'Approach, mistakes…',
    difficulty: 'Difficulty', status: 'Status',
    diff_easy: 'Easy', diff_med: 'Medium', diff_hard: 'Hard',
    st_solved: 'Solved', st_review: 'Review', st_stuck: 'Stuck',
    addProblem: 'Add problem', toRevisit: 'To revisit', markSolved: 'Mark solved',
    fLeetNotePh: 'Patterns to review, insights…', solvedUnit: 'solved',
    logToday: x => `Log: ${x}`, saveLog: 'Save log', logSaved: 'Logged', delLogConfirm: 'Delete this entry and its photos?',
    logbook: 'Logbook', gallery: 'Progress photos', noLogs: 'No entries yet.',
    photos: 'Photos', addPhoto: 'Add photo', photoFailed: 'Could not add that photo',
    fBook: 'Book', fBookPh: 'e.g. Atomic Habits', fPage: 'Page', fLanguage: 'Language', fLanguagePh: 'e.g. English',
    fNotes: 'Notes', fReadNotePh: 'A line about what you read…', fLink: 'Link', fWhat: 'What I wrote',
    fWhatPh: 'e.g. Chapter 3 draft', fWords: 'Word count', fWriteNotePh: 'How it went…',
    fWorkoutNotePh: 'How you felt, PRs…', fPhotoNotePh: 'Weight, notes…', fNotePh: 'Anything worth remembering…',
    photoLogHint: 'Add a progress photo. They build a timeline you can scroll back through.',
    pageN: x => `p. ${x}`, wordsUnit: 'words', weight: 'Weight', reps: 'Reps', kg: 'kg', last: 'last', rest: 'Rest day',
    sess_push: 'Push', sess_pull: 'Pull', sess_legs: 'Legs',
    noProgram: 'No program set for this session.', rampNote: 'Returning: keep ~2 working sets per lift and leave 3–4 reps in reserve this week.',

    // Prayer times
    prayers: 'Prayer times', prayersSub: 'Calculated on your phone from your location. Nothing is sent anywhere.',
    prayersMenuSub: 'Five 15-minute prayer blocks on Today',
    prayerShow: 'Show prayer times on Today',
    prayer_fajr: 'Fajr', prayer_dhuhr: 'Dhuhr', prayer_asr: 'Asr', prayer_maghrib: 'Maghrib', prayer_isha: 'Isha',
    sunrise: 'Sunrise', prayerNow: 'Now', prayerIn: x => `In ${x}`,
    prayed: x => `Prayed: ${x}`, prayersCount: (d, n) => `Prayers ${d}/${n}`,
    yourLocation: 'Your location',
    locNone: 'Allow location so the prayer times match where you are.',
    useLocation: 'Use my location', updateLocation: 'Update location', locating: 'Locating…',
    locUpdated: 'Location updated',
    locDenied: 'Location access was denied. Allow it in your phone’s settings, or enter coordinates manually.',
    locFailed: 'Couldn’t get your location. Try again.',
    locUnavailable: 'Location isn’t available on this device.',
    locUpdatedAgo: x => `Updated ${x}`,
    autoLoc: 'Update automatically when I travel',
    manualCoords: 'Enter coordinates manually', latitude: 'Latitude', longitude: 'Longitude', saveT2: 'Save',
    coordsInvalid: 'Enter a valid latitude (−90 to 90) and longitude (−180 to 180)',
    calcMethod: 'Calculation method', methodAuto: x => `Automatic — ${x}`,
    asrLabel: 'Asr time', asrShafi: 'Standard (Shafi‘i, Maliki, Hanbali)', asrHanafi: 'Hanafi (later)',
    adjustMinutes: 'Adjust minutes',
    adjustHint: 'Times differ slightly between mosques. Compare with your local mosque and shift any prayer by a few minutes.',
    prayerTimesToday: 'Prayer times today', prayers14: 'Prayers · last 14 days',
    methods: {
      mwl: 'Muslim World League', uoif: 'France — UOIF (12°)', morocco: 'Morocco (19° / 17°)',
      egyptian: 'Egyptian General Authority', karachi: 'Karachi (University of Islamic Sciences)',
      ummalqura: 'Umm al-Qura (Makkah)', dubai: 'Dubai (UAE)', qatar: 'Qatar', kuwait: 'Kuwait',
      moonsighting: 'Moonsighting Committee', isna: 'ISNA (North America)',
      singapore: 'Singapore / Malaysia / Indonesia', turkey: 'Turkey (Diyanet, approx.)', tehran: 'Tehran',
    },

    // Duration & timer
    duration: 'Duration', minUnit: 'min',
    startTimer: x => `Start timer: ${x}`, timerFull: x => `Start · ${x}`, timerTwo: 'Just 2 minutes',
    pause: 'Pause', resume: 'Resume', finishNow: 'Done', cancel: 'Cancel', close: 'Close',
    timerDone: 'Time’s up — habit checked off',
    timerHint: 'Showing up is what counts. Start with two minutes if that’s all you’ve got.',

    // Coach (on-device AI)
    tabCoach: 'Coach', coach: 'Coach', coachSub: 'Your on-device habit coach',
    aiPrivacy: 'Runs entirely on your phone. Nothing you write leaves this device.',
    aiDownload: mb => `Download & start (~${mb} MB)`,
    aiWifi: 'One-time download — use Wi-Fi; it takes a few minutes. It then stays on your phone and works offline. Works best on recent phones; answers take 15–30 seconds.',
    aiKeepOpen: 'Keep Atoms open until it finishes — the screen stays on. If it stops, tap the button again: it resumes where it left off.',
    aiStart: 'Start coach', aiLoading: 'Loading the coach…', aiModelLbl: x => `Model: ${x}`,
    aiRemove: 'Remove downloaded model', aiRemoveConfirm: 'Delete the downloaded model from this phone? You can download it again later.', aiRemoved: 'Model removed',
    aiUnsupported: 'This browser can’t run the AI on-device (it needs WebGPU). On iPhone, update to iOS 26 or later and use Safari. On Android, use an up-to-date Chrome.',
    aiError: x => `The coach couldn’t start: ${x}. If your phone is low on memory, close other apps and try again.`, retry: 'Try again',
    coachEmpty: 'Ask anything about building or breaking habits. The coach knows your current habits and goals.',
    coachPh: 'Ask the coach…', send: 'Send', stop: 'Stop', clearChat: 'Clear chat',
    coachSuggestions: ['Help me design a morning routine', 'Why do I keep missing my habits?', 'Turn my goal into small daily habits', 'How do I stop scrolling at night?'],
    aiFillTitle: 'Design it with the coach',
    aiFillHint: 'Describe what you want. The coach fills in the empty fields; you review and adjust.',
    aiIdeaPh: 'e.g. I want to read more in the evening', aiFill: 'Fill with AI', aiFilling: 'Thinking…',
    aiFilled: 'Suggestions added — review and adjust', aiNeedIdea: 'Describe the habit first', aiBadOutput: 'The coach got confused. Try rephrasing.',
    aiNone: '(none yet)', aiNeedDownload: 'Download the coach first',
    aiSystem: (habits, goals) => `You are Atoms Coach, a warm, concise habit coach inside a habit-tracking app. Ground your advice in the ideas of the book Atomic Habits: identity-based habits, the Four Laws (make it obvious, attractive, easy, satisfying — and invert them to break bad habits), habit stacking, implementation intentions ("I will [habit] at [time] in [place]"), the two-minute rule, environment design, never miss twice, and systems over goals. Give concrete, small, actionable suggestions. Keep answers short: at most 4 bullet points, under 120 words. Always reply in English. ${STRINGS.en.aiNoRefuse}

The user's habits:
${habits}

The user's goals:
${goals}`,
    aiFillExample: {
      build: ['I want to meditate', '{"name":"Meditate","identity":"a calm person","time":"07:00","duration":10,"location":"in my bedroom","stack":"make my bed","twoMin":"Take three deep breaths","pair":"My favorite tea while I sit","prime":"Leave the cushion on the floor","reward":"Check it off and enjoy the calm"}'],
      break: ['I want to stop eating sugar at night', '{"name":"No sugar after dinner","identity":"someone who eats well","hideCue":"Keep no sweets in the house","reframe":"Sugar steals my sleep and energy","friction":"Brush my teeth right after dinner","accountability":"Tell my partner and log every slip"}'],
    },
    aiNoRefuse: 'Questions about habits, routines, health, focus, sleep or screen time are always appropriate: never refuse them.',
    aiFillPrompt: (type, idea) => type === 'break'
      ? `Help me BREAK a bad habit. My request: "${idea}".
Reply in English with a JSON object. Keep every value short (under 12 words).
- name: the habit to stop, 1-5 words (e.g. "No phone in bed")
- identity: completes "I am ..." (e.g. "someone who sleeps well")
- hideCue: how to make the cue invisible
- reframe: a reframe that makes the habit unattractive
- friction: how to make it difficult
- accountability: an immediate cost or accountability partner`
      : `Help me BUILD a good habit. My request: "${idea}".
Reply in English with a JSON object. Keep every value short (under 12 words).
- name: the habit, 1-4 words starting with a verb (e.g. "Read")
- identity: completes "I am ..." (e.g. "a reader")
- time: best start time, 24-hour "HH:MM"
- duration: realistic full duration in minutes (integer)
- location: where, with a preposition (e.g. "on the couch")
- stack: an existing daily habit it comes right after (e.g. "brush my teeth")
- twoMin: a version that takes only two minutes (e.g. "Read one page")
- pair: something enjoyable to pair it with
- prime: how to prepare the environment in advance
- reward: a small immediate reward`,

    principles: [
      ['Systems over goals', 'Goals set the direction; systems make the progress. Fall in love with the process you repeat every day.'],
      ['Every action is a vote', 'Each time you show up, you cast a vote for the person you want to become. You don’t need a unanimous vote, just a majority.'],
      ['1% better', 'Tiny improvements compound. Getting 1% better each day makes you roughly 37× better after a year.'],
      ['Never miss twice', 'Missing once is an accident. Missing twice is the start of a new habit. If you slipped yesterday, today matters most.'],
      ['The two-minute rule', 'Scale a new habit down until it takes two minutes. Master the art of showing up before you optimize.'],
      ['Habit stacking', 'Anchor a new habit to one you already do: “After I [current habit], I will [new habit].”'],
      ['Design your environment', 'Make the cues of good habits visible and the cues of bad habits invisible. Environment beats motivation.'],
      ['Make it satisfying', 'What is immediately rewarded is repeated. Give yourself a small win the moment you finish.'],
      ['The plateau of latent potential', 'Results lag behind effort. Keep going through the valley of disappointment; the work is being stored.'],
      ['Identity first', 'The goal is not to read a book, it’s to become a reader. Decide who you want to be, then prove it with small wins.'],
      ['Reduce friction', 'Lower the number of steps between you and good habits. Increase the steps between you and bad ones.'],
      ['Don’t break the chain', 'A visual record of progress is satisfying on its own. Seeing the streak makes you want to keep it.'],
    ],
    quotes: [
      'You do not rise to the level of your goals. You fall to the level of your systems.',
      'Every action you take is a vote for the type of person you wish to become.',
      'Habits are the compound interest of self-improvement.',
    ],
    q: x => `“${x}”`,
  },

  fr: {
    tabToday: 'Aujourd’hui', tabHabits: 'Habitudes', tabProgress: 'Progrès', tabGoals: 'Objectifs', tabMore: 'Plus',

    greetMorning: 'Bonjour', greetAfternoon: 'Bon après-midi', greetEvening: 'Bonsoir',
    lookingBack: 'Retour en arrière', today: 'Aujourd’hui', backToToday: 'Revenir à aujourd’hui',
    prevDay: 'Jour précédent', nextDay: 'Jour suivant',
    ringLabel: (d, n) => `${d} sur ${n} faites`,
    emptyTitle: 'Commencez par une toute petite habitude',
    emptyBody: 'Choisissez quelque chose de si petit que vous ne pouvez pas refuser. Deux minutes suffisent — l’essentiel est d’être au rendez-vous.',
    createFirst: 'Créer ma première habitude',
    nothingToday: 'Rien de prévu aujourd’hui. Profitez du repos.',
    nothingThatDay: 'Rien de prévu ce jour-là.',
    bonus: 'Non prévues — votes bonus',
    anytime: 'À tout moment', throughDay: 'Au fil de la journée',
    reflection: 'Réflexion',
    reflectionPh: 'Qu’est-ce qui a bien marché ? Qu’est-ce qui a rendu une habitude plus difficile que prévu ? Un petit ajustement pour demain…',
    todaysPrinciple: 'Le principe du jour',
    newHabit: 'Nouvelle habitude',
    breakingChip: 'À arrêter', neverMissTwice: 'Ne jamais manquer deux fois',
    twoMinChip: x => `2 min : ${x}`,
    markResisted: 'Cochez quand vous avez résisté aujourd’hui',
    doneAria: x => `Fait : ${x}`, resistedAria: x => `Résisté : ${x}`,
    streakTitle: 'Série en cours',
    iAm: 'Je suis', iAmX: x => `Je suis ${x}`,
    afterX: x => `Après ${x}`,

    habits: 'Habitudes', activeHabits: n => `${n} habitude${n > 1 ? 's' : ''} active${n > 1 ? 's' : ''}`, new: 'Nouvelle',
    noHabits: 'Aucune habitude pour l’instant. Commencez par quelque chose qui prend deux minutes.',
    archived: 'Archivées',
    everyDay: 'Tous les jours', weekdays: 'En semaine', weekends: 'Le week-end',

    back: 'Retour', editHabit: 'Modifier l’habitude',
    buildHabit: 'Créer une habitude', breakHabit: 'Arrêter une habitude', habitType: 'Type d’habitude',
    whoBecome: 'Qui voulez-vous devenir ?',
    whoHint: 'Les habitudes fondées sur l’identité durent. Chaque réussite est un vote pour cette personne.',
    habitLabel: 'Habitude', habitPhBuild: 'ex. Lire', habitPhBreak: 'ex. Pas de téléphone au lit',
    identity: 'Identité', identityPh: 'un lecteur / quelqu’un qui…',
    law1b: 'Rendez-la évidente', law1bHint: 'Intention de mise en œuvre : « Je vais [habitude] à [heure] [lieu]. » Ou accrochez-la à une habitude existante.',
    time: 'Heure', location: 'Lieu', locationPh: 'ex. sur le canapé',
    afterPrayerLabel: 'Après une prière', afterPrayerNone: '— aucune —',
    afterPrayerHint: 'Cale cette habitude juste après cette prière chaque jour — son heure suit la prière automatiquement.',
    cAfterPrayer: (p, act) => `Après la prière du ${p}, je vais ${act}.`,
    stackLabel: 'Empilement — après…', stackPh: 'ex. mon café du matin', stackHint: 'Après [habitude actuelle], je vais [nouvelle habitude].',
    law1k: 'Rendez-la invisible', law1kHint: 'Supprimez les signaux. Loin des yeux, loin du cœur.',
    hideCue: 'Comment allez-vous cacher le signal ?', hideCuePh: 'ex. Charger mon téléphone dans la cuisine',
    law2b: 'Rendez-la attrayante', law2bHint: 'Regroupement de tentations : associez-la à quelque chose que vous aimez. Entourez-vous de gens pour qui c’est normal.',
    pairLabel: 'L’associer à…', pairPh: 'ex. Mon podcast préféré, seulement en marchant',
    law2k: 'Rendez-la repoussante', law2kHint: 'Changez de regard. Mettez en avant les bénéfices de l’éviter.',
    reframe: 'Nouveau regard', reframePh: 'ex. Le sommeil est mon super-pouvoir ; scroller me le vole',
    law3b: 'Rendez-la facile', law3bHint: 'Réduisez la friction. Ramenez-la à une version de deux minutes — l’important est de s’y mettre.',
    twoMinLabel: 'Version deux minutes', twoMinPh: 'ex. Lire une page',
    primeLabel: 'Préparer l’environnement', primePh: 'ex. Poser le livre sur mon oreiller',
    law3k: 'Rendez-la difficile', law3kHint: 'Augmentez la friction. Utilisez un mécanisme d’engagement.',
    frictionLabel: 'Ajouter de la friction', frictionPh: 'ex. Me déconnecter des applis ; bloquer avec un minuteur',
    law4b: 'Rendez-la satisfaisante', law4bHint: 'Ce qui est récompensé immédiatement est répété. Cocher ici fait partie de la récompense.',
    rewardLabel: 'Récompense immédiate', rewardPh: 'ex. Un thé une fois terminé',
    law4k: 'Rendez-la insatisfaisante', law4kHint: 'Ajoutez un coût immédiat. Un partenaire de responsabilité ou un contrat d’habitude aide.',
    accountLabel: 'Responsabilité', accountPh: 'ex. Envoyer un SMS à Sam à chaque écart',
    scheduleColor: 'Jours et couleur', days: 'Jours', color: 'Couleur', colorN: i => `Couleur ${i}`,
    saveChanges: 'Enregistrer', createHabit: 'Créer l’habitude',
    archive: 'Archiver', restore: 'Restaurer', delete: 'Supprimer',

    building: 'À construire', breakingLbl: 'À arrêter', archivedLbl: 'Archivée', edit: 'Modifier',
    someoneInControl: 'maître de moi',
    cIAm: x => `Je suis ${x}.`,
    cStop: x => `J’arrête : ${x}.`,
    cWill: (name, time, loc, dur) => `Je vais ${name}${time ? ` à ${time}` : ''}${dur ? ` pendant ${dur}` : ''}${loc ? ` ${loc}` : ''}.`,
    cStack: (stack, act) => `Après ${stack}, je vais ${act}.`,
    stats: 'Statistiques', streak: 'Série', best: 'Record', days30: '30 jours', votes: 'Votes',
    history: 'Historique', legendDone: 'Fait', legendResisted: 'Résisté', missed: 'Manqué', restDay: 'Repos',
    pending: 'en attente', tapToFix: 'Touchez un jour pour corriger votre historique.',
    fourLaws: 'Les quatre lois',
    lawsBuild: ['Évidente', 'Attrayante', 'Facile', 'Satisfaisante'],
    lawsBreak: ['Invisible', 'Repoussante', 'Difficile', 'Insatisfaisante'],
    notSet: 'Non défini', add: 'ajouter',

    progress: 'Progrès', progressSub: 'De petites victoires qui se cumulent.',
    progressEmpty: 'Vos progrès apparaîtront ici dès que vous commencerez à cocher.',
    totalVotes: 'Votes au total', avg30: 'Moy. 30 jours', activeDays: 'Jours actifs',
    last30: '30 derniers jours', habits14: 'Habitudes · 14 derniers jours',
    identityVotes: 'Votes d’identité', noIdentity: 'Sans identité', firstVote: 'Réalisez une habitude pour voter pour la première fois.',
    power1: 'Le pouvoir du 1 %',
    power1Body: (n, date) => `Vous avez été au rendez-vous ${n} jour${n > 1 ? 's' : ''} depuis le ${date}. Si chacun de ces jours vous a rendu 1 % meilleur, et chaque jour manqué 1 % moins bon :`,
    whereYouAre: 'où vous en êtes', afterYear: 'après un an à 1 % par jour',
    nothingSched: 'rien de prévu', chartLabel: 'Taux de réalisation quotidien, 30 derniers jours',

    goals: 'Objectifs', goalsSub: 'Les objectifs donnent la direction. Les habitudes vous y mènent.',
    goalsEmpty: 'Fixez un objectif, puis rattachez-y les habitudes — le système — qui vous y mèneront.',
    newGoal: 'Nouvel objectif', editGoal: 'Modifier l’objectif',
    goal: 'Objectif', goalPh: 'ex. Courir un semi-marathon',
    why: 'Pourquoi c’est important', whyPh: 'ex. Me sentir fort et avoir de l’énergie pour mes enfants',
    targetDate: 'Date cible (facultatif)',
    milestones: 'Étapes', milestonesHint: 'Une par ligne. De petits jalons concrets.',
    milestonesPh: 'Courir 5 km sans m’arrêter\nCourir 10 km\nM’inscrire à la course',
    yourSystem: 'Votre système', systemHint: 'Quelles habitudes quotidiennes vous rapprochent de cet objectif ?',
    noHabitsCreate: 'Aucune habitude — <a href="#/habit/new">créez-en une</a> d’abord.',
    saveGoal: 'Enregistrer', createGoal: 'Créer l’objectif', deleteGoal: 'Supprimer l’objectif',
    msCount: (d, n) => `${d}/${n} étapes`, systemConsistency: 'Régularité du système',
    daysLeft: n => `${n} jour${n > 1 ? 's' : ''} restant${n > 1 ? 's' : ''}`, daysPast: n => `${n} jour${n > 1 ? 's' : ''} après la date cible`,
    systemLine: p => `Le système · ${p} de régularité (30 j)`,

    more: 'Plus', language: 'Langue', tools: 'Outils',
    scorecard: 'Bilan des habitudes', scorecardSub: 'Prenez conscience de vos habitudes actuelles',
    lawsMenu: 'Les quatre lois', lawsMenuSub: 'Aide-mémoire pour créer et arrêter des habitudes',
    yourData: 'Vos données',
    exportT: 'Exporter une sauvegarde', exportSub: 'Tout télécharger dans un fichier JSON',
    importT: 'Importer une sauvegarde', importSub: 'Remplacer les données actuelles par un fichier JSON',
    erase: 'Effacer toutes les données',
    localNote: 'Tout est stocké uniquement sur cet appareil. Exportez une sauvegarde de temps en temps.',
    install: 'Ajouter à l’écran d’accueil', installApp: 'Installer l’application', installAppSub: 'Ajouter Atoms à votre écran d’accueil',
    installIos: 'Dans <b>Safari</b>, touchez <b>Partager</b> <span aria-hidden="true">⬆︎</span> puis <b>Sur l’écran d’accueil</b>.',
    installAndroid: 'Dans <b>Chrome</b>, touchez le menu <b>⋮</b> puis <b>Installer l’application</b> ou <b>Ajouter à l’écran d’accueil</b>.',
    inspired: 'Inspiré de <i>Atomic Habits</i> de James Clear. Sans affiliation.',

    scSub: 'Listez ce que vous faites dans une journée type, dans l’ordre. Notez chaque élément : sert-il la personne que vous voulez devenir ?',
    good: 'Bonne (+)', neutral: 'Neutre (=)', bad: 'Mauvaise (−)',
    goodA: 'Bonne', neutralA: 'Neutre', badA: 'Mauvaise', rate: 'Noter',
    yourDay: 'Votre journée', scExample: 'ex. Réveil · Regarder mon téléphone · Café · Lire les infos · Douche…',
    addBehavior: 'Ajouter un comportement…', remove: 'Retirer',
    scNote: 'Le but n’est pas de juger, mais de remarquer. Transformez un « − » en habitude à arrêter, ou empilez une nouvelle habitude après un « + ».',

    lawsIntro: 'Signal → Envie → Réponse → Récompense. Pour créer une habitude, suivez la loi ; pour en arrêter une, inversez-la.',
    lawN: n => `Loi ${n}`,
    lawsRef: [
      ['Rendez-la évidente', 'Rendez-la invisible',
        ['Faites le bilan de vos habitudes', 'Intention de mise en œuvre : « Je vais [X] à [heure] [lieu] »', 'Empilement : « Après [habitude actuelle], je vais [nouvelle] »', 'Rendez visibles les bons signaux'],
        ['Supprimez les signaux de votre environnement', 'Gardez les tentations hors de vue']],
      ['Rendez-la attrayante', 'Rendez-la repoussante',
        ['Regroupement de tentations', 'Rejoignez un groupe où c’est le comportement normal', 'Faites juste avant quelque chose que vous aimez'],
        ['Changez de regard : soulignez les bénéfices de l’éviter']],
      ['Rendez-la facile', 'Rendez-la difficile',
        ['Réduisez la friction', 'Préparez l’environnement', 'Règle des deux minutes', 'Automatisez quand c’est possible'],
        ['Augmentez la friction', 'Utilisez un mécanisme d’engagement']],
      ['Rendez-la satisfaisante', 'Rendez-la insatisfaisante',
        ['Offrez-vous une récompense immédiate', 'Suivez-la — ne brisez pas la chaîne', 'Ne jamais manquer deux fois'],
        ['Trouvez un partenaire de responsabilité', 'Rédigez un contrat d’habitude']],
    ],

    notFound: 'Cet élément n’existe plus.', goToday: 'Aller à Aujourd’hui',

    voteFor: x => `+1 vote pour « Je suis ${x} »`, vote: '+1 vote', streakSuffix: n => ` · série de ${n} jours`,
    archivedT: 'Habitude archivée', restoredT: 'Habitude restaurée',
    deleteConfirm: x => `Supprimer « ${x} » et tout son historique ? L’archivage conserve l’historique.`,
    deletedT: 'Habitude supprimée', milestoneT: 'Étape atteinte',
    deleteGoalConfirm: 'Supprimer cet objectif ?', backupDl: 'Sauvegarde téléchargée',
    eraseConfirm: 'Effacer toutes les habitudes, objectifs et l’historique de cet appareil ? Action irréversible.',
    erasedT: 'Toutes les données ont été effacées', savedT: 'Enregistré', createdT: 'Habitude créée — commencez par deux minutes',
    goalSaved: 'Objectif enregistré', goalCreated: 'Objectif créé', pickDay: 'Choisissez au moins un jour',
    importConfirm: n => `Remplacer les données actuelles par cette sauvegarde (${n} habitude${n > 1 ? 's' : ''}) ?`,
    restoredBackup: 'Sauvegarde restaurée', invalidBackup: 'Ce fichier n’est pas une sauvegarde valide',
    storageFull: 'Enregistrement impossible — stockage plein',

    trackingLabel: 'Suivi', logTypeField: 'À enregistrer à chaque fois',
    logTypeHint: 'Au-delà d’une simple coche, note des détails chaque jour — séries, pages, liens ou photos.',
    log_none: 'Simple coche', log_note: 'Une note', log_reading: 'Lecture (livre, page, langue)',
    log_writing: 'Écriture (lien / mots)', log_workout: 'Séance (séries & répétitions)', log_photo: 'Photos de progression',
    log_leetcode: 'LeetCode (problèmes & révision)',
    pTitlePh: 'Nom ou n° du problème', pTopicPh: 'Motif / thème', pNotePh: 'Approche, erreurs…',
    difficulty: 'Difficulté', status: 'Statut',
    diff_easy: 'Facile', diff_med: 'Moyen', diff_hard: 'Difficile',
    st_solved: 'Résolu', st_review: 'À revoir', st_stuck: 'Bloqué',
    addProblem: 'Ajouter un problème', toRevisit: 'À revoir', markSolved: 'Marquer résolu',
    fLeetNotePh: 'Motifs à réviser, remarques…', solvedUnit: 'résolus',
    logToday: x => `Journal : ${x}`, saveLog: 'Enregistrer', logSaved: 'Enregistré', delLogConfirm: 'Supprimer cette entrée et ses photos ?',
    logbook: 'Journal', gallery: 'Photos de progression', noLogs: 'Aucune entrée pour l’instant.',
    photos: 'Photos', addPhoto: 'Ajouter une photo', photoFailed: 'Impossible d’ajouter cette photo',
    fBook: 'Livre', fBookPh: 'ex. Un rien peut tout changer', fPage: 'Page', fLanguage: 'Langue', fLanguagePh: 'ex. Français',
    fNotes: 'Notes', fReadNotePh: 'Une ligne sur ce que vous avez lu…', fLink: 'Lien', fWhat: 'Ce que j’ai écrit',
    fWhatPh: 'ex. Brouillon du chapitre 3', fWords: 'Nombre de mots', fWriteNotePh: 'Comment ça s’est passé…',
    fWorkoutNotePh: 'Sensations, records…', fPhotoNotePh: 'Poids, remarques…', fNotePh: 'À retenir…',
    photoLogHint: 'Ajoutez une photo de progression. Elles forment une chronologie à faire défiler.',
    pageN: x => `p. ${x}`, wordsUnit: 'mots', weight: 'Poids', reps: 'Rép.', kg: 'kg', last: 'dernier', rest: 'Repos',
    sess_push: 'Poussée', sess_pull: 'Tirage', sess_legs: 'Jambes',
    noProgram: 'Aucun programme pour cette séance.', rampNote: 'Reprise : gardez ~2 séries effectives par exercice et laissez 3–4 répétitions en réserve cette semaine.',

    prayers: 'Heures de prière', prayersSub: 'Calculées sur votre téléphone à partir de votre position. Rien n’est envoyé.',
    prayersMenuSub: 'Cinq créneaux de prière de 15 min dans Aujourd’hui',
    prayerShow: 'Afficher les prières dans Aujourd’hui',
    prayer_fajr: 'Fajr', prayer_dhuhr: 'Dhohr', prayer_asr: 'Asr', prayer_maghrib: 'Maghrib', prayer_isha: 'Icha',
    sunrise: 'Lever du soleil', prayerNow: 'Maintenant', prayerIn: x => `Dans ${x}`,
    prayed: x => `Prière faite : ${x}`, prayersCount: (d, n) => `Prières ${d}/${n}`,
    yourLocation: 'Votre position',
    locNone: 'Autorisez la localisation pour que les heures correspondent à l’endroit où vous êtes.',
    useLocation: 'Utiliser ma position', updateLocation: 'Mettre à jour ma position', locating: 'Localisation…',
    locUpdated: 'Position mise à jour',
    locDenied: 'L’accès à la position a été refusé. Autorisez-le dans les réglages du téléphone, ou saisissez les coordonnées.',
    locFailed: 'Impossible d’obtenir votre position. Réessayez.',
    locUnavailable: 'La localisation n’est pas disponible sur cet appareil.',
    locUpdatedAgo: x => `Mise à jour ${x}`,
    autoLoc: 'Mettre à jour automatiquement en déplacement',
    manualCoords: 'Saisir les coordonnées manuellement', latitude: 'Latitude', longitude: 'Longitude', saveT2: 'Enregistrer',
    coordsInvalid: 'Saisissez une latitude valide (−90 à 90) et une longitude (−180 à 180)',
    calcMethod: 'Méthode de calcul', methodAuto: x => `Automatique — ${x}`,
    asrLabel: 'Heure de l’Asr', asrShafi: 'Standard (chafiite, malikite, hanbalite)', asrHanafi: 'Hanafite (plus tard)',
    adjustMinutes: 'Ajuster les minutes',
    adjustHint: 'Les horaires varient légèrement d’une mosquée à l’autre. Comparez avec votre mosquée et décalez une prière de quelques minutes si besoin.',
    prayerTimesToday: 'Heures de prière aujourd’hui', prayers14: 'Prières · 14 derniers jours',
    methods: {
      mwl: 'Ligue islamique mondiale', uoif: 'France — UOIF (12°)', morocco: 'Maroc (19° / 17°)',
      egyptian: 'Autorité générale égyptienne', karachi: 'Karachi (Université des sciences islamiques)',
      ummalqura: 'Umm al-Qura (La Mecque)', dubai: 'Dubaï (EAU)', qatar: 'Qatar', kuwait: 'Koweït',
      moonsighting: 'Moonsighting Committee', isna: 'ISNA (Amérique du Nord)',
      singapore: 'Singapour / Malaisie / Indonésie', turkey: 'Turquie (Diyanet, approx.)', tehran: 'Téhéran',
    },

    duration: 'Durée', minUnit: 'min',
    startTimer: x => `Lancer le minuteur : ${x}`, timerFull: x => `Lancer · ${x}`, timerTwo: 'Juste 2 minutes',
    pause: 'Pause', resume: 'Reprendre', finishNow: 'Terminé', cancel: 'Annuler', close: 'Fermer',
    timerDone: 'Temps écoulé — habitude cochée',
    timerHint: 'L’essentiel est d’être au rendez-vous. Commencez par deux minutes si c’est tout ce que vous avez.',

    tabCoach: 'Coach', coach: 'Coach', coachSub: 'Votre coach d’habitudes, sur l’appareil',
    aiPrivacy: 'Fonctionne entièrement sur votre téléphone. Rien de ce que vous écrivez ne quitte l’appareil.',
    aiDownload: mb => `Télécharger et démarrer (~${mb} Mo)`,
    aiWifi: 'Téléchargement unique — utilisez le Wi-Fi, cela prend quelques minutes. Le modèle reste ensuite sur votre téléphone et fonctionne hors ligne. Idéal sur un téléphone récent ; une réponse prend 15 à 30 secondes.',
    aiKeepOpen: 'Gardez Atoms ouvert jusqu’à la fin — l’écran reste allumé. Si ça s’arrête, touchez à nouveau le bouton : le téléchargement reprend là où il s’était arrêté.',
    aiStart: 'Démarrer le coach', aiLoading: 'Chargement du coach…', aiModelLbl: x => `Modèle : ${x}`,
    aiRemove: 'Supprimer le modèle téléchargé', aiRemoveConfirm: 'Supprimer le modèle téléchargé de ce téléphone ? Vous pourrez le retélécharger plus tard.', aiRemoved: 'Modèle supprimé',
    aiUnsupported: 'Ce navigateur ne peut pas faire tourner l’IA sur l’appareil (WebGPU est nécessaire). Sur iPhone, passez à iOS 26 ou plus récent et utilisez Safari. Sur Android, utilisez un Chrome à jour.',
    aiError: x => `Le coach n’a pas pu démarrer : ${x}. Si votre téléphone manque de mémoire, fermez d’autres applis et réessayez.`, retry: 'Réessayer',
    coachEmpty: 'Posez n’importe quelle question pour créer ou arrêter une habitude. Le coach connaît vos habitudes et objectifs actuels.',
    coachPh: 'Demandez au coach…', send: 'Envoyer', stop: 'Arrêter', clearChat: 'Effacer la conversation',
    coachSuggestions: ['Aidez-moi à créer une routine du matin', 'Pourquoi est-ce que je rate mes habitudes ?', 'Transformez mon objectif en petites habitudes', 'Comment arrêter de scroller le soir ?'],
    aiFillTitle: 'Concevez-la avec le coach',
    aiFillHint: 'Décrivez ce que vous voulez. Le coach remplit les champs vides ; vous relisez et ajustez.',
    aiIdeaPh: 'ex. Je veux lire davantage le soir', aiFill: 'Remplir avec l’IA', aiFilling: 'Réflexion…',
    aiFilled: 'Suggestions ajoutées — relisez et ajustez', aiNeedIdea: 'Décrivez d’abord l’habitude', aiBadOutput: 'Le coach s’est embrouillé. Reformulez.',
    aiNone: '(aucun pour l’instant)', aiNeedDownload: 'Téléchargez d’abord le coach',
    aiSystem: (habits, goals) => `Tu es le Coach Atoms, un coach en habitudes bienveillant et concis, intégré à une application de suivi d’habitudes. Appuie tes conseils sur les idées du livre Atomic Habits : habitudes fondées sur l’identité, les quatre lois (rendre évident, attrayant, facile, satisfaisant — et les inverser pour arrêter une mauvaise habitude), l’empilement d’habitudes, les intentions de mise en œuvre (« Je vais [habitude] à [heure] [lieu] »), la règle des deux minutes, la conception de l’environnement, ne jamais manquer deux fois, et les systèmes avant les objectifs. Donne des suggestions concrètes, petites et réalisables. Réponds brièvement : 4 puces au maximum, moins de 120 mots. Réponds toujours en français et vouvoie l’utilisateur. ${STRINGS.fr.aiNoRefuse}

Habitudes de l’utilisateur :
${habits}

Objectifs de l’utilisateur :
${goals}`,
    aiFillExample: {
      build: ['Je veux méditer', '{"name":"Méditer","identity":"une personne calme","time":"07:00","duration":10,"location":"dans ma chambre","stack":"mon réveil","twoMin":"Trois respirations profondes","pair":"Ma tisane préférée pendant","prime":"Laisser le coussin par terre","reward":"Cocher l’habitude et savourer le calme"}'],
      break: ['Je veux arrêter le sucre le soir', '{"name":"Pas de sucre après le dîner","identity":"quelqu’un qui mange bien","hideCue":"Ne garder aucune sucrerie à la maison","reframe":"Le sucre me vole mon sommeil et mon énergie","friction":"Me brosser les dents juste après le dîner","accountability":"Le dire à mon conjoint et noter chaque écart"}'],
    },
    aiNoRefuse: 'Les questions sur les habitudes, routines, la santé, la concentration, le sommeil ou les écrans sont toujours appropriées : ne les refuse jamais.',
    aiFillPrompt: (type, idea) => type === 'break'
      ? `Aide-moi à ARRÊTER une mauvaise habitude. Ma demande : « ${idea} ».
Réponds en français avec un objet JSON. Chaque valeur doit être courte (moins de 12 mots).
- name : l’habitude à arrêter, 1 à 5 mots (ex. « Pas de téléphone au lit »)
- identity : complète « Je suis … » (ex. « quelqu’un qui dort bien »)
- hideCue : comment rendre le signal invisible
- reframe : un nouveau regard qui rend l’habitude repoussante
- friction : comment la rendre difficile
- accountability : un coût immédiat ou un partenaire de responsabilité`
      : `Aide-moi à CRÉER une bonne habitude. Ma demande : « ${idea} ».
Réponds en français avec un objet JSON. Chaque valeur doit être courte (moins de 12 mots).
- name : l’habitude, 1 à 4 mots commençant par un verbe (ex. « Lire »)
- identity : complète « Je suis … » (ex. « un lecteur »)
- time : meilleure heure de début, format 24 h « HH:MM »
- duration : durée complète réaliste en minutes (entier)
- location : où, avec une préposition (ex. « sur le canapé »)
- stack : une habitude quotidienne existante juste avant (ex. « mon café du matin »)
- twoMin : une version qui ne prend que deux minutes (ex. « Lire une page »)
- pair : quelque chose d’agréable à y associer
- prime : comment préparer l’environnement à l’avance
- reward : une petite récompense immédiate`,

    principles: [
      ['Les systèmes avant les objectifs', 'Les objectifs donnent la direction ; les systèmes font avancer. Tombez amoureux du processus que vous répétez chaque jour.'],
      ['Chaque action est un vote', 'Chaque fois que vous êtes au rendez-vous, vous votez pour la personne que vous voulez devenir. Pas besoin d’unanimité, une majorité suffit.'],
      ['1 % de mieux', 'Les petites améliorations se cumulent. Progresser de 1 % par jour vous rend environ 37 fois meilleur en un an.'],
      ['Ne jamais manquer deux fois', 'Manquer une fois est un accident. Manquer deux fois, c’est le début d’une nouvelle habitude. Si vous avez flanché hier, aujourd’hui compte plus que tout.'],
      ['La règle des deux minutes', 'Réduisez une nouvelle habitude jusqu’à ce qu’elle prenne deux minutes. Apprenez d’abord à être au rendez-vous, optimisez ensuite.'],
      ['L’empilement d’habitudes', 'Accrochez une nouvelle habitude à une habitude existante : « Après [habitude actuelle], je vais [nouvelle habitude]. »'],
      ['Concevez votre environnement', 'Rendez visibles les signaux des bonnes habitudes et invisibles ceux des mauvaises. L’environnement l’emporte sur la motivation.'],
      ['Rendez-la satisfaisante', 'Ce qui est récompensé immédiatement est répété. Offrez-vous une petite victoire dès que vous avez terminé.'],
      ['Le plateau du potentiel latent', 'Les résultats arrivent après l’effort. Traversez la vallée de la déception : le travail s’accumule en silence.'],
      ['L’identité d’abord', 'Le but n’est pas de lire un livre, c’est de devenir lecteur. Décidez qui vous voulez être, puis prouvez-le par de petites victoires.'],
      ['Réduisez la friction', 'Diminuez le nombre d’étapes entre vous et les bonnes habitudes. Augmentez-le pour les mauvaises.'],
      ['Ne brisez pas la chaîne', 'Voir ses progrès est satisfaisant en soi. Voir la série vous donne envie de la prolonger.'],
    ],
    quotes: [
      'Vous ne vous élevez pas au niveau de vos objectifs. Vous tombez au niveau de vos systèmes.',
      'Chaque action que vous entreprenez est un vote pour la personne que vous souhaitez devenir.',
      'Les habitudes sont les intérêts composés du développement personnel.',
    ],
    q: x => `« ${x} »`,
  },
};
