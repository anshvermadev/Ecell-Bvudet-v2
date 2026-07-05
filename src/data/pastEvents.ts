export interface Guest {
  name: string;
  role: string;
  organization: string;
  placeholder: boolean;
}

export interface PastEvent {
  slug: string;
  name: string;
  shortName: string;
  type: string;
  tag: string;
  date: string;
  location: string;
  format: string;
  participantCount: string;
  duration: string;
  edition: string;
  description: string;
  objective: string;
  highlights: string[];
  guests: Guest[];
  images: string[];
}

export const pastEvents: PastEvent[] = [
  {
    slug: "0-to-1-sprint",
    name: "0 TO 1 SPRINT",
    shortName: "0 to 1 Sprint",
    type: "Startup Competition",
    tag: "STARTUP COMPETITION",
    date: "2024",
    location: "CC Lab, BVUDET, Navi Mumbai",
    format: "Offline",
    participantCount: "50+",
    duration: "48 Hours",
    edition: "Season 1",
    description: "0 to 1 Sprint was an intensive offline startup competition held at CC Lab, BVUDET. Teams were given a problem space and had to go from a raw concept to a structured pitch in 48 hours. The event was listed on Unstop under Innovation Challenges and attracted participants from across the department.",
    objective: "To push students beyond the comfort of academic projects and force them to think like founders. The sprint format was designed to simulate the pressure of early-stage startup building - fast decisions, real constraints, no safety net.",
    highlights: [
      "12 teams competed over 48 hours",
      "Listed on Unstop under Innovation Challenges",
      "Held offline at CC Lab, BVUDET",
      "Winners received mentorship and recognition"
    ],
    guests: [
      { name: "Guest Speaker", role: "Industry Mentor", organization: "TBA", placeholder: true },
      { name: "Judge", role: "Startup Evaluator", organization: "TBA", placeholder: true }
    ],
    images: [
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038707/0-1_Sprint_PPT_fouwtp.jpg",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038753/IMG_0517_ozob1r.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038749/IMG_0519_z2euxi.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038732/IMG_5068_jdhfgy.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038713/IMG_0521_de5o9g.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038713/IMG_0513_rzquop.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038703/IMG_0663_zid8mc.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038698/IMG_0683_wecune.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038698/IMG_0524_rae1gg.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038697/IMG_0526_xxsgcv.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038696/IMG_0678_phvzks.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038690/IMG_0518_zp40xi.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038661/IMG_0732_rzbdrd.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782040239/IMG_5067_ippz8t.heic",
    "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038703/IMG_0663_zid8mc.heic",
  ]
  },
  {
    slug: "pitchx-2026",
    name: "PITCHX 2026",
    shortName: "PitchX 2026",
    type: "Entrepreneurship Pitch Competition",
    tag: "PITCH COMPETITION",
    date: "2026",
    location: "BVUDET, Navi Mumbai",
    format: "Hybrid",
    participantCount: "100+",
    duration: "2 Weeks",
    edition: "Season 1",
    description: "Welcome to PitchX 2026 - Entrepreneurship Pitch Competition! The Entrepreneurship Cell of Bharati Vidyapeeth Deemed University Department of Engineering and Technology proudly presents PitchX 2026, a premier startup pitch competition in association with StockGro. This is your platform to transform innovative ideas into viable business ventures and showcase your entrepreneurial prowess. PitchX 2026 is designed to identify, nurture, and celebrate the next generation of entrepreneurs. Whether you have a groundbreaking tech solution, a social enterprise, or an innovative business model, this competition is your opportunity to gain exposure, receive valuable feedback, and win exciting prizes.",
    objective: "To identify, nurture, and celebrate the next generation of entrepreneurs, helping them transform innovative ideas into viable business ventures, gain exposure, receive valuable feedback, and pitch to venture capitalists, angel investors, and industry experts.",
    highlights: [
      "Organized in association with StockGro with a total prize pool of INR 5,000",
      "Three rounds including Executive Summary, Trading Simulation, and Grand Finale Pitch",
      "Top 10 teams receive 1-on-1 mentorship from industry veterans",
      "Grand Finale live pitch at Seminar Hall, BVUDET, Navi Mumbai"
    ],
    guests: [
      { name: "Venture Capitalists Panel", role: "Judge & Investor Panel", organization: "Various", placeholder: true },
      { name: "Angel Investors", role: "Judge & Mentor", organization: "Various", placeholder: true },
      { name: "Industry Experts", role: "Judge", organization: "Various", placeholder: true }
    ],
    images: [
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1782040818/pitchx_cihham.png",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1782040833/IMG_3319_b7wiy1.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1782040834/IMG_0565_n0kgbu.heic",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1782040855/IMG_20260116_155226792_AE_ccqp2t.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1782040854/IMG_20260116_155311450_AE_fouv64.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1782040858/IMG_20260116_155437468_AE_f5ilax.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1782041212/IMG_3326_loq4ug.jpg"
    ]
  },
  {
    slug: "dev-with-ai",
    name: "DEV WITH AI",
    shortName: "Dev with AI",
    type: "Hackathon",
    tag: "HACKATHON",
    date: "2024",
    location: "BVUDET, Navi Mumbai",
    format: "Offline",
    participantCount: "80+",
    duration: "24 Hours",
    edition: "Season 1",
    description: "Dev with AI was E-Cell BVUDET's annual AI-powered hackathon. Teams had 24 hours to build functional solutions using artificial intelligence across problem domains including healthcare, education, and fintech. The event attracted some of the most technically ambitious students in the department.",
    objective: "To accelerate technical execution skills and push students to build real, working AI-integrated products in a constrained environment. The hackathon was designed to reward shipping over planning.",
    highlights: [
      "80+ participants across teams",
      "24-hour build sprint",
      "Problem domains: healthcare, education, fintech",
      "Winners presented live demos to the judging panel"
    ],
    guests: [
      { name: "Technical Judge", role: "AI/ML Engineer", organization: "TBA", placeholder: true },
      { name: "Industry Mentor", role: "Product Mentor", organization: "TBA", placeholder: true }
    ],
    images: [
      "https://res.cloudinary.com/tobijudah/image/upload/q_auto,f_auto/v1637486753/it/5_jhk3kg.png",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783247155/Copy_of_IMG_9032_tgdpns.heic",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1783247150/Copy_of_IMG_9036_kelgav.heic",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1783247152/Copy_of_IMG_9045_vtjbry.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1783247143/Copy_of_IMG_9088_jc1hsb.heic",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1783247142/Copy_of_IMG_9097_ygodr3.heic",
    ]
  },
  {
    slug: "launchpad",
    name: "LAUNCHPAD",
    shortName: "Launchpad",
    type: "Innovation Challenge",
    tag: "INNOVATION CHALLENGE",
    date: "2023",
    location: "BVUDET, Navi Mumbai",
    format: "Offline",
    participantCount: "40+",
    duration: "1 Day",
    edition: "Season 1",
    description: "Launchpad was E-Cell BVUDET's inaugural innovation event. Teams were challenged to identify real problems and present structured, actionable solutions. As the first major event after the club's founding in 2023, Launchpad set the standard for every event that followed.",
    objective: "To establish a culture of problem-first thinking on campus from day one. Launchpad was designed to show students that innovation does not require a lab or a budget - it requires the right questions.",
    highlights: [
      "E-Cell BVUDET's first major event",
      "40+ participants in the inaugural edition",
      "Problem-first format focused on real-world challenges",
      "Set the template for all future E-Cell events"
    ],
    guests: [
      { name: "Guest Speaker", role: "Entrepreneur", organization: "TBA", placeholder: true }
    ],
    images: [
      "https://res.cloudinary.com/tobijudah/image/upload/q_auto,f_auto/v1637522594/it/6_eda4xd.png",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783247000/Copy_of_IMG-20250927-WA0360_l6ylz5.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783247001/Copy_of_IMG-20250927-WA0345_pmmp8q.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783247000/Copy_of_IMG-20250927-WA0366_qtunsf.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783247004/Copy_of_IMG-20250927-WA0063_mkkjkd.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783247003/Copy_of_IMG-20250927-WA0071_gmy71v.jpg",
    ]
  },
  {
    slug: "youth-speak-forum",
    name: "YOUTH SPEAK FORUM",
    shortName: "Youth Speak Forum",
    type: "Forum",
    tag: "FORUM",
    date: "2025",
    location: "BVUDET, Navi Mumbai",
    format: "Offline",
    participantCount: "165+",
    duration: "2 Hours",
    edition: "A.Y. 2024-25",
    description: "The Youth Speak Forum was a highly engaging and interactive session designed to encourage students to take leadership roles and use their ideas to address global challenges. Organized under the IIC Calendar, participants actively contributed through practical examples, translating discussions into concrete actions for Sustainable Development Goals.",
    objective: "To encourage participants to take leadership roles, address global challenges, and translate discussions into concrete actions for Sustainable Development Goals while inspiring them to engage with AIESEC's initiatives.",
    highlights: [
      "165 students and 10 faculty participants",
      "Interactive sessions with TEDx speakers and industry CEOs",
      "Focus on actionable plans for Sustainable Development Goals",
      "Development of leadership, critical thinking, and communication skills"
    ],
    guests: [
      { name: "Deveeka Mahajan", role: "Managing Director and CEO", organization: "Victor Manickam Knowledge Group", placeholder: false },
      { name: "Vrinda Gupta", role: "TEDx Speaker & Corporate Trainer", organization: "Physics Wallah / TNC Aviation", placeholder: false },
      { name: "Sanjiv Jain", role: "CEO", organization: "Prorata", placeholder: false }
    ],
    images: [
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783248160/YSF_PPT_2K26_uhi1ls.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783248075/IMG_2165_rl9ppp.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783248072/IMG_2191_hhxsix.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783248070/IMG_2186_bbphxx.jpg",
      "https://res.cloudinary.com/dobmi3ojr/image/upload/v1783248068/IMG_2208_b9cdbz.jpg",
    ]
  },
];
