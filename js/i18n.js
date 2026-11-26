/**
 * Modul Internasionalisasi (i18n): English (default) & Bahasa Indonesia
 */
const LANG_STORAGE_KEY = 'story_quest_lang';
let memoryLang = null;

const DICT = {
  en: {
    brandSub: 'Story Island • Grade 9 Junior High School',
    progressLabel: 'Learning Progress',
    navHome: 'Home',
    navMap: 'Map',
    navLeaderboard: 'Rankings',
    navPid: 'IWB Mode',
    navTeacher: 'Teacher',
    switchProfile: 'Switch Student',
    xpSuffix: 'XP',
    daysUnit: 'Days',
    badgesUnit: 'Badges',
    loadingText: 'Preparing Story Island...',
    prevBtn: '⬅️ Previous',
    repeatMatBtn: '🔄 Repeat Material',
    downloadSummaryBtn: '📥 Download Learning Summary',
    nextBtn: 'Next ➡️',
    footerDesc: 'Deep Learning English Media for Grade 9 Junior High School (Narrative Text: Legend & Fable).',
    footerSub: 'Data is saved safely on this device (offline-ready PWA) • No login & no external server.',
    modalClose: 'Close',
    langToggleTitle: 'Switch Language (English / Indonesia)',

    // Home
    heroBadge: 'Grade 9 Junior High School English',
    heroTitle: 'Welcome to Story Quest: Story Island! 🏝️',
    heroDesc:
      'Explore <strong>6 Interactive Islands</strong> to master <strong>Narrative Text (Legend &amp; Fable)</strong> deeply: from communicative purpose, Story Map, text proportions, critical comparison, fact vs opinion, to designing your own story!',
    flowTitle: 'Adventure Flow',
    flowSteps:
      '<li>Fill in your explorer profile &amp; pick your cartoon avatar.</li><li>Watch the Apperception &amp; take the Adaptive Pretest.</li><li>Conquer 6 Islands in order (Material → Mini-Game → Boss Quiz).</li><li>Complete the Final Assessment, Reflection, &amp; download your PDF Certificate!</li>',
    continueBtn: '🚀 Continue Adventure',
    startApersepsiBtn: '🎬 Start from Apperception',
    profileHeading: '🧭 Register / Sign In Explorer Profile',
    nameLabel: 'Student Full Name',
    namePlaceholder: 'Example: Raka Pratama',
    classLabel: 'Class',
    classPlaceholder: 'Example: 9A',
    pickAvatarLabel: 'Choose Your Cartoon Avatar:',
    saveProfileBtn: '⚓ Save Profile & Start Adventure',
    savedProfilesHint: 'Or pick a saved profile on this device:',
    badgeCollectionTitle: '🎖️ Your Badge Collection ({owned}/{total})',
    badgeCollectionSub: 'Collect badges by completing islands, mini-games, & reflections!',

    // Apersepsi
    apersepsiBadge: 'Stage 1 • Apperception',
    apersepsiTitle: '🎬 Observe Before Setting Sail!',
    skipApersepsiBtn: 'Continue to Pretest ➡️',
    apersepsiPlaceholder: 'Starter video can be configured via YouTube link in Teacher Mode.',
    apersepsiOfflineNote: 'If offline, observe the island illustration on the right and discuss the starter question with classmates.',
    apersepsiPromptTitle: '🤔 Starter Question',
    apersepsiPromptQ: '"What would happen if a story character broke a sacred promise or underestimated a smaller friend?"',
    apersepsiPromptHint: 'Write a quick prediction in your notebook or discuss aloud before starting the mission! (No need to memorize theory yet.)',

    // Pretest & Quiz Engine
    pretestDoneTitle: 'Pretest Already Completed',
    pretestScoreLabel: 'Your Pretest Score:',
    pretestRecTitle: '📌 Learning Recommendation',
    pretestRecBody: 'Recommended focus area: <strong>Island {id}: {name}</strong>. All islands still unlock sequentially starting from Island 1.',
    retakePretestBtn: '🔄 Retake Pretest',
    enterMapBtn: '🗺️ Enter Island Map',
    pretestTitle: 'Adaptive Pretest',
    pretestSub: '10 adaptive questions to map your readiness and suggest a focus island.',
    diffHard: 'Level: High (HOTS)',
    diffEasy: 'Level: Basic',
    diffMedium: 'Level: Medium',
    questionProgress: 'Question {curr} / {total}',
    passageLabel: '📖 Text Excerpt (English):',
    tempCorrect: 'Correct answers so far: {count}',
    nextQuestionBtn: 'Next Question ➡️',
    seeFinalResultBtn: 'View Final Result 🏁',
    correctToast: '✅ Awesome! Your answer is correct!',
    answerKeyLabel: 'Answer Key:',
    explanationLabel: 'Explanation:',
    resultHeading: '{title} Result',
    resultCountSub: '{correct} out of {total} questions answered correctly',
    recBoxTitle: '🧭 Your Adventure Map Recommendation',
    recBoxDesc: 'Based on your Adaptive Pretest answers, the most recommended focus is <strong>Island {id}: {name}</strong> ({sub}).',
    recBoxNote: 'Following the adventure rules, islands remain sequential from Island 1. The recommended island is highlighted on the map!',
    predicateLabel: 'Predicate: {label}',
    bossPassedMsg: '🎉 <strong>Island Boss Defeated!</strong> The next island is now unlocked on the map!',
    bossFailedMsg: '🌱 <strong>Score is still below {pass}.</strong> No worries! Review the mini-material or retry the Boss Quiz to unlock the next island.',
    retryQuizBtn: '🔄 Try Again',
    continueAdvBtn: 'Continue Adventure ➡️',

    // Map
    mapTitle: '🗺️ Story Island Map (6 Sequential Levels)',
    mapSub: 'Complete mini-material, mini-game, and Boss Quiz (score ≥ {pass}) to unlock the next island.',
    mapApersepsiBtn: '🎬 Apperception',
    mapPretestBtn: '🧭 Pretest',
    recBadge: '📌 Pretest Recommendation',
    completedBadge: '✅ Clear (Boss: {score})',
    unlockedBadge: '🔓 Unlocked',
    lockedBadge: '🔒 Locked',
    islandLabel: 'Island {id}: {name}',
    revisitIslandBtn: '🔄 Visit / Repeat Island',
    exploreIslandBtn: '⛵ Explore This Island',
    lockedIslandBtn: 'Complete Island {prev} First',
    finalGateTitle: '🏁 Final Adventure Gate',
    finalGateDone: 'Awesome! All 6 islands are conquered. Take the Final Assessment, fill in Reflection, and claim your Certificate!',
    finalGateWait: 'Complete all 6 islands to unlock the Final Assessment & Certificate ({done}/6 completed).',
    posttestBtn: '📝 Final Assessment',
    reflectionBtn: '💭 Reflection',
    certBtn: '🎓 Certificate',

    // Island view
    islandBadge: 'Island {id} of 6',
    tabMaterial: '1. Mini-Material',
    tabGame: '2. Mini-Game',
    tabBoss: '3. Boss Quiz',
    materialSlideBadge: 'Mini-Material • Screen {curr} / {total}',
    readSampleBtn: '📖 Read Sample Text ({title})',
    sampleOrigin: 'Origin:',
    samplePurpose: 'Purpose:',
    sampleEvidenceTitle: '🔍 Communicative Purpose Evidence',
    matPrevBtn: '⬅️ Previous Screen',
    matNextBtn: 'Next Material Screen ➡️',
    matToGameBtn: '🎮 Go to Mini-Game ➡️',
    challengeBossBtn: '⚔️ Challenge Island {id} Boss Quiz ➡️',
    bossQuizTitle: 'Island {id} Boss Quiz: {name}',
    bossQuizSub: '10 HOTS questions (5 island-specific + 5 cross-topic). Score ≥ 70 to unlock the next island!',
    presentationTitle: '🖥️ Group Presentation: {title}',
    presentationTag: '{genre} • Group Creation',
    presentationMoral: '🎯 Moral Value',

    // Posttest & Reflection
    posttestTitle: 'Story Quest Final Assessment',
    posttestSub: '10 comprehensive medium-high questions covering all Narrative Text learning objectives.',
    reflectionBadge: 'Deep Learning • Self-Reflection',
    reflectionTitle: '💭 Adventure Reflection',
    reflectionSub: 'Complete the 4 fill-in-the-blank sentences honestly, then save before printing your certificate.',
    ref1Label: '1. The most important thing I learned about Narrative Text (Legend & Fable) is ...',
    ref1Ph: 'Write your main takeaway...',
    ref2Label: '2. The schematic stage or analysis skill I found most challenging was ..., and I overcame it by ...',
    ref2Ph: 'Describe your challenge & strategy...',
    ref3Label: '3. The accurate way to distinguish text facts from reader opinions is by checking ...',
    ref3Ph: 'Write keywords or evidence checks...',
    ref4Label: '4. The moral value from the stories that I will practice in daily life is ...',
    ref4Ph: 'Example: keeping promises, respecting parents...',
    saveRefBtn: '💾 Save Reflection',
    openCertBtn: '🎓 Open Certificate ➡️',
    refSavedAlert: '✅ Reflection saved on this device! You are ready to download your PDF Certificate.',

    // Certificate
    certPageTitle: '🎓 Story Quest Completion Certificate',
    certPageSub: 'Official Narrative Text (Legend & Fable) adventure certificate ready for PDF download or printing.',
    certBackMap: '🗺️ Back to Map',
    certPrint: '🖨️ Print',
    certPdf: '📥 Download PDF',
    certNotEligible: '⚠️ Complete the <strong>Final Assessment</strong> first to activate your score on the certificate.',
    certRibbon: 'CERTIFICATE OF ACHIEVEMENT',
    certSubject: 'Grade 9 Junior High School English — Narrative Text (Legend & Fable)',
    certAwardedTo: 'Proudly presented to:',
    certClassLabel: 'Class:',
    certBody: 'Has completed deep learning on <strong>Narrative Text (Legend &amp; Fable)</strong> covering communicative purpose analysis, schematic structure, text proportions, critical comparison, fact vs opinion evaluation, and original story design.',
    certFinalScore: 'Final Score',
    certPredikat: 'Predicate',
    certTotalXp: 'Total XP & Islands',
    certIslandsUnit: 'Islands',
    certDateIssued: 'Date Issued:',
    certIdLabel: 'Certificate ID:',
    certIssuer: 'Story Quest Development Team',
    certIssuerSub: 'Grade 9 Junior High School English Learning',

    // Leaderboard & Teacher
    lbTitle: '🏆 Local Leaderboard',
    lbEmpty: 'No student profiles registered on this device yet.',
    lbSub: 'Local leaderboard ranked by adventure XP on this device.',
    lbColStudent: 'Student',
    lbColClass: 'Class',
    lbColXp: 'Level & XP',
    lbColIslands: 'Islands Clear',
    lbColFinal: 'Final Score',
    lbColBadges: 'Badges',
    teacherModalTitle: '👩‍🏫 Teacher Mode (PIN Required)',
    teacherPinPrompt: 'Enter the <strong>Teacher PIN</strong> to view score recaps, timer settings, CSV/JSON export, and device data reset.',
    teacherPinPh: 'Enter PIN (default: 1234)',
    teacherPinBtn: '🔓 Unlock',
    teacherPinError: 'Incorrect PIN! Check CONFIG.TEACHER_PIN in js/config.js.',
    teacherRecapTitle: '📊 Student Learning Recap ({count} Profiles on This Device)',
    teacherNoData: 'No student data yet.',
    teacherExportCsv: '📄 Export CSV',
    teacherExportJson: '📦 Export JSON',
    teacherSettingsTitle: '⚙️ Learning Settings',
    teacherTimerLabel: 'Quiz Race Duration (seconds)',
    teacherYtLabel: 'Apperception YouTube Video URL',
    teacherBgmLabel: 'Background Music YouTube URL',
    teacherBgmEnabledLabel: 'Enable Background Music by default',
    bgmOnLabel: 'BGM On',
    bgmOffLabel: 'BGM Off',
    teacherSaveSettings: '💾 Save Settings',
    teacherSettingsSaved: '✅ Settings saved successfully.',
    teacherDangerZone: 'Danger Zone: Delete all profiles & progress in this browser.',
    teacherResetAll: '🗑️ Reset All Data',
    teacherConfirmReset: 'Are you sure you want to delete all student data on this device? This action cannot be undone.',

    // Mini-games shared & specific
    mg1Title: '🎯 Pair Matching: Keyword ↔ Purpose Evidence',
    mg1Sub: 'Click a <strong>Purpose Keyword</strong> on the left, then click the matching <strong>Text Evidence</strong> on the right.',
    mg1Matched: '{done} / {total} Matched',
    mg1LeftCol: 'Keywords & Moral Values',
    mg1RightCol: 'Concrete Text Evidence (English)',
    mg1Done: '🎉 <strong>All pairs matched!</strong> Mini-Game Score: <strong>{score}</strong>.',
    mg1TipTitle: '💡 Tip',
    mg1TipBody: 'Look for cause-and-effect links between character actions and moral lessons in each piece of evidence.',
    mg1PickLeftFirst: 'Pick a <strong>Keyword</strong> from the left column first!',
    mg1Wrong: '🌱 Not quite right — mistakes help us grow! Match the story theme between keyword and evidence.',

    mg2Title: '🗺️ Digital Story Map: {title}',
    mg2Sub: 'Drag &amp; Drop or click a sentence card then click the matching schematic stage box.',
    mg2Placed: '{done} / {total} Placed',
    mg2PoolLabel: 'Story Sentence Cards (Unplaced):',
    mg2AllPlaced: '✅ All cards are placed on the Story Map! Click "Check Story Map".',
    mg2PlaceHere: 'Place here',
    mg2EmptyZone: 'Empty — drag or click "Place here"',
    mg2RemoveCard: 'Remove card',
    mg2Reset: '🔄 Reset Board',
    mg2Check: '✅ Check Story Map',
    mg2Perfect: '🎉 <strong>Perfect!</strong> All {total} Story Map stages are placed accurately (Score 100).',
    mg2Partial: '🌱 {correct} of {total} cards are right (Score {score}). Check the red cards and refine them!',

    mg3Title: '📊 Proportion Calculator & Auto Chart',
    mg3Sub: 'Count the sentences in each stage below, enter the numbers, and watch the chart update!',
    mg3ToBar: '📊 Switch to Bar Chart',
    mg3ToDoughnut: '🍩 Switch to Doughnut Chart',
    mg3TotalWords: 'Total Words: {words} words',
    mg3Step1: '1. Enter Sentence Count per Stage',
    mg3ColStage: 'Stage',
    mg3ColInput: 'Sentences',
    mg3ColWords: 'Words (Info)',
    mg3ColPct: 'Proportion (%)',
    mg3Longest: 'Longest Stage:',
    mg3Shortest: 'Shortest Stage:',
    mg3CheckBtn: '✅ Calculate & Verify Proportion',
    mg3FormulaTitle: '📐 Quick Formula',
    mg3FormulaBody: 'Stage Percentage = (Stage Sentences ÷ Total Sentences) × 100%. Difference is longest stage minus shortest stage.',
    mg3Right: '🎉 <strong>Spot on!</strong> Total {total} sentences. Longest ({max} sentences) and shortest ({min} sentences) differ by <strong>{diff} sentences</strong>!',
    mg3Wrong: '🌱 {ok}/{total} sentence counts are correct. Hint: Count the periods in each colored block above.',

    mg4Title: '⚡ Comparative Quiz Race (Legend vs Fable)',
    mg4Sub: 'Use the comparison table & chart to answer fast before the timer runs out!',
    mg4QCount: 'Q {curr}/{total}',
    mg4ColAspect: 'Comparison Aspect',
    mg4RowChars: 'Characters',
    mg4RowCharsL: 'Humans (Malin & Mother)',
    mg4RowCharsF: 'Animals (Mouse Deer & Crocodiles)',
    mg4RowOrigin: 'Origin',
    mg4RowOriginL: 'Air Manis Beach stone',
    mg4RowOriginF: 'No real-world landmark',
    mg4RowTotal: 'Total Sentences',
    mg4SecUnit: 's',
    mg4Used: '(Used)',
    mg4TimePower: '⏳ Power-up +15 Seconds',
    mg4DoneTitle: 'Quiz Race Finished!',
    mg4DoneSub: 'You answered <strong>{correct}</strong> out of {total} challenges correctly with <strong>{left} seconds</strong> left.',
    mg4Retry: '🔄 Race Again',

    mg5Title: '🔍 Fact vs Opinion Detective',
    mg5Sub: 'Swipe the card <strong>Left (FACT)</strong> or <strong>Right (OPINION)</strong>, or press the buttons below.',
    mg5CardCount: 'Card {curr} / {total}',
    mg5CardHeader: 'TEXT STATEMENT',
    mg5FactBtn: '⬅️ TEXT FACT',
    mg5OpinionBtn: 'READER OPINION ➡️',
    mg5DoneTitle: 'Fact vs Opinion Mission Complete!',
    mg5DoneSub: 'Sorting accuracy: <strong>{correct} / {total}</strong> cards',
    mg5Retry: '🔄 Play Again',
    mg5Correct: '✅ Correct! ({type}) — {reason}',
    mg5Wrong: '🌱 Not quite! It should be <strong>{type}</strong>. {reason}',

    mg6Title: '✍️ Story Builder: Design an Original Story',
    mg6Sub: 'Shuffle idea cards, draft a 4-stage outline in English, then present it in IWB Mode!',
    mg6ShuffleBtn: '🎲 Shuffle Idea Cards',
    mg6CardsTitle: '🃏 Your Group Idea Cards',
    mg6Char: 'Characters:',
    mg6Set: 'Setting:',
    mg6Prob: 'Problem:',
    mg6Mor: 'Moral Value:',
    mg6TitleLabel: 'Story Title (English)',
    mg6TitlePh: 'Example: The Honest Heron of Merapi',
    mg6GenreLabel: 'Story Type',
    mg6OriLabel: '1. Orientation (Who, When, Where)',
    mg6CompLabel: '2. Complication (Conflict / Crisis)',
    mg6ResLabel: '3. Resolution (How it was solved)',
    mg6ReoriLabel: '4. Re-orientation (Moral Reflection)',
    mg6AutoFillBtn: '✨ Fill Draft Example',
    mg6SaveBtn: '💾 Save Story Outline',
    mg6PresentBtn: '🖥️ Present on Interactive Board',
    mg6SavedMsg: '🎉 Story outline saved! You are ready to present it in Interactive Whiteboard (IWB) Mode.',
    mg6NeedFillMsg: 'Please fill in the title and outline first (or click "Fill Draft Example") before presenting.'
  },
  id: {
    brandSub: 'Pulau Cerita • SMP Kelas 9',
    progressLabel: 'Progres Petualangan',
    navHome: 'Home',
    navMap: 'Peta',
    navLeaderboard: 'Peringkat',
    navPid: 'Mode PID',
    navTeacher: 'Guru',
    switchProfile: 'Ganti Siswa',
    xpSuffix: 'XP',
    daysUnit: 'Hari',
    badgesUnit: 'Badge',
    loadingText: 'Menyiapkan Pulau Cerita...',
    prevBtn: '⬅️ Previous',
    repeatMatBtn: '🔄 Ulangi Materi',
    downloadSummaryBtn: '📥 Download Hasil Belajar',
    nextBtn: 'Next ➡️',
    footerDesc: 'Media Pembelajaran Mendalam Bahasa Inggris SMP Kelas 9 (Narrative Text: Legend & Fable).',
    footerSub: 'Data tersimpan aman di perangkat (offline-ready PWA) • Tanpa login & tanpa server eksternal.',
    modalClose: 'Tutup',
    langToggleTitle: 'Ganti Bahasa (English / Indonesia)',

    heroBadge: 'Bahasa Inggris SMP Kelas 9',
    heroTitle: 'Selamat Datang di Story Quest: Pulau Cerita! 🏝️',
    heroDesc:
      'Jelajahi <strong>6 Pulau Interaktif</strong> untuk menguasai materi <strong>Narrative Text (Legend &amp; Fable)</strong> secara mendalam: dari tujuan komunikatif, Story Map, proporsi teks, perbandingan kritis, fakta vs opini, hingga merancang ceritamu sendiri!',
    flowTitle: 'Alur Petualangan',
    flowSteps:
      '<li>Isi profil petualang &amp; pilih avatar kartunmu.</li><li>Tonton Apersepsi &amp; kerjakan Asesmen Awal Adaptif.</li><li>Taklukkan 6 Pulau berurutan (Materi → Mini-Game → Boss Quiz).</li><li>Selesaikan Asesmen Akhir, Refleksi, &amp; unduh Sertifikat PDF!</li>',
    continueBtn: '🚀 Lanjutkan Petualangan',
    startApersepsiBtn: '🎬 Mulai dari Apersepsi',
    profileHeading: '🧭 Daftar / Masuk Profil Petualang',
    nameLabel: 'Nama Lengkap Siswa',
    namePlaceholder: 'Contoh: Raka Pratama',
    classLabel: 'Kelas',
    classPlaceholder: 'Contoh: 9A',
    pickAvatarLabel: 'Pilih Avatar Kartunmu:',
    saveProfileBtn: '⚓ Simpan Profil & Mulai Berpetualang',
    savedProfilesHint: 'Atau pilih profil tersimpan di perangkat ini:',
    badgeCollectionTitle: '🎖️ Koleksi Badge Kamu ({owned}/{total})',
    badgeCollectionSub: 'Kumpulkan badge dengan menyelesaikan pulau, mini-game, & refleksi!',

    apersepsiBadge: 'Tahap 1 • Apersepsi Pemantik',
    apersepsiTitle: '🎬 Mari Mengamati Sebelum Berlayar!',
    skipApersepsiBtn: 'Lanjut ke Asesmen Awal ➡️',
    apersepsiPlaceholder: 'Video pemantik siap dipasang lewat link YouTube di Mode Guru.',
    apersepsiOfflineNote: 'Jika koneksi offline, amati ilustrasi pulau di samping dan diskusikan pertanyaan pemantik bersama temanmu.',
    apersepsiPromptTitle: '🤔 Pertanyaan Pemantik',
    apersepsiPromptQ: '"Apa yang akan terjadi jika tokoh dalam sebuah cerita melanggar janji sucinya atau meremehkan teman yang kecil?"',
    apersepsiPromptHint: 'Tuliskan tebakan singkatmu di buku atau diskusikan secara lisan sebelum memulai misi! (Belum perlu menghafal teori apa pun dahulu.)',

    pretestDoneTitle: 'Asesmen Awal Sudah Diselesaikan',
    pretestScoreLabel: 'Skor Asesmen Awalmu:',
    pretestRecTitle: '📌 Rekomendasi Belajar',
    pretestRecBody: 'Fokus perhatian yang disarankan: <strong>Pulau {id}: {name}</strong>. Semua pulau tetap dimulai secara berurutan dari Pulau 1.',
    retakePretestBtn: '🔄 Ulangi Asesmen Awal',
    enterMapBtn: '🗺️ Masuk ke Peta Pulau',
    pretestTitle: 'Asesmen Awal Adaptif',
    pretestSub: '10 soal adaptif untuk memetakan kesiapanmu dan memberi rekomendasi pulau fokus.',
    diffHard: 'Level: Tinggi (HOTS)',
    diffEasy: 'Level: Dasar',
    diffMedium: 'Level: Sedang',
    questionProgress: 'Soal {curr} / {total}',
    passageLabel: '📖 Cuplikan Teks (English):',
    tempCorrect: 'Skor benar sementara: {count}',
    nextQuestionBtn: 'Soal Berikutnya ➡️',
    seeFinalResultBtn: 'Lihat Hasil Akhir 🏁',
    correctToast: '✅ Hebat! Jawabanmu tepat!',
    answerKeyLabel: 'Kunci Jawaban:',
    explanationLabel: 'Pembahasan:',
    resultHeading: 'Hasil {title}',
    resultCountSub: '{correct} dari {total} soal dijawab benar',
    recBoxTitle: '🧭 Rekomendasi Peta Petualanganmu',
    recBoxDesc: 'Berdasarkan jawabanmu pada Asesmen Awal Adaptif, fokus belajar yang paling disarankan adalah <strong>Pulau {id}: {name}</strong> ({sub}).',
    recBoxNote: 'Sesuai aturan petualangan, semua pulau tetap dibuka berurutan mulai dari Pulau 1. Pulau rekomendasi akan ditandai khusus di peta!',
    predicateLabel: 'Predikat: {label}',
    bossPassedMsg: '🎉 <strong>Boss Pulau Berhasil Dikalahkan!</strong> Pulau berikutnya kini terbuka di peta!',
    bossFailedMsg: '🌱 <strong>Skor masih di bawah {pass}.</strong> Tidak apa-apa! Ulangi mini-materi atau coba Boss Quiz lagi untuk membuka pulau berikutnya.',
    retryQuizBtn: '🔄 Coba Lagi',
    continueAdvBtn: 'Lanjutkan Petualangan ➡️',

    mapTitle: '🗺️ Peta Pulau Cerita (6 Level Berurutan)',
    mapSub: 'Selesaikan mini-materi, mini-game, dan Boss Quiz (skor ≥ {pass}) untuk membuka pulau berikutnya.',
    mapApersepsiBtn: '🎬 Apersepsi',
    mapPretestBtn: '🧭 Asesmen Awal',
    recBadge: '📌 Rekomendasi Asesmen Awal',
    completedBadge: '✅ Tuntas (Boss: {score})',
    unlockedBadge: '🔓 Terbuka',
    lockedBadge: '🔒 Terkunci',
    islandLabel: 'Pulau {id}: {name}',
    revisitIslandBtn: '🔄 Kunjungi / Ulangi Pulau',
    exploreIslandBtn: '⛵ Jelajahi Pulau Ini',
    lockedIslandBtn: 'Selesaikan Pulau {prev} Dulu',
    finalGateTitle: '🏁 Gerbang Akhir Petualangan',
    finalGateDone: 'Hebat! Keenam pulau sudah ditaklukkan. Kerjakan Asesmen Akhir, isi Refleksi, dan klaim Sertifikatmu!',
    finalGateWait: 'Selesaikan seluruh 6 pulau untuk membuka Asesmen Akhir & Sertifikat ({done}/6 selesai).',
    posttestBtn: '📝 Asesmen Akhir',
    reflectionBtn: '💭 Refleksi',
    certBtn: '🎓 Sertifikat',

    islandBadge: 'Pulau {id} dari 6',
    tabMaterial: '1. Mini-Materi',
    tabGame: '2. Mini-Game',
    tabBoss: '3. Boss Quiz',
    materialSlideBadge: 'Mini-Materi • Layar {curr} / {total}',
    readSampleBtn: '📖 Baca Teks Contoh ({title})',
    sampleOrigin: 'Asal:',
    samplePurpose: 'Tujuan:',
    sampleEvidenceTitle: '🔍 Bukti Tujuan Komunikatif',
    matPrevBtn: '⬅️ Layar Sebelumnya',
    matNextBtn: 'Layar Materi Berikutnya ➡️',
    matToGameBtn: '🎮 Lanjut ke Mini-Game ➡️',
    challengeBossBtn: '⚔️ Tantang Boss Quiz Pulau {id} ➡️',
    bossQuizTitle: 'Boss Quiz Pulau {id}: {name}',
    bossQuizSub: '10 soal HOTS (5 khusus topik pulau + 5 lintas topik). Raih skor ≥ 70 untuk membuka pulau berikutnya!',
    presentationTitle: '🖥️ Presentasi Kelompok: {title}',
    presentationTag: '{genre} • Karya Kelompok',
    presentationMoral: '🎯 Nilai Moral',

    posttestTitle: 'Asesmen Akhir Story Quest',
    posttestSub: '10 soal komprehensif tingkat sedang–tinggi mencakup semua tujuan pembelajaran Narrative Text.',
    reflectionBadge: 'Pembelajaran Mendalam • Refleksi Diri',
    reflectionTitle: '💭 Refleksi Petualanganmu',
    reflectionSub: 'Lengkapi 4 kalimat rumpang di bawah ini dengan jujur, lalu simpan sebelum mencetak sertifikatmu.',
    ref1Label: '1. Hal paling penting yang kupelajari dari Narrative Text (Legend & Fable) adalah ...',
    ref1Ph: 'Tuliskan pemahaman utamamu...',
    ref2Label: '2. Tahap struktur atau bagian analisis yang menurutku paling menantang adalah ..., dan cara mengatasinya dengan ...',
    ref2Ph: 'Ceritakan tantangan & strategimu...',
    ref3Label: '3. Cara membedakan fakta teks dan opini pembaca secara akurat yaitu dengan memeriksa ...',
    ref3Ph: 'Tuliskan kata kunci atau bukti...',
    ref4Label: '4. Nilai moral dari cerita yang ingin kuterapkan dalam kehidupan sehari-hari adalah ...',
    ref4Ph: 'Contoh: menepati janji, menghormati orang tua...',
    saveRefBtn: '💾 Simpan Refleksi',
    openCertBtn: '🎓 Buka Sertifikat ➡️',
    refSavedAlert: '✅ Refleksi tersimpan di perangkat! Kamu siap mengunduh Sertifikat PDF.',

    certPageTitle: '🎓 Sertifikat Kelulusan Story Quest',
    certPageSub: 'Sertifikat resmi petualangan Narrative Text (Legend & Fable) untuk diunduh sebagai PDF atau dicetak.',
    certBackMap: '🗺️ Kembali ke Peta',
    certPrint: '🖨️ Cetak',
    certPdf: '📥 Unduh PDF',
    certNotEligible: '⚠️ Selesaikan <strong>Asesmen Akhir</strong> terlebih dahulu untuk mengaktifkan data nilai pada sertifikatmu.',
    certRibbon: 'CERTIFICATE OF ACHIEVEMENT',
    certSubject: 'Bahasa Inggris SMP Kelas 9 — Narrative Text (Legend & Fable)',
    certAwardedTo: 'Diberikan dengan bangga kepada:',
    certClassLabel: 'Kelas:',
    certBody: 'Telah menyelesaikan pembelajaran mendalam materi <strong>Narrative Text (Legend &amp; Fable)</strong> yang mencakup analisis tujuan komunikatif, schematic structure, proporsi teks, perbandingan kritis, evaluasi fakta vs opini, serta perancangan cerita orisinal.',
    certFinalScore: 'Nilai Akhir',
    certPredikat: 'Predikat',
    certTotalXp: 'Total XP & Pulau',
    certIslandsUnit: 'Pulau',
    certDateIssued: 'Tanggal Terbit:',
    certIdLabel: 'ID Sertifikat:',
    certIssuer: 'Tim Pengembang Story Quest',
    certIssuerSub: 'Pembelajaran Bahasa Inggris SMP Kelas 9',

    lbTitle: '🏆 Papan Peringkat Lokal',
    lbEmpty: 'Belum ada profil siswa yang terdaftar di perangkat ini.',
    lbSub: 'Papan peringkat lokal berdasarkan XP petualangan di perangkat ini.',
    lbColStudent: 'Siswa',
    lbColClass: 'Kelas',
    lbColXp: 'Level & XP',
    lbColIslands: 'Pulau Selesai',
    lbColFinal: 'Nilai Akhir',
    lbColBadges: 'Badge',
    teacherModalTitle: '👩‍🏫 Mode Guru (PIN Diperlukan)',
    teacherPinPrompt: 'Masukkan <strong>PIN Guru</strong> untuk mengakses rekap nilai, pengaturan timer, ekspor CSV/JSON, dan reset data perangkat.',
    teacherPinPh: 'Masukkan PIN (default: 1234)',
    teacherPinBtn: '🔓 Masuk',
    teacherPinError: 'PIN salah! Cek nilai CONFIG.TEACHER_PIN pada file js/config.js.',
    teacherRecapTitle: '📊 Rekap Hasil Belajar Siswa ({count} Profil di Perangkat Ini)',
    teacherNoData: 'Belum ada data siswa.',
    teacherExportCsv: '📄 Ekspor CSV',
    teacherExportJson: '📦 Ekspor JSON',
    teacherSettingsTitle: '⚙️ Pengaturan Pembelajaran',
    teacherTimerLabel: 'Durasi Balapan Kuis (detik)',
    teacherYtLabel: 'Link Video YouTube Apersepsi',
    teacherBgmLabel: 'Link YouTube Musik Latar (Background Music)',
    teacherBgmEnabledLabel: 'Aktifkan Musik Latar secara default',
    bgmOnLabel: 'Musik Nyala',
    bgmOffLabel: 'Musik Mati',
    teacherSaveSettings: '💾 Simpan Pengaturan',
    teacherSettingsSaved: '✅ Pengaturan berhasil disimpan.',
    teacherDangerZone: 'Zona Berbahaya: Hapus seluruh profil & progres di browser ini.',
    teacherResetAll: '🗑️ Reset Semua Data',
    teacherConfirmReset: 'Yakin ingin menghapus seluruh data siswa di perangkat ini? Tindakan tidak dapat dibatalkan.',

    mg1Title: '🎯 Pencocokan Pasangan: Kata Kunci ↔ Bukti Tujuan',
    mg1Sub: 'Klik satu <strong>Kata Kunci Tujuan</strong> di kiri, lalu klik <strong>Bukti Teks</strong> yang cocok di kanan.',
    mg1Matched: '{done} / {total} Cocok',
    mg1LeftCol: 'Kata Kunci & Nilai Moral',
    mg1RightCol: 'Bukti Konkret dari Teks (English)',
    mg1Done: '🎉 <strong>Semua pasangan berhasil dicocokkan!</strong> Skor Mini-Game: <strong>{score}</strong>.',
    mg1TipTitle: '💡 Tips',
    mg1TipBody: 'Perhatikan hubungan sebab-akibat antara tindakan tokoh dan pesan moral di setiap bukti teks.',
    mg1PickLeftFirst: 'Pilih dulu satu <strong>Kata Kunci</strong> di kolom kiri!',
    mg1Wrong: '🌱 Belum tepat, kesalahan membantu kita tumbuh! Cek kesamaan cerita pada kata kunci dan bukti.',

    mg2Title: '🗺️ Story Map Digital: {title}',
    mg2Sub: 'Seret (Drag &amp; Drop) atau klik kartu kalimat lalu klik kotak tahap struktur yang tepat.',
    mg2Placed: '{done} / {total} Terpasang',
    mg2PoolLabel: 'Kartu Kalimat Cerita (Belum Dipasang):',
    mg2AllPlaced: '✅ Semua kartu sudah dimasukkan ke Story Map! Tekan "Periksa Story Map".',
    mg2PlaceHere: 'Tempel di sini',
    mg2EmptyZone: 'Kosong — seret atau klik "Tempel di sini"',
    mg2RemoveCard: 'Lepas kartu',
    mg2Reset: '🔄 Reset Papan',
    mg2Check: '✅ Periksa Story Map',
    mg2Perfect: '🎉 <strong>Sempurna!</strong> Semua {total} tahap Story Map tersusun tepat (Skor 100).',
    mg2Partial: '🌱 {correct} dari {total} kartu sudah tepat (Skor {score}). Cek kartu merah dan perbaiki agar makin mantap!',

    mg3Title: '📊 Kalkulator Proporsi & Grafik Otomatis',
    mg3Sub: 'Hitung jumlah kalimat tiap tahap dari teks di bawah, masukkan angkanya, dan lihat grafik otomatis!',
    mg3ToBar: '📊 Ubah ke Grafik Batang',
    mg3ToDoughnut: '🍩 Ubah ke Grafik Donat',
    mg3TotalWords: 'Total Kata: {words} kata',
    mg3Step1: '1. Isi Jumlah Kalimat Tiap Tahap',
    mg3ColStage: 'Tahap',
    mg3ColInput: 'Input Kalimat',
    mg3ColWords: 'Kata (Info)',
    mg3ColPct: 'Proporsi (%)',
    mg3Longest: 'Tahap Terpanjang:',
    mg3Shortest: 'Tahap Terpendek:',
    mg3CheckBtn: '✅ Hitung & Verifikasi Proporsi',
    mg3FormulaTitle: '📐 Rumus Cepat',
    mg3FormulaBody: 'Persentase Tahap = (Jumlah Kalimat Tahap ÷ Total Kalimat) × 100%. Selisih dihitung dari tahap terpanjang dikurangi tahap terpendek.',
    mg3Right: '🎉 <strong>Tepat sekali!</strong> Total {total} kalimat. Tahap terpanjang ({max} kalimat) dan terpendek ({min} kalimat) memiliki selisih <strong>{diff} kalimat</strong>!',
    mg3Wrong: '🌱 {ok}/{total} hitungan kalimat tepat. Petunjuk: Hitung tanda titik di tiap blok warna pada kotak bacaan.',

    mg4Title: '⚡ Balapan Kuis Komparatif (Legend vs Fable)',
    mg4Sub: 'Gunakan tabel & grafik perbandingan untuk menjawab cepat sebelum waktu habis!',
    mg4QCount: 'Soal {curr}/{total}',
    mg4ColAspect: 'Aspek Perbandingan',
    mg4RowChars: 'Tokoh',
    mg4RowCharsL: 'Manusia (Malin & Ibu)',
    mg4RowCharsF: 'Hewan (Kancil & Buaya)',
    mg4RowOrigin: 'Asal-Usul',
    mg4RowOriginL: 'Batu Pantai Air Manis',
    mg4RowOriginF: 'Tidak menjelaskan tempat nyata',
    mg4RowTotal: 'Total Kalimat',
    mg4SecUnit: 'd',
    mg4Used: '(Terpakai)',
    mg4TimePower: '⏳ Power-up +15 Detik',
    mg4DoneTitle: 'Balapan Kuis Selesai!',
    mg4DoneSub: 'Kamu menjawab benar <strong>{correct}</strong> dari {total} tantangan dengan sisa waktu <strong>{left} detik</strong>.',
    mg4Retry: '🔄 Ulangi Balapan',

    mg5Title: '🔍 Detektif Fakta vs Opini',
    mg5Sub: 'Geser (swipe) kartu ke <strong>Kiri (FAKTA)</strong> atau <strong>Kanan (OPINI)</strong>, atau tekan tombol di bawah.',
    mg5CardCount: 'Kartu {curr} / {total}',
    mg5CardHeader: 'PERNYATAAN TEKS',
    mg5FactBtn: '⬅️ FAKTA TEKS',
    mg5OpinionBtn: 'OPINI PEMBACA ➡️',
    mg5DoneTitle: 'Misi Detektif Fakta vs Opini Tuntas!',
    mg5DoneSub: 'Ketepatan memilah: <strong>{correct} / {total}</strong> kartu',
    mg5Retry: '🔄 Main Lagi',
    mg5Correct: '✅ Benar! ({type}) — {reason}',
    mg5Wrong: '🌱 Belum tepat! Seharusnya <strong>{type}</strong>. {reason}',

    mg6Title: '✍️ Story Builder: Rancang Cerita Orisinal',
    mg6Sub: 'Acak kartu inspirasi, susun kerangka 4 tahap dalam bahasa Inggris, lalu presentasikan di Mode PID!',
    mg6ShuffleBtn: '🎲 Acak Kartu Ide',
    mg6CardsTitle: '🃏 Kartu Ide Kelompokmu Saat Ini',
    mg6Char: 'Tokoh:',
    mg6Set: 'Latar:',
    mg6Prob: 'Masalah:',
    mg6Mor: 'Nilai Moral:',
    mg6TitleLabel: 'Judul Cerita (English)',
    mg6TitlePh: 'Contoh: The Honest Heron of Merapi',
    mg6GenreLabel: 'Jenis Cerita',
    mg6OriLabel: '1. Orientation (Who, When, Where)',
    mg6CompLabel: '2. Complication (Conflict / Crisis)',
    mg6ResLabel: '3. Resolution (How it was solved)',
    mg6ReoriLabel: '4. Re-orientation (Moral Reflection)',
    mg6AutoFillBtn: '✨ Bantu Isi Contoh Draf',
    mg6SaveBtn: '💾 Simpan Kerangka Cerita',
    mg6PresentBtn: '🖥️ Presentasi di Papan Interaktif',
    mg6SavedMsg: '🎉 Kerangka cerita berhasil disimpan! Kamu siap mempresentasikannya di Papan Interaktif (PID).',
    mg6NeedFillMsg: 'Isi judul dan kerangka cerita dulu (atau tekan "Bantu Isi Contoh Draf") sebelum presentasi.'
  }
};

