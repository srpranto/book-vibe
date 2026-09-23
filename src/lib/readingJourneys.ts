import { getDeterministicWorkBookId } from "./openLibrary";

interface JourneyStep {
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
    id: "existential-psychology",
    title: "The Existential & Psychological Odyssey",
    subtitle: "From Alienation & Guilt to Dual Selves",
    badge: "Psychological Fiction",
    emoji: "🪨",
    themeColor: "from-primary/15 to-secondary/10",
    description:
      "A guided traversal through the architecture of modern dread, moral reckoning, divided consciousness, and the defiance of the human spirit.",
    curatorNote:
      "Begin with Samsa's quiet alienation, descend into Raskolnikov's feverish guilt, confront Dorian Gray's vanity, and conclude with the dark duality of Jekyll and Hyde.",
    estimatedTotalHours: 24,
    steps: [
      {
        bookId: getDeterministicWorkBookId("OL262758W"),
        stepNumber: 1,
        stageTitle: "The Fracture of Ordinary Life",
        reflectionPrompt:
          "How does Kafka portray estrangement not as an external tragedy, but as the quiet rupture of routine?",
      },
      {
        bookId: getDeterministicWorkBookId("OL338947W"),
        stepNumber: 2,
        stageTitle: "The Extraordinary Man Delusion",
        reflectionPrompt:
          "Raskolnikov tests whether superior minds stand above morality, only to be crushed by conscience. What redeems him?",
      },
      {
        bookId: getDeterministicWorkBookId("OL345719W"),
        stepNumber: 3,
        stageTitle: "The Vanity of the Unblemished Face",
        reflectionPrompt:
          "When aesthetic beauty is decoupled from moral consequence, does art liberate life or corrupt it?",
      },
      {
        bookId: getDeterministicWorkBookId("OL24033W"),
        stepNumber: 4,
        stageTitle: "The Severed Self",
        reflectionPrompt:
          "Stevenson reveals that man is not truly one, but truly two. What happens when society demands the suppression of the shadow self?",
      },
    ],
  },
  {
    id: "philosophy-power-soul",
    title: "Philosophy, Power & the Soul",
    subtitle: "Stoic Duty, Statecraft & Spiritual Illumination",
    badge: "Philosophy & Thought",
    emoji: "🏛️",
    themeColor: "from-[#4A3B2C]/15 to-primary/10",
    description:
      "Trace the grand spectrum of human governance—from the private Stoic meditations of an emperor to Machiavellian realism and mystical spiritual wisdom.",
    curatorNote:
      "From Marcus Aurelius's self-mastery in camp to Machiavelli's cold pragmatic counsel and Gibran's timeless poetic contemplation of love and freedom.",
    estimatedTotalHours: 22,
    steps: [
      {
        bookId: getDeterministicWorkBookId("OL44337W"),
        stepNumber: 1,
        stageTitle: "The Citadel of the Mind",
        reflectionPrompt:
          "How does Marcus Aurelius find stillness and ethical resolve amidst plague, betrayal, and the burdens of rule?",
      },
      {
        bookId: getDeterministicWorkBookId("OL257618W"),
        stepNumber: 2,
        stageTitle: "The Calculus of Power",
        reflectionPrompt:
          "Machiavelli insists on the effective truth of things rather than imaginary republics. Is political morality distinct from personal ethics?",
      },
      {
        bookId: getDeterministicWorkBookId("OL12297W"),
        stepNumber: 3,
        stageTitle: "The Poetry of Being",
        reflectionPrompt:
          "Almustafa speaks on work, joy, sorrow, and time. How does poetry bridge the gulf between solitude and community?",
      },
      {
        bookId: getDeterministicWorkBookId("OL503666W"),
        stepNumber: 4,
        stageTitle: "The Knight of the Sorrowful Countenance",
        reflectionPrompt:
          "Don Quixote tilts at windmills for an ideal world. Is madness in pursuit of honor nobler than cynical sanity?",
      },
    ],
  },
  {
    id: "gothic-shadows-passion",
    title: "Gothic Shadows & Tempestuous Passion",
    subtitle: "Hubris, Monsters & Defiant Love",
    badge: "Gothic Masterpieces",
    emoji: "🕯️",
    themeColor: "from-[#5B3315]/15 to-primary/10",
    description:
      "Enter the storm-swept moors, dark castles, and electric laboratories of 19th-century gothic romance and terror.",
    curatorNote:
      "Witness Mary Shelley's tragic Creature, Stoker's nocturnal predator, and the fiercely independent spirits of the Brontë sisters.",
    estimatedTotalHours: 28,
    steps: [
      {
        bookId: getDeterministicWorkBookId("OL450063W"),
        stepNumber: 1,
        stageTitle: "The Modern Prometheus",
        reflectionPrompt:
          "Who is the true monster: the creature created and abandoned, or the scientist consumed by unchecked ambition?",
      },
      {
        bookId: getDeterministicWorkBookId("OL85892W"),
        stepNumber: 2,
        stageTitle: "The Shadow from the East",
        reflectionPrompt:
          "Count Dracula invades Victorian England not just with claws, but with ancient bloodlines and psychological contagion.",
      },
      {
        bookId: getDeterministicWorkBookId("OL1095427W"),
        stepNumber: 3,
        stageTitle: "Integrity Against the World",
        reflectionPrompt:
          "Jane Eyre asserts: 'I am a free human being with an independent will.' How does her moral spine withstand Thornfield's secrets?",
      },
      {
        bookId: getDeterministicWorkBookId("OL21177W"),
        stepNumber: 4,
        stageTitle: "The Heath of Consuming Love",
        reflectionPrompt:
          "Catherine and Heathcliff's bond transcends morality, marriage, and mortality. Is their connection demonic or transcendent?",
      },
    ],
  },
  {
    id: "epics-and-horizons",
    title: "Grand Epics & Far Horizons",
    subtitle: "Ancient Odysseys, Castaways & the Edge of Time",
    badge: "Adventure & Odyssey",
    emoji: "🌊",
    themeColor: "from-[#2C1810]/20 to-muted-foreground/15",
    description:
      "Voyage beyond known maps—from Homer's wine-dark Mediterranean to desert islands, pirate treasures, and the distant year 802,701 AD.",
    curatorNote:
      "A thrilling sequence of human resilience, survival against nature, cunning intellect, and speculative futures.",
    estimatedTotalHours: 26,
    steps: [
      {
        bookId: getDeterministicWorkBookId("OL103133W"),
        stepNumber: 1,
        stageTitle: "The Homecoming of the Wily Wanderer",
        reflectionPrompt:
          "Odysseus relies on metis (cunning) more than raw strength. What does his journey reveal about the hunger for home?",
      },
      {
        bookId: getDeterministicWorkBookId("OL45089W"),
        stepNumber: 2,
        stageTitle: "The Sovereign Castaway",
        reflectionPrompt:
          "Robinson Crusoe rebuilds civilization from wreckage. What are the limits of rational self-reliance on an isolated island?",
      },
      {
        bookId: getDeterministicWorkBookId("OL24034W"),
        stepNumber: 3,
        stageTitle: "Sails, Cutlasses & Silver's Shadow",
        reflectionPrompt:
          "Long John Silver shifts between charming sea-cook and ruthless mutineer. Why is he one of fiction's most magnetic rogues?",
      },
      {
        bookId: getDeterministicWorkBookId("OL52267W"),
        stepNumber: 4,
        stageTitle: "The Dying Sunset of the Earth",
        reflectionPrompt:
          "Wells's Time Traveller looks into the deep future of humanity divided. What is his warning to industrial society?",
      },
    ],
  },
  {
    id: "social-canvas-and-wit",
    title: "The Social Canvas & The Play of Life",
    subtitle: "Regency Wit, Shakespearean Tragedy & Modern Illusions",
    badge: "Classic Drama & Wit",
    emoji: "🎭",
    themeColor: "from-secondary/20 to-primary/10",
    description:
      "Delve into human character through brilliant dialogue, social satire, romantic comedy, and the tragic illusions of ambition.",
    curatorNote:
      "From Austen's razor-sharp Regency parlors to Hamlet's castle ramparts and Gatsby's glittering green light.",
    estimatedTotalHours: 25,
    steps: [
      {
        bookId: getDeterministicWorkBookId("OL66554W"),
        stepNumber: 1,
        stageTitle: "First Impressions & Chastened Pride",
        reflectionPrompt:
          "Elizabeth Bennet must overcome prejudice while Darcy must dismantle pride. What makes their dialogue timelessly modern?",
      },
      {
        bookId: getDeterministicWorkBookId("OL9170454W"),
        stepNumber: 2,
        stageTitle: "The Traitor Within the Mind",
        reflectionPrompt:
          "Hamlet hesitates not because he is weak, but because he sees all moral consequences simultaneously. What is the price of awareness?",
      },
      {
        bookId: getDeterministicWorkBookId("OL32466W"),
        stepNumber: 3,
        stageTitle: "Reclaiming the Human Heart",
        reflectionPrompt:
          "Scrooge sees his past, present, and unmourned future. Can a hardened heart truly be renewed in a single night?",
      },
      {
        bookId: getDeterministicWorkBookId("OL468431W"),
        stepNumber: 4,
        stageTitle: "The Green Light Across the Bay",
        reflectionPrompt:
          "Gatsby believes he can repeat the past through pure will and spectacle. What causes his tragic unraveling?",
      },
    ],
  },
];
