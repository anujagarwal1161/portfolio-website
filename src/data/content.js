export const SKILLS = [
  { name: "Python", level: 100, category: "Backend" },
  { name: "Django", level: 100, category: "Backend" },
  { name: "FastAPI", level: 100, category: "Backend" },
  { name: "Spring Boot", level: 85, category: "Backend" },
  { name: "Java", level: 90, category: "Backend" },
  { name: "HTML", level: 85, category: "frontend" },
  { name: "CSS", level: 85, category: "frontend" },
  { name: "Javascript", level: 85, category: "frontend" },
  { name: "ReactJS", level: 85, category: "frontend" },

  { name: "PostgreSQL", level: 100, category: "Database" },
  { name: "Docker / K8s", level: 90, category: "DevOps" },
  { name: "AWS / GCP", level: 75, category: "DevOps" },
];

export const PROJECTS = [
  {
    slug: "msedcl",
    title: "Maharashtra State Electricity Distribution Corporation Limited (MSEDCL)",
    tag: "Whatsapp Chatbot",
    desc: "Integrated MSEDCL (Maharashtra State Electricity Distribution Company Limited) consumer services into a WhatsApp chatbot, enabling features such as electricity bill payment, bill download, complaint registration, solar application, and complaint status tracking, improving customer self-service and automation.",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Celery"],
    color: "#00ffe7",
    year: "2026",
    caseStudy: {
      headline: "Inference-style automation platform for citizen and employee utility services",
      problem:
        "MSEDCL needed a scalable self-service platform for both consumers and employees across WhatsApp, reducing dependency on call centers and manual service desks while supporting high request volumes and real-time integrations.",
      approach:
        "Built scalable WhatsApp chatbot workflows using Python, Django, Redis, and API orchestration layers. Integrated consumer services including bill payment, bill download, complaint registration, complaint tracking, and solar applications. Developed employee self-service flows for salary slips, leave management, and Mahavitaran operations with secure authentication and backend automation.",
      metrics: [
        "Reduced manual support dependency through automated WhatsApp-first workflows",
        "Improved response time and scalability using Redis caching and optimized backend processing",
        "Supported high-availability service orchestration for large-scale citizen interactions",
        "Delivered unified consumer and employee automation platform on WhatsApp"
      ],
      architecture:
        "WhatsApp gateway → chatbot orchestration layer → authentication service → MSEDCL APIs → Redis cache → PostgreSQL → async notification services → monitoring dashboards.",
    },
  },
  {
    slug: "BMC",
    title: "Bhubaneswar Municipal Corporation (BMC)",
    tag: "Whatsapp Chatbot",
    desc: "Designed and developed a WhatsApp-based municipal service platform using Python and Django. Integrated workflows for property tax payments, trade license applications, Kalyana Mandap bookings, and water tank reservations. Implemented secure transaction handling and scalable backend processing for concurrent requests.",
    stack: ["Python", "Django", "PostgreSQL", "Redis", "Celery", "Payments"],
    color: "#bf00ff",
    year: "2025",
    caseStudy: {
      headline: "Digital municipal services platform for citizen automation",
      problem: "Citizens relied heavily on physical municipal offices for tax payments, license applications, and utility bookings, leading to operational inefficiencies and long turnaround times.",
      approach: "Designed and developed a WhatsApp-based municipal service platform using Python and Django. Integrated workflows for property tax payments, trade license applications, Kalyana Mandap bookings, and water tank reservations. Implemented secure transaction handling and scalable backend processing for concurrent requests.",
      metrics: [
        "Digitized multiple citizen-facing municipal services into a single conversational platform",
        "Improved accessibility and reduced dependency on offline processes",
        "Engineered infrastructure capable of handling thousands of daily transactions",
        "Simplified payment and booking experiences through WhatsApp automation"
      ],
      architecture: "WhatsApp interface → API gateway → service orchestration engine → municipal service APIs → payment gateway integrations → PostgreSQL → notification and audit systems.",
    },
  },
  {
    slug: "Auth Service",
    title: "Authentication and Authorization Service (Microservice)",
    tag: "Microservice",
    desc: "Built a standalone authentication and authorization microservice using Django and PostgreSQL. Implemented MPIN-based login, token generation, permission validation, role-based access control, and business token workflows. Designed scalable APIs for secure inter-service communication and permission management.",
    stack: ["Python", "Django", "PostgreSQL", "JWT", "Celery"],
    color: "#ff6a00",
    year: "2024",
    caseStudy: {
      headline: "Centralized auth platform for multi-tenant fintech systems",
      problem: "Multiple business systems required secure authentication, fine-grained authorization, and token validation across users, merchants, and business entities without tightly coupling services.",
      approach: "Built a standalone authentication and authorization microservice using Django and PostgreSQL. Implemented MPIN-based login, token generation, permission validation, role-based access control, and business token workflows. Designed scalable APIs for secure inter-service communication and permission management.",
      metrics: [
        "Centralized authentication for multiple business platforms",
        "Improved security and permission governance across services",
        "Enabled scalable token validation and authorization flows",
        "Simplified integration for downstream fintech applications"
      ],
      architecture: "Client applications → auth gateway → token generation service → RBAC/permission engine → PostgreSQL → JWT validation layer → business and merchant APIs.",
    },
  },
  {
    slug: "MMMOCL",
    title: "Mumbai Metro WhatsApp Ticketing System (MMMOCL)",
    tag: "Whatsapp-Chatbot",
    desc: "Developed a complete metro ticket booking platform integrated with the Route Mobile chatbot ecosystem using Python and Django. Engineered end-to-end flows for station selection, passenger handling, payment processing, and ticket generation. Integrated secure payment gateways with transaction validation and callback handling.",
    stack: ["Python", "Django", "PostgreSQL", "Celery", "Payments"],
    color: "#00ff88",
    year: "2025",
    caseStudy: {
      headline: "WhatsApp-native metro ticketing and payment platform",
      problem: "Mumbai Metro required a frictionless digital ticketing experience directly inside WhatsApp, supporting secure payments, instant ticket delivery, and high concurrent booking traffic.",
      approach: "Developed a complete metro ticket booking platform integrated with the Route Mobile chatbot ecosystem using Python and Django. Engineered end-to-end flows for station selection, passenger handling, payment processing, and ticket generation. Integrated secure payment gateways with transaction validation and callback handling.",
      metrics: [
        "Enabled seamless metro ticket booking directly on WhatsApp",
        "Reduced friction in ticket purchasing and delivery workflows",
        "Supported scalable transaction processing for high user traffic",
        "Improved operational efficiency with automated ticket generation"
      ],
      architecture: "WhatsApp chatbot → booking orchestration service → fare calculation engine → payment gateway integrations → ticket generation service → QR/ticket delivery → monitoring and logging systems.",
    },
  },
];

