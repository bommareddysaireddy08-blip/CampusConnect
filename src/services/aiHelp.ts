import type { InstantHelpResult, StudyResource, FAQItem } from '../types/index.ts';

interface KnowledgeEntry {
  keywords: string[];
  subject: string;
  topic: string;
  summaryAnswer: string;
  detailedExplanation: string;
  resources: StudyResource[];
  relatedQuestions: string[];
}

export const ACADEMIC_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    subject: 'Operating Systems',
    topic: "Peterson's Algorithm & Memory Barriers",
    keywords: ['peterson', 'critical section', 'memory barrier', 'fence', 'race condition', 'synchronization', 'mfence', 'multi-core'],
    summaryAnswer: "Peterson's algorithm guarantees mutual exclusion under sequential consistency, but on modern out-of-order execution multi-core CPUs, hardware memory fences (e.g. `mfence` or atomic store-load barriers) are required to prevent memory reordering between `flag` and `turn` variables.",
    detailedExplanation: "On x86 and ARM processors, CPU write buffers allow loads to pass prior stores to different addresses (Store-Load reordering). If Process 0 sets `flag[0] = true` and Process 1 sets `flag[1] = true`, CPU pipeline reordering can cause both processes to check the other's flag before the write commits to shared L3 cache, causing mutual exclusion failure. Inserting a memory barrier flushes the CPU store buffer before reading the peer flag.",
    resources: [
      { title: 'Silberschatz - Operating System Concepts (Chapter 6: Synchronization)', linkOrRef: 'Section 6.3 Peterson Solution', type: 'Textbook' },
      { title: 'Linux Kernel Documentation: Memory Barriers', linkOrRef: 'Documentation/memory-barriers.txt', type: 'Documentation' },
      { title: 'Lecture 14 Slides: Synchronization Primitives', linkOrRef: 'Course Portal / CS301 / Module 3', type: 'Lecture Notes' }
    ],
    relatedQuestions: [
      "Why does Peterson's solution fail on modern SMP architectures without atomic instructions?",
      "What is the difference between compiler reordering and processor store buffering?",
      "How does Test-and-Set (TAS) compare to Compare-and-Swap (CAS) in hardware?"
    ]
  },
  {
    subject: 'Operating Systems',
    topic: "Belady's Anomaly & Page Replacement",
    keywords: ['belady', 'page replacement', 'fifo', 'lru', 'stack algorithm', 'page fault', 'anomaly', 'frames'],
    summaryAnswer: "Belady's Anomaly is the phenomenon where allocating more physical page frames causes MORE page faults for certain access strings. It only occurs in non-stack page replacement algorithms like FIFO, and NEVER in stack algorithms like LRU or Optimal.",
    detailedExplanation: "A page replacement algorithm is a 'stack algorithm' if the set of pages in an n-frame allocation is always a strict subset of the pages in an (n+1)-frame allocation for the identical reference string: M(n, r) ⊆ M(n+1, r). Because FIFO evicts the oldest page regardless of recency of access, adding frames alters eviction ordering, which can drop frequently referenced pages prematurely.",
    resources: [
      { title: 'Operating Systems: Three Easy Pieces (OSTEP: Paging)', linkOrRef: 'Chapter 22: Beyond Physical Memory', type: 'Textbook' },
      { title: 'MIT 6.004 Virtual Memory Notes', linkOrRef: '6.004 Computation Structures Courseware', type: 'Lecture Notes' }
    ],
    relatedQuestions: [
      "Can Belady's Anomaly occur with Clock or Second-Chance replacement?",
      "What is the formal proof of the Inclusion Property for LRU?",
      "Why is Optimal Page Replacement (MIN/OPT) impractical in production OS?"
    ]
  },
  {
    subject: 'Database Management Systems',
    topic: 'Normalization: 3NF vs BCNF',
    keywords: ['bcnf', '3nf', 'normalization', 'functional dependency', 'dependency preservation', 'lossless join', 'prime attribute'],
    summaryAnswer: "In 3NF, for every functional dependency X -> Y, either X is a superkey OR Y is a prime attribute. In BCNF (Boyce-Codd Normal Form), X MUST always be a superkey without exception. BCNF is strictly stronger, but decomposing into BCNF can sacrifice Functional Dependency Preservation.",
    detailedExplanation: "A decomposition is in 3NF if there are no transitive dependencies of non-prime attributes on candidate keys. BCNF eliminates all redundancy caused by functional dependencies. However, while every relation has a lossless and dependency-preserving 3NF decomposition, some relations cannot achieve BCNF without losing dependency preservation (e.g., relation R(A, B, C) with FDs AB -> C and C -> B). In real database schemas, 3NF is often chosen to avoid costly cross-table integrity assertions.",
    resources: [
      { title: 'Elmasri & Navathe - Fundamentals of Database Systems', linkOrRef: 'Chapter 14: Relational Database Design & Normal Forms', type: 'Textbook' },
      { title: 'Stanford CS145 Normalization Cheat Sheet', linkOrRef: 'CS145 Relational Schema Design Handbook', type: 'Documentation' }
    ],
    relatedQuestions: [
      "How to check if a decomposition preserves all functional dependencies?",
      "What are prime vs non-prime attributes with compound candidate keys?",
      "When is 3NF preferred over BCNF in production relational databases?"
    ]
  },
  {
    subject: 'Data Structures & Algorithms',
    topic: 'Disjoint Set Union (DSU) & Inverse Ackermann',
    keywords: ['dsu', 'disjoint set', 'union find', 'inverse ackermann', 'alpha', 'amortized', 'rank', 'path compression'],
    summaryAnswer: "Combining Path Compression with Union by Rank gives DSU an amortized time complexity of O(m * alpha(n)), where alpha(n) is the extremely slow-growing Inverse Ackermann function. For all practical values of n (even 10^80 atoms in the universe), alpha(n) <= 4, making each operation essentially O(1).",
    detailedExplanation: "Union by rank keeps trees balanced with height at most log(n). Path compression flattens the tree during `find()` operations by pointing nodes directly to their root. The formal amortized proof divides node ranks into logarithmic buckets; the Inverse Ackermann function alpha(n) represents the number of times the recursive Ackermann function must be inverted to reach <= 1. Because Ackermann grows faster than any tower of exponents, alpha(n) never exceeds 4 in realistic computing.",
    resources: [
      { title: 'Cormen, Leiserson, Rivest, Stein (CLRS: Chapter 21)', linkOrRef: 'Data Structures for Disjoint Sets', type: 'Textbook' },
      { title: 'CP-Algorithms: Disjoint Set Union', linkOrRef: 'cp-algorithms.com/data_structures/disjoint_set_union.html', type: 'Documentation' },
      { title: 'Lab Practice: Kruskal Minimum Spanning Tree', linkOrRef: 'Algorithms Lab 5 Assignment', type: 'Practice' }
    ],
    relatedQuestions: [
      "What happens to time complexity if we use path compression WITHOUT union by rank?",
      "How does DSU handle cycle detection in undirected graphs?",
      "How can DSU maintain extra metadata (like size or sum) per component?"
    ]
  },
  {
    subject: 'Computer Networks',
    topic: 'TCP Three-Way Handshake & SYN Floods',
    keywords: ['tcp', 'handshake', 'syn', 'ack', 'sequence number', 'isn', 'syn flood', 'syn cookie', 'transport layer'],
    summaryAnswer: "TCP uses a Three-Way Handshake (SYN -> SYN-ACK -> ACK) so both sender and receiver can exchange and acknowledge their initial sequence numbers (ISNs). A two-way handshake cannot protect against stale or duplicated connection requests from previous half-open connections.",
    detailedExplanation: "If client C sends SYN with sequence x, server S receives it and acknowledges x+1 while sending its own sequence y in SYN-ACK. The client acknowledges y+1 with ACK. This ensures bidirectional parameter negotiation. If an old duplicated SYN arrives at the server, the 3-way handshake allows the client to reject the spurious connection using RST, preventing ghost TCP state on the server.",
    resources: [
      { title: 'Kurose & Ross - Computer Networking: A Top-Down Approach', linkOrRef: 'Chapter 3: Transport Layer & TCP Principles', type: 'Textbook' },
      { title: 'RFC 793 / RFC 9293: Transmission Control Protocol Specification', linkOrRef: 'IETF Standards Track', type: 'Documentation' }
    ],
    relatedQuestions: [
      "How do SYN Cookies mitigate SYN Flood denial of service attacks?",
      "Why is TIME_WAIT state necessary for 2*MSL duration during TCP teardown?",
      "What is the difference between TCP sliding window flow control and congestion window?"
    ]
  },
  {
    subject: 'Operating Systems',
    topic: 'Deadlocks: Necessary Conditions & Bankers Algorithm',
    keywords: ['deadlock', 'coffman', 'mutual exclusion', 'hold and wait', 'preemption', 'circular wait', 'bankers', 'safe state'],
    summaryAnswer: "Deadlock requires all 4 Coffman conditions simultaneously: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait. Breaking any ONE condition prevents deadlock. Dijkstra's Banker's Algorithm avoids deadlocks dynamically by only allocating resources if the resulting state is Safe.",
    detailedExplanation: "A safe state is one where there exists at least one sequence <P1, P2, ... Pn> such that each process can complete using currently available resources plus resources held by earlier processes. The Banker's Algorithm maintains matrices: Allocation, Max, Available, and Need (where Need = Max - Allocation). Before granting request R, it simulates allocation and runs safety check O(m * n^2).",
    resources: [
      { title: 'Silberschatz - Operating System Concepts (Chapter 8: Deadlocks)', linkOrRef: 'Section 8.5 Deadlock Avoidance', type: 'Textbook' },
      { title: 'Deadlock Detection vs Prevention Case Study', linkOrRef: 'Department OS Lecture Repository', type: 'Lecture Notes' }
    ],
    relatedQuestions: [
      "How does resource ordering eliminate Circular Wait?",
      "What is the computational overhead of Banker's Algorithm in modern general-purpose OS?",
      "How does Linux handle deadlocks (Ostrich Algorithm) vs critical embedded OS?"
    ]
  }
];

