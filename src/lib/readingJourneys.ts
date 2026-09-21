export interface JourneyStep {
  bookId: number;
  stepNumber: number;
  stageTitle: string;
  reflectionPrompt: string;
}

export interface ReadingJourney {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  emoji: string;
  description: string;
  themeColor: string;
  steps: JourneyStep[];
  estimatedTotalHours: number;
  curatorNote: string;
}

export const READING_JOURNEYS: ReadingJourney[] = [
  {
    id: "existential-odyssey",
    title: "The Existential Odyssey",
    subtitle: "From Alienation & Dread to Conscious Freedom",
    badge: "Existential Philosophy",
    emoji: "🪨",
    themeColor: "from-[#8B5A2B]/15 to-[#D4A373]/10",
    description:
      "A guided traversal through the architecture of modern dread, the burden of solitary choice, and the defiant choice to live fully in an indifferent cosmos.",
    curatorNote:
      "Begin with Samsa's quiet alienation, witness Sisyphus's defiant laughter, and culminate in Kierkegaard's profound inquiry into despair.",
    estimatedTotalHours: 24,
    steps: [
      {
        bookId: 2, // The Metamorphosis
        stepNumber: 1,
        stageTitle: "The Fracture of Ordinary Life",
        reflectionPrompt:
          "How does Kafka portray estrangement not as an external tragedy, but as the quiet rupture of routine?",
      },
      {
        bookId: 4, // The Stranger
        stepNumber: 2,
        stageTitle: "Encountering the Absurd",
        reflectionPrompt:
          "Meursault refuses to perform grief or guilt. What does his honesty reveal about society's demand for illusions?",
      },
      {
        bookId: 5, // The Myth of Sisyphus
        stepNumber: 3,
        stageTitle: "Lucidity & Defiance",
        reflectionPrompt:
          "If life has no inherent meaning, does that make living an act of despair or an act of supreme revolt?",
      },
      {
        bookId: 21, // Nausea
        stepNumber: 4,
        stageTitle: "The Viscosity of Existence",
        reflectionPrompt:
          "Roquentin discovers that things simply exist, gratuitously and without purpose. Where does freedom begin?",
      },
      {
        bookId: 28, // The Sickness Unto Death
        stepNumber: 5,
        stageTitle: "The Anatomy of Despair",
        reflectionPrompt:
          "For Kierkegaard, despair is not sorrow, but the misrelation of the self to itself. What brings synthesis?",
      },
    ],
  },
  {
    id: "wisdom-doubt-soul",
    title: "Wisdom, Doubt & Soul",
    subtitle: "Classical Islamic Philosophy & Spiritual Discovery",
    badge: "Islamic Philosophy",
    emoji: "🕌",
    themeColor: "from-[#4A3B2C]/15 to-[#8B5A2B]/10",
    description:
      "Trace the profound intellectual dialogue of classical Islam—wrestling with theological skepticism, the harmony of revelation and reason, and inner spiritual purification.",
    curatorNote:
      "From Al-Ghazali's epistemological crisis to Ibn Tufayl's desert island rationalism and Attar's allegorical quest of the birds.",
    estimatedTotalHours: 28,
    steps: [
      {
        bookId: 63, // Deliverance from Error
        stepNumber: 1,
        stageTitle: "The Crucible of Skepticism",
        reflectionPrompt:
          "Al-Ghazali doubted senses and pure intellect centuries before Descartes. How does certitude re-emerge?",
      },
      {
        bookId: 72, // Hayy ibn Yaqdhan
        stepNumber: 2,
        stageTitle: "Reason Untamed by Dogma",
        reflectionPrompt:
          "A feral human child deduces cosmology, ethics, and metaphysics through unguided observation alone.",
      },
      {
        bookId: 73, // The Decisive Treatise
        stepNumber: 3,
        stageTitle: "Truth Does Not Contradict Truth",
        reflectionPrompt:
          "Ibn Rushd's seminal defense of philosophy: can philosophical logic ever truly undermine revealed truth?",
      },
      {
        bookId: 68, // The Conference of the Birds
        stepNumber: 4,
        stageTitle: "The Seven Valleys of the Heart",
        reflectionPrompt:
          "Attar's epic spiritual journey where thirty birds cross the abyss only to discover the Divine within.",
      },
      {
        bookId: 80, // The Secrets of the Self
        stepNumber: 5,
        stageTitle: "Awakening the Dormant Will",
        reflectionPrompt:
          "Iqbal's call to shatter quietism and revitalize the spiritual self (Khudi) in an era of colonial malaise.",
      },
    ],
  },
  {
    id: "bengal-humanist-tapestry",
    title: "Bengal's Humanist Tapestry",
    subtitle: "Rivers, Identity & the Awakening of Conscience",
    badge: "Bengali Masterworks",
    emoji: "🌾",
    themeColor: "from-[#7A4B22]/15 to-[#D4A373]/10",
    description:
      "Experience the golden dawn of modern Bengali letters—rich with monsoon rain, village paths, societal caste conflicts, and unvarnished emotional dignity.",
    curatorNote:
      "A pilgrimage through Tagore's philosophical nationhood, Bibhutibhushan's pastoral lyricism, and Manik's psychological realism.",
    estimatedTotalHours: 32,
    steps: [
      {
        bookId: 44, // Gora
        stepNumber: 1,
        stageTitle: "Identity, Orthodoxy & Universalism",
        reflectionPrompt:
          "Gora defends tradition fiercely until truth shatters his ancestral illusions, giving birth to a universal humanism.",
      },
      {
        bookId: 47, // Pather Panchali
        stepNumber: 2,
        stageTitle: "Song of the Rural Path",
        reflectionPrompt:
          "Through the wide eyes of Apu and Durga, Bibhutibhushan immortalizes the wondrous poetry of quiet rural poverty.",
      },
      {
        bookId: 52, // Srikanta
        stepNumber: 3,
        stageTitle: "The Wandering Conscience",
        reflectionPrompt:
          "Sarat Chandra's bohemian wanderer explores love beyond societal sanction, casting light on outcast women.",
      },
      {
        bookId: 55, // Padma Nadir Majhi
        stepNumber: 4,
        stageTitle: "The River & the Fisherman's Fate",
        reflectionPrompt:
          "Manik Bandopadhyay's unsparing depiction of the relentless Padma river, survival, desire, and Mayadwip.",
      },
      {
        bookId: 56, // Putul Nacher Itikatha
        stepNumber: 5,
        stageTitle: "The Puppet Dance of Desires",
        reflectionPrompt:
          "Shashi the doctor realizes that despite education and science, humanity remains tethered to unconscious instincts.",
      },
    ],
  },
  {
    id: "russian-conscience",
    title: "The Weight of Conscience",
    subtitle: "Guilt, Redemption & Russian Psychological Depths",
    badge: "Russian Classics",
    emoji: "❄️",
    themeColor: "from-[#5B3315]/15 to-[#8B5A2B]/10",
    description:
      "Descend into St. Petersburg stairwells and Siberian exiles to confront moral transgression, the burden of ego, and the sanctity of suffering.",
    curatorNote:
      "Few writers have excavated the criminal heart as Dostoevsky did, or laid bare the vanity of comfortable death as Tolstoy.",
    estimatedTotalHours: 36,
    steps: [
      {
        bookId: 14, // Notes from Underground
        stepNumber: 1,
        stageTitle: "The Paradoxical Self",
        reflectionPrompt:
          "The spiteful narrator refuses 2+2=4. Why does humanity cling to irrational spite rather than sterile logic?",
      },
      {
        bookId: 13, // Crime and Punishment
        stepNumber: 2,
        stageTitle: "The Extraordinary Man Delusion",
        reflectionPrompt:
          "Raskolnikov tests whether superior men stand above morality, only to be crushed by his own conscience.",
      },
      {
        bookId: 18, // The Death of Ivan Ilyich
        stepNumber: 3,
        stageTitle: "The Terror of the Ordinary",
        reflectionPrompt:
          "Ivan Ilyich lived decorously, comfortably, and according to rule—and therefore his life was completely terrible.",
      },
      {
        bookId: 15, // The Brothers Karamazov
        stepNumber: 4,
        stageTitle: "Faith, Doubt & the Grand Inquisitor",
        reflectionPrompt:
          "Ivan's rebellion against innocent suffering vs. Father Zosima's active love: can the world bear its own burden?",
      },
    ],
  },
  {
    id: "nocturnal-solitude",
    title: "Nocturnal Melancholy & Solitude",
    subtitle: "The Inner Fortresses of the Solitary Reader",
    badge: "Meditations on Solitude",
    emoji: "🌙",
    themeColor: "from-[#2C1810]/20 to-[#6F5B50]/15",
    description:
      "A quiet evening sanctuary for introspective wanderers. Books that capture midnight streets, unfinished manuscripts, and the sublime peace of solitude.",
    curatorNote:
      "Read slowly, preferably late at night with a quiet cup of tea or dark brew.",
    estimatedTotalHours: 26,
    steps: [
      {
        bookId: 19, // The Book of Disquiet
        stepNumber: 1,
        stageTitle: "The Factless Autobiography",
        reflectionPrompt:
          "Bernardo Soares records the rain falling on Lisbon and the immense universe inside a quiet office clerk.",
      },
      {
        bookId: 34, // The Tartar Steppe
        stepNumber: 2,
        stageTitle: "Waiting at the Edge of the Desert",
        reflectionPrompt:
          "Giovanni Drogo waits at Fort Bastiani for glory that never comes, while youth quietly drains away.",
      },
      {
        bookId: 35, // Steppenwolf
        stepNumber: 3,
        stageTitle: "The Wolf of the Steppes",
        reflectionPrompt:
          "Harry Haller torn between bourgeois comfort and feral intellectual detachment: how to laugh at life?",
      },
      {
        bookId: 24, // On the Heights of Despair
        stepNumber: 4,
        stageTitle: "Lyrical Insomnia",
        reflectionPrompt:
          "Written at age twenty-two during agonizing sleepless nights, Cioran transforms sorrow into sheer incandescent prose.",
      },
    ],
  },
];

export function getJourneyById(id: string): ReadingJourney | undefined {
  return READING_JOURNEYS.find((j) => j.id === id);
}
