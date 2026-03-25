import { useEffect } from "react";
import { EMAIL } from "../data/siteContent.js";

export const SEO_CONFIG = {
  title: "HireQuest — Interview Proxy, Mock Interviews, Job Support & Background Verification",
  description:
    "HireQuest offers professional interview proxy services ($200/session), mock interviews ($100/session), job support ($600/month), and background verification. 50+ technology experts from Microsoft, Amazon, Google & more. 98% success rate.",
  url: "https://hirequest.in",
  image: "https://hirequest.in/og-image.png",
  keywords:
    "interview proxy, interview proxy service, proxy interview, mock interview, job support, background verification, interview help, technical interview proxy, coding interview help, interview proxy India, interview proxy USA, FAANG interview prep, remote interview assistance, HireQuest",
};

function buildJsonLdSchemas() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "HireQuest",
      url: "https://hirequest.in",
      logo: "https://hirequest.in/logo.png",
      description:
        "Professional interview proxy, mock interviews, job support, and background verification services for tech professionals.",
      email: EMAIL,
      telephone: "+919649224523",
      address: { "@type": "PostalAddress", addressCountry: "IN" },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+919649224523",
          contactType: "customer service",
          availableLanguage: ["English", "Hindi"],
          areaServed: ["IN", "US", "GB", "CA", "AU"],
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "HireQuest",
      url: "https://hirequest.in",
      description:
        "End-to-end career services including interview proxy, mock interviews, job support, and background verification for tech professionals worldwide.",
      email: EMAIL,
      telephone: "+919649224523",
      priceRange: "$100 - $600",
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "5000", bestRating: "5" },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Interview Proxy Service",
      provider: { "@type": "Organization", name: "HireQuest" },
      description:
        "Professional interview proxy service where seasoned experts attend your technical and HR interviews on your behalf. Covers 50+ technologies.",
      url: "https://hirequest.in/#services",
      areaServed: "Worldwide",
      offers: {
        "@type": "Offer",
        price: "200",
        priceCurrency: "USD",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "200", priceCurrency: "USD", unitText: "per session" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Mock Interview Service",
      provider: { "@type": "Organization", name: "HireQuest" },
      description:
        "1-on-1 mock interview sessions with industry veterans from FAANG and top-tier companies. Get detailed feedback and improvement plans.",
      url: "https://hirequest.in/#services",
      areaServed: "Worldwide",
      offers: {
        "@type": "Offer",
        price: "100",
        priceCurrency: "USD",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "100", priceCurrency: "USD", unitText: "per session" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Job Support Service",
      provider: { "@type": "Organization", name: "HireQuest" },
      description:
        "Daily on-the-job expert assistance — 3 hours per day. Code reviews, debugging, sprint support, and technology ramp-up guidance.",
      url: "https://hirequest.in/#services",
      areaServed: "Worldwide",
      offers: {
        "@type": "Offer",
        price: "600",
        priceCurrency: "USD",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "600", priceCurrency: "USD", unitText: "per month" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is an interview proxy service?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An interview proxy service is where a qualified expert attends your technical or HR interview on your behalf. HireQuest's proxy experts cover 50+ technologies and have a 98% success rate across FAANG and top-tier companies.",
          },
        },
        {
          "@type": "Question",
          name: "How much does an interview proxy cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "HireQuest's interview proxy service costs $200 per session, covering complete interview rounds including technical and HR. Mock interviews are available at $100 per session.",
          },
        },
        {
          "@type": "Question",
          name: "What technologies do your experts cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our 50+ experts cover Java, Python, React, Angular, Node.js, AWS, Android, iOS, Flutter, .NET, Go, PHP, Selenium, Salesforce, SAP, Kubernetes, Docker, Terraform, and 30+ more technologies.",
          },
        },
        {
          "@type": "Question",
          name: "What is job support service?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Job support provides daily expert assistance (3 hours/day at $600/month) for your day-to-day work — code reviews, debugging, sprint deliverables, and technology ramp-up. Extended hours scale automatically.",
          },
        },
        {
          "@type": "Question",
          name: "How do I book a session with HireQuest?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Contact us via WhatsApp at +91 96492 24523 or email proxyinterview980@gmail.com. We respond within 30 minutes and offer a free initial consultation.",
          },
        },
        {
          "@type": "Question",
          name: "Is the interview proxy service confidential?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, 100% confidential. All session data is handled with strict privacy. We use Chrome Remote Desktop for remote access and Otter.ai for real-time voice assistance.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "HireQuest",
      url: "https://hirequest.in",
      description: "Interview Proxy, Mock Interviews, Job Support & Background Verification",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://hirequest.in/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function useSEO() {
  useEffect(() => {
    document.title = SEO_CONFIG.title;

    const metas = [
      { name: "description", content: SEO_CONFIG.description },
      { name: "keywords", content: SEO_CONFIG.keywords },
      { name: "author", content: "HireQuest" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "theme-color", content: "#08090E" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "HireQuest" },
      { name: "format-detection", content: "telephone=yes" },
      { name: "geo.region", content: "IN" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SEO_CONFIG.url },
      { property: "og:title", content: "HireQuest — Interview Proxy | Mock Interviews | Job Support" },
      {
        property: "og:description",
        content:
          "Land your dream tech job with HireQuest. Professional interview proxy ($200), mock interviews ($100), job support ($600/mo). 50+ experts from Microsoft, Amazon, Google. 98% success rate.",
      },
      { property: "og:image", content: SEO_CONFIG.image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "HireQuest — Your Career, Our Expertise. Interview Proxy, Mock Interviews, Job Support.",
      },
      { property: "og:site_name", content: "HireQuest" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: SEO_CONFIG.url },
      { name: "twitter:title", content: "HireQuest — Interview Proxy | Mock Interviews | Job Support" },
      {
        name: "twitter:description",
        content:
          "Land your dream tech job. Professional interview proxy, mock interviews, job support & background verification. 50+ experts, 98% success rate.",
      },
      { name: "twitter:image", content: SEO_CONFIG.image },
      { name: "twitter:image:alt", content: "HireQuest — Your Career, Our Expertise" },
    ];

    const injected = [];

    metas.forEach((m) => {
      const el = document.createElement("meta");
      if (m.property) el.setAttribute("property", m.property);
      if (m.name) el.setAttribute("name", m.name);
      el.setAttribute("content", m.content);
      document.head.appendChild(el);
      injected.push(el);
    });

    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", `${SEO_CONFIG.url}/`);
    document.head.appendChild(canonical);
    injected.push(canonical);

    buildJsonLdSchemas().forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      injected.push(script);
    });

    return () => injected.forEach((el) => el.remove());
  }, []);
}
