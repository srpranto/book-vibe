import { getBookById } from "./books";
import type { Book } from "@/types/book.type";

export interface KinshipConnection {
  targetBookId: number;
  connectionType: "Dialogue" | "Influence" | "Philosophical Counterpart" | "Shared Sensibility";
  rationale: string;
}

const KINSHIP_MAP: Record<number, KinshipConnection[]> = {
  1: [
    {
      targetBookId: 4, // The Stranger
      connectionType: "Dialogue",
      rationale:
        "Where Josef K. fruitlessly searches for rational cause in a faceless legal machine, Camus's Meursault confronts the courtroom's identical hunger to impose neat moral narratives on an indifferent world.",
    },
    {
      targetBookId: 21, // Nausea
      connectionType: "Philosophical Counterpart",
      rationale:
        "Sartre's existential dread of physical existence directly echoes Kafka's claustrophobic sense that modern humans are perpetual defendants before an unnamable court.",
    },
  ],
  2: [
    {
      targetBookId: 14, // Notes from Underground
      connectionType: "Influence",
      rationale:
        "Gregor Samsa's quiet, helpless metamorphosis is the tragic physical incarnation of the Underground Man's spiteful self-confinement from polite society.",
    },
    {
      targetBookId: 19, // The Book of Disquiet
      connectionType: "Shared Sensibility",
      rationale:
        "Both Kafka and Pessoa capture the fragile dignity of commercial clerks who discover enormous, terrifying psychological landscapes inside small rooms.",
    },
  ],
  4: [
    {
      targetBookId: 5, // The Myth of Sisyphus
      connectionType: "Dialogue",
      rationale:
        "The philosophical treatise written simultaneously with The Stranger: while Meursault lives the absurdity of life, Sisyphus explains why living it lucidly is supreme revolt.",
    },
    {
      targetBookId: 13, // Crime and Punishment
      connectionType: "Philosophical Counterpart",
      rationale:
        "Dostoevsky's Raskolnikov kills for a grandiose theory and is crushed by conscience; Camus's Meursault shoots because the sun is in his eyes, defying society's moral formulas.",
    },
  ],
  5: [
    {
      targetBookId: 28, // The Sickness Unto Death
      connectionType: "Dialogue",
      rationale:
        "Camus and Kierkegaard arrive at the exact same cliff edge of absurdity. Kierkegaard takes the leap of faith; Camus demands that the mind never leap, but stay and rebel.",
    },
  ],
  8: [
    {
      targetBookId: 80, // The Secrets of the Self
      connectionType: "Influence",
      rationale:
        "Allama Iqbal admired Nietzsche's fiery critique of passive quietism, but steered the will to power toward a spiritual revitalization of the soul (Khudi).",
    },
    {
      targetBookId: 9, // Beyond Good and Evil
      connectionType: "Dialogue",
      rationale:
        "The prose counterpart to Zarathustra's poetry: Nietzsche strips away the comfort of dogmatic morality to forge thinkers who love danger and free thought.",
    },
  ],
  13: [
    {
      targetBookId: 9, // Beyond Good and Evil
      connectionType: "Dialogue",
      rationale:
        "Nietzsche famously proclaimed that Dostoevsky was 'the only psychologist from whom I had something to learn.' Raskolnikov's Napoleon delusion prefigures the Übermensch.",
    },
    {
      targetBookId: 15, // The Brothers Karamazov
      connectionType: "Philosophical Counterpart",
      rationale:
        "Raskolnikov's solitary crime broadens into Ivan Karamazov's universal indictment of human suffering and divine justice.",
    },
  ],
  14: [
    {
      targetBookId: 21, // Nausea
      connectionType: "Influence",
      rationale:
        "The Underground Man's paradoxical spite is the direct progenitor of Sartre's Roquentin, who recoils at the smooth, hypocritical self-satisfaction of respectable society.",
    },
  ],
  15: [
    {
      targetBookId: 63, // Deliverance from Error
      connectionType: "Shared Sensibility",
      rationale:
        "Both Dostoevsky and Al-Ghazali walked through the harrowing furnace of intellectual doubt before recognizing that pure syllogisms cannot heal a suffering human heart.",
    },
  ],
  18: [
    {
      targetBookId: 34, // The Tartar Steppe
      connectionType: "Shared Sensibility",
      rationale:
        "Tolstoy shows the tragedy of a life that lived according to bourgeois expectations; Buzzati shows the tragedy of a soldier waiting for a glorious battle that never arrives.",
    },
  ],
  19: [
    {
      targetBookId: 24, // On the Heights of Despair
      connectionType: "Shared Sensibility",
      rationale:
        "Written in Lisbon and Bucharest respectively, both Pessoa and Cioran elevate midnight sleeplessness, loneliness, and the beauty of melancholy into sublime art.",
    },
  ],
  44: [
    {
      targetBookId: 46, // The Home and the World
      connectionType: "Dialogue",
      rationale:
        "Tagore's twin masterworks exploring the conflict between fierce nationalist orthodoxy and universal humanist ethics in colonial Bengal.",
    },
    {
      targetBookId: 52, // Srikanta
      connectionType: "Shared Sensibility",
      rationale:
        "Tagore and Sarat Chandra capture the caste constraints, social hypocrisies, and quiet moral resilience of early 20th-century Bengali society.",
    },
  ],
  47: [
    {
      targetBookId: 49, // Aranyak
      connectionType: "Shared Sensibility",
      rationale:
        "Bibhutibhushan's lyrical reverence for nature: from the village thickets of Nischindipur to the primeval forests of Bihar, nature is an intimate living presence.",
    },
    {
      targetBookId: 55, // Padma Nadir Majhi
      connectionType: "Philosophical Counterpart",
      rationale:
        "Where Bibhutibhushan sees gentle poetry in rural struggles, Manik Bandopadhyay brings fierce, uncompromising social realism and elemental hunger.",
    },
  ],
  63: [
    {
      targetBookId: 73, // The Decisive Treatise
      connectionType: "Dialogue",
      rationale:
        "The grand classical dialogue of Islamic civilization: Al-Ghazali questions the limits of Greek philosophical metaphysics, and Ibn Rushd provides the counter-defense.",
    },
    {
      targetBookId: 72, // Hayy ibn Yaqdhan
      connectionType: "Philosophical Counterpart",
      rationale:
        "Ibn Tufayl's famous philosophical novel demonstrates that natural human reason, left uncorrupted by societal prejudice, arrives at spiritual enlightenment.",
    },
  ],
  65: [
    {
      targetBookId: 87, // Lost Islamic History
      connectionType: "Dialogue",
      rationale:
        "Ibn Khaldun's foundational theories of Asabiyyah (social cohesion) and dynastic cycles provide the interpretive lens for tracing 1,400 years of Islamic civilization.",
    },
  ],
  67: [
    {
      targetBookId: 68, // The Conference of the Birds
      connectionType: "Shared Sensibility",
      rationale:
        "Rumi and Attar represent the pinnacle of Persian Sufi poetry: journeying through longing, annihilation of the ego, and finding the Divine within.",
    },
  ],
  80: [
    {
      targetBookId: 67, // The Masnavi
      connectionType: "Influence",
      rationale:
        "Iqbal took Rumi as his spiritual master (Pir-e-Rumi), modernizing classical Sufi intuition to summon Eastern consciousness out of colonial lethargy.",
    },
  ],
  84: [
    {
      targetBookId: 81, // The Road to Mecca
      connectionType: "Dialogue",
      rationale:
        "Two extraordinary spiritual journeys across continents and identities: Muhammad Asad from Austrian journalism, and Malcolm X from Harlem to Mecca, finding true brotherhood.",
    },
  ],
};

export interface ResolvedKinship {
  book: Book;
  connectionType: KinshipConnection["connectionType"];
  rationale: string;
}

export function getKinshipForBook(bookId: number): ResolvedKinship[] {
  const connections = KINSHIP_MAP[bookId];
  if (connections && connections.length > 0) {
    const resolved: ResolvedKinship[] = [];
    for (const c of connections) {
      const b = getBookById(c.targetBookId);
      if (b) {
        resolved.push({
          book: b,
          connectionType: c.connectionType,
          rationale: c.rationale,
        });
      }
    }
    if (resolved.length > 0) return resolved;
  }

  // Fallback: smart thematic connection if book doesn't have an explicit kinship entry
  const current = getBookById(bookId);
  if (!current) return [];

  return [];
}
