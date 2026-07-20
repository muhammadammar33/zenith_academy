export const domains = [
  {
    name: "Technology",
    slug: "technology",
    image: "https://unsplash.com/photos/HKnvq4krutI/download?force=true",
    imageAlt: "Male students coding on laptops in a classroom",
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
    image: "https://unsplash.com/photos/7cahomYTo1U/download?force=true",
    imageAlt: "Four men working in a business meeting room with laptops",
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
    image: "https://unsplash.com/photos/uzePm5Hy-Q0/download?force=true",
    imageAlt: "Male instructor speaking to students in a classroom",
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
    image: "https://unsplash.com/photos/HKnvq4krutI/download?force=true",
    imageAlt: "Young men using laptops during a coding class",
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
    image: "https://unsplash.com/photos/uzePm5Hy-Q0/download?force=true",
    imageAlt: "Male instructor leading a classroom discussion",
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
    image: "https://unsplash.com/photos/7cahomYTo1U/download?force=true",
    imageAlt: "Men collaborating around laptops in a meeting room",
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

export const siteImages = {
  homeHero: {
    src: "https://unsplash.com/photos/HKnvq4krutI/download?force=true",
    alt: "Male students working on laptops in a classroom",
  },
  about:
    "https://unsplash.com/photos/tgANYv9U10Q/download?force=true",
  aboutAlt: "Male student sitting outdoors with a laptop and backpack",
  instructor:
    "https://unsplash.com/photos/uzePm5Hy-Q0/download?force=true",
  instructorAlt: "Male instructor teaching in a classroom",
  registration:
    "https://unsplash.com/photos/tgANYv9U10Q/download?force=true",
  registrationAlt: "Male student completing registration on a laptop",
  books:
    "https://unsplash.com/photos/xKR1_6Tfclo/download?force=true",
  booksAlt: "Young man sitting with books",
};
