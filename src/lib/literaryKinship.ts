import { getBookById, getAllBooks } from "./books";
import { getDeterministicWorkBookId } from "./openLibrary";
import type { Book } from "@/types/book.type";

interface KinshipConnection {
  targetBookId: number;
  connectionType:
    | "Dialogue"
    | "Influence"
    | "Philosophical Counterpart"
    | "Shared Sensibility";
  rationale: string;
}

const KINSHIP_MAP: Record<number, KinshipConnection[]> = {
  // Franz Kafka - The Metamorphosis (OL262758W)
  [getDeterministicWorkBookId("OL262758W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL338947W"),
      connectionType: "Influence",
      rationale:
        "Gregor Samsa's quiet psychological alienation echoes Raskolnikov's feverish guilt and estrangement from society.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL24033W"),
      connectionType: "Philosophical Counterpart",
      rationale:
        "Both works examine an irreversible bodily and mental transformation that exposes the fragility of bourgeois domesticity.",
    },
  ],

  // Fyodor Dostoevsky - Crime and Punishment (OL338947W)
  [getDeterministicWorkBookId("OL338947W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL345719W"),
      connectionType: "Dialogue",
      rationale:
        "Raskolnikov transgresses morality for an intellectual theory; Dorian Gray transgresses it for aesthetic pleasure. Both are consumed from within.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL262758W"),
      connectionType: "Shared Sensibility",
      rationale:
        "Both authors excavate the claustrophobic psychology of small rooms and the profound burden of conscience.",
    },
  ],

  // Oscar Wilde - The Picture of Dorian Gray (OL345719W)
  [getDeterministicWorkBookId("OL345719W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL24033W"),
      connectionType: "Dialogue",
      rationale:
        "Written in the same Victorian decade, both explore the moral horror of a hidden, degrading double self shielded from public scrutiny.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL450063W"),
      connectionType: "Philosophical Counterpart",
      rationale:
        "Frankenstein creates an external monstrous mirror; Dorian Gray creates an internal one locked behind an attic door.",
    },
  ],

  // Mary Shelley - Frankenstein (OL450063W)
  [getDeterministicWorkBookId("OL450063W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL85892W"),
      connectionType: "Influence",
      rationale:
        "The gothic archetypes of Shelley and Stoker define the boundaries between human science, primal mortality, and existential dread.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL52267W"),
      connectionType: "Dialogue",
      rationale:
        "Shelley warns of the ethical perils of scientific hubris at the dawn of the industrial age; Wells projects its distant, terrifying conclusion.",
    },
  ],

  // Bram Stoker - Dracula (OL85892W)
  [getDeterministicWorkBookId("OL85892W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL450063W"),
      connectionType: "Dialogue",
      rationale:
        "Both masterpieces interrogate the collision between modern Victorian rationalism and ancient, unconquerable shadows.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL21177W"),
      connectionType: "Shared Sensibility",
      rationale:
        "Both works summon a dark, supernatural intensity where passion, death, and bleak landscapes intertwine.",
    },
  ],

  // Charlotte Brontë - Jane Eyre (OL1095427W)
  [getDeterministicWorkBookId("OL1095427W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL21177W"),
      connectionType: "Shared Sensibility",
      rationale:
        "Sisters writing across the Yorkshire moors: Charlotte examines moral resilience and moral self-determination; Emily explores destructive, untamable passion.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL66554W"),
      connectionType: "Dialogue",
      rationale:
        "Jane Eyre's passionate moral independence enters into profound dialogue with Elizabeth Bennet's quick wit and social resistance.",
    },
  ],

  // Emily Brontë - Wuthering Heights (OL21177W)
  [getDeterministicWorkBookId("OL21177W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL1095427W"),
      connectionType: "Shared Sensibility",
      rationale:
        "The sister novels of Haworth Parsonage: one governed by unyielding ethical integrity, the other by elemental, untamed fury.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL85892W"),
      connectionType: "Influence",
      rationale:
        "Heathcliff's demonic ferocity and spectral haunting anticipate the dark gothic magnetism of the Victorian vampire.",
    },
  ],

  // Jane Austen - Pride and Prejudice (OL66554W)
  [getDeterministicWorkBookId("OL66554W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL1095427W"),
      connectionType: "Dialogue",
      rationale:
        "Both celebrate heroine protagonists who refuse marriages of mere financial convenience, demanding intellectual and emotional equality.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL468431W"),
      connectionType: "Philosophical Counterpart",
      rationale:
        "Austen dissects social class and pride with sparkling irony; Fitzgerald observes the tragic illusion of social climbing in the Jazz Age.",
    },
  ],

  // Marcus Aurelius - Meditations (OL44337W)
  [getDeterministicWorkBookId("OL44337W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL257618W"),
      connectionType: "Philosophical Counterpart",
      rationale:
        "Marcus Aurelius advises rulers to govern from inner virtue and duty; Machiavelli insists that survival requires pragmatic realism and worldly cunning.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL12297W"),
      connectionType: "Shared Sensibility",
      rationale:
        "Both provide profound spiritual contemplation on acceptance, the brevity of mortal life, and living in harmony with nature.",
    },
  ],

  // Niccolò Machiavelli - The Prince (OL257618W)
  [getDeterministicWorkBookId("OL257618W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL44337W"),
      connectionType: "Dialogue",
      rationale:
        "The great debate of European statecraft: Stoic virtue and inner justice versus pragmatic political survival and realpolitik.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL9170454W"),
      connectionType: "Philosophical Counterpart",
      rationale:
        "Machiavelli teaches how rulers must act decisively without moral squeamishness; Hamlet embodies the paralysis caused by overthinking moral consequence.",
    },
  ],

  // William Shakespeare - Hamlet (OL9170454W)
  [getDeterministicWorkBookId("OL9170454W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL9170453W"),
      connectionType: "Shared Sensibility",
      rationale:
        "Shakespearean masterworks exploring how generational guilt, royal politics, and fateful choices ensnare youthful innocence.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL338947W"),
      connectionType: "Influence",
      rationale:
        "Hamlet's relentless self-interrogation and moral fever directly anticipated Dostoevsky's psychological interiority in Crime and Punishment.",
    },
  ],

  // Homer - The Odyssey (OL103133W)
  [getDeterministicWorkBookId("OL103133W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL45089W"),
      connectionType: "Influence",
      rationale:
        "The ancient archetype of the solitary traveler confronting the sea and unknown shores laid the foundation for Defoe's castaway narrative.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL24034W"),
      connectionType: "Dialogue",
      rationale:
        "Both capture the irresistible siren call of uncharted waters, high adventure, and the triumph of human wits over peril.",
    },
  ],

  // Daniel Defoe - Robinson Crusoe (OL45089W)
  [getDeterministicWorkBookId("OL45089W")]: [
    {
      targetBookId: getDeterministicWorkBookId("OL103133W"),
      connectionType: "Influence",
      rationale:
        "Defoe transforms Odysseus's mythical sea trials into a modern, empirical narrative of survival, labor, and faith.",
    },
    {
      targetBookId: getDeterministicWorkBookId("OL52267W"),
      connectionType: "Philosophical Counterpart",
      rationale:
        "Crusoe rebuilds human order on a deserted island; Wells's Time Traveller discovers humanity's distant descendents having abandoned all labor and intellect.",
    },
  ],
};

export interface ResolvedKinship {
  book: Book;
  connectionType: KinshipConnection["connectionType"];
  rationale: string;
}

export function getKinshipForBook(
  bookId: number,
  category?: string,
  bookName?: string,
): ResolvedKinship[] {
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

  const allBooks = getAllBooks();
  const matched = allBooks
    .filter((b) => b.bookId !== bookId)
    .filter(
      (b) =>
        category &&
        (b.category.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(b.category.toLowerCase())),
    )
    .slice(0, 2);

  const fallbackBooks = matched.length > 0 ? matched : allBooks.slice(0, 2);

  return fallbackBooks.map((b, idx) => ({
    book: b,
    connectionType: (idx === 0
      ? "Shared Sensibility"
      : "Philosophical Counterpart") as KinshipConnection["connectionType"],
    rationale: `Both ${
      bookName ? `"${bookName}"` : "this work"
    } and "${b.bookName}" explore foundational human dilemmas, psychological interiority, and enduring literary depth across classic traditions.`,
  }));
}
