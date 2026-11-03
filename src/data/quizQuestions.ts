import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // 1. GUESS THE BOOK (Order of the Canon, Chronology & Author Identification)
  // =========================================================================
  {
    id: 'gtb-1',
    category: 'old',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'easy',
    q: 'Which book of the Old Testament comes immediately before Numbers?',
    options: ['Leviticus', 'Exodus', 'Deuteronomy', 'Joshua'],
    answer: 0,
    acceptableAnswers: ['leviticus', 'levitico'],
    explanation: 'The third book of Moses is Leviticus, followed directly by Numbers (the fourth book of the Pentateuch).',
    reference: 'Leviticus 27:34, Numbers 1:1'
  },
  {
    id: 'gtb-2',
    category: 'old',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'easy',
    q: 'Which book comes immediately after Psalms in the Holy Scriptures?',
    options: ['Proverbs', 'Ecclesiastes', 'Job', 'Song of Solomon'],
    answer: 0,
    acceptableAnswers: ['proverbs', 'mga kawikaan', 'mga panultihon'],
    explanation: 'Proverbs directly follows Psalms in the Poetic and Wisdom section of the Old Testament.',
    reference: 'Psalm 150:6, Proverbs 1:1'
  },
  {
    id: 'gtb-3',
    category: 'new',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'easy',
    q: 'Which book comes immediately before the Book of Romans in the New Testament?',
    options: ['Acts', 'John', '1 Corinthians', 'Galatians'],
    answer: 0,
    acceptableAnswers: ['acts', 'acts of the apostles', 'mga buhat', 'mga gawa'],
    explanation: 'The Acts of the Apostles concludes the historical section of the New Testament right before Romans begins Paul\'s epistles.',
    reference: 'Acts 28:30-31, Romans 1:1'
  },
  {
    id: 'gtb-4',
    category: 'new',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'easy',
    q: 'Which book comes immediately before the Book of Revelation?',
    options: ['Jude', '3 John', '2 Peter', 'James'],
    answer: 0,
    acceptableAnswers: ['jude', 'judas'],
    explanation: 'The General Epistle of Jude is the sixty-fifth book of the Bible, immediately preceding Revelation.',
    reference: 'Jude 1:24-25, Revelation 1:1'
  },
  {
    id: 'gtb-5',
    category: 'new',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'medium',
    q: 'Which book comes between Galatians and Philippians in the Pauline Epistles?',
    options: ['Ephesians', 'Colossians', '1 Thessalonians', 'Romans'],
    answer: 0,
    acceptableAnswers: ['ephesians', 'efeso', 'mga taga-efeso'],
    explanation: 'The order of Paul\'s prison epistles runs: Galatians, Ephesians, Philippians, Colossians.',
    reference: 'Galatians 6:18, Ephesians 1:1, Philippians 1:1'
  },
  {
    id: 'gtb-6',
    category: 'old',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'medium',
    q: 'Which book comes immediately after Deuteronomy in the Old Testament?',
    options: ['Joshua', 'Judges', 'Ruth', '1 Samuel'],
    answer: 0,
    acceptableAnswers: ['joshua', 'josue'],
    explanation: 'After Moses died at the end of Deuteronomy, Joshua assumed leadership and the Book of Joshua begins the historical books.',
    reference: 'Deuteronomy 34:10-12, Joshua 1:1-2'
  },
  {
    id: 'gtb-7',
    category: 'new',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'medium',
    q: 'Which book comes immediately after the Gospel of Luke?',
    options: ['John', 'Acts', 'Mark', 'Matthew'],
    answer: 0,
    acceptableAnswers: ['john', 'gospel of john', 'juan', 'san juan'],
    explanation: 'The Gospel of John is the fourth Gospel, placed between Luke and Acts.',
    reference: 'Luke 24:53, John 1:1'
  },
  {
    id: 'gtb-8',
    category: 'old',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'medium',
    q: 'Which book of the Old Testament comes immediately after 2 Kings?',
    options: ['1 Chronicles', 'Ezra', 'Nehemiah', 'Esther'],
    answer: 0,
    acceptableAnswers: ['1 chronicles', '1 cronicas', '1 mga cronicas'],
    explanation: '1 Chronicles follows 2 Kings in the Protestant Old Testament canon.',
    reference: '2 Kings 25:30, 1 Chronicles 1:1'
  },
  {
    id: 'gtb-9',
    category: 'old',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'hard',
    q: 'Which book of the Minor Prophets comes immediately before Malachi, the final book of the Old Testament?',
    options: ['Zechariah', 'Haggai', 'Zephaniah', 'Habakkuk'],
    answer: 0,
    acceptableAnswers: ['zechariah', 'zacarias'],
    explanation: 'Zechariah is the thirty-eighth book of the Bible, immediately preceding Malachi (the thirty-ninth book).',
    reference: 'Zechariah 14:21, Malachi 1:1'
  },
  {
    id: 'gtb-10',
    category: 'new',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'hard',
    q: 'Which book comes between 2 Thessalonians and 2 Timothy?',
    options: ['1 Timothy', 'Titus', 'Philemon', 'Hebrews'],
    answer: 0,
    acceptableAnswers: ['1 timothy', '1 timoteo'],
    explanation: '1 Timothy sits directly between 2 Thessalonians and 2 Timothy in the New Testament epistles.',
    reference: '2 Thessalonians 3:18, 1 Timothy 1:1, 2 Timothy 1:1'
  },
  {
    id: 'gtb-11',
    category: 'old',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'hard',
    q: 'Which Old Testament book records the rebuilding of Jerusalem\'s walls under the cupbearer to King Artaxerxes?',
    options: ['Nehemiah', 'Ezra', 'Esther', 'Daniel'],
    answer: 0,
    acceptableAnswers: ['nehemiah', 'nehemias'],
    explanation: 'Nehemiah was cupbearer to Artaxerxes and returned to Jerusalem to rebuild its broken walls in 52 days.',
    reference: 'Nehemiah 1:11, Nehemiah 6:15'
  },
  {
    id: 'gtb-12',
    category: 'old',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'difficult',
    q: 'Which prophetic book opens with the declaration: "The burden of Nineveh. The book of the vision of Elkoshite"?',
    options: ['Nahum', 'Jonah', 'Micah', 'Habakkuk'],
    answer: 0,
    acceptableAnswers: ['nahum'],
    explanation: 'Nahum 1:1 opens with the burden of Nineveh by Nahum the Elkoshite, prophesying Nineveh\'s destruction.',
    reference: 'Nahum 1:1'
  },
  {
    id: 'gtb-13',
    category: 'old',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'difficult',
    q: 'Which shortest book of the Old Testament contains only twenty-one verses prophesying against the pride of Edom?',
    options: ['Obadiah', 'Haggai', 'Habakkuk', 'Zephaniah'],
    answer: 0,
    acceptableAnswers: ['obadiah', 'abdias'],
    explanation: 'Obadiah consists of a single chapter of 21 verses detailing God\'s judgment upon Edom for violence against Jacob.',
    reference: 'Obadiah 1:1-21'
  },
  {
    id: 'gtb-14',
    category: 'new',
    categoryLabel: 'Guess the Book',
    type: 'guess_the_book',
    difficulty: 'difficult',
    q: 'Which single-chapter Pauline epistle was addressed to a believer in Colossae regarding his runaway slave Onesimus?',
    options: ['Philemon', 'Titus', '2 John', '3 John'],
    answer: 0,
    acceptableAnswers: ['philemon', 'filemon'],
    explanation: 'Paul wrote to Philemon pleading for him to receive back Onesimus no longer as a slave, but as a beloved brother.',
    reference: 'Philemon 1:10-16'
  },

  // =========================================================================
  // 2. IDENTIFICATION (Fill-in-the-Blank / Type-In, Non-Case-Sensitive)
  // =========================================================================
  {
    id: 'id-1',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'easy',
    q: 'Who built the ark of gopher wood at God\'s command to preserve life through the great Flood?',
    answer: 'Noah',
    acceptableAnswers: ['noah', 'noe'],
    explanation: 'Noah found grace in the eyes of the LORD and obeyed God\'s command to construct an ark.',
    reference: 'Genesis 6:8, 14; Genesis 7:1'
  },
  {
    id: 'id-2',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'easy',
    q: 'Who was the oldest man recorded in the Bible, living a total of 969 years?',
    answer: 'Methuselah',
    acceptableAnswers: ['methuselah', 'matusalem'],
    explanation: 'Genesis 5:27 records: "And all the days of Methuselah were nine hundred sixty and nine years: and he died."',
    reference: 'Genesis 5:27'
  },
  {
    id: 'id-3',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'easy',
    q: 'What body of water did God part through Moses for the children of Israel to cross on dry ground?',
    answer: 'Red Sea',
    acceptableAnswers: ['red sea', 'sea of reeds', 'dagat na pula', 'dagat pula'],
    explanation: 'Moses stretched out his hand over the Red Sea, and the LORD drove the sea back with a strong east wind all night.',
    reference: 'Exodus 14:21-22'
  },
  {
    id: 'id-4',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'easy',
    q: 'On which sacred mountain did Moses receive the two stone tablets of the Ten Commandments?',
    answer: 'Mount Sinai',
    acceptableAnswers: ['mount sinai', 'sinai', 'horeb', 'bundok sinai'],
    explanation: 'The LORD came down upon Mount Sinai and delivered the Ten Commandments written by the finger of God.',
    reference: 'Exodus 19:20, Exodus 31:18'
  },
  {
    id: 'id-5',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'easy',
    q: 'Which young shepherd boy defeated the Philistine champion Goliath with a sling and a stone?',
    answer: 'David',
    acceptableAnswers: ['david'],
    explanation: 'David went out in the name of the LORD of hosts and struck Goliath with a sling and stone.',
    reference: '1 Samuel 17:45-50'
  },
  {
    id: 'id-6',
    category: 'new',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'easy',
    q: 'In which Judean town was Jesus Christ born according to the prophecy of Micah?',
    answer: 'Bethlehem',
    acceptableAnswers: ['bethlehem', 'betlehem', 'belen'],
    explanation: 'Jesus was born in Bethlehem of Judea during the days of Herod the king, fulfilling Micah 5:2.',
    reference: 'Micah 5:2, Matthew 2:1, Luke 2:4-7'
  },
  {
    id: 'id-7',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'medium',
    q: 'Which prophet was swallowed by a great fish when he attempted to flee to Tarshish instead of Nineveh?',
    answer: 'Jonah',
    acceptableAnswers: ['jonah', 'jonas'],
    explanation: 'The LORD prepared a great fish to swallow up Jonah, and Jonah was in the belly of the fish three days and three nights.',
    reference: 'Jonah 1:1-3, 17'
  },
  {
    id: 'id-8',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'medium',
    q: 'Who was anointed by the prophet Samuel as the first human king over the united nation of Israel?',
    answer: 'Saul',
    acceptableAnswers: ['saul'],
    explanation: 'Samuel took a vial of oil and anointed Saul king over the LORD\'s inheritance.',
    reference: '1 Samuel 10:1'
  },
  {
    id: 'id-9',
    category: 'new',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'medium',
    q: 'Who was the Roman governor of Judea who washed his hands and condemned Jesus to be crucified?',
    answer: 'Pontius Pilate',
    acceptableAnswers: ['pontius pilate', 'pilate', 'poncio pilato', 'pilato'],
    explanation: 'When Pilate saw that he could prevail nothing, he took water and washed his hands before the multitude.',
    reference: 'Matthew 27:24-26'
  },
  {
    id: 'id-10',
    category: 'new',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'medium',
    q: 'Whom did Jesus raise from the dead in Bethany after he had been in the tomb four days?',
    answer: 'Lazarus',
    acceptableAnswers: ['lazarus', 'lazaro'],
    explanation: 'Jesus cried with a loud voice, "Lazarus, come forth," and he that was dead came out bound hand and foot.',
    reference: 'John 11:38-44'
  },
  {
    id: 'id-11',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'hard',
    q: 'Which prophet of God was taken up to heaven in a whirlwind by a chariot and horses of fire?',
    answer: 'Elijah',
    acceptableAnswers: ['elijah', 'elias'],
    explanation: 'As Elijah and Elisha walked and talked, a chariot of fire and horses of fire parted them both, and Elijah went up into heaven.',
    reference: '2 Kings 2:11'
  },
  {
    id: 'id-12',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'hard',
    q: 'What was the name of Abraham\'s wife who miraculously gave birth to Isaac in her old age?',
    answer: 'Sarah',
    acceptableAnswers: ['sarah', 'sara', 'sarai'],
    explanation: 'God promised Abraham that his wife Sarah would bear a son in her old age, whom they named Isaac.',
    reference: 'Genesis 17:15-19, Genesis 21:1-3'
  },
  {
    id: 'id-13',
    category: 'new',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'hard',
    q: 'Who was chosen by lot to replace Judas Iscariot as the twelfth apostle in Acts 1?',
    answer: 'Matthias',
    acceptableAnswers: ['matthias', 'matias'],
    explanation: 'The disciples prayed and cast lots, and the lot fell upon Matthias, numbering him with the eleven apostles.',
    reference: 'Acts 1:23-26'
  },
  {
    id: 'id-14',
    category: 'new',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'difficult',
    q: 'What was the name of the priestly division to which Zechariah, father of John the Baptist, belonged?',
    answer: 'Abijah',
    acceptableAnswers: ['abijah', 'course of abijah', 'division of abijah', 'abia', 'abias'],
    explanation: 'Luke 1:5 states Zechariah was of the course of Abijah (the eighth priestly order appointed under King David).',
    reference: 'Luke 1:5, 1 Chronicles 24:10'
  },
  {
    id: 'id-15',
    category: 'new',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'difficult',
    q: 'On which Greek island was the Apostle John exiled when he saw the vision and wrote the Book of Revelation?',
    answer: 'Patmos',
    acceptableAnswers: ['patmos', 'island of patmos'],
    explanation: 'John writes in Revelation 1:9: "I John... was in the isle that is called Patmos, for the word of God, and for the testimony of Jesus Christ."',
    reference: 'Revelation 1:9'
  },
  {
    id: 'id-16',
    category: 'old',
    categoryLabel: 'Identification',
    type: 'identification',
    difficulty: 'difficult',
    q: 'Who was the left-handed judge of Israel from the tribe of Benjamin who delivered Israel by slaying King Eglon of Moab?',
    answer: 'Ehud',
    acceptableAnswers: ['ehud', 'aod'],
    explanation: 'Judges 3:15 records that God raised up a deliverer, Ehud the son of Gera, a Benjamite, a man lefthanded.',
    reference: 'Judges 3:15-21'
  },

  // =========================================================================
  // 3. MULTIPLE CHOICE (Comprehensive Biblical Knowledge)
  // =========================================================================

  // --- EASY DIFFICULTY ---
  {
    id: 'mc-e1',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'easy',
    q: 'How many days did God take to create the heavens, the earth, the sea, and all life before resting on the seventh day?',
    options: ['6 days', '7 days', '5 days', '10 days'],
    answer: 0,
    explanation: 'God completed all His creative work in six days and rested on the seventh day, blessing and sanctifying the Sabbath.',
    reference: 'Genesis 1:31, Genesis 2:1-3, Exodus 20:11'
  },
  {
    id: 'mc-e2',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'easy',
    q: 'Who were the first two human beings created by God in the Garden of Eden?',
    options: ['Adam and Eve', 'Cain and Abel', 'Abraham and Sarah', 'Noah and Naamah'],
    answer: 0,
    explanation: 'God formed Adam from the dust of the ground and made Eve from Adam\'s rib to be his helper.',
    reference: 'Genesis 2:7, 21-23; Genesis 3:20'
  },
  {
    id: 'mc-e3',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'easy',
    q: 'In which river was Jesus Christ baptized by John the Baptist?',
    options: ['Jordan River', 'Nile River', 'Euphrates River', 'Tigris River'],
    answer: 0,
    explanation: 'Jesus came from Galilee to the Jordan River unto John, to be baptized of him.',
    reference: 'Matthew 3:13-17, Mark 1:9'
  },
  {
    id: 'mc-e4',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'easy',
    q: 'How many apostles did Jesus Christ personally choose and designate during His ministry?',
    options: ['12', '10', '7', '14'],
    answer: 0,
    explanation: 'Jesus called unto Him His disciples, and of them He chose twelve, whom also He named apostles.',
    reference: 'Luke 6:13, Matthew 10:1-4'
  },
  {
    id: 'mc-e5',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'easy',
    q: 'Which city\'s walls collapsed flat after the Israelites marched around them once a day for six days and seven times on the seventh day?',
    options: ['Jericho', 'Ai', 'Jerusalem', 'Hebron'],
    answer: 0,
    explanation: 'When the priests blew with the trumpets and the people shouted with a great shout, the wall of Jericho fell down flat.',
    reference: 'Joshua 6:20'
  },

  // --- MEDIUM DIFFICULTY ---
  {
    id: 'mc-m1',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'medium',
    q: 'On which mountain did the prophet Elijah challenge and defeat the 450 prophets of the false god Baal?',
    options: ['Mount Carmel', 'Mount Sinai', 'Mount Nebo', 'Mount of Olives'],
    answer: 0,
    explanation: 'Elijah summoned all Israel and the prophets of Baal unto Mount Carmel, where God answered with consuming fire from heaven.',
    reference: '1 Kings 18:19-39'
  },
  {
    id: 'mc-m2',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'medium',
    q: 'Who was thrown into the lions\' den for refusing to stop praying to the True God three times a day?',
    options: ['Daniel', 'Joseph', 'Jeremiah', 'Shadrach'],
    answer: 0,
    explanation: 'King Darius had Daniel cast into the den of lions, but God sent His angel to shut the lions\' mouths.',
    reference: 'Daniel 6:10, 16-22'
  },
  {
    id: 'mc-m3',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'medium',
    q: 'On the road to which city was Saul surrounded by a light from heaven and spoken to by the risen Lord Jesus?',
    options: ['Damascus', 'Antioch', 'Jerusalem', 'Rome'],
    answer: 0,
    explanation: 'As Saul journeyed and came near Damascus, suddenly there shined round about him a light from heaven.',
    reference: 'Acts 9:3-6'
  },
  {
    id: 'mc-m4',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'medium',
    q: 'How many spies did Moses send from the wilderness of Paran to spy out the Promised Land of Canaan?',
    options: ['12 spies', '10 spies', '2 spies', '7 spies'],
    answer: 0,
    explanation: 'Moses sent twelve men, one ruler from every tribe of the children of Israel, to search the land of Canaan.',
    reference: 'Numbers 13:1-16'
  },
  {
    id: 'mc-m5',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'medium',
    q: 'Which disciple denied knowing Jesus three times before the rooster crowed, and afterwards went out and wept bitterly?',
    options: ['Peter', 'Judas Iscariot', 'Thomas', 'John'],
    answer: 0,
    explanation: 'Peter denied his Lord three times as Jesus had predicted, and wept bitterly in deep repentance.',
    reference: 'Matthew 26:69-75, Luke 22:60-62'
  },
  {
    id: 'mc-m6',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'medium',
    q: 'With how many loaves of barley bread and small fishes did Jesus miraculously feed a multitude of 5,000 men?',
    options: ['5 loaves and 2 fishes', '7 loaves and a few fishes', '3 loaves and 1 fish', '12 loaves and 2 fishes'],
    answer: 0,
    explanation: 'Jesus took the five loaves and the two fishes, blessed them, broke them, and fed 5,000 men besides women and children.',
    reference: 'Matthew 14:17-21, John 6:9-14'
  },

  // --- HARD DIFFICULTY ---
  {
    id: 'mc-h1',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'hard',
    q: 'Who was the first Christian disciple to suffer martyrdom by stoning while gazing steadfastly into heaven?',
    options: ['Stephen', 'James the son of Zebedee', 'Philip', 'Barnabas'],
    answer: 0,
    explanation: 'Stephen saw the glory of God and Jesus standing on the right hand of God before being stoned by the council.',
    reference: 'Acts 7:55-60'
  },
  {
    id: 'mc-h2',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'hard',
    q: 'How many total years were the children of Israel sentenced to wander in the wilderness before entering Canaan?',
    options: ['40 years', '70 years', '30 years', '25 years'],
    answer: 0,
    explanation: 'Because of their unbelief, God appointed that Israel would wander forty years, a year for each day the spies searched the land.',
    reference: 'Numbers 14:33-34'
  },
  {
    id: 'mc-h3',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'hard',
    q: 'Which two faithful spies among the twelve urged the congregation to trust God and possess the Promised Land?',
    options: ['Joshua and Caleb', 'Moses and Aaron', 'Gideon and Barak', 'Phinehas and Eleazar'],
    answer: 0,
    explanation: 'Joshua the son of Nun and Caleb the son of Jephunneh tore their clothes and proclaimed that the LORD would bring them into the land.',
    reference: 'Numbers 14:6-9'
  },
  {
    id: 'mc-h4',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'hard',
    q: 'In which city were the disciples of Jesus Christ first called "Christians"?',
    options: ['Antioch', 'Jerusalem', 'Rome', 'Ephesus'],
    answer: 0,
    explanation: 'Acts 11:26 states: "And the disciples were called Christians first in Antioch."',
    reference: 'Acts 11:26'
  },
  {
    id: 'mc-h5',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'hard',
    q: 'On which biblical feast day did the Holy Spirit descend upon the apostles with the sound of a rushing mighty wind?',
    options: ['The Day of Pentecost', 'Passover', 'Feast of Tabernacles', 'Day of Atonement'],
    answer: 0,
    explanation: 'When the Day of Pentecost was fully come, the Holy Spirit descended as cloven tongues like as of fire upon the disciples.',
    reference: 'Acts 2:1-4'
  },
  {
    id: 'mc-h6',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'hard',
    q: 'How many total years did King David reign over Israel (both in Hebron over Judah and in Jerusalem over all Israel)?',
    options: ['40 years', '33 years', '50 years', '20 years'],
    answer: 0,
    explanation: 'David was thirty years old when he began to reign, and he reigned forty years: seven years in Hebron and thirty-three in Jerusalem.',
    reference: '2 Samuel 5:4-5, 1 Kings 2:11'
  },

  // --- DIFFICULT DIFFICULTY ---
  {
    id: 'mc-d1',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'difficult',
    q: 'With how many chosen men did Gideon defeat the vast host of the Midianites using only trumpets, empty pitchers, and lamps?',
    options: ['300 men', '700 men', '10,000 men', '3,000 men'],
    answer: 0,
    explanation: 'The LORD reduced Gideon\'s army from 32,000 down to 300 men who lapped water with their tongue so that Israel could not vaunt itself.',
    reference: 'Judges 7:2-7, 16-22'
  },
  {
    id: 'mc-d2',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'difficult',
    q: 'Which chapter in the Book of Psalms is the longest chapter in the entire Bible, containing 176 verses?',
    options: ['Psalm 119', 'Psalm 150', 'Psalm 89', 'Psalm 78'],
    answer: 0,
    explanation: 'Psalm 119 is an acrostic psalm celebrating God\'s law, commandments, testimonies, and precepts with 176 verses.',
    reference: 'Psalm 119:1-176'
  },
  {
    id: 'mc-d3',
    category: 'all',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'difficult',
    q: 'According to 1 Peter 3:20, how many human souls were saved by water in the days of Noah inside the ark?',
    options: ['8 souls', '10 souls', '4 souls', '12 souls'],
    answer: 0,
    explanation: 'The eight souls saved in Noah\'s ark were Noah, his wife, his three sons (Shem, Ham, Japheth), and their three wives.',
    reference: '1 Peter 3:20, Genesis 7:13'
  },
  {
    id: 'mc-d4',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'difficult',
    q: 'Who was the prophetess and judge of Israel who judged under the palm tree between Ramah and Bethel and went with Barak to battle?',
    options: ['Deborah', 'Huldah', 'Miriam', 'Noadiah'],
    answer: 0,
    explanation: 'Deborah, a prophetess, the wife of Lapidoth, judged Israel at that time and led Israel to victory over Sisera.',
    reference: 'Judges 4:4-14'
  },
  {
    id: 'mc-d5',
    category: 'old',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'difficult',
    q: 'How many total chapters are in the prophetic Book of Isaiah in the Old Testament?',
    options: ['66 chapters', '52 chapters', '48 chapters', '40 chapters'],
    answer: 0,
    explanation: 'The Book of Isaiah consists of exactly 66 chapters, often called a miniature Bible because of its structure.',
    reference: 'Isaiah 1:1, Isaiah 66:24'
  },
  {
    id: 'mc-d6',
    category: 'new',
    categoryLabel: 'Multiple Choice',
    type: 'multiple_choice',
    difficulty: 'difficult',
    q: 'In Acts 16, what was the name of the seller of purple from the city of Thyatira who believed Paul\'s preaching and was baptized with her household?',
    options: ['Lydia', 'Priscilla', 'Dorcas', 'Phoebe'],
    answer: 0,
    explanation: 'Lydia, a seller of purple of the city of Thyatira which worshipped God, heard Paul, and the Lord opened her heart.',
    reference: 'Acts 16:14-15'
  }
];

