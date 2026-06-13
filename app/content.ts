export const domains = [
  {
    name: "Technology",
    slug: "technology",
    image: "https://unsplash.com/photos/HKnvq4krutI/download?force=true",
    imageAlt: "Male students coding on laptops in a classroom",
    line: "Build practical capability in the tools shaping modern work.",
    about:
      "Technology covers the practical systems, tools, and workflows behind modern digital work. It matters because nearly every field now depends on people who can understand software, automation, data, and emerging technical trends.",
    outcome:
      "Students can expect to gain hands-on confidence, clearer technical judgment, and readiness to keep learning in fast-moving professional environments.",
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
    line: "Understand markets, teams, and decisions with real-world clarity.",
    about:
      "Business introduces the ideas and tools students need to understand organizations, markets, and professional decision-making. It is for learners interested in entrepreneurship, management, communication, and practical career readiness.",
    outcome:
      "Students leave with sharper workplace thinking, stronger communication habits, and a better sense of how ideas become sustainable work.",
    themes: [
      "Entrepreneurship",
      "Management basics",
      "Professional communication",
      "Business analysis",
    ],
    courses: ["Domain-focused cohorts"],
  },
  {
    name: "Leadership & Humanities",
    slug: "leadership-humanities",
    image: "https://unsplash.com/photos/uzePm5Hy-Q0/download?force=true",
    imageAlt: "Male instructor speaking to students in a classroom",
    line: "Grow the judgment, character, and perspective behind meaningful work.",
    about:
      "Leadership and humanities focus on the moral, intellectual, and social foundations of effective contribution. This domain is for students who want to think deeply, communicate clearly, and lead with responsibility.",
    outcome:
      "Students develop stronger judgment, personal discipline, civic awareness, and the ability to connect ideas with meaningful action.",
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
    duration: "4-6 weeks",
    mode: "In-person / Online",
    status: "Upcoming",
    description:
      "A practical short-course format designed to help students move beyond classroom theory and build useful skills through guided sessions.",
    about:
      "This course format closes the gap between routine academic study and the practical knowledge students need in modern fields. Sessions are built around direct explanation, field examples, guided practice, and a concrete sense of where the skill is used professionally.",
    takeaway:
      "Students walk away with clearer foundations, applied exposure, and a roadmap for continued learning in the selected domain.",
    audience:
      "This is suitable for university and college students, early-career learners, and motivated young professionals who want structured weekend learning without committing to a long program.",
    prerequisites: ["Basic computer literacy", "Interest in the selected domain"],
    sessions: [
      "Topic foundation",
      "Applied concepts",
      "Guided practice",
      "Field workflow",
      "Project or case work",
      "Review and next steps",
    ],
    fee: "PKR [2000]",
    seats: "Limited",
  },
  {
    title: "Practitioner-led workshops",
    domain: "Leadership & Humanities",
    image: "https://unsplash.com/photos/uzePm5Hy-Q0/download?force=true",
    imageAlt: "Male instructor leading a classroom discussion",
    duration: "6 sessions",
    mode: "Weekend",
    status: "Opening soon",
    description:
      "Focused workshops taught by experienced practitioners who connect concepts with real field experience.",
    about:
      "These workshops are designed for students who want exposure to how ideas, tools, and decisions work outside textbooks. Each session centers on a field-relevant theme and gives students practical vocabulary, examples, and direction.",
    takeaway:
      "Students gain perspective, usable frameworks, and confidence to explore a field with more seriousness.",
    audience:
      "Best for students exploring career directions, leadership roles, creative work, or professional development opportunities.",
    prerequisites: ["No prior background required"],
    sessions: [
      "Field overview",
      "Core concepts",
      "Practitioner examples",
      "Applied discussion",
      "Student exercise",
      "Reflection and guidance",
    ],
    fee: "PKR [2500]",
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
      "A cohort-based learning path organized around one domain and its most useful themes.",
    about:
      "This format helps students understand a field as a connected landscape rather than isolated topics. Learners explore the domain, key sub-fields, professional expectations, and the skills that matter most right now.",
    takeaway:
      "Students leave with domain awareness, practical next steps, and a clearer path for future study or work.",
    audience:
      "Ideal for students choosing a direction, preparing for internships, or looking for guided exposure before deeper specialization.",
    prerequisites: ["Curiosity about the domain", "Commitment to weekend sessions"],
    sessions: [
      "Domain introduction",
      "Key themes",
      "Current trends",
      "Professional pathways",
      "Applied case",
      "Portfolio of next steps",
    ],
    fee: "PKR [3000]",
    seats: "Limited",
  },
];

export const registrationSections = [
  {
    title: "Personal Information",
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
    title: "Academic Information",
    items: ["Institution name", "Degree program", "Current year of study"],
  },
  {
    title: "Course Selection",
    items: [
      "Select a Course dropdown listing currently open courses organized by domain",
      "Selected course auto-populates fee and mode details so the student knows exactly what they are signing up for",
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