const ISLANDS_I18N = {
  en: {
    1: {
      name: 'Purpose Island',
      subtitle: 'Social Function & Evidence',
      goal: 'Identify communicative purpose (to entertain, to convey moral values) with keywords and at least 2 text evidences.'
    },
    2: {
      name: 'Structure Island',
      subtitle: 'Schematic Structure',
      goal: 'Identify Orientation, Complication, Resolution, plus optional Evaluation & Re-orientation using a digital Story Map.'
    },
    3: {
      name: 'Proportion Island',
      subtitle: 'Sentence & Word Proportions',
      goal: 'Calculate sentence/word counts, differences, and stage percentages, and determine the longest & shortest stages.'
    },
    4: {
      name: 'Comparison Island',
      subtitle: 'Legend vs Fable',
      goal: 'Compare two narrative texts (Legend vs Fable) using proportion tables and charts with at least 2 evidences.'
    },
    5: {
      name: 'Evaluation Island',
      subtitle: 'Stage Roles, Fact & Opinion',
      goal: 'Evaluate the role of each narrative stage and distinguish verifiable text facts from reader opinions.'
    },
    6: {
      name: 'Creator Island',
      subtitle: 'Story Design & Presentation',
      goal: 'Design an original story outline with templates & random cards, then present collaboratively on the Interactive Board.'
    }
  },
  id: {
    1: {
      name: 'Pulau Tujuan',
      subtitle: 'Social Function & Evidence',
      goal: 'Menentukan tujuan komunikatif (to entertain, to convey moral values) beserta kata kunci dan minimal 2 bukti teks.'
    },
    2: {
      name: 'Pulau Struktur',
      subtitle: 'Schematic Structure',
      goal: 'Mengidentifikasi Orientation, Complication, Resolution, serta Evaluation & Re-orientation memakai Story Map digital.'
    },
    3: {
      name: 'Pulau Hitung',
      subtitle: 'Proporsi Kalimat & Kata',
      goal: 'Menghitung jumlah kalimat/kata, selisih, dan persentase proporsi tiap tahap, serta menentukan tahap terpanjang & terpendek.'
    },
    4: {
      name: 'Pulau Banding',
      subtitle: 'Legend vs Fable',
      goal: 'Membandingkan dua teks naratif (Legend vs Fable) lewat tabel dan grafik proporsi dengan minimal 2 bukti.'
    },
    5: {
      name: 'Pulau Evaluasi',
      subtitle: 'Peran Tahap, Fakta & Opini',
      goal: 'Mengevaluasi peran tiap tahap naratif serta membedakan pernyataan fakta dan opini dari teks.'
    },
    6: {
      name: 'Pulau Kreator',
      subtitle: 'Merancang & Presentasi Cerita',
      goal: 'Merancang kerangka cerita orisinal dengan template & kartu acak lalu mempresentasikannya di Papan Interaktif.'
    }
  }
};