export function searchInstantAcademicHelp(
  query: string, 
  subject?: string, 
  existingFaqs: FAQItem[] = []
): InstantHelpResult {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery.split(/[\s,?.!]+/).filter(t => t.length > 2);

  // 1. Search in verified Knowledge Base
  let bestMatch: KnowledgeEntry | null = null;
  let highestScore = 0;

  for (const entry of ACADEMIC_KNOWLEDGE_BASE) {
    let score = 0;
    if (subject && entry.subject.toLowerCase() === subject.toLowerCase()) {
      score += 2;
    }

    for (const kw of entry.keywords) {
      if (normalizedQuery.includes(kw)) {
        score += 3;
      }
    }

    for (const token of queryTokens) {
      if (entry.topic.toLowerCase().includes(token)) score += 2;
      if (entry.summaryAnswer.toLowerCase().includes(token)) score += 1;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  // 2. Check if an existing FAQ is a closer match
  let matchedFaq: FAQItem | null = null;
  let faqScore = 0;
  for (const faq of existingFaqs) {
    let score = 0;
    if (subject && faq.subject.toLowerCase() === subject.toLowerCase()) score += 2;
    for (const token of queryTokens) {
      if (faq.question.toLowerCase().includes(token)) score += 3;
      if (faq.answer.toLowerCase().includes(token)) score += 1;
    }
    if (score > faqScore) {
      faqScore = score;
      matchedFaq = faq;
    }
  }

  // If FAQ has higher score
  if (matchedFaq && faqScore > highestScore && faqScore >= 4) {
    return {
      answer: matchedFaq.answer,
      confidence: faqScore > 7 ? 'high' : 'medium',
      source: `Verified Subject FAQ (${matchedFaq.subject} • Verified by ${matchedFaq.facultyAuthor})`,
      suggestedQuestions: [
        `How does this apply to upcoming ${matchedFaq.subject} assignments?`,
        `Can you provide an example problem related to ${matchedFaq.category}?`
      ],
      studyResources: [
        { title: `${matchedFaq.subject} Course Syllabus & Lecture Archives`, linkOrRef: 'Department Portal', type: 'Lecture Notes' }
      ],
      wasHelpful: null,
      timestamp: new Date().toISOString()
    };
  }

  // If Knowledge Base matched with confidence
  if (bestMatch && highestScore >= 3) {
    return {
      answer: `${bestMatch.summaryAnswer}\n\n${bestMatch.detailedExplanation}`,
      confidence: highestScore >= 6 ? 'high' : 'medium',
      source: `Curated Academic Knowledge Base (${bestMatch.subject} • ${bestMatch.topic})`,
      suggestedQuestions: bestMatch.relatedQuestions,
      studyResources: bestMatch.resources,
      wasHelpful: null,
      timestamp: new Date().toISOString()
    };
  }

  // If no reliable answer found: Honest, accurate response as required
  return {
    answer: "I couldn't find a reliable answer in our curated knowledge base or verified subject FAQs. Your question has been forwarded to course faculty for accurate assistance.",
    confidence: 'none',
    source: 'Instant Academic Assistant (Query dispatched to Faculty)',
    suggestedQuestions: [
      "Would you like to book an office hours consultation with your course professor?",
      "Would you like to refine your question keywords or add code/notes context?"
    ],
    studyResources: [
      { title: 'Course Recommended Textbooks & Reference Materials', linkOrRef: 'Library Course Reserves', type: 'Textbook' }
    ],
    wasHelpful: null,
    timestamp: new Date().toISOString()
  };
}
