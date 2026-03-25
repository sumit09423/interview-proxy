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

export const FAQ_DATA = [
  {
    q: "What is an interview proxy service?",
    a: "An interview proxy service is where a qualified expert attends your technical or HR interview on your behalf. HireQuest's proxy experts cover 50+ technologies including Java, Python, React, AWS, and more — with a 98% success rate across FAANG and top-tier companies.",
  },
  {
    q: "How much does an interview proxy cost?",
    a: "HireQuest's interview proxy service costs $200 per session, covering complete interview rounds including technical and HR. Mock interviews are available at $100 per session, and job support is $600/month for 3 hours of daily expert assistance.",
  },
  {
    q: "What technologies do your experts cover?",
    a: "Our 35+ experts cover Java, Python, React, Angular, Node.js, AWS, Android, iOS, Flutter, .NET, Go, PHP, Selenium, Salesforce, SAP, Kubernetes, Docker, Terraform, Tableau, Power BI, and 30+ more technologies across SDE, frontend, backend, mobile, QA, DevOps, data engineering, AI/ML, and cybersecurity domains.",
  },
  {
    q: "How does the interview proxy process work?",
    a: "We use Chrome Remote Desktop for secure remote access and Otter.ai for real-time voice-to-text prompting. You connect with our expert via Google Meet, wear wired headphones, and the expert handles all technical and behavioral questions. Full setup details are shared 24 hours before the interview.",
  },
  {
    q: "Is the service confidential?",
    a: "Yes, 100% confidential. All session data, interview recordings, and communication are handled with strict privacy. We never share client information or interview details with any third party.",
  },
  {
    q: "How do I book a session?",
    a: "Simply reach out via WhatsApp at +91 96492 24523 or email proxyinterview980@gmail.com. We respond within 30 minutes and offer a free initial consultation to understand your requirements.",
  },
  {
    q: "What is job support and how does it work?",
    a: "Job support provides daily on-the-job expert assistance — 3 hours per day at $600/month. Our dedicated expert helps with code reviews, debugging, sprint deliverables, and technology ramp-up. If you need more hours, extra days are covered automatically.",
  },
  {
    q: "Do you offer services for all interview platforms?",
    a: "Yes. We support Zoom, Google Meet, Microsoft Teams, HackerRank, CodeSignal, CoderPad, LeetCode, and all major interview platforms. Our experts are experienced with both live coding rounds and take-home assessments.",
  },
];
