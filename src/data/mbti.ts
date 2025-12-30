export type MBTIData = {
  group: "Analysts" | "Diplomats" | "Sentinels" | "Explorers";
  color: string;
  textColor: string;
  en: {
    name: string;
    desc: string;
    quote: string;
    strengths: string[];
    weaknesses: string[];
    relationships: string;
    career: string;
  };
  id: {
    name: string;
    desc: string;
    quote: string;
    strengths: string[];
    weaknesses: string[];
    relationships: string;
    career: string;
  };
};

export const mbtiDatabase: Record<string, MBTIData> = {
  // --- ANALYSTS ---
  INTJ: {
    group: "Analysts",
    color: "border-purple-500 shadow-purple-500/20",
    textColor: "text-purple-600 dark:text-purple-400",
    en: {
      name: "Architect",
      desc: "Imaginative and strategic thinkers, with a plan for everything. They are one of the rarest and most capable personality types.",
      quote: "Thought constitutes the greatness of man. Man is a reed, the feeblest thing in nature, but he is a thinking reed.",
      strengths: ["Rational", "Informed", "Independent", "Determined"],
      weaknesses: ["Arrogant", "Dismissive of Emotions", "Overly Critical"],
      relationships: "In relationships, Architects are looking for an intellectual equal. They prize honesty and open communication but may struggle with emotional expression.",
      career: "They thrive in careers that require complex problem-solving and strategic planning, such as Systems Engineering, Strategy, or Science."
    },
    id: {
      name: "Arsitek",
      desc: "Pemikir yang super imajinatif dan strategis. Selalu punya plan A sampai Z. Tipe yang langka banget tapi capable parah.",
      quote: "Pikiran itu bikin manusia hebat. Manusia emang lemah, tapi dia adalah 'buluh yang berpikir'.",
      strengths: ["Rasional Abis", "Berwawasan Luas", "Independen", "Tekun"],
      weaknesses: ["Agak Arogan", "Cuek sama Perasaan", "Terlalu Kritis"],
      relationships: "Nyari pasangan yang selevel otaknya. Mereka suka kejujuran dan komunikasi yang to the point, tapi kadang kikuk kalau soal perasaan.",
      career: "Cocok banget di kerjaan yang butuh mikir keras dan strategi, kayak System Engineer, Strategist, atau Scientist."
    },
  },
  INTP: {
    group: "Analysts",
    color: "border-purple-500 shadow-purple-500/20",
    textColor: "text-purple-600 dark:text-purple-400",
    en: {
      name: "Logician",
      desc: "Innovative inventors with an unquenchable thirst for knowledge. They love patterns and spotting discrepancies in statements.",
      quote: "Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.",
      strengths: ["Analytical", "Original", "Open-minded", "Curious"],
      weaknesses: ["Disconnected", "Insensitive", "Dissatisfied"],
      relationships: "Logicians are often laid-back partners but can be oblivious to their partner's emotional needs, preferring to fix problems logically.",
      career: "Ideal careers involve abstract theory and analysis, such as Programming, Mathematics, or Academic Research."
    },
    id: {
      name: "Ahli Logika",
      desc: "Penemu yang inovatif dan haus ilmu. Hobi banget nyari pola dan bakal nge-notice kalau ada yang gak logis dari omongan lo.",
      quote: "Belajar dari kemarin, hidup buat hari ini, berharap buat besok. Intinya jangan berhenti nanya 'kenapa'.",
      strengths: ["Analitis", "Orisinal", "Open Minded", "Kepo Banget"],
      weaknesses: ["Suka Bengong Sendiri", "Gak Peka", "Gampang Bosen"],
      relationships: "Pasangan yang santuy sebenernya, tapi sering gak peka sama kode-kodean. Lebih suka nyelesain masalah pake logika daripada perasaan.",
      career: "Kerjaan yang butuh teori abstrak kayak Coding, Matematika, atau Riset Akademis itu makanan sehari-hari mereka."
    },
  },
  ENTJ: {
    group: "Analysts",
    color: "border-purple-500 shadow-purple-500/20",
    textColor: "text-purple-600 dark:text-purple-400",
    en: {
      name: "Commander",
      desc: "Bold, imaginative and strong-willed leaders, always finding a way - or making one.",
      quote: "Time is limited, so don't waste it living someone else's life.",
      strengths: ["Efficient", "Energetic", "Self-Confident", "Strong-willed"],
      weaknesses: ["Stubborn", "Intolerant", "Impatient", "Arrogant"],
      relationships: "Commanders approach dating like a project. They look for growth-oriented partners and can be very dominant.",
      career: "Natural leaders who excel in Executive roles, Entrepreneurship, and Management Consulting."
    },
    id: {
      name: "Komandan",
      desc: "Pemimpin yang bold dan imajinatif. Kalau gak nemu jalan, ya mereka bikin jalan sendiri. Boss energy banget.",
      quote: "Waktu itu terbatas, bestie. Jangan buang waktu jalanin hidup orang lain.",
      strengths: ["Efisien", "Energik Parah", "PD Abis", "Kemauan Keras"],
      weaknesses: ["Keras Kepala", "Gak Sabaran", "Kurang Toleran", "Suka Ngeboss"],
      relationships: "Ngedate itu kayak project bisnis buat mereka. Nyari pasangan yang visioner, tapi hati-hati, mereka dominan banget.",
      career: "Terlahir jadi pemimpin. Cocok jadi CEO, Entrepreneur, atau Konsultan Manajemen."
    },
  },
  ENTP: {
    group: "Analysts",
    color: "border-purple-500 shadow-purple-500/20",
    textColor: "text-purple-600 dark:text-purple-400",
    en: {
      name: "Debater",
      desc: "Smart and curious thinkers who cannot resist an intellectual challenge. They tend to play the devil's advocate.",
      quote: "Follow the path of the unsafe, independent thinker. Expose your ideas to the dangers of controversy.",
      strengths: ["Knowledgeable", "Quick-thinking", "Original", "Charismatic"],
      weaknesses: ["Very Argumentative", "Insensitive", "Intolerant", "Can find it hard to focus"],
      relationships: "Spontaneous and exciting partners who love to explore new ideas together, though they may struggle with stability.",
      career: "They need freedom and creativity, excelling in Entrepreneurship, Marketing, or Law."
    },
    id: {
      name: "Pendebat",
      desc: "Pinter, iseng, dan gak bisa nolak debat. Suka banget jadi 'devil's advocate' cuma buat ngetes argumen orang.",
      quote: "Jadilah pemikir independen yang berani ambil risiko. Biarin ide lo diuji sama kontroversi.",
      strengths: ["Wawasan Luas", "Gercep Mikirnya", "Orisinal", "Karismatik"],
      weaknesses: ["Hobi Debat", "Gak Peka", "Gak Sabaran", "Susah Fokus"],
      relationships: "Pasangan yang seru dan spontan. Suka diajak diskusi ide gila, tapi mungkin agak susah kalau diajak serius soal kestabilan.",
      career: "Butuh kebebasan berkreasi. Jago banget kalau jadi Entrepreneur, Marketer, atau Pengacara."
    },
  },

  // --- DIPLOMATS ---
  INFJ: {
    group: "Diplomats",
    color: "border-green-500 shadow-green-500/20",
    textColor: "text-green-600 dark:text-green-400",
    en: {
      name: "Advocate",
      desc: "Quiet and mystical, yet very inspiring and tireless idealists. They approach life with deep thoughtfulness and imagination.",
      quote: "Treat people as if they were what they ought to be and you help them to become what they are capable of being.",
      strengths: ["Creative", "Insightful", "Principled", "Passionate"],
      weaknesses: ["Sensitive to Criticism", "Reluctant to Open Up", "Perfectionistic"],
      relationships: "They seek deep, meaningful connections and honesty, often taking time to find the 'perfect' partner.",
      career: "Drawn to meaningful work like Counseling, Psychology, Writing, or Non-profit work."
    },
    id: {
      name: "Advokat",
      desc: "Pendiam dan misterius, tapi idealis banget. Hidupnya penuh pemikiran mendalam dan imajinasi. Inspiratif parah.",
      quote: "Perlakukan orang sebagaimana mestinya, dan lo bantu mereka jadi versi terbaik diri mereka.",
      strengths: ["Kreatif", "Punya Insight Dalem", "Punya Prinsip", "Passionate"],
      weaknesses: ["Baperan kalau Dikritik", "Susah Terbuka", "Perfeksionis"],
      relationships: "Nyari hubungan yang deep dan meaningful. Sering kelamaan jomblo karena nunggu 'the perfect one'.",
      career: "Suka kerjaan yang punya makna kayak Konseling, Psikologi, Penulis, atau di NGO."
    },
  },
  INFP: {
    group: "Diplomats",
    color: "border-green-500 shadow-green-500/20",
    textColor: "text-green-600 dark:text-green-400",
    en: {
      name: "Mediator",
      desc: "Poetic, kind and altruistic people, always eager to help a good cause. They are true idealists.",
      quote: "Not all those who wander are lost.",
      strengths: ["Empathetic", "Generous", "Open-minded", "Creative"],
      weaknesses: ["Unrealistic", "Self-Isolating", "Unfocused"],
      relationships: "Hopeless romantics who dream of a perfect soulmate connection and are deeply supportive partners.",
      career: "They prefer work that aligns with their values, such as Writing, Arts, or Social Work."
    },
    id: {
      name: "Mediator",
      desc: "Puitis, baik hati, dan tulus banget. Selalu mau bantu orang lain. Bener-bener idealis sejati.",
      quote: "Gak semua orang yang mengembara itu tersesat kok.",
      strengths: ["Empati Tinggi", "Dermawan", "Open Minded", "Kreatif"],
      weaknesses: ["Terlalu Khayal", "Suka Mengurung Diri", "Gak Fokus"],
      relationships: "Hopeless romantic yang ngehayal punya soulmate sempurna. Pasangan yang super supportive.",
      career: "Kerja harus sesuai hati nurani, kayak Penulis, Seniman, atau Pekerja Sosial."
    },
  },
  ENFJ: {
    group: "Diplomats",
    color: "border-green-500 shadow-green-500/20",
    textColor: "text-green-600 dark:text-green-400",
    en: {
      name: "Protagonist",
      desc: "Charismatic and inspiring leaders, able to mesmerize their listeners. They love helping others grow.",
      quote: "Everything you do right now ripples outward and affects everyone. Your posture can shine your heart or transmit anxiety.",
      strengths: ["Receptive", "Reliable", "Passionate", "Altruistic"],
      weaknesses: ["Unrealistic", "Overly Idealistic", "Condescending"],
      relationships: "Dedicated partners who put a lot of effort into the relationship and their partner's happiness.",
      career: "They excel in people-oriented roles like Teaching, Public Relations, or Human Resources."
    },
    id: {
      name: "Protagonis",
      desc: "Pemimpin karismatik yang jago banget ngomong. Hobi banget bantuin orang lain buat berkembang. Main character energy.",
      quote: "Apapun yang lo lakuin sekarang bakal ngaruh ke orang lain. Lo bisa nyebarin semangat atau kecemasan.",
      strengths: ["Enak Diajak Ngobrol", "Bisa Diandalkan", "Semangat", "Suka Nolong"],
      weaknesses: ["Kurang Realistis", "Terlalu Idealis", "Kadang Merendahkan"],
      relationships: "Pasangan yang totalitas banget. Rela lakuin apa aja demi kebahagiaan ayang.",
      career: "Jago di bidang yang ngurusin orang kayak Guru, PR, atau HRD."
    },
  },
  ENFP: {
    group: "Diplomats",
    color: "border-green-500 shadow-green-500/20",
    textColor: "text-green-600 dark:text-green-400",
    en: {
      name: "Campaigner",
      desc: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
      quote: "It doesn't interest me what you do for a living. I want to know what you ache for.",
      strengths: ["Curious", "Observant", "Energetic", "Excellent Communicator"],
      weaknesses: ["Poor Practical Skills", "Find it Difficult to Focus", "Overthink Things"],
      relationships: "Warm and adventurous lovers who are always looking for new ways to connect emotionally.",
      career: "They need variety and creativity, fitting well in Journalism, Entertainment, or Event Planning."
    },
    id: {
      name: "Juru Kampanye",
      desc: "Antusias, kreatif, dan jiwa bebas banget. Selalu nemu alasan buat senyum di situasi apapun.",
      quote: "Gue gak peduli kerjaan lo apa. Gue mau tau apa yang bikin hati lo bergetar.",
      strengths: ["Kepo Positif", "Jago Mengamati", "Energik", "Jago Ngomong"],
      weaknesses: ["Kurang Praktis", "Susah Fokus", "Overthinking"],
      relationships: "Pasangan yang hangat dan petualang. Selalu cari cara baru buat bonding emosional.",
      career: "Butuh variasi dan kreativitas. Cocok di Jurnalisme, Entertainment, atau Event Organizer."
    },
  },

  // --- SENTINELS ---
  ISTJ: {
    group: "Sentinels",
    color: "border-blue-500 shadow-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
    en: {
      name: "Logistician",
      desc: "Practical and fact-minded individuals, whose reliability cannot be doubted. They value tradition and order.",
      quote: "My observation is that whenever one person is found adequate to the discharge of a duty... it is worse executed by two persons.",
      strengths: ["Honest", "Direct", "Strong-willed", "Responsible"],
      weaknesses: ["Stubborn", "Insensitive", "Always by the Book", "Judgmental"],
      relationships: "Dependable and loyal partners who show love through actions and stability rather than grand gestures.",
      career: "They prefer structured environments like Accounting, Military, Law, or Data Analysis."
    },
    id: {
      name: "Ahli Logistik",
      desc: "Praktis dan fakta banget. Keandalannya gak usah diragukan lagi. Menghargai tradisi dan ketertiban.",
      quote: "Satu orang yang kompeten itu lebih baik daripada dua orang yang ngerjain hal yang sama tapi berantakan.",
      strengths: ["Jujur", "To The Point", "Teguh Pendirian", "Tanggung Jawab"],
      weaknesses: ["Keras Kepala", "Gak Peka", "Kaku Banget", "Suka Menghakimi"],
      relationships: "Pasangan setia yang bisa diandelin. Cara mereka nunjukin cinta itu lewat kestabilan, bukan gombalan.",
      career: "Suka lingkungan terstruktur kayak Akuntansi, Militer, Hukum, atau Analisis Data."
    },
  },
  ISFJ: {
    group: "Sentinels",
    color: "border-blue-500 shadow-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
    en: {
      name: "Defender",
      desc: "Very dedicated and warm protectors, always ready to defend their loved ones.",
      quote: "Love only grows by sharing. You can only have more for yourself by giving it away to others.",
      strengths: ["Supportive", "Reliable", "Patient", "Imaginative"],
      weaknesses: ["Humble", "Take Things Personally", "Repress Their Feelings"],
      relationships: "Committed and caring partners who prioritize their family and home harmony above all else.",
      career: "They thrive in service roles like Nursing, Teaching, Customer Service, or Administration."
    },
    id: {
      name: "Pembela",
      desc: "Pelindung yang hangat dan dedikasi tinggi. Selalu siap pasang badan buat orang tersayang.",
      quote: "Cinta itu tumbuh karena berbagi. Semakin banyak lo ngasih, semakin banyak yang lo dapet.",
      strengths: ["Supportive", "Bisa Diandalkan", "Sabar", "Imajinatif"],
      weaknesses: ["Terlalu Merendah", "Baperan", "Suka Mendam Perasaan"],
      relationships: "Pasangan yang peduli banget. Keluarga dan keharmonisan rumah itu prioritas nomor satu.",
      career: "Cocok di bidang pelayanan kayak Perawat, Guru, CS, atau Admin."
    },
  },
  ESTJ: {
    group: "Sentinels",
    color: "border-blue-500 shadow-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
    en: {
      name: "Executive",
      desc: "Excellent administrators, unsurpassed at managing things - or people.",
      quote: "Good order is the foundation of all things.",
      strengths: ["Dedicated", "Strong-willed", "Direct", "Honest"],
      weaknesses: ["Inflexible", "Uncomfortable with Unconventional Situations", "Judgmental"],
      relationships: "Stable and responsible partners who take their commitments very seriously, though they may struggle with emotions.",
      career: "Natural managers who excel in Business Administration, Law Enforcement, or Finance."
    },
    id: {
      name: "Eksekutif",
      desc: "Administrator handal. Jago banget ngatur barang atau orang. Gak ada yang bisa ngalahin skill manajemennya.",
      quote: "Ketertiban itu pondasi dari segalanya, bro.",
      strengths: ["Dedikasi Tinggi", "Kemauan Kuat", "Langsung", "Jujur"],
      weaknesses: ["Gak Fleksibel", "Gak Suka Hal Aneh", "Suka Ngejudge"],
      relationships: "Pasangan stabil dan bertanggung jawab. Komitmen itu harga mati, tapi mungkin agak kaku soal emosi.",
      career: "Manajer alami. Jago di Admin Bisnis, Kepolisian, atau Keuangan."
    },
  },
  ESFJ: {
    group: "Sentinels",
    color: "border-blue-500 shadow-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
    en: {
      name: "Consul",
      desc: "Extraordinarily caring, social and popular people, always eager to help.",
      quote: "Encourage, lift and strengthen one another. For the positive energy spread to one will be felt by us all.",
      strengths: ["Strong Practical Skills", "Strong Sense of Duty", "Very Loyal", "Sensitive"],
      weaknesses: ["Worried about their Social Status", "Inflexible", "Vulnerable to Criticism"],
      relationships: "Very supportive and traditional partners who want to feel appreciated and build a strong family unit.",
      career: "Great at connecting with others in roles like Sales, Healthcare, or Social Work."
    },
    id: {
      name: "Konsul",
      desc: "Orang yang super peduli, sosial, dan populer. Selalu gercep kalau ada yang butuh bantuan.",
      quote: "Saling dukung dan kuatin satu sama lain. Energi positif lo bakal kerasa buat kita semua.",
      strengths: ["Skill Praktis Oke", "Tanggung Jawab", "Setia Banget", "Peka"],
      weaknesses: ["Gila Hormat", "Kaku", "Gak Tahan Kritik"],
      relationships: "Pasangan yang suportif dan tradisional. Pengen banget dihargai dan bangun keluarga harmonis.",
      career: "Jago konek sama orang, kayak di Sales, Kesehatan, atau Pekerjaan Sosial."
    },
  },

  // --- EXPLORERS ---
  ISTP: {
    group: "Explorers",
    color: "border-yellow-500 shadow-yellow-500/20",
    textColor: "text-yellow-600 dark:text-yellow-400",
    en: {
      name: "Virtuoso",
      desc: "Bold and practical experimenters, masters of all kinds of tools.",
      quote: "I wanted to live deep and suck out all the marrow of life.",
      strengths: ["Optimistic", "Creative", "Spontaneous", "Rational"],
      weaknesses: ["Stubborn", "Insensitive", "Private and Reserved", "Easily Bored"],
      relationships: "Independent partners who need their own space but enjoy shared activities and adventures.",
      career: "Hands-on work suits them best, like Engineering, Mechanics, Forensics, or Construction."
    },
    id: {
      name: "Pengrajin",
      desc: "Eksperimentator yang berani dan praktis. Jago banget pake segala macem alat.",
      quote: "Gue pengen hidup seutuhnya dan nikmatin setiap detiknya.",
      strengths: ["Optimis", "Kreatif", "Spontan", "Rasional"],
      weaknesses: ["Keras Kepala", "Gak Peka", "Tertutup", "Gampang Bosan"],
      relationships: "Pasangan mandiri yang butuh 'me time', tapi seneng kalau diajak petualangan bareng.",
      career: "Kerja lapangan paling cocok, kayak Teknik, Mekanik, Forensik, atau Konstruksi."
    },
  },
  ISFP: {
    group: "Explorers",
    color: "border-yellow-500 shadow-yellow-500/20",
    textColor: "text-yellow-600 dark:text-yellow-400",
    en: {
      name: "Adventurer",
      desc: "Flexible and charming artists, always ready to explore and experience something new.",
      quote: "I change during the course of a day. I wake and I'm one person, and when I go to sleep I know for certain I'm somebody else.",
      strengths: ["Charming", "Sensitive to Others", "Imaginative", "Passionate"],
      weaknesses: ["Fiercely Independent", "Unpredictable", "Easily Stressed"],
      relationships: "Gentle and caring partners who express love through actions and shared experiences rather than words.",
      career: "They need creative freedom, often choosing Fashion, Photography, or Interior Design."
    },
    id: {
      name: "Petualang",
      desc: "Seniman yang fleksibel dan menawan. Selalu siap buat eksplor hal-hal baru.",
      quote: "Gue berubah tiap saat. Pagi gue siapa, malem gue bisa jadi orang yang beda lagi.",
      strengths: ["Mempesona", "Peka sama Orang", "Imajinatif", "Passionate"],
      weaknesses: ["Terlalu Mandiri", "Susah Ditebak", "Gampang Stres"],
      relationships: "Pasangan lembut yang nunjukin cinta lewat tindakan, bukan cuma omong doang.",
      career: "Butuh kebebasan kreatif, sering milih Fashion, Fotografi, atau Desain Interior."
    },
  },
  ESTP: {
    group: "Explorers",
    color: "border-yellow-500 shadow-yellow-500/20",
    textColor: "text-yellow-600 dark:text-yellow-400",
    en: {
      name: "Entrepreneur",
      desc: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
      quote: "Life is either a daring adventure or nothing at all.",
      strengths: ["Bold", "Rational", "Practical", "Perceptive"],
      weaknesses: ["Insensitive", "Impatient", "Risk-prone", "Unstructured"],
      relationships: "Fun-loving and spontaneous partners who keep things exciting but may struggle with long-term planning.",
      career: "Action-oriented careers like Sales, Business, Emergency Services, or Sports."
    },
    id: {
      name: "Pengusaha",
      desc: "Pinter, energik, dan peka banget. Suka hidup yang menantang dan berisiko.",
      quote: "Hidup itu antara petualangan yang berani atau gak sama sekali.",
      strengths: ["Berani", "Rasional", "Praktis", "Peka Situasi"],
      weaknesses: ["Gak Peka Perasaan", "Gak Sabaran", "Hobi Ambil Risiko", "Berantakan"],
      relationships: "Pasangan seru yang spontan. Hubungan gak bakal bosenin, tapi mungkin susah diajak mikir jangka panjang.",
      career: "Karir penuh aksi kayak Sales, Bisnis, Tim SAR, atau Atlet."
    },
  },
  ESFP: {
    group: "Explorers",
    color: "border-yellow-500 shadow-yellow-500/20",
    textColor: "text-yellow-600 dark:text-yellow-400",
    en: {
      name: "Entertainer",
      desc: "Spontaneous, energetic and enthusiastic people - life is never boring around them.",
      quote: "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle.",
      strengths: ["Bold", "Original", "Aesthetics", "Observant"],
      weaknesses: ["Sensitive", "Conflict-Averse", "Easily Bored", "Poor Long-term Planners"],
      relationships: "Warm and affectionate partners who love to lavish attention on their loved ones and have fun.",
      career: "They love social interaction and attention, excelling in Event Planning, Sales, or Performing Arts."
    },
    id: {
      name: "Penghibur",
      desc: "Spontan, energik, dan antusias. Hidup gak bakal ngebosenin kalau ada mereka.",
      quote: "Gue egois, gak sabaran, dan agak insecure. Gue bikin salah, dan kadang susah diatur.",
      strengths: ["Berani Tampil", "Orisinal", "Estetik", "Jago Mengamati"],
      weaknesses: ["Sensitif", "Anti Konflik", "Gampang Bosan", "Gak Bisa Planning"],
      relationships: "Pasangan yang hangat dan manja. Suka banget ngasih perhatian ke ayang dan have fun bareng.",
      career: "Suka jadi pusat perhatian, cocok di Event Organizer, Sales, atau Seni Pertunjukan."
    },
  },
};