const MINI_MATERIALS_I18N = {
  en: {
    1: [
      {
        title: 'Understanding Communicative Purpose of Narrative Text',
        body: 'Narrative texts (such as <strong>Legends</strong> and <strong>Fables</strong>) serve two primary social functions: <em>to entertain/amuse the readers</em> with an imaginative plot and <em>to convey moral values</em>.',
        boxTitle: 'Did You Know?',
        boxText: 'In any legend or fable, the moral value never stands alone—it is supported by <strong>keywords</strong> and at least <strong>2 concrete event evidences</strong>!'
      },
      {
        title: 'How to Find Purpose Evidence in the Text',
        body: 'Pay attention to character actions (e.g., Malin Kundang denying his mother), the consequence (a storm turning him into stone), and closing reminders like <em>"...reminding everyone to keep their promises"</em>.',
        boxTitle: 'Fun Fact',
        boxText: 'The two strongest evidences usually form a pair: <strong>Cause (character action in Complication)</strong> + <strong>Effect (outcome in Resolution)</strong>.'
      }
    ],
    2: [
      {
        title: 'Three Essential Schematic Structure Stages',
        body: 'Every complete narrative text contains:<br>1. <strong>Orientation</strong>: introduces characters, time, and setting.<br>2. <strong>Complication</strong>: introduces the conflict leading to the climax.<br>3. <strong>Resolution</strong>: shows how the problem is resolved (happily or tragically).',
        boxTitle: 'Important Info',
        boxText: 'Orientation often begins with <em>Once upon a time</em> or <em>Long ago</em> using the <strong>Simple Past Tense</strong>.'
      },
      {
        title: 'Two Optional Stages: Evaluation & Re-orientation',
        body: 'Beyond the 3 core stages, authors may include:<br>• <strong>Evaluation</strong> (optional): a character\'s inner realization or pause during the crisis.<br>• <strong>Re-orientation</strong> (optional): a closing comment summarizing the moral or present-day landmark.',
        boxTitle: 'Did You Know?',
        boxText: 'Using a <strong>Digital Story Map</strong> helps you organize events visually before summarizing or writing a story.'
      }
    ],
    3: [
      {
        title: 'Measuring Sentence & Word Proportions per Stage',
        body: 'Critical readers look beyond the plot and measure <strong>proportions</strong>: how many sentences or words appear in Orientation, Complication, and Resolution, plus the difference between them.',
        boxTitle: 'Important Info',
        boxText: 'Stage Percentage Formula = <strong>(Stage Sentences ÷ Total Sentences) × 100%</strong>.'
      },
      {
        title: 'Identifying Longest & Shortest Stages',
        body: 'The stage with the highest percentage is the <strong>longest stage</strong> (often Complication or Resolution because it holds the main action), while the smallest is the <strong>shortest stage</strong> (often Evaluation/Re-orientation).',
        boxTitle: 'Fun Fact',
        boxText: 'Bar and doughnut charts let you spot story balance at a single glance!'
      }
    ],
    4: [
      {
        title: 'Legend vs Fable: Similarities & Differences',
        body: 'Both use past-tense storytelling with moral lessons. However:<br>• <strong>Legend</strong>: features human/mythical figures and often explains the origin of real landmarks (lakes, mountains, beaches).<br>• <strong>Fable</strong>: features talking animals acting like humans.',
        boxTitle: 'Did You Know?',
        boxText: 'Indonesian heritage is rich with legends like <em>Lake Toba</em>, <em>Malin Kundang</em>, and <em>Sangkuriang</em>, alongside clever fables like <em>Kancil</em>.'
      },
      {
        title: 'Comparing Two Texts with Concrete Evidence',
        body: 'When comparing a Legend and a Fable, combine a <strong>comparison table</strong> with a <strong>proportion chart</strong>, then back up your conclusion with at least <strong>2 specific evidences</strong> from both texts.',
        boxTitle: 'Important Info',
        boxText: 'Don\'t just say "they are different"—cite exact stage percentages or specific character actions.'
      }
    ],
    5: [
      {
        title: 'Evaluating the Role of Each Story Stage',
        body: 'Every stage has a job: without <strong>Orientation</strong>, readers lack context; without <strong>Complication</strong>, the plot feels flat; without <strong>Resolution</strong>, the conflict stays unfinished.',
        boxTitle: 'Fun Fact',
        boxText: 'The <strong>Evaluation</strong> stage helps readers feel the character\'s turning point right before the Resolution takes place.'
      },
      {
        title: 'Distinguishing Text Facts from Reader Opinions',
        body: '• <strong>Text Fact</strong>: an event or detail explicitly written and verifiable in the passage.<br>• <strong>Opinion</strong>: a subjective judgment (often using words like <em>the best, worst, unfairly, boring</em>).',
        boxTitle: 'Important Info',
        boxText: 'Always point back to the exact sentence in the story before labeling any claim as a fact!'
      }
    ],
    6: [
      {
        title: 'Designing an Original Story Outline (Story Builder)',
        body: 'Now it\'s your turn to be a creator! Combine random cards for <strong>Characters</strong>, <strong>Setting</strong>, <strong>Problem</strong>, and <strong>Moral Value</strong> into a coherent English outline.',
        boxTitle: 'Did You Know?',
        boxText: 'Make sure the conflict in Complication directly challenges the character trait introduced in Orientation so the Resolution feels earned!'
      },
      {
        title: 'Collaborative Presentation Tips on IWB',
        body: 'When presenting your outline with your group, turn on <strong>IWB Mode</strong> for large readable text in front of the class, and explain your communicative purpose and stage flow clearly.',
        boxTitle: 'Important Info',
        boxText: 'Give constructive peer feedback by praising one strong structural element and offering one specific improvement idea.'
      }
    ]
  },
  id: {
    1: [
      {
        title: 'Mengenal Tujuan Komunikatif Narrative Text',
        body: 'Narrative text (seperti <strong>Legend</strong> dan <strong>Fable</strong>) memiliki dua fungsi sosial utama: <em>to entertain/amuse the readers</em> (menghibur pembaca dengan kisah imajinatif) dan <em>to convey moral values</em> (menyampaikan pesan moral).',
        boxTitle: 'Tahukah Kamu?',
        boxText: 'Dalam sebuah legenda atau fabel, pesan moral jarang berdiri sendiri—selalu ada <strong>kata kunci</strong> dan minimal <strong>2 bukti peristiwa</strong> dari awal hingga akhir cerita!'
      },
      {
        title: 'Cara Menemukan Bukti Tujuan di Dalam Teks',
        body: 'Perhatikan tindakan tokoh (misalnya Malin Kundang menolak ibunya), akibat dari tindakan tersebut (badai mengubahnya menjadi batu), dan kalimat penutup seperti <em>"...reminding everyone to keep their promises"</em>.',
        boxTitle: 'Fakta Menarik',
        boxText: 'Dua bukti paling kuat untuk membuktikan tujuan moral biasanya berasal dari pasangan <strong>Sebab (tindakan tokoh di Complication)</strong> + <strong>Akibat (hasil di Resolution)</strong>.'
      }
    ],
    2: [
      {
        title: 'Tiga Tahap Wajib Schematic Structure',
        body: 'Setiap narrative text yang utuh memiliki: <br>1. <strong>Orientation</strong>: mengenalkan tokoh, waktu, dan tempat.<br>2. <strong>Complication</strong>: munculnya masalah/konflik hingga klimaks.<br>3. <strong>Resolution</strong>: cara masalah diselesaikan (bahagia atau tragis).',
        boxTitle: 'Info Penting',
        boxText: 'Ciri bahasa Orientation sering memakai <em>Once upon a time</em> atau <em>Long ago</em> dengan <strong>Simple Past Tense</strong>.'
      },
      {
        title: 'Dua Tahap Opsional: Evaluation & Re-orientation',
        body: 'Selain 3 tahap wajib, penulis dapat menyisipkan:<br>• <strong>Evaluation</strong> (opsional): kesadaran atau penilaian batin tokoh di tengah krisis.<br>• <strong>Re-orientation</strong> (opsional): penutup yang merangkum pesan moral atau kondisi saat ini.',
        boxTitle: 'Tahukah Kamu?',
        boxText: 'Menggunakan <strong>Story Map Digital</strong> membantumu memetakan alur cerita secara visual sebelum menulis atau meringkas teks.'
      }
    ],
    3: [
      {
        title: 'Mengukur Proporsi Kalimat & Kata Tiap Tahap',
        body: 'Pembaca kritis tidak hanya membaca cerita, tetapi juga mengamati <strong>proporsi</strong>: berapa jumlah kalimat atau kata pada Orientation, Complication, dan Resolution, serta berapa selisihnya.',
        boxTitle: 'Info Penting',
        boxText: 'Rumus Persentase Tahap = <strong>(Jumlah Kalimat Tahap ÷ Total Kalimat Teks) × 100%</strong>.'
      },
      {
        title: 'Membaca Tahap Terpanjang & Terpendek',
        body: 'Tahap dengan persentase terbesar disebut <strong>tahap terpanjang</strong> (biasanya Complication atau Resolution karena memuat aksi terbanyak), sedangkan yang terkecil adalah <strong>tahap terpendek</strong> (sering kali Evaluation/Re-orientation).',
        boxTitle: 'Fakta Menarik',
        boxText: 'Grafik batang dan grafik donat memudahkan kita melihat keseimbangan cerita dalam sekali pandang!'
      }
    ],
    4: [
      {
        title: 'Legend vs Fable: Persamaan & Perbedaan',
        body: 'Keduanya sama-sama berbentuk naratif lampau dengan pesan moral. Namun:<br>• <strong>Legend</strong>: tokoh manusia/mistis, sering menjelaskan asal-usul bentang alam (danau, gunung, pantai).<br>• <strong>Fable</strong>: tokoh hewan yang berbicara/berpikir layaknya manusia.',
        boxTitle: 'Tahukah Kamu?',
        boxText: 'Indonesia kaya legenda Nusantara seperti <em>Lake Toba</em>, <em>Malin Kundang</em>, dan <em>Sangkuriang</em>, serta fabel cerdik seperti <em>Si Kancil</em>.'
      },
      {
        title: 'Membandingkan Dua Teks Secara Berbasis Bukti',
        body: 'Saat membandingkan Legend dan Fable, gunakan <strong>tabel komparatif</strong> dan <strong>grafik proporsi</strong>, lalu dukung kesimpulanmu dengan minimal <strong>2 bukti</strong> langsung dari kedua teks.',
        boxTitle: 'Info Penting',
        boxText: 'Jangan hanya menulis "berbeda"—tuliskan bukti spesifik seperti persentase Complication atau kutipan tindakan tokoh.'
      }
    ],
    5: [
      {
        title: 'Mengevaluasi Peran Tiap Tahap Cerita',
        body: 'Setiap tahap punya peran penting: tanpa <strong>Orientation</strong> pembaca bingung siapa tokohnya; tanpa <strong>Complication</strong> cerita terasa datar; tanpa <strong>Resolution</strong> konflik menggantung.',
        boxTitle: 'Fakta Menarik',
        boxText: 'Tahap <strong>Evaluation</strong> membuat pembaca ikut merasakan emosi tokoh tepat sebelum keputusan besar di Resolution terjadi.'
      },
      {
        title: 'Membedakan Fakta Teks vs Opini Pembaca',
        body: '• <strong>Fakta Teks</strong>: kejadian atau detail yang tertulis eksplisit dan bisa dibuktikan langsung di bacaan.<br>• <strong>Opini</strong>: penilaian subjektif pembaca (misalnya memakai kata <em>the best, worst, unfairly, boring</em>).',
        boxTitle: 'Info Penting',
        boxText: 'Selalu cek kalimat rujukan di teks asli sebelum menyimpulkan sebuah pernyataan sebagai fakta!'
      }
    ],
    6: [
      {
        title: 'Merancang Kerangka Cerita Orisinal (Story Builder)',
        body: 'Kini saatnya menjadi kreator! Gabungkan kartu <strong>Tokoh</strong>, <strong>Latar</strong>, <strong>Masalah</strong>, dan <strong>Nilai Moral</strong> menjadi kerangka cerita berbahasa Inggris yang runtut.',
        boxTitle: 'Tahukah Kamu?',
        boxText: 'Pastikan konflik di Complication berhubungan langsung dengan sifat tokoh di Orientation agar Resolution terasa logis!'
      },
      {
        title: 'Tips Presentasi Kolaboratif di Papan Interaktif (PID)',
        body: 'Saat mempresentasikan kerangka ceritamu bersama kelompok, gunakan tombol <strong>Mode PID</strong> agar teks tampil besar dan jelas di depan kelas, lalu jelaskan tujuan komunikatif dan alur tiap tahapnya.',
        boxTitle: 'Info Penting',
        boxText: 'Beri umpan balik yang membangun kepada kelompok temanmu dengan menyebutkan kelebihan struktur dan satu saran perbaikan.'
      }
    ]
  }
};

