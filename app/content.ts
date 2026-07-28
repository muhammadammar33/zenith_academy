export const domains = [
  {
    name: "Technology",
    slug: "technology",
    image: "/images/technology.JPG",
    imageAlt: "Students collaborating on laptops at a tech workshop",
    line: "Practice software, automation, data, and digital product workflows.",
    about:
      "Technology courses cover the systems and workflows behind modern digital work. Learners study software, automation, data, and current technical practice.",
    outcome:
      "Build technical judgment through guided practice, then leave with a clear route for continued study and project work.",
    themes: [
      "Software development",
      "Emerging technologies",
      "Digital product thinking",
      "Applied technical workflows",
    ],
    courses: ["New weekend courses", "Practitioner-led workshops"],
  },
  {
    name: "Business",
    slug: "business",
    image: "/images/registeration.JPG",
    imageAlt: "Young professionals building a project with a laptop and prototype",
    line: "Study how teams evaluate markets, communicate, and make decisions.",
    about:
      "Business courses introduce the tools used to assess organizations, markets, and professional decisions. Sessions cover entrepreneurship, management, communication, and business analysis.",
    outcome:
      "Practice structured analysis, present decisions clearly, and learn how an idea becomes sustainable work.",
    themes: [
      "Entrepreneurship",
      "Management basics",
      "Professional communication",
      "Business analysis",
    ],
    courses: ["Domain-focused cohorts"],
  },
  {
    name: "Leadership and humanities",
    slug: "leadership-humanities",
    image: "/images/instructor.JPG",
    imageAlt: "Students attending a leadership and tech conference session",
    line: "Develop the judgment, character, and communication required to lead.",
    about:
      "Leadership and humanities examine the moral, intellectual, and social foundations of responsible action. Learners practice critical thinking, communication, and civic judgment.",
    outcome:
      "Apply ethical frameworks to decisions, communicate ideas clearly, and connect reflection with responsible action.",
    themes: [
      "Leadership development",
      "Ethics and civic responsibility",
      "Critical thinking",
      "Communication and influence",
    ],
    courses: ["Practitioner-led workshops"],
  },
];

export const courses = [
  {
    title: "New weekend courses",
    domain: "Technology",
    image: "/images/technology.JPG",
    imageAlt: "Students coding together during a weekend workshop",
    duration: "4–6 weeks",
    mode: "In person / online",
    status: "Upcoming",
    description:
      "Build field foundations through 6 guided sessions, applied exercises, and a final case or project.",
    about:
      "Practicing professionals connect each concept to current field workflows. Every session combines direct instruction, a worked example, and guided practice.",
    takeaway:
      "Leave with completed practice work, a foundation in the selected field, and a next-step learning plan.",
    audience:
      "For university and college students, early-career practitioners, and young professionals seeking structured weekend study.",
    prerequisites: ["Basic computer literacy", "Interest in the selected domain"],
    sessions: [
      "Topic foundation",
      "Applied concepts",
      "Guided practice",
      "Field workflow",
      "Project or case work",
      "Review and next steps",
    ],
    fee: "PKR 2,000",
    seats: "Limited",
  },
  {
    title: "Practitioner-led workshops",
    domain: "Leadership and humanities",
    image: "/images/instructor.JPG",
    imageAlt: "Audience and speakers at a practitioner-led academy session",
    duration: "6 sessions",
    mode: "Weekend",
    status: "Opening soon",
    description:
      "Work through current field examples with a practitioner across 6 focused weekend sessions.",
    about:
      "Each workshop examines how a practitioner uses ideas, tools, and judgment outside the classroom. Sessions combine field examples, discussion, and an applied student exercise.",
    takeaway:
      "Leave with a working framework, relevant vocabulary, and direct feedback on an applied exercise.",
    audience:
      "For students exploring a profession, preparing for leadership, or strengthening a current area of study.",
    prerequisites: ["No prior background required"],
    sessions: [
      "Field overview",
      "Core concepts",
      "Practitioner examples",
      "Applied discussion",
      "Student exercise",
      "Reflection and guidance",
    ],
    fee: "PKR 2,500",
    seats: "Limited",
  },
  {
    title: "Domain-focused cohorts",
    domain: "Business",
    image: "/images/registeration.JPG",
    imageAlt: "Team collaborating on a laptop during a cohort workshop",
    duration: "Short course",
    mode: "Hybrid",
    status: "Upcoming",
    description:
      "Study one domain with a cohort through current trends, professional pathways, and an applied case.",
    about:
      "The cohort maps a field as a connected professional landscape. Learners examine its sub-fields, current expectations, and the skills used in active roles.",
    takeaway:
      "Leave with a field map, a completed case, and specific next steps for study, internships, or project work.",
    audience:
      "For students choosing a direction, preparing for internships, or evaluating a deeper specialization.",
    prerequisites: ["Curiosity about the domain", "Commitment to weekend sessions"],
    sessions: [
      "Domain introduction",
      "Key themes",
      "Current trends",
      "Professional pathways",
      "Applied case",
      "Portfolio of next steps",
    ],
    fee: "PKR 3,000",
    seats: "Limited",
  },
];

export const registrationSections = [
  {
    title: "Personal information",
    items: [
      "Full name",
      "CNIC number for identity verification and certification purposes",
      "Date of birth",
      "Gender",
      "Phone number",
      "Email address",
    ],
  },
  {
    title: "Academic information",
    items: [
      "Education level: school, college, graduation, or post graduation",
      "School or college: institution name and class",
      "Graduation: institution, degree program, and semester",
      "Post graduation: program type (MS, PhD, and related), field, and current stage",
    ],
  },
  {
    title: "Course selection",
    items: [
      "Choose from currently open courses, organized by domain",
      "Review the course fee and delivery mode before submitting",
      "Optional: join the domain community while registering",
    ],
  },
  {
    title: "Payment",
    items: [
      "Fee amount displayed clearly from the selected course",
      "Payment method such as bank transfer, JazzCash, EasyPaisa, or active channels",
      "Upload field for payment receipt or transaction screenshot",
    ],
  },
];

export const communitySections = [
  {
    title: "What communities are",
    items: [
      "Field-based groups for students and young professionals",
      "Space to meet peers across Technology, Business, and Leadership",
      "Separate from course enrollment — join even if you are not registering yet",
    ],
  },
  {
    title: "How to join",
    items: [
      "Choose the domain community that matches your interests",
      "Share your name, email, and phone so the academy can reach you",
      "Or join while registering for a course through the registration form",
    ],
  },
];

export const siteImages = {
  homeHero: {
    src: "/images/home_hero.jpeg",
    alt: "Capital Youth Expo audience filling a large auditorium",
  },
  about: "/images/student.JPG",
  aboutAlt: "Students collaborating on laptops at a learning event",
  instructor: "/images/instructor.JPG",
  instructorAlt: "Students attending a Future Vision and Codzilla conference session",
  registration: "/images/registeration.JPG",
  registrationAlt: "Students building a hardware project at a registration and workshop desk",
  books: "/images/books.JPG",
  booksAlt: "Students working on electronics and a circuit board at a hands-on workshop",
};
