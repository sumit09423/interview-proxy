export const SERVICES = [
  {
    id: "interview-proxy",
    title: "Interview Proxy",
    subtitle: "We Sit, You Get Hired",
    description:
      "Our seasoned professionals attend your technical and HR interviews on your behalf. With deep domain expertise across 50+ technologies, we ensure flawless performance that lands you the offer.",
    features: [
      "Live technical interview handling",
      "Real-time coding assessments",
      "Behavioral & HR round coverage",
      "Confidential & undetectable process",
    ],
    icon: "🎭",
    accent: "#00E5A0",
    stat: "98%",
    statLabel: "Success Rate",
  },
  {
    id: "mock-interview",
    title: "Mock Interview",
    subtitle: "Practice Until Perfect",
    description:
      "Rigorous mock sessions with industry veterans from FAANG and top-tier companies. Get brutal, honest feedback and actionable strategies to crack any interview round.",
    features: [
      "1-on-1 with FAANG interviewers",
      "System design deep-dives",
      "DSA problem-solving sessions",
      "Detailed feedback & improvement plan",
    ],
    icon: "🎯",
    accent: "#7B61FF",
    stat: "5000+",
    statLabel: "Sessions Done",
  },
  {
    id: "background-verification",
    title: "Background Verification",
    subtitle: "Clean Records, Clear Path",
    description:
      "Comprehensive background check preparation and verification support. We ensure your professional history, education credentials, and employment records are accurate and verification-ready.",
    features: [
      "Employment history alignment",
      "Education credential verification",
      "Reference check preparation",
      "Document & record management",
    ],
    icon: "🛡️",
    accent: "#FF6B35",
    stat: "100%",
    statLabel: "Clean Reports",
  },
  {
    id: "job-support",
    title: "Job Support",
    subtitle: "Survive & Thrive On The Job",
    description:
      "Struggling with tasks at your new role? Our experts provide real-time assistance for your day-to-day work — from debugging production issues to completing sprint deliverables on time.",
    features: [
      "3 hours daily expert assistance",
      "Extended hours available on demand",
      "Code reviews & debugging help",
      "Sprint deliverable support",
      "Technology ramp-up guidance",
    ],
    icon: "🚀",
    accent: "#00B4D8",
    stat: "2000+",
    statLabel: "Professionals Helped",
  },
];

export const SETUP_DOC_LINK =
  "https://docs.google.com/document/d/1g0kqkE27k47tuczT_QY4uYWv26w-EO9G9SjT7drkYXY/edit?pli=1&tab=t.0";

export const SETUP_GUIDE = [
  {
    step: "01",
    title: "System & Audio Setup",
    icon: "🖥️",
    items: [
      "Chrome Remote Desktop will be used for remote access. Make sure it's properly installed and configured before the interview.",
      "Otter.ai will be used for real-time voice-to-text assistance and prompt reading.",
      "Use simple wired headphones (non-Bluetooth preferred) — they have zero noise cancellation and provide a more natural sound environment.",
      "Avoid using AirPods or noise-cancelling headphones, as they may block prompt audio or interfere with Otter's recognition.",
      "Verify headphone settings — ensure noise cancellation or spatial audio is turned off.",
    ],
  },
  {
    step: "02",
    title: "Voice & Prompt Coordination",
    icon: "🎙️",
    items: [
      "We'll connect on Google Meet for voice coordination and prompt delivery.",
      "You'll hear the expert's voice through your headphones and communicate directly with the interviewer.",
      "Keep the Meet tab minimized or muted on the laptop to avoid echo, but keep the microphone active for communication.",
    ],
  },
  {
    step: "03",
    title: "Using Otter for Prompts",
    icon: "🧠",
    items: [
      "Initially, open Otter.ai on your laptop alongside the interview window. This allows you to see real-time prompts and guidance during the conversation.",
      "If the interviewer asks you to share your full screen, switch to using Otter on your phone instead.",
      "Open the same Otter session on your mobile browser or app.",
      "Place your phone in front of your laptop, just below the webcam, so you can read prompts naturally.",
    ],
  },
  {
    step: "04",
    title: "Additional Recommendations",
    icon: "✅",
    items: [
      "Test all tools (Chrome Remote Desktop, Meet, and Otter) at least 30 minutes before the interview.",
      "Close all unnecessary tabs and background apps to reduce lag.",
      "Have a backup internet connection (e.g., mobile hotspot) ready.",
      "Keep a bottle of water nearby and stay calm — the expert handles the rest behind the scenes.",
    ],
  },
];

export const TEAM_SDE = [
  { name: "Shubham Verma", role: "Software Engineer", company: "Microsoft", isLead: true, avatar: "hacker" },
  { name: "Sid", role: "Software Engineer", company: "Anonymous Company", avatar: "default" },
  { name: "Ravi", role: "Software Engineer", company: "Amazon", avatar: "default" },
  { name: "Ronnie", role: "Software Engineer", company: "Anonymous Company", avatar: "default" },
  { name: "Dinesh", role: "Software Engineer", company: "Anonymous Company", avatar: "default" },
];

export const TEAM_DE = [
  { name: "Harsh", role: "Data Engineer", company: "Goldman Sachs", avatar: "default" },
  { name: "Sunny", role: "Data Engineer", company: "Anonymous Company", avatar: "default" },
];

export const TEAM_DEVOPS = [{ name: "Raj", role: "DevOps Engineer", company: "Zepto", avatar: "default" }];

export const TESTIMONIALS = [
  {
    name: "Rajesh K.",
    role: "Software Engineer → Senior SDE @ Amazon",
    text: "The interview proxy service was a game-changer. Landed a role I never thought possible. Absolutely seamless experience.",
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Fresher → SDE-1 @ Microsoft",
    text: "Mock interviews gave me the confidence I desperately needed. The feedback was brutally honest but incredibly helpful.",
    rating: 5,
  },
  {
    name: "Anil S.",
    role: "QA Engineer → DevOps @ Google",
    text: "Job support helped me survive my first 90 days. Without their daily assistance, I would have been completely lost.",
    rating: 5,
  },
];

export const PROCESS_STEPS = [
  { step: "01", title: "Connect", desc: "Reach out via WhatsApp or email. Tell us your requirements." },
  { step: "02", title: "Strategize", desc: "We analyze your profile and create a tailored action plan." },
  { step: "03", title: "Execute", desc: "Our experts step in and deliver results with precision." },
  { step: "04", title: "Succeed", desc: "You land the role, clear verification, and thrive at work." },
];

export const WHATSAPP_LINK = `https://wa.me/919649224523?text=${encodeURIComponent("Hi, I'm interested in your services. Please share more details.")}`;
export const WHATSAPP_COMMUNITY = "https://chat.whatsapp.com/EUnxXypvR6tIfAVSEobufs";
export const EMAIL = "proxyinterview980@gmail.com";

export const COMMUNITY_PERKS = [
  { icon: "💼", title: "Daily Job Postings", desc: "Fresh openings from top tech companies — FAANG, startups, and more" },
  { icon: "🚨", title: "Urgent Hiring Alerts", desc: "Be the first to know about hot roles with quick turnaround" },
  { icon: "💰", title: "Salary Insights", desc: "Real compensation data and negotiation tips from insiders" },
  { icon: "🤝", title: "Direct Referrals", desc: "Get referred by our network of 50+ industry professionals" },
  { icon: "📋", title: "Resume & Profile Reviews", desc: "Weekly tips on optimizing your resume and LinkedIn profile" },
  { icon: "🔔", title: "Interview Prep Alerts", desc: "Company-specific interview experiences shared regularly" },
];