const GROWTH_MINDSET_I18N = {
  en: [
    'Not quite yet — mistakes help our brains grow!',
    'Keep trying! Every mistake sharpens your reading accuracy.',
    'Almost there! Reviewing explanations makes your skills stronger.',
    'Never give up, explorer! Check the explanation for a valuable clue.'
  ],
  id: [
    'Belum tepat, kesalahan membantu kita tumbuh!',
    'Terus mencoba! Setiap kesalahan melatih ketelitianmu membaca teks.',
    'Hampir tepat! Otak kita berkembang saat mengevaluasi jawaban.',
    'Jangan menyerah, petualang! Cek pembahasannya untuk petunjuk berharga.'
  ]
};

const PREDIKAT_I18N = {
  en: [
    { min: 90, label: 'Excellent', color: 'success' },
    { min: 80, label: 'Good', color: 'primary' },
    { min: 70, label: 'Fair', color: 'warning' },
    { min: 0, label: 'Needs Guidance', color: 'danger' }
  ],
  id: [
    { min: 90, label: 'Sangat Baik', color: 'success' },
    { min: 80, label: 'Baik', color: 'primary' },
    { min: 70, label: 'Cukup', color: 'warning' },
    { min: 0, label: 'Perlu Bimbingan', color: 'danger' }
  ]
};

