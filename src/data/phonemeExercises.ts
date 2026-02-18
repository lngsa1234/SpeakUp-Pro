// Phoneme Exercise Data
// Daily rotating exercises for confusing sound pairs

export interface MinimalPair {
  word1: string;
  word2: string;
  phonetic1: string;
  phonetic2: string;
  sentence1: string;
  sentence2: string;
}

export interface PhonemeExercise {
  soundPair: string;
  displayName: string;
  description: string;
  tip: string;
  pairs: MinimalPair[];
}

export const phonemeExercises: PhonemeExercise[] = [
  // Day 1, 11, 21... - L vs R
  {
    soundPair: 'l-r',
    displayName: 'L vs R Sounds',
    description: 'Practice distinguishing between the L and R sounds, which are often confused by non-native speakers.',
    tip: 'For L, place your tongue tip against the ridge behind your upper teeth. For R, curl your tongue back without touching the roof of your mouth.',
    pairs: [
      {
        word1: 'light',
        word2: 'right',
        phonetic1: '/laɪt/',
        phonetic2: '/raɪt/',
        sentence1: 'Turn on the light.',
        sentence2: 'Turn right at the corner.',
      },
      {
        word1: 'lead',
        word2: 'read',
        phonetic1: '/liːd/',
        phonetic2: '/riːd/',
        sentence1: 'She will lead the team.',
        sentence2: 'I love to read books.',
      },
      {
        word1: 'long',
        word2: 'wrong',
        phonetic1: '/lɒŋ/',
        phonetic2: '/rɒŋ/',
        sentence1: 'The road is very long.',
        sentence2: 'That answer is wrong.',
      },
      {
        word1: 'glass',
        word2: 'grass',
        phonetic1: '/ɡlæs/',
        phonetic2: '/ɡræs/',
        sentence1: 'Fill the glass with water.',
        sentence2: 'The grass is green.',
      },
      {
        word1: 'fly',
        word2: 'fry',
        phonetic1: '/flaɪ/',
        phonetic2: '/fraɪ/',
        sentence1: 'Birds can fly high.',
        sentence2: 'Let\'s fry some eggs.',
      },
    ],
  },

  // Day 2, 12, 22... - TH vs S
  {
    soundPair: 'th-s',
    displayName: 'TH vs S Sounds',
    description: 'Practice the voiced and voiceless TH sounds versus the S sound.',
    tip: 'For TH, place your tongue between your teeth and blow air. For S, keep your tongue behind your teeth and hiss.',
    pairs: [
      {
        word1: 'think',
        word2: 'sink',
        phonetic1: '/θɪŋk/',
        phonetic2: '/sɪŋk/',
        sentence1: 'Let me think about it.',
        sentence2: 'The ship began to sink.',
      },
      {
        word1: 'thick',
        word2: 'sick',
        phonetic1: '/θɪk/',
        phonetic2: '/sɪk/',
        sentence1: 'The book is very thick.',
        sentence2: 'She felt sick yesterday.',
      },
      {
        word1: 'path',
        word2: 'pass',
        phonetic1: '/pæθ/',
        phonetic2: '/pæs/',
        sentence1: 'Follow the path through the forest.',
        sentence2: 'Please pass me the salt.',
      },
      {
        word1: 'math',
        word2: 'mass',
        phonetic1: '/mæθ/',
        phonetic2: '/mæs/',
        sentence1: 'I enjoy studying math.',
        sentence2: 'The mass of the object is 5 kg.',
      },
      {
        word1: 'mouth',
        word2: 'mouse',
        phonetic1: '/maʊθ/',
        phonetic2: '/maʊs/',
        sentence1: 'Open your mouth wide.',
        sentence2: 'A mouse ran across the floor.',
      },
    ],
  },

  // Day 3, 13, 23... - V vs W
  {
    soundPair: 'v-w',
    displayName: 'V vs W Sounds',
    description: 'Practice distinguishing between the V and W sounds.',
    tip: 'For V, touch your upper teeth to your lower lip and vibrate. For W, round your lips without touching your teeth.',
    pairs: [
      {
        word1: 'vest',
        word2: 'west',
        phonetic1: '/vest/',
        phonetic2: '/west/',
        sentence1: 'He wore a warm vest.',
        sentence2: 'The sun sets in the west.',
      },
      {
        word1: 'vine',
        word2: 'wine',
        phonetic1: '/vaɪn/',
        phonetic2: '/waɪn/',
        sentence1: 'Grapes grow on a vine.',
        sentence2: 'Would you like some wine?',
      },
      {
        word1: 'vet',
        word2: 'wet',
        phonetic1: '/vet/',
        phonetic2: '/wet/',
        sentence1: 'Take your pet to the vet.',
        sentence2: 'The ground is wet from rain.',
      },
      {
        word1: 'veal',
        word2: 'wheel',
        phonetic1: '/viːl/',
        phonetic2: '/wiːl/',
        sentence1: 'The restaurant serves veal.',
        sentence2: 'The car needs a new wheel.',
      },
      {
        word1: 'vow',
        word2: 'wow',
        phonetic1: '/vaʊ/',
        phonetic2: '/waʊ/',
        sentence1: 'They made a solemn vow.',
        sentence2: 'Wow, that\'s amazing!',
      },
    ],
  },

  // Day 4, 14, 24... - B vs V
  {
    soundPair: 'b-v',
    displayName: 'B vs V Sounds',
    description: 'Practice distinguishing between the B and V sounds.',
    tip: 'For B, close both lips completely and release with a burst of air. For V, touch your upper teeth to your lower lip and vibrate.',
    pairs: [
      {
        word1: 'berry',
        word2: 'very',
        phonetic1: '/ˈberi/',
        phonetic2: '/ˈveri/',
        sentence1: 'I picked a fresh berry.',
        sentence2: 'That is very interesting.',
      },
      {
        word1: 'boat',
        word2: 'vote',
        phonetic1: '/boʊt/',
        phonetic2: '/voʊt/',
        sentence1: 'We sailed on a boat.',
        sentence2: 'Don\'t forget to vote.',
      },
      {
        word1: 'ban',
        word2: 'van',
        phonetic1: '/bæn/',
        phonetic2: '/væn/',
        sentence1: 'They want to ban smoking.',
        sentence2: 'She drives a white van.',
      },
      {
        word1: 'bet',
        word2: 'vet',
        phonetic1: '/bet/',
        phonetic2: '/vet/',
        sentence1: 'I bet you can do it.',
        sentence2: 'The vet examined our dog.',
      },
      {
        word1: 'base',
        word2: 'vase',
        phonetic1: '/beɪs/',
        phonetic2: '/veɪs/',
        sentence1: 'The base of the mountain is wide.',
        sentence2: 'Put the flowers in the vase.',
      },
    ],
  },

  // Day 5, 15, 25... - P vs F
  {
    soundPair: 'p-f',
    displayName: 'P vs F Sounds',
    description: 'Practice distinguishing between the P and F sounds.',
    tip: 'For P, close both lips and release with a puff of air. For F, touch your upper teeth to your lower lip and blow air continuously.',
    pairs: [
      {
        word1: 'pan',
        word2: 'fan',
        phonetic1: '/pæn/',
        phonetic2: '/fæn/',
        sentence1: 'Heat the pan on the stove.',
        sentence2: 'Turn on the fan.',
      },
      {
        word1: 'pour',
        word2: 'four',
        phonetic1: '/pɔːr/',
        phonetic2: '/fɔːr/',
        sentence1: 'Please pour me some water.',
        sentence2: 'I have four apples.',
      },
      {
        word1: 'pine',
        word2: 'fine',
        phonetic1: '/paɪn/',
        phonetic2: '/faɪn/',
        sentence1: 'That\'s a tall pine tree.',
        sentence2: 'Everything is fine.',
      },
      {
        word1: 'peel',
        word2: 'feel',
        phonetic1: '/piːl/',
        phonetic2: '/fiːl/',
        sentence1: 'Peel the banana before eating.',
        sentence2: 'How do you feel today?',
      },
      {
        word1: 'copy',
        word2: 'coffee',
        phonetic1: '/ˈkɒpi/',
        phonetic2: '/ˈkɒfi/',
        sentence1: 'Make a copy of the document.',
        sentence2: 'I need my morning coffee.',
      },
    ],
  },

  // Day 6, 16, 26... - Short i vs Long i (i vs ee)
  {
    soundPair: 'i-ee',
    displayName: 'Short I vs Long I',
    description: 'Practice distinguishing between the short /ɪ/ and long /iː/ vowel sounds.',
    tip: 'For short I, relax your tongue and keep the sound brief. For long I (ee), tense your tongue higher and hold the sound longer.',
    pairs: [
      {
        word1: 'ship',
        word2: 'sheep',
        phonetic1: '/ʃɪp/',
        phonetic2: '/ʃiːp/',
        sentence1: 'The ship sailed across the ocean.',
        sentence2: 'The sheep grazed in the field.',
      },
      {
        word1: 'bit',
        word2: 'beat',
        phonetic1: '/bɪt/',
        phonetic2: '/biːt/',
        sentence1: 'Take a small bit of cake.',
        sentence2: 'I can hear the beat of the drum.',
      },
      {
        word1: 'slip',
        word2: 'sleep',
        phonetic1: '/slɪp/',
        phonetic2: '/sliːp/',
        sentence1: 'Be careful not to slip.',
        sentence2: 'I need to get more sleep.',
      },
      {
        word1: 'fit',
        word2: 'feet',
        phonetic1: '/fɪt/',
        phonetic2: '/fiːt/',
        sentence1: 'These shoes fit perfectly.',
        sentence2: 'My feet are tired from walking.',
      },
      {
        word1: 'hill',
        word2: 'heel',
        phonetic1: '/hɪl/',
        phonetic2: '/hiːl/',
        sentence1: 'We climbed up the hill.',
        sentence2: 'She broke her high heel.',
      },
    ],
  },

  // Day 7, 17, 27... - Short u vs Long u (oo sounds)
  {
    soundPair: 'u-oo',
    displayName: 'Short U vs Long U',
    description: 'Practice distinguishing between the short /ʊ/ and long /uː/ vowel sounds.',
    tip: 'For short U, keep your lips slightly rounded and the sound brief. For long U (oo), round your lips more tightly and hold the sound.',
    pairs: [
      {
        word1: 'full',
        word2: 'fool',
        phonetic1: '/fʊl/',
        phonetic2: '/fuːl/',
        sentence1: 'The glass is full.',
        sentence2: 'Don\'t be a fool.',
      },
      {
        word1: 'pull',
        word2: 'pool',
        phonetic1: '/pʊl/',
        phonetic2: '/puːl/',
        sentence1: 'Pull the door to open it.',
        sentence2: 'Let\'s swim in the pool.',
      },
      {
        word1: 'look',
        word2: 'Luke',
        phonetic1: '/lʊk/',
        phonetic2: '/luːk/',
        sentence1: 'Look at that beautiful sunset.',
        sentence2: 'Luke is my friend\'s name.',
      },
      {
        word1: 'could',
        word2: 'cooed',
        phonetic1: '/kʊd/',
        phonetic2: '/kuːd/',
        sentence1: 'She said she could help.',
        sentence2: 'The dove cooed softly.',
      },
      {
        word1: 'stood',
        word2: 'stewed',
        phonetic1: '/stʊd/',
        phonetic2: '/stuːd/',
        sentence1: 'He stood by the window.',
        sentence2: 'The meat stewed for hours.',
      },
    ],
  },

  // Day 8, 18, 28... - D vs TH
  {
    soundPair: 'd-th',
    displayName: 'D vs TH Sounds',
    description: 'Practice distinguishing between the D and voiced TH sounds.',
    tip: 'For D, touch your tongue to the ridge behind your upper teeth and release. For TH, place your tongue between your teeth and let the air flow.',
    pairs: [
      {
        word1: 'day',
        word2: 'they',
        phonetic1: '/deɪ/',
        phonetic2: '/ðeɪ/',
        sentence1: 'What a beautiful day!',
        sentence2: 'They are coming to visit.',
      },
      {
        word1: 'dare',
        word2: 'there',
        phonetic1: '/deər/',
        phonetic2: '/ðeər/',
        sentence1: 'I dare you to try.',
        sentence2: 'Put the book over there.',
      },
      {
        word1: 'den',
        word2: 'then',
        phonetic1: '/den/',
        phonetic2: '/ðen/',
        sentence1: 'The lion rested in its den.',
        sentence2: 'First this, then that.',
      },
      {
        word1: 'udder',
        word2: 'other',
        phonetic1: '/ˈʌdər/',
        phonetic2: '/ˈʌðər/',
        sentence1: 'The cow\'s udder was full of milk.',
        sentence2: 'The other one is better.',
      },
      {
        word1: 'doze',
        word2: 'those',
        phonetic1: '/doʊz/',
        phonetic2: '/ðoʊz/',
        sentence1: 'I started to doze off.',
        sentence2: 'I want those cookies.',
      },
    ],
  },

  // Day 9, 19, 29... - N vs NG
  {
    soundPair: 'n-ng',
    displayName: 'N vs NG Sounds',
    description: 'Practice distinguishing between the N and NG sounds.',
    tip: 'For N, touch your tongue tip to the ridge behind your teeth. For NG, raise the back of your tongue to touch your soft palate.',
    pairs: [
      {
        word1: 'thin',
        word2: 'thing',
        phonetic1: '/θɪn/',
        phonetic2: '/θɪŋ/',
        sentence1: 'The paper is very thin.',
        sentence2: 'What is that thing?',
      },
      {
        word1: 'sin',
        word2: 'sing',
        phonetic1: '/sɪn/',
        phonetic2: '/sɪŋ/',
        sentence1: 'That would be a sin.',
        sentence2: 'I love to sing songs.',
      },
      {
        word1: 'ran',
        word2: 'rang',
        phonetic1: '/ræn/',
        phonetic2: '/ræŋ/',
        sentence1: 'She ran to catch the bus.',
        sentence2: 'The phone rang loudly.',
      },
      {
        word1: 'win',
        word2: 'wing',
        phonetic1: '/wɪn/',
        phonetic2: '/wɪŋ/',
        sentence1: 'I hope we win the game.',
        sentence2: 'The bird hurt its wing.',
      },
      {
        word1: 'ban',
        word2: 'bang',
        phonetic1: '/bæn/',
        phonetic2: '/bæŋ/',
        sentence1: 'They want to ban that practice.',
        sentence2: 'I heard a loud bang.',
      },
    ],
  },

  // Day 10, 20, 30... - CH vs SH
  {
    soundPair: 'ch-sh',
    displayName: 'CH vs SH Sounds',
    description: 'Practice distinguishing between the CH and SH sounds.',
    tip: 'For CH, start with your tongue pressed against the roof of your mouth and release with a burst. For SH, keep your tongue close but not touching and let air flow continuously.',
    pairs: [
      {
        word1: 'chair',
        word2: 'share',
        phonetic1: '/tʃeər/',
        phonetic2: '/ʃeər/',
        sentence1: 'Please sit in the chair.',
        sentence2: 'Let\'s share the pizza.',
      },
      {
        word1: 'chip',
        word2: 'ship',
        phonetic1: '/tʃɪp/',
        phonetic2: '/ʃɪp/',
        sentence1: 'I ate a potato chip.',
        sentence2: 'The ship sailed away.',
      },
      {
        word1: 'chop',
        word2: 'shop',
        phonetic1: '/tʃɒp/',
        phonetic2: '/ʃɒp/',
        sentence1: 'Chop the vegetables finely.',
        sentence2: 'Let\'s shop for groceries.',
      },
      {
        word1: 'catch',
        word2: 'cash',
        phonetic1: '/kætʃ/',
        phonetic2: '/kæʃ/',
        sentence1: 'Try to catch the ball.',
        sentence2: 'I need to get some cash.',
      },
      {
        word1: 'watch',
        word2: 'wash',
        phonetic1: '/wɒtʃ/',
        phonetic2: '/wɒʃ/',
        sentence1: 'I like to watch movies.',
        sentence2: 'Please wash your hands.',
      },
    ],
  },
];

/**
 * Get the phoneme exercise for a specific day number.
 * Exercises rotate on a 10-day cycle.
 * @param dayNumber - The day number (1-60+)
 * @returns The phoneme exercise for that day
 */
export function getDailyPhonemeExercise(dayNumber: number): PhonemeExercise {
  // Calculate which exercise to use (0-9 based on day number)
  const exerciseIndex = (dayNumber - 1) % 10;
  return phonemeExercises[exerciseIndex];
}