export const TIMELINE = [
  { year: "2026", role: "Senior Software Engineer", company: "Pelocal Fintech Private Limited", desc: "Owned the AI Chatbot engine backend." },
  { year: "2024", role: "Software Engineer", company: "Pelocal Fintech Private Limited", desc: "Built and deployed 15+ scalable backend systems for enterprise clients" },
  { year: "2024", role: "CS Graduate", company: "JSS Academy of Technical Education Noida", desc: "B.Tech Computer Science — Graduated with distinction." },
];

export const IMPACT_LINES = [
  "Designed and implemented a standalone authentication backend, enhancing security and streamlining user verification for high-volume applications.",
  "Optimized DTC and DMRC systems by introducing Redis caching and load balancing, reducing response times by​ 40% and improving scalability to handle over 200,000 daily transactions.",
  "Developed the Mumbai Metro WhatsApp Ticketing System by integrating with the Route Mobile chatbot platform, implementing secure payment gateway integration, and engineering a seamless end-to-end ticket booking flow using Python, Django, SOLID principles, and scalable system design concepts.",
  "Spearheaded initiatives to optimize code and manage traffic across servers, reducing operational costs by 15%.",
  "Integrated and maintained multiple payment gateways including Zaakpay, PayU, and SBI ePay, enabling secure and reliable payment processing across fintech workflows; worked closely with gateway documentation, callbacks, checksum validation, and transaction reconciliation.",
  "Engineered advanced LLM-based workflows using LangChain and LangGraph, enabling multi-step reasoning, context-aware conversations, and automated task orchestration.",
  "Implemented scalable AI pipeline architecture integrating prompt engineering, API orchestration, and real-time decision flows, enhancing chatbot accuracy, responsiveness, and user engagement."
];

export const TESTIMONIALS = [
  {
    quote: "The rare engineer who can zoom from kernel-level performance to product narrative in the same meeting.",
    name: "Rohit Verma",
    role: "Tech Lead",
  },
  {
    quote: "Our most dependable owner on production — clear runbooks, fast incident response, and honest timelines.",
    name: "Padmaja Shukla",
    role: "Chief Technology Officer",
  },
];

export const USES_STACK = {
  hardware: [
    { name: "14\" laptop", note: "32GB RAM · primary dev machine" },
    { name: "Ergonomic desk + chair", note: "Long-session friendly" },
  ],
  software: [
    { name: "Editor", note: "Cursor / VS Code" },
    { name: "Terminal", note: "Ghostty / Alacritty + tmux" },
    { name: "Design", note: "Figma for UI specs" },
    { name: "APIs", note: "Insomnia / curl" },
  ],
  stack: [
    "React 19",
    "React Router 7",
    "NPM"
  ],
};

export const BLOG_POSTS = [
  {
    slug: "shipping-slo-thinking",
    title: "Shipping with SLO thinking (even before you have an SRE team)",
    date: "2026-03-12",
    excerpt: "Error budgets, who owns them, and how to talk about risk with product.",
    body: `You do not need a dedicated SRE org to behave like one. Start by naming one golden signal per critical path — usually latency or success rate — and write down what "good" means for a week.

Product will ask for features; your job is to translate reliability into opportunity cost. An error budget is just shared vocabulary: when the budget is thin, you fix debt; when it is healthy, you ship boldly.

I keep a one-page runbook per service: dependencies, dashboards, rollback, and who to ping. The goal is not perfection; it is predictable recovery.`,
  },
  {
    slug: "inference-latency-checklist",
    title: "A practical checklist for inference latency",
    date: "2026-01-28",
    excerpt: "Batching, caching, and the boring wins that beat a bigger GPU.",
    body: `Before you buy more silicon, measure where time goes: tokenization, queueing, GPU, or post-processing. Most teams find queueing and serialization dominate.

Coalesce requests where safety allows. Cache embeddings for stable prefixes. Prefer streaming UX so perceived latency drops even when total work is similar.

Finally, treat model versions like schema migrations: canary, metrics, rollback. The GPU is only as good as your deployment discipline.`,
  },
  {
    slug: "readable-incident-reviews",
    title: "Incident reviews people actually read",
    date: "2025-11-04",
    excerpt: "Blameless does not mean vague — be specific about mechanisms and guardrails.",
    body: `The best postmortems answer: what broke, how we noticed, how we mitigated, and what we changed so a smart newcomer would not repeat the mistake.

Attach timelines, not novels. Link dashboards. Assign owners and dates. If leadership only skims, put the three takeaways at the top.

Over time these documents become your institutional memory — far more valuable than another roadmap slide deck.`,
  },
];
