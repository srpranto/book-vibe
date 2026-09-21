export interface BookQuoteData {
  text: string;
  attribution: string;
}

const BOOK_QUOTES: Record<number, BookQuoteData> = {
  1: {
    text: "Like a dog! he said; it was as if the shame of it must outlive him.",
    attribution: "Franz Kafka, The Trial",
  },
  2: {
    text: "I cannot make you understand. I cannot make anyone understand what is happening inside me. I cannot even explain it to myself.",
    attribution: "Franz Kafka, The Metamorphosis",
  },
  3: {
    text: "You misinterpret everything, even the silence.",
    attribution: "Franz Kafka, The Castle",
  },
  4: {
    text: "I opened myself to the gentle indifference of the world.",
    attribution: "Albert Camus, The Stranger",
  },
  5: {
    text: "The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy.",
    attribution: "Albert Camus, The Myth of Sisyphus",
  },
  6: {
    text: "Don't wait for the Last Judgment. It takes place every day.",
    attribution: "Albert Camus, The Fall",
  },
  7: {
    text: "Each of us has the plague within him; no one, no one on earth is free from it.",
    attribution: "Albert Camus, The Plague",
  },
  8: {
    text: "I tell you: one must still have chaos in oneself to give birth to a dancing star.",
    attribution: "Friedrich Nietzsche, Thus Spoke Zarathustra",
  },
  9: {
    text: "He who fights with monsters should look to it that he himself does not become a monster. And if you gaze long into an abyss, the abyss also gazes into you.",
    attribution: "Friedrich Nietzsche, Beyond Good and Evil",
  },
  10: {
    text: "We are unknown to ourselves, we men of knowledge—and with good reason.",
    attribution: "Friedrich Nietzsche, On the Genealogy of Morality",
  },
  11: {
    text: "Without music, life would be a mistake.",
    attribution: "Friedrich Nietzsche, The Gay Science",
  },
  12: {
    text: "Art is the proper task of life.",
    attribution: "Friedrich Nietzsche, The Birth of Tragedy",
  },
  13: {
    text: "Pain and suffering are always inevitable for a large intelligence and a deep heart.",
    attribution: "Fyodor Dostoevsky, Crime and Punishment",
  },
  14: {
    text: "I say let the world go to hell, but I should always have my tea.",
    attribution: "Fyodor Dostoevsky, Notes from Underground",
  },
  15: {
    text: "What is hell? I maintain that it is the suffering of being unable to love.",
    attribution: "Fyodor Dostoevsky, The Brothers Karamazov",
  },
  16: {
    text: "Man is unhappy because he doesn't know he's happy; only because of that.",
    attribution: "Fyodor Dostoevsky, Demons",
  },
  17: {
    text: "To think too much is a disease.",
    attribution: "Fyodor Dostoevsky, The Double",
  },
  18: {
    text: "Ivan Ilych's life had been most simple and most ordinary and therefore most terrible.",
    attribution: "Leo Tolstoy, The Death of Ivan Ilyich",
  },
  19: {
    text: "My past is everything I failed to be.",
    attribution: "Fernando Pessoa, The Book of Disquiet",
  },
  20: {
    text: "Everything in the world began with a yes.",
    attribution: "Clarice Lispector, The Hour of the Star",
  },
  21: {
    text: "My thought is me: that's why I can't stop.",
    attribution: "Jean-Paul Sartre, Nausea",
  },
  22: {
    text: "Hell is—other people!",
    attribution: "Jean-Paul Sartre, No Exit",
  },
  23: {
    text: "The spectacle of downfall prevails over that of death: all beings die; only man has the vocation to fall.",
    attribution: "Emil Cioran, The Fall into Time",
  },
  24: {
    text: "I have no ideas, only obsessions. Ideas are things anyone can have.",
    attribution: "Emil Cioran, On the Heights of Despair",
  },
  25: {
    text: "It is not worth the bother of killing yourself, since you always kill yourself too late.",
    attribution: "Emil Cioran, The Trouble with Being Born",
  },
  26: {
    text: "Life can only be understood backwards; but it must be lived forwards.",
    attribution: "Søren Kierkegaard, Either/Or",
  },
  27: {
    text: "If anyone on the verge of action should judge himself according to the outcome, he would never begin.",
    attribution: "Søren Kierkegaard, Fear and Trembling",
  },
  28: {
    text: "The greatest hazard of all, losing one's self, can occur very quietly in the world, as if it were nothing at all.",
    attribution: "Søren Kierkegaard, The Sickness Unto Death",
  },
  29: {
    text: "The life of every individual, viewed as a whole, is really a tragedy; but gone through in detail it has the character of a comedy.",
    attribution: "Arthur Schopenhauer, The World as Will and Representation",
  },
  30: {
    text: "When the heart speaks, the mind finds it indecent to object.",
    attribution: "Milan Kundera, The Unbearable Lightness of Being",
  },
  31: {
    text: "Every choice has its obverse, a renunciation, and so there is no difference between the acts we perform and those we refrain from.",
    attribution: "Italo Calvino, The Castle of Crossed Destinies",
  },
  32: {
    text: "We always find something, eh Didi, to give us the impression we exist.",
    attribution: "Samuel Beckett, Waiting for Godot",
  },
  33: {
    text: "The end is in the beginning and yet you go on.",
    attribution: "Samuel Beckett, Endgame",
  },
  34: {
    text: "Everything goes by — men, the seasons, the clouds — and there is no use clinging to the stones.",
    attribution: "Dino Buzzati, The Tartar Steppe",
  },
  35: {
    text: "Solitude is independence.",
    attribution: "Hermann Hesse, Steppenwolf",
  },
  36: {
    text: "The bird fights its way out of the egg. The egg is the world. Who would be born must first destroy a world.",
    attribution: "Hermann Hesse, Demian",
  },
  37: {
    text: "It is love, not reason, that is stronger than death.",
    attribution: "Thomas Mann, The Magic Mountain",
  },
  38: {
    text: "In theory we understand people, but in practice we can't put up with them.",
    attribution: "Thomas Bernhard, The Loser",
  },
  39: {
    text: "She only wants to be an instrument on which he will teach himself to play.",
    attribution: "Elfriede Jelinek, The Piano Teacher",
  },
  40: {
    text: "This is the great lesson the depressive learns: Nothing in the world is inherently compelling.",
    attribution: "Thomas Ligotti, The Conspiracy Against the Human Race",
  },
  41: {
    text: "Beauty will save the world.",
    attribution: "Fyodor Dostoevsky, The Idiot",
  },
  42: {
    text: "I rebel—therefore we exist.",
    attribution: "Albert Camus, The Rebel",
  },
  43: {
    text: "Deliverance is not for me in renunciation. I feel the embrace of freedom in a thousand bonds of delight.",
    attribution: "Rabindranath Tagore, Gitanjali",
  },
  44: {
    text: "Where one loves, one can follow without agreeing—one can surrender oneself with eyes open.",
    attribution: "Rabindranath Tagore, Gora",
  },
  45: {
    text: "The pain of dwelling on the wrongs done to us by other people far exceeds the little bit of pleasure we derive from condemning others.",
    attribution: "Rabindranath Tagore, Chokher Bali",
  },
  46: {
    text: "I am willing to serve my country, but my worship I reserve for Right which is far greater than my country.",
    attribution: "Rabindranath Tagore, The Home and the World",
  },
  47: {
    text: "Life is so sweet just because so much of this sweetness is made of dreams and imagination.",
    attribution: "Bibhutibhushan Bandyopadhyay, Pather Panchali",
  },
  48: {
    text: "The forest, the mountains, the unknown horizon — these are the only things worth living for.",
    attribution: "Bibhutibhushan Bandyopadhyay, Chander Pahar",
  },
  49: {
    text: "What does man want — improvement or happiness? What is the use of improvement if there is no happiness in it?",
    attribution: "Bibhutibhushan Bandyopadhyay, Aranyak",
  },
  50: {
    text: "I have decided never to love again. For one thing, it is very painful to love and lose.",
    attribution: "Sarat Chandra Chattopadhyay, Devdas",
  },
  51: {
    text: "No matter how bad a man becomes, no one stops him if he wants to be good; but why are all paths closed for us?",
    attribution: "Sarat Chandra Chattopadhyay, Parineeta",
  },
  52: {
    text: "The entire universe is full of truth. If falsehood exists anywhere, it is nowhere but in the human mind.",
    attribution: "Sarat Chandra Chattopadhyay, Srikanta",
  },
  53: {
    text: "I was not cheated, because I was able to love. But the one who was cheated is the one who could not love.",
    attribution: "Sarat Chandra Chattopadhyay, Charitraheen",
  },
  54: {
    text: "One should not say such things about anyone's caste. Caste is not something in one's own hands.",
    attribution: "Sarat Chandra Chattopadhyay, Palli Samaj",
  },
  55: {
    text: "Those who live in darkness are blinded by mild light.",
    attribution: "Manik Bandopadhyay, Padma Nadir Majhi",
  },
  56: {
    text: "Some believe, some do not. Those who believe do not verify truth or falsehood, and those who do not believe, do not either.",
    attribution: "Manik Bandopadhyay, Putul Nacher Itikatha",
  },
  57: {
    text: "Traveller, have you lost your way?",
    attribution: "Bankim Chandra Chatterjee, Kapalkundala",
  },
  58: {
    text: "Love is the only truth; all else is illusion.",
    attribution: "Bankim Chandra Chatterjee, Durgeshnandini",
  },
  59: {
    text: "All birds come home — all rivers — all transactions of this life end; only darkness remains, to sit face to face with Banalata Sen.",
    attribution: "Jibanananda Das, Banalata Sen",
  },
  60: {
    text: "Words alone — not songs — silence is weaving our lives.",
    attribution: "Manik Bandopadhyay, Diba-Ratrir Kabya",
  },
  61: {
    text: "On these grounds, he strove to resolve the longstanding problems, and gave humanity the chance to breathe a sigh of relief after a long exhausting journey.",
    attribution: "Safiur Rahman Mubarakpuri, The Sealed Nectar",
  },
  62: {
    text: "That gentleness and kindness were the very essence of his teaching. He kept saying: God is gentle and he loves gentleness.",
    attribution:
      "Martin Lings, Muhammad: His Life Based on the Earliest Sources",
  },
  63: {
    text: "I realized that reason is not a self-sufficient entity that can grasp all matters and solve all problems.",
    attribution: "Abu Hamid al-Ghazali, Deliverance from Error",
  },
  64: {
    text: "For surely it is not the eyes that are blind, but blinded are the hearts which are in the breasts.",
    attribution: "Abu Hamid al-Ghazali, The Beginning of Guidance",
  },
  65: {
    text: "The past resembles the future more than one drop of water resembles another.",
    attribution: "Ibn Khaldun, The Muqaddimah",
  },
  66: {
    text: "Travelling — it leaves you speechless, then turns you into a storyteller.",
    attribution: "Ibn Battuta, The Travels of Ibn Battuta",
  },
  67: {
    text: "The wound is the place where the Light enters you.",
    attribution: "Jalal al-Din Rumi, The Masnavi",
  },
  68: {
    text: "The Truth we seek is like a shoreless sea, of which your paradise is but a drop.",
    attribution: "Farid ud-Din Attar, The Conference of the Birds",
  },
  69: {
    text: "Human beings are members of a whole, in creation of one essence and soul. If one member is afflicted with pain, other members uneasy will remain.",
    attribution: "Saadi Shirazi, Gulistan (The Rose Garden)",
  },
  70: {
    text: "If the misery of others leaves you indifferent and with no feelings of sorrow, you cannot be called a human being.",
    attribution: "Saadi Shirazi, Bustan (The Orchard)",
  },
  71: {
    text: "I wish I could show you, when you are lonely or in darkness, the astonishing light of your own being.",
    attribution: "Hafez Shirazi, The Divan of Hafez",
  },
  72: {
    text: "The knowledge of anything is not acquired or complete unless it is known by its causes.",
    attribution: "Ibn Tufayl, Hayy ibn Yaqdhan",
  },
  73: {
    text: "Truth does not contradict truth.",
    attribution: "Ibn Rushd (Averroes), The Decisive Treatise",
  },
  74: {
    text: "The body's ills come from excess; the soul's from deficiency.",
    attribution: "Ibn Sina (Avicenna), The Canon of Medicine",
  },
  75: {
    text: "Actions are but by intentions, and every man shall have but that which he intended.",
    attribution: "Imam al-Nawawi, The Forty Hadith of al-Nawawi",
  },
  76: {
    text: "So set your face towards the religion of pure monotheism — that is the straight religion, but most men know not.",
    attribution: "Ibn Kathir, Stories of the Prophets",
  },
  77: {
    text: "Allah has made patience the means for attaining His love, His companionship, His help and support, and His good rewards.",
    attribution: "Ibn Qayyim al-Jawziyya, Patience and Gratitude",
  },
  78: {
    text: "The weak are dominated by their ego, the wise dominate their ego, and the intelligent are in a constant struggle against their ego.",
    attribution: "Hamza Yusuf, Purification of the Heart",
  },
  79: {
    text: "This world cannot break you — unless you give it permission. And it cannot own you unless you hand it the keys.",
    attribution: "Yasmin Mogahed, Reclaim Your Heart",
  },
  80: {
    text: "The highest art is that which awakens our dormant will-force, and nerves us to face the trials of life manfully.",
    attribution: "Sir Muhammad Iqbal, The Secrets of the Self",
  },
  81: {
    text: "Islam did not seem to be so much a religion in the popular sense of the word as, rather, a way of life.",
    attribution: "Muhammad Asad, The Road to Mecca",
  },
  82: {
    text: "The Quran is not a book in the ordinary sense of the word; it is a perpetual guidance for all humankind.",
    attribution: "Muhammad Asad, The Message of The Qur'an",
  },
  83: {
    text: "It is clear that if we are to fulfill our true function, we must first identify and then become our true selves.",
    attribution: "Charles Le Gai Eaton, Islam and the Destiny of Man",
  },
  84: {
    text: "I'm for truth, no matter who tells it. I'm for justice, no matter who it is for or against.",
    attribution: "Malcolm X, The Autobiography of Malcolm X",
  },
  85: {
    text: "Modesty is the way you deal with beauty, not the way you avoid it.",
    attribution: "Tariq Ramadan, In the Footsteps of the Prophet",
  },
  86: {
    text: "Beauty is at once a royal path to God and an impediment to reaching God if it is taken as a god in itself.",
    attribution: "Seyyed Hossein Nasr, The Heart of Islam",
  },
  87: {
    text: "Muslim and non-Muslim from across the world flocked to Baghdad to be part of Al-Ma'mun's project — the House of Wisdom.",
    attribution: "Firas Alkhateeb, Lost Islamic History",
  },
  88: {
    text: "Here are two enormous worlds side by side; what's remarkable is how little notice they have taken of each other.",
    attribution: "Tamim Ansary, Destiny Disrupted",
  },
  89: {
    text: "Religion is the story of faith — a common language with which a community can share their encounter with the Divine.",
    attribution: "Reza Aslan, No god but God",
  },
  90: {
    text: "Love is neither disapproved by Religion, nor prohibited by the Law; for every heart is in God's hands.",
    attribution: "Ibn Hazm, The Ring of the Dove",
  },
  91: {
    text: "I have seen battles and sieges, and the courage of men who knew they would not return.",
    attribution: "Usama ibn Munqidh, The Book of Contemplation",
  },
  92: {
    text: "I want to take my rightful share of life by force, I want to give lavishly, I want love to flow from my heart, to ripen and bear fruit.",
    attribution: "Tayeb Salih, Season of Migration to the North",
  },
  93: {
    text: "Memories soon obscured the entire present.",
    attribution: "Naguib Mahfouz, Palace Walk",
  },
  94: {
    text: "Perhaps a strong will can provide us with more than one future, but we will never have but one past from which there is no escape.",
    attribution: "Naguib Mahfouz, The Cairo Trilogy",
  },
  95: {
    text: "Fear does not prevent death. It prevents life.",
    attribution: "Naguib Mahfouz, Children of Gebelawi",
  },
  96: {
    text: "I don't want to be a tree; I want to be its meaning.",
    attribution: "Orhan Pamuk, My Name is Red",
  },
  97: {
    text: "Happiness is holding someone in your arms and knowing you hold the whole world.",
    attribution: "Orhan Pamuk, Snow",
  },
  98: {
    text: "For you, a thousand times over.",
    attribution: "Khaled Hosseini, The Kite Runner",
  },
  99: {
    text: "Like a compass needle that points north, a man's accusing finger always finds a woman.",
    attribution: "Khaled Hosseini, A Thousand Splendid Suns",
  },
  100: {
    text: "They say the occupier always loves the land he occupies, not because he loves what is in it, but because he wants it to be empty.",
    attribution: "Susan Abulhawa, Mornings in Jenin",
  },
};

export function getBookQuote(bookId: number): BookQuoteData {
  return (
    BOOK_QUOTES[bookId] ?? {
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      attribution: "George R.R. Martin",
    }
  );
}
