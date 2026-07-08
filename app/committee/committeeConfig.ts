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
    members: generateMembers(20),
  },
];
