// ─── Committee Page Data Config ─────────────────────────────────
// Add / remove members and topics here. The page will update automatically.
// Place member photos in public/images/committee/<topic_folder>/

export interface CommitteeMember {
  name: string;           // Short name shown on card banner
  full_name: string;      // Full name in expanded view
  year_course: string;    // e.g. "Y2 / Computer Science"
  og: string;             // e.g. "OG 3"
  first_image: string;    // Front-facing photo path
  second_image: string;   // Alternate / fun photo path
}

export interface CommitteeTopic {
  title: string;                   // Banner title, e.g. "TOPS & MC"
  group_image: string;             // Group photo for the top banner
  members: CommitteeMember[];
}

// ─── Placeholder data — replace with real members ───────────────

const NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank",
  "Iris", "Jack", "Karen", "Leo", "Mia", "Noah", "Olivia", "Pete",
  "Quinn", "Ryan", "Sara", "Tom",
];

const placeholder = (name: string, i: number): CommitteeMember => ({
  name,
  full_name: `${name} Placeholder`,
  year_course: `Y${(i % 4) + 1} / Course`,
  og: `OG ${(i % 8) + 1}`,
  first_image: "/images/finn.png",
  second_image: "/images/jake.png",
});

/** Generate N placeholder members from the names pool */
const generateMembers = (count: number): CommitteeMember[] =>
  Array.from({ length: count }, (_, i) =>
    placeholder(NAMES[i % NAMES.length], i),
  );

export const committeeTopics: CommitteeTopic[] = [
  {
    title: "TOPS & MC",
    group_image: "/images/finn.png",
    members: generateMembers(20),
  },
  {
    title: "GL",
    group_image: "/images/finn.png",
    members: generateMembers(20),
  },
  {
    title: "PPIT",
    group_image: "/images/finn.png",
    members: generateMembers(20),
  },
  {
    title: "WELFARE",
    group_image: "/images/finn.png",
    members: generateMembers(20),
  },
  {
    title: "POLOG",
    group_image: "/images/finn.png",
    members: generateMembers(20),
  },
  {
    title: "BFM",
    group_image: "/images/finn.png",
    members: [
  {
    name: "Audria",
    full_name: "Audria Akbar",
    year_course: "",
    og: "",
    first_image: "/images/bfm/audria1.jpg",
    second_image: "/images/bfm/audria2.jpg",
  },
  {
    name: "Christian",
    full_name: "Christian Vilaril Tjendra",
    year_course: "",
    og: "",
    first_image: "/images/bfm/christian1.jpg",
    second_image: "/images/bfm/christian2.jpg",
  },
  {
    name: "Daniel",
    full_name: "Daniel Delin",
    year_course: "",
    og: "",
    first_image: "/images/bfm/daniel1.jpg",
    second_image: "/images/bfm/daniel2.jpg",
  },
  {
    name: "Donni",
    full_name: "Donni Putera Sow",
    year_course: "",
    og: "",
    first_image: "/images/bfm/donni1.jpg",
    second_image: "/images/bfm/donni2.jpg",
  },
  {
    name: "Ivonne",
    full_name: "Ivonne Wijaya",
    year_course: "",
    og: "",
    first_image: "/images/bfm/ivonne1.jpg",
    second_image: "/images/bfm/ivonne2.jpg",
  },
  {
    name: "Keenan",
    full_name: "Keenan Jonathan Maxwell",
    year_course: "",
    og: "",
    first_image: "/images/bfm/keenan1.jpg",
    second_image: "/images/bfm/keenan2.jpg",
  },
  {
    name: "Melly",
    full_name: "Melly Wibowo",
    year_course: "",
    og: "",
    first_image: "/images/bfm/melly1.jpg",
    second_image: "/images/bfm/melly2.jpg",
  },
  {
    name: "Michelle",
    full_name: "Michelle Joandra Hartanto",
    year_course: "",
    og: "",
    first_image: "/images/bfm/michelle1.jpg",
    second_image: "/images/bfm/michelle2.jpg",
  },
  {
    name: "Nicholas",
    full_name: "Nicholas Elbert Liem",
    year_course: "",
    og: "",
    first_image: "/images/bfm/nicholas1.jpg",
    second_image: "/images/bfm/nicholas2.jpg",
  },
  {
    name: "Owen",
    full_name: "Owen Nigel Tjiptarahardja",
    year_course: "",
    og: "",
    first_image: "/images/bfm/owen1.jpg",
    second_image: "/images/bfm/owen2.jpg",
  },
  {
    name: "Stephanie",
    full_name: "Stephanie Nathania Subari",
    year_course: "",
    og: "",
    first_image: "/images/bfm/stephanie1.jpg",
    second_image: "/images/bfm/stephanie2.jpg",
  },
  {
    name: "Vincentius",
    full_name: "Vincentius Farrel Bhaskoro Setyanto",
    year_course: "",
    og: "",
    first_image: "/images/bfm/vincentius1.jpg",
    second_image: "/images/bfm/vincentius2.jpg",
  },
  {
    name: "Viony",
    full_name: "Viony Prajogo",
    year_course: "",
    og: "",
    first_image: "/images/bfm/viony1.jpg",
    second_image: "/images/bfm/viony2.jpg",
  },
],
},
];