/**
 * Case-insensitive, punctuation-tolerant answer validation utility.
 * Guarantees that typing "moses", "Moses", " MOSES " or acceptable variants
 * evaluates accurately without false rejections.
 */
export function isQuizAnswerCorrect(
  userAnswer: string | number | undefined,
  question: QuizQuestion
): boolean {
  if (userAnswer === undefined || userAnswer === null) return false;

  // 1. Multiple Choice validation
  if (question.type === 'multiple_choice') {
    return Number(userAnswer) === Number(question.answer);
  }

  // 2. Guess the Book validation (can be option index OR typed string)
  if (question.type === 'guess_the_book') {
    if (typeof question.answer === 'number' && typeof userAnswer === 'number') {
      return Number(userAnswer) === question.answer;
    }
    if (typeof question.answer === 'number' && !isNaN(Number(userAnswer))) {
      return Number(userAnswer) === question.answer;
    }
  }

  // 3. String / Identification validation (Case-Insensitive & Punctuation-Agnostic)
  const normalize = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[.,'’"?!;:()]/g, '')
      .replace(/^the\s+/i, '')
      .replace(/^mount\s+/i, '')
      .replace(/^isle\s+of\s+/i, '')
      .replace(/^island\s+of\s+/i, '')
      .replace(/^bundok\s+/i, '')
      .replace(/^dagat\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim();

  const userClean = normalize(String(userAnswer));

  // If question answer is an index and user typed a string, check against option text
  if (typeof question.answer === 'number' && question.options && question.options[question.answer]) {
    const optClean = normalize(question.options[question.answer]);
    if (userClean === optClean) return true;
  }

  const targetClean = normalize(String(question.answer));
  if (userClean === targetClean) return true;

  if (question.acceptableAnswers && question.acceptableAnswers.length > 0) {
    return question.acceptableAnswers.some((acc) => normalize(acc) === userClean);
  }

  return false;
}