const AVATAR_LABELS_EN = {
  explorer: 'Raka Explorer',
  scholar: 'Sinta Scholar',
  captain: 'Bima Captain',
  owl: 'Wise Owl',
  kancil: 'Clever Kancil',
  creator: 'Nadia Creator'
};

const BADGES_EN = {
  first_step: { name: 'First Explorer', description: 'Completed the Adaptive Pretest to map your starting point.' },
  island_1: { name: 'Purpose Seeker', description: 'Conquered Island 1 Boss Quiz (Communicative Purpose).' },
  island_2: { name: 'Story Map Architect', description: 'Conquered Island 2 Boss Quiz (Schematic Structure).' },
  island_3: { name: 'Proportion Master', description: 'Conquered Island 3 Boss Quiz (Sentence & Percentage Math).' },
  island_4: { name: 'Comparative Analyst', description: 'Conquered Island 4 Boss Quiz (Legend vs Fable).' },
  island_5: { name: 'Critical Detective', description: 'Conquered Island 5 Boss Quiz (Stage Roles & Fact/Opinion).' },
  island_6: { name: 'Story Creator', description: 'Conquered Island 6 & designed an original story outline.' },
  master_explorer: { name: '6-Island Conqueror', description: 'Completed all 6 islands on the Story Quest Map.' },
  perfect_boss: { name: 'Prime Scorer', description: 'Scored ≥ 90 on a Boss Quiz or Final Assessment.' },
  game_lover: { name: 'Mini-Game Champion', description: 'Completed at least 3 island mini-games.' },
  all_games: { name: 'Challenge Collector', description: 'Completed all 6 interactive mini-games across every island.' },
  deep_reflector: { name: 'Reflective Thinker', description: 'Filled in and saved all four reflection sentences.' },
  graduate: { name: 'Story Quest Graduate', description: 'Passed the Final Assessment (≥ 70) and unlocked your certificate.' },
  streak_3: { name: 'Consistent Explorer', description: 'Earned 300+ XP or maintained an active daily streak.' }
};

