export type MbtiContent = {
  name: string;
  desc: string;
  quote: string;
  strengths: string[];
  weaknesses: string[];
};

export type MbtiData = {
  group: string; // Analysts, Diplomats, etc.
  color: string; // Tailwind color class
  textColor: string;
  en: MbtiContent;
  id: MbtiContent;
};

export const mbtiDatabase: Record<string, MbtiData> = {
  // --- ANALYSTS (UNGU) ---
  INTJ: {
    group: "Analysts",
    color: "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
    en: {
      name: "Architect",
      desc: "Imaginative and strategic thinkers, with a plan for everything.",
      quote: "Thought constitutes the greatness of man.",
      strengths: ["Rational", "Informed", "Independent", "Determined"],
      weaknesses: ["Arrogant", "Dismissive of Emotions", "Overly Critical"]
    },
    id: {
      name: "Arsitek",
      desc: "Pemikir imajinatif dan strategis, selalu punya rencana untuk segalanya.",
      quote: "Pemikiran membentuk keagungan manusia.",
      strengths: ["Rasional", "Berwawasan", "Mandiri", "Tekad Kuat"],
      weaknesses: ["Arogan", "Mengabaikan Emosi", "Terlalu Kritis"]
    }
  },
  INTP: {
    group: "Analysts",
    color: "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
    en: {
      name: "Logician",
      desc: "Innovative inventors with an unquenchable thirst for knowledge.",
      quote: "Learn from yesterday, live for today, hope for tomorrow.",
      strengths: ["Analytical", "Original", "Open-minded", "Curious"],
      weaknesses: ["Disconnected", "Insensitive", "Dissatisfied"]
    },
    id: {
      name: "Ahli Logika",
      desc: "Penemu inovatif dengan rasa ingin tahu yang tak terbendung.",
      quote: "Belajar dari masa lalu, hidup untuk hari ini, berharap untuk esok.",
      strengths: ["Analitis", "Orisinil", "Pikiran Terbuka", "Penuh Ingin Tahu"],
      weaknesses: ["Terisolasi", "Kurang Peka", "Mudah Tidak Puas"]
    }
  },
  ENTJ: {
    group: "Analysts",
    color: "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
    en: {
      name: "Commander",
      desc: "Bold, imaginative and strong-willed leaders, always finding a way.",
      quote: "Time is limited, so don't waste it living someone else's life.",
      strengths: ["Efficient", "Energetic", "Self-Confident", "Charismatic"],
      weaknesses: ["Stubborn", "Intolerant", "Arrogant", "Poor Handling of Emotions"]
    },
    id: {
      name: "Komandan",
      desc: "Pemimpin pemberani dan berkemauan keras, selalu menemukan jalan.",
      quote: "Waktu terbatas, jangan sia-siakan untuk menjalani hidup orang lain.",
      strengths: ["Efisien", "Energik", "Percaya Diri", "Karismatik"],
      weaknesses: ["Keras Kepala", "Tidak Toleran", "Arogan", "Kurang Empati"]
    }
  },
  ENTP: {
    group: "Analysts",
    color: "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
    en: {
      name: "Debater",
      desc: "Smart and curious thinkers who cannot resist an intellectual challenge.",
      quote: "Follow the path of the unsafe, independent thinker.",
      strengths: ["Knowledgeable", "Quick Thinker", "Original", "Excellent Brainstormer"],
      weaknesses: ["Very Argumentative", "Insensitive", "Intolerant", "Can't Focus"]
    },
    id: {
      name: "Pendebat",
      desc: "Pemikir cerdas yang tidak bisa menolak tantangan intelektual.",
      quote: "Ikuti jalan pemikir bebas yang berani mengambil risiko.",
      strengths: ["Berpengetahuan", "Berpikir Cepat", "Orisinil", "Jago Brainstorming"],
      weaknesses: ["Suka Berdebat", "Kurang Peka", "Tidak Toleran", "Susah Fokus"]
    }
  },

  // --- DIPLOMATS (HIJAU) ---
  INFJ: {
    group: "Diplomats",
    color: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    en: {
      name: "Advocate",
      desc: "Quiet and mystical, yet very inspiring and tireless idealists.",
      quote: "Treat people as if they were what they ought to be.",
      strengths: ["Creative", "Insightful", "Principled", "Passionate"],
      weaknesses: ["Sensitive to Criticism", "Reluctant to Open Up", "Perfectionistic"]
    },
    id: {
      name: "Advokat",
      desc: "Pendiam dan mistis, namun idealis yang sangat menginspirasi.",
      quote: "Perlakukan orang sebagaimana mereka seharusnya menjadi.",
      strengths: ["Kreatif", "Berwawasan", "Berprinsip", "Penuh Gairah"],
      weaknesses: ["Sensitif Kritik", "Tertutup", "Perfeksionis"]
    }
  },
  INFP: {
    group: "Diplomats",
    color: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    en: {
      name: "Mediator",
      desc: "Poetic, kind and altruistic people, always eager to help a good cause.",
      quote: "Not all those who wander are lost.",
      strengths: ["Empathic", "Generous", "Open-Minded", "Creative"],
      weaknesses: ["Unrealistic", "Self-Isolating", "Unfocused", "Emotionally Vulnerable"]
    },
    id: {
      name: "Mediator",
      desc: "Orang puitis dan baik hati, selalu ingin membantu tujuan mulia.",
      quote: "Tidak semua yang mengembara itu tersesat.",
      strengths: ["Empati Tinggi", "Dermawan", "Pikiran Terbuka", "Kreatif"],
      weaknesses: ["Tidak Realistis", "Suka Menyendiri", "Kurang Fokus", "Terlalu Emosional"]
    }
  },
  ENFJ: {
    group: "Diplomats",
    color: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    en: {
      name: "Protagonist",
      desc: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
      quote: "Everything you do right now ripples outward and affects everyone.",
      strengths: ["Receptive", "Reliable", "Passionate", "Charismatic"],
      weaknesses: ["Unrealistic", "Overly Idealistic", "Condescending", "Intense"]
    },
    id: {
      name: "Protagonis",
      desc: "Pemimpin karismatik yang mampu memukau pendengarnya.",
      quote: "Segala yang kau lakukan berdampak luas pada semua orang.",
      strengths: ["Peka", "Bisa Diandalkan", "Penuh Gairah", "Karismatik"],
      weaknesses: ["Tidak Realistis", "Terlalu Idealis", "Menggurui", "Terlalu Intens"]
    }
  },
  ENFP: {
    group: "Diplomats",
    color: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    en: {
      name: "Campaigner",
      desc: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
      quote: "It doesn't interest me what you do for a living. I want to know what you ache for.",
      strengths: ["Curious", "Perceptive", "Enthusiastic", "Excellent Communicator"],
      weaknesses: ["People-Pleasing", "Unfocused", "Disorganized", "Overly Optimistic"]
    },
    id: {
      name: "Juru Kampanye",
      desc: "Semangat bebas yang antusias dan kreatif, selalu punya alasan untuk tersenyum.",
      quote: "Aku tak peduli apa kerjamu. Aku ingin tahu apa mimpimu.",
      strengths: ["Penuh Ingin Tahu", "Peka", "Antusias", "Komunikator Handal"],
      weaknesses: ["People Pleaser", "Kurang Fokus", "Berantakan", "Terlalu Optimis"]
    }
  },

  // --- SENTINELS (BIRU) ---
  ISTJ: {
    group: "Sentinels",
    color: "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    en: {
      name: "Logistician",
      desc: "Practical and fact-minded individuals, whose reliability cannot be doubted.",
      quote: "My observation is that whenever one person is found adequate to the discharge of a duty, it is worse executed by two persons.",
      strengths: ["Honest", "Direct", "Strong-willed", "Responsible"],
      weaknesses: ["Stubborn", "Insensitive", "Always by the Book", "Judgmental"]
    },
    id: {
      name: "Ahli Logistik",
      desc: "Individu praktis yang mengutamakan fakta, keandalannya tak diragukan.",
      quote: "Tugas akan lebih baik dikerjakan satu orang yang kompeten daripada dua orang.",
      strengths: ["Jujur", "To the Point", "Berkemauan Keras", "Bertanggung Jawab"],
      weaknesses: ["Keras Kepala", "Kurang Peka", "Kaku Aturan", "Suka Menghakimi"]
    }
  },
  ISFJ: {
    group: "Sentinels",
    color: "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    en: {
      name: "Defender",
      desc: "Very dedicated and warm protectors, always ready to defend their loved ones.",
      quote: "Love only grows by sharing. You can only have more for yourself by giving it away to others.",
      strengths: ["Supportive", "Reliable", "Observant", "Enthusiastic"],
      weaknesses: ["Overly Humble", "Taking Things Personally", "Repressing Feelings", "Reluctant to Change"]
    },
    id: {
      name: "Pembela",
      desc: "Pelindung yang hangat dan setia, selalu siap membela orang tercinta.",
      quote: "Cinta tumbuh dengan berbagi. Kau hanya memilikinya lebih banyak dengan memberikannya.",
      strengths: ["Suportif", "Bisa Diandalkan", "Pengamat Baik", "Antusias"],
      weaknesses: ["Terlalu Rendah Hati", "Baperan", "Memendam Perasaan", "Takut Perubahan"]
    }
  },
  ESTJ: {
    group: "Sentinels",
    color: "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    en: {
      name: "Executive",
      desc: "Excellent administrators, unsurpassed at managing things - or people.",
      quote: "Good order is the foundation of all things.",
      strengths: ["Dedicated", "Strong-willed", "Direct", "Loyal"],
      weaknesses: ["Inflexible", "Uncomfortable with Unconventional Situations", "Judgmental", "Difficult to Relax"]
    },
    id: {
      name: "Eksekutif",
      desc: "Administrator hebat, jago mengelola sesuatu atau orang.",
      quote: "Ketertiban adalah fondasi dari segala hal.",
      strengths: ["Berdedikasi", "Tekad Kuat", "Langsung", "Setia"],
      weaknesses: ["Kaku", "Tidak Nyaman dengan Hal Baru", "Menghakimi", "Susah Santai"]
    }
  },
  ESFJ: {
    group: "Sentinels",
    color: "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    en: {
      name: "Consul",
      desc: "Extraordinarily caring, social and popular people, always eager to help.",
      quote: "Encourage, lift and strengthen one another.",
      strengths: ["Strong Practical Skills", "Warm", "Loyal", "Good at Connecting"],
      weaknesses: ["Worried about Social Status", "Inflexible", "Reluctant to Innovate", "Vulnerable to Criticism"]
    },
    id: {
      name: "Konsul",
      desc: "Orang yang sangat peduli, sosial, dan populer, selalu ingin membantu.",
      quote: "Saling menyemangati, mengangkat, dan menguatkan satu sama lain.",
      strengths: ["Praktis", "Hangat", "Setia", "Jago Bersosialisasi"],
      weaknesses: ["Gila Hormat", "Kaku", "Takut Inovasi", "Anti Kritik"]
    }
  },

  // --- EXPLORERS (KUNING) ---
  ISTP: {
    group: "Explorers",
    color: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    en: {
      name: "Virtuoso",
      desc: "Bold and practical experimenters, masters of all kinds of tools.",
      quote: "I wanted to live deep and suck out all the marrow of life.",
      strengths: ["Optimistic", "Creative", "Practical", "Spontaneous"],
      weaknesses: ["Stubborn", "Insensitive", "Private", "Easily Bored"]
    },
    id: {
      name: "Pengrajin",
      desc: "Eksperimentator berani dan praktis, menguasai berbagai alat.",
      quote: "Aku ingin hidup mendalam dan menyerap semua intisari kehidupan.",
      strengths: ["Optimis", "Kreatif", "Praktis", "Spontan"],
      weaknesses: ["Keras Kepala", "Kurang Peka", "Tertutup", "Cepat Bosan"]
    }
  },
  ISFP: {
    group: "Explorers",
    color: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    en: {
      name: "Adventurer",
      desc: "Flexible and charming artists, always ready to explore and experience something new.",
      quote: "I change during the course of a day. I wake and I'm one person, and when I go to sleep I know for certain I'm somebody else.",
      strengths: ["Charming", "Sensitive to Others", "Imaginative", "Passionate"],
      weaknesses: ["Fiercely Independent", "Unpredictable", "Easily Stressed", "Overly Competitive"]
    },
    id: {
      name: "Petualang",
      desc: "Seniman fleksibel dan menawan, selalu siap menjelajah hal baru.",
      quote: "Aku berubah sepanjang hari. Saat bangun aku siapa, saat tidur aku orang lain.",
      strengths: ["Menawan", "Peka", "Imajinatif", "Penuh Gairah"],
      weaknesses: ["Terlalu Mandiri", "Sulit Ditebak", "Gampang Stres", "Terlalu Kompetitif"]
    },
  },
  ESTP: {
    group: "Explorers",
    color: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    en: {
      name: "Entrepreneur",
      desc: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
      quote: "Life is either a daring adventure or nothing at all.",
      strengths: ["Bold", "Rational", "Original", "Perceptive"],
      weaknesses: ["Insensitive", "Impatient", "Risk-prone", "Unstructured"]
    },
    id: {
      name: "Pengusaha",
      desc: "Orang cerdas, energik, dan tanggap, yang menikmati hidup di ujung tanduk.",
      quote: "Hidup adalah petualangan berani atau tidak sama sekali.",
      strengths: ["Berani", "Rasional", "Orisinil", "Tanggap"],
      weaknesses: ["Kurang Peka", "Tidak Sabaran", "Suka Risiko", "Berantakan"]
    }
  },
  ESFP: {
    group: "Explorers",
    color: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    en: {
      name: "Entertainer",
      desc: "Spontaneous, energetic and enthusiastic people – life is never boring around them.",
      quote: "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle.",
      strengths: ["Bold", "Original", "Aesthetics", "Practical"],
      weaknesses: ["Sensitive", "Conflict-Averse", "Easily Bored", "Poor Planner"]
    },
    id: {
      name: "Entertainer", 
      desc: "Orang yang spontan, energik, dan antusias – hidup tak pernah membosankan di dekat mereka.",
      quote: "Aku egois, tidak sabaran, dan sedikit insecure. Tapi kalau kau tak bisa menanganiku saat terburuk, kau tak pantas dapat yang terbaik.",
      strengths: ["Berani", "Orisinil", "Estetis", "Praktis"],
      weaknesses: ["Sensitif", "Menghindari Konflik", "Cepat Bosan", "Perencana Buruk"]
    }
  }
};