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
    full_name: "Audria",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/audria2.jpg",
    second_image: "/images/committee/bfm/audria1.jpg",
  },
  {
    name: "Christian",
    full_name: "Christian",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/christian2.jpg",
    second_image: "/images/committee/bfm/christian1.jpg",
  },
  {
    name: "Daniel",
    full_name: "Daniel",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/daniel2.jpg",
    second_image: "/images/committee/bfm/daniel1.jpg",
  },
  {
    name: "Donni",
    full_name: "Donni",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/donni2.jpg",
    second_image: "/images/committee/bfm/donni1.jpg",
  },
  {
    name: "Ivonne",
    full_name: "Ivonne",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/ivonne2.jpg",
    second_image: "/images/committee/bfm/ivonne1.jpg",
  },
  {
    name: "Keenan",
    full_name: "Keenan",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/keenan2.jpg",
    second_image: "/images/committee/bfm/keenan1.jpg",
  },
  {
    name: "Melly",
    full_name: "Melly",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/melly2.jpg",
    second_image: "/images/committee/bfm/melly1.jpg",
  },
  {
    name: "Michelle",
    full_name: "Michelle",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/michelle1.jpg",
    second_image: "/images/committee/bfm/michelle2.jpg",
  },
  {
    name: "Nicholas",
    full_name: "Nicholas",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/nicholas2.jpg",
    second_image: "/images/committee/bfm/nicholas1.jpg",
  },
  {
    name: "Owen",
    full_name: "Owen",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/owen2.jpg",
    second_image: "/images/committee/bfm/owen1.jpg",
  },
  {
    name: "Stephanie",
    full_name: "Stephanie",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/stephanie2.jpg",
    second_image: "/images/committee/bfm/stephanie1.jpg",
  },
  {
    name: "Vincentius",
    full_name: "Vincentius",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/vincentius2.jpg",
    second_image: "/images/committee/bfm/vincentius1.jpg",
  },
  {
    name: "Viony",
    full_name: "Viony",
    year_course: "",
    og: "",
    first_image: "/images/committee/bfm/viony2.jpg",
    second_image: "/images/committee/bfm/viony1.jpg",
  },
],
},
];