export function getLang() {
  if (memoryLang === 'id' || memoryLang === 'en') return memoryLang;
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    memoryLang = saved === 'id' ? 'id' : 'en';
    return memoryLang;
  } catch {
    return memoryLang || 'en';
  }
}

export function setLang(lang) {
  const normalized = lang === 'id' ? 'id' : 'en';
  memoryLang = normalized;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, normalized);
  } catch {
    // Abaikan jika storage terbatas
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalized;
  }
  return normalized;
}

export function t(key, vars = {}) {
  const lang = getLang();
  let str = DICT[lang]?.[key] ?? DICT.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  });
  return str;
}

export function getPredikatLocalized(score) {
  const lang = getLang();
  const list = PREDIKAT_I18N[lang] || PREDIKAT_I18N.en;
  const numeric = Number(score) || 0;
  return list.find((p) => numeric >= p.min) || list[list.length - 1];
}

export function getIslandMeta(id) {
  const lang = getLang();
  return ISLANDS_I18N[lang]?.[id] || ISLANDS_I18N.en[id];
}

export function getMiniMaterials(id) {
  const lang = getLang();
  return MINI_MATERIALS_I18N[lang]?.[id] || MINI_MATERIALS_I18N.en[id] || [];
}

export function getGrowthMindsetMsg() {
  const lang = getLang();
  const list = GROWTH_MINDSET_I18N[lang] || GROWTH_MINDSET_I18N.en;
  return list[Math.floor(Math.random() * list.length)];
}

export function getAvatarLabel(avatarObj) {
  if (getLang() === 'en' && AVATAR_LABELS_EN[avatarObj.id]) {
    return AVATAR_LABELS_EN[avatarObj.id];
  }
  return avatarObj.label;
}

export function getBadgeText(badge) {
  if (getLang() === 'en' && BADGES_EN[badge.id]) {
    return { ...badge, ...BADGES_EN[badge.id] };
  }
  return badge;
}
