import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const GOLD_PRICE_PER_GRAM = 7245;

const chainPatterns = [
  (c1, c2) =>
    `<pattern id="p" width="24" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 L6 4 L12 10 L6 16Z" fill="none" stroke="${c1}" stroke-width="1.5"/><path d="M12 10 L18 4 L24 10 L18 16Z" fill="none" stroke="${c2}" stroke-width="1.5"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="28" height="16" patternUnits="userSpaceOnUse"><ellipse cx="8" cy="8" rx="7" ry="5" fill="none" stroke="${c1}" stroke-width="1.8"/><ellipse cx="20" cy="8" rx="7" ry="5" fill="none" stroke="${c2}" stroke-width="1.8"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 8 Q4 2 8 8 Q12 14 16 8" fill="none" stroke="${c1}" stroke-width="1.5"/><path d="M0 8 Q4 14 8 8 Q12 2 16 8" fill="none" stroke="${c2}" stroke-width="1.5"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="10" height="10" rx="1" fill="none" stroke="${c1}" stroke-width="1.2"/><rect x="5" y="5" width="4" height="4" rx="0.5" fill="none" stroke="${c2}" stroke-width="0.8"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="8" fill="none" stroke="${c1}" stroke-width="0.8"/><path d="M12 4 Q16 8 12 12 Q8 16 12 20" fill="none" stroke="${c2}" stroke-width="1"/><path d="M4 12 Q8 8 12 12 Q16 16 20 12" fill="none" stroke="${c2}" stroke-width="1"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="8" height="8" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="8" y2="8" stroke="${c1}" stroke-width="0.6"/><line x1="0" y1="4" x2="8" y2="12" stroke="${c2}" stroke-width="0.4"/><line x1="0" y1="-4" x2="8" y2="4" stroke="${c1}" stroke-width="0.4"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="10" fill="none" stroke="${c1}" stroke-width="1"/><circle cx="15" cy="15" r="6" fill="none" stroke="${c2}" stroke-width="1.5"/><circle cx="15" cy="15" r="2.5" fill="${c2}" opacity="0.4"/><line x1="15" y1="5" x2="15" y2="0" stroke="${c1}" stroke-width="0.5"/><line x1="15" y1="25" x2="15" y2="30" stroke="${c1}" stroke-width="0.5"/><line x1="5" y1="15" x2="0" y2="15" stroke="${c1}" stroke-width="0.5"/><line x1="25" y1="15" x2="30" y2="15" stroke="${c1}" stroke-width="0.5"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="32" height="18" patternUnits="userSpaceOnUse"><path d="M0 9 Q8 2 16 9 Q24 16 32 9" fill="none" stroke="${c1}" stroke-width="1.2"/><path d="M0 13 Q8 6 16 13 Q24 20 32 13" fill="none" stroke="${c2}" stroke-width="0.8"/><path d="M0 5 Q8 -2 16 5 Q24 12 32 5" fill="none" stroke="${c2}" stroke-width="0.8"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="22" height="26" patternUnits="userSpaceOnUse"><path d="M2 26 L2 10 Q2 2 11 2 Q20 2 20 10 L20 26" fill="none" stroke="${c1}" stroke-width="1.2"/><circle cx="11" cy="14" r="3" fill="none" stroke="${c2}" stroke-width="1"/><line x1="11" y1="18" x2="11" y2="26" stroke="${c2}" stroke-width="0.7"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="20" height="12" patternUnits="userSpaceOnUse"><rect x="1" y="2" width="8" height="8" rx="2" fill="none" stroke="${c1}" stroke-width="1.3"/><rect x="11" y="2" width="8" height="8" rx="2" fill="none" stroke="${c2}" stroke-width="1.3"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 6 Q3 0 6 6 Q9 12 12 6" fill="none" stroke="${c1}" stroke-width="1.8"/><circle cx="3" cy="3" r="1" fill="${c2}" opacity="0.3"/><circle cx="9" cy="9" r="1" fill="${c2}" opacity="0.3"/></pattern>`,
  (c1, c2) =>
    `<pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0 L20 10 L10 20 L0 10Z" fill="none" stroke="${c1}" stroke-width="0.8"/><circle cx="10" cy="10" r="3" fill="none" stroke="${c2}" stroke-width="1.2"/></pattern>`,
];

const prodGrad = [
  ["#1a1206", "#2a1f0a", "#D4AF37", "#B8860B"],
  ["#120e0a", "#1f1a10", "#C9A96E", "#A67C52"],
  ["#0d0d0a", "#1a180e", "#F0D78C", "#D4AF37"],
  ["#100c0c", "#1e1616", "#D4AF37", "#C9A96E"],
  ["#0f0a0f", "#1c141c", "#E8C97A", "#B8860B"],
  ["#0c0e0a", "#161a10", "#D4AF37", "#A67C52"],
  ["#1a0a0a", "#2a1010", "#F0D78C", "#D4AF37"],
  ["#0a0a12", "#10101f", "#E8C97A", "#C9A96E"],
  ["#120a0a", "#1f1010", "#D4AF37", "#B8860B"],
  ["#0e0e0a", "#1a1a10", "#C9A96E", "#A67C52"],
  ["#0a0e0e", "#101a1a", "#D4AF37", "#B8860B"],
  ["#100a0e", "#1e101c", "#F0D78C", "#C9A96E"],
];

const icons = ["◆", "⬮", "⟐", "▣", "✿", "≋", "❖", "≈", "⌂", "□", "⟐", "◇"];

function mkImg(idx, sz = 400) {
  const g = prodGrad[idx] || prodGrad[0];
  const pat = (chainPatterns[idx] || chainPatterns[0])(g[2], g[3]);
  const ic = icons[idx] || "◆";
  const s = sz;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <defs>${pat}
      <radialGradient id="bg" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="${g[1]}"/><stop offset="100%" stop-color="${g[0]}"/></radialGradient>
      <radialGradient id="gw" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${g[2]}" stop-opacity="0.15"/><stop offset="100%" stop-color="${g[2]}" stop-opacity="0"/></radialGradient>
      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${g[2]}"/><stop offset="50%" stop-color="${g[3]}"/><stop offset="100%" stop-color="${g[2]}"/></linearGradient>
    </defs>
    <rect width="${s}" height="${s}" fill="url(#bg)"/>
    <rect width="${s}" height="${s}" fill="url(#gw)"/>
    <rect x="${s * 0.08}" y="${s * 0.08}" width="${s * 0.84}" height="${s * 0.84}" fill="url(#p)" opacity="0.25" rx="4"/>
    <ellipse cx="${s / 2}" cy="${s / 2}" rx="${s * 0.28}" ry="${s * 0.28}" fill="none" stroke="${g[2]}" stroke-width="1.5" opacity="0.12"/>
    <ellipse cx="${s / 2}" cy="${s / 2}" rx="${s * 0.35}" ry="${s * 0.35}" fill="none" stroke="${g[2]}" stroke-width="0.5" opacity="0.08"/>
    <line x1="${s * 0.35}" y1="${s * 0.22}" x2="${s * 0.65}" y2="${s * 0.22}" stroke="url(#cg)" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M${s * 0.28} ${s * 0.22} Q${s * 0.22} ${s * 0.22} ${s * 0.22} ${s * 0.3} L${s * 0.22} ${s * 0.55}" stroke="url(#cg)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M${s * 0.72} ${s * 0.22} Q${s * 0.78} ${s * 0.22} ${s * 0.78} ${s * 0.3} L${s * 0.78} ${s * 0.55}" stroke="url(#cg)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M${s * 0.22} ${s * 0.55} Q${s * 0.22} ${s * 0.72} ${s * 0.38} ${s * 0.78} L${s * 0.5} ${s * 0.82}" stroke="url(#cg)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M${s * 0.78} ${s * 0.55} Q${s * 0.78} ${s * 0.72} ${s * 0.62} ${s * 0.78} L${s * 0.5} ${s * 0.82}" stroke="url(#cg)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <circle cx="${s * 0.5}" cy="${s * 0.82}" r="${s * 0.04}" fill="${g[2]}" opacity="0.35"/>
    <circle cx="${s * 0.5}" cy="${s * 0.82}" r="${s * 0.02}" fill="${g[2]}" opacity="0.6"/>
    <circle cx="${s * 0.5}" cy="${s * 0.48}" r="${s * 0.15}" fill="none" stroke="${g[2]}" stroke-width="1" opacity="0.15"/>
    <text x="${s / 2}" y="${s * 0.5}" text-anchor="middle" fill="${g[2]}" font-family="Georgia,serif" font-size="${s * 0.07}" opacity="0.7" font-weight="600">${ic}</text>
    <text x="${s / 2}" y="${s * 0.6}" text-anchor="middle" fill="${g[2]}" font-family="Georgia,serif" font-size="${s * 0.03}" letter-spacing="3" opacity="0.35">MOHINI</text>
    <rect x="${s * 0.05}" y="${s * 0.05}" width="${s * 0.9}" height="${s * 0.9}" fill="none" stroke="${g[2]}" stroke-width="0.5" opacity="0.1" rx="2"/>
  </svg>`)}`;
}

const IMGS = Array.from({ length: 12 }, (_, i) => mkImg(i));

const PRODUCTS = [
  {
    id: 1,
    name: "Royal Bismark Chain",
    category: "men",
    weight: "45g",
    purity: "22K",
    price: 326025,
    imgIdx: 0,
    desc: "Bold interlocking links with a regal presence. The Bismark weave delivers unmatched strength and sophistication for the modern gentleman.",
  },
  {
    id: 2,
    name: "Classic Curb Link",
    category: "men",
    weight: "38g",
    purity: "22K",
    price: 275310,
    imgIdx: 1,
    desc: "Timeless flat-link design polished to a mirror finish. A versatile staple that transitions effortlessly from boardroom to evening wear.",
  },
  {
    id: 3,
    name: "Sovereign Rope Chain",
    category: "men",
    weight: "52g",
    purity: "24K",
    price: 376740,
    imgIdx: 2,
    desc: "Tightly twisted strands create a lustrous, textured surface that catches light from every angle. Pure 24-karat gold at its finest.",
  },
  {
    id: 4,
    name: "Venetian Box Chain",
    category: "women",
    weight: "18g",
    purity: "22K",
    price: 130410,
    imgIdx: 3,
    desc: "Sleek square links create an elegant, fluid drape. Lightweight yet eye-catching — perfect for layering or wearing solo.",
  },
  {
    id: 5,
    name: "Filigree Charm Necklace",
    category: "women",
    weight: "22g",
    purity: "22K",
    price: 159390,
    imgIdx: 4,
    desc: "Delicate open-metalwork pendants dance along a fine cable chain, blending heritage artistry with contemporary grace.",
  },
  {
    id: 6,
    name: "Silk Thread Gold Chain",
    category: "women",
    weight: "15g",
    purity: "22K",
    price: 108675,
    imgIdx: 5,
    desc: "Micro-woven gold threads form a fabric-soft chain with a satin sheen. Feather-light luxury for everyday elegance.",
  },
  {
    id: 7,
    name: "Bridal Kundan Haar",
    category: "bridal",
    weight: "85g",
    purity: "22K",
    price: 615825,
    imgIdx: 6,
    desc: "A statement multi-strand masterpiece set with Kundan stones. Crafted to make every bride the centre of attention on her special day.",
  },
  {
    id: 8,
    name: "Rani Layered Set",
    category: "bridal",
    weight: "72g",
    purity: "22K",
    price: 521640,
    imgIdx: 7,
    desc: "Three cascading layers of graduating gold beads and filigree links create an opulent waterfall of pure gold.",
  },
  {
    id: 9,
    name: "Temple Choker Collection",
    category: "bridal",
    weight: "65g",
    purity: "22K",
    price: 470925,
    imgIdx: 8,
    desc: "Traditional temple motifs hand-carved into a wide choker band. A timeless symbol of grace, devotion, and bridal splendour.",
  },
  {
    id: 10,
    name: "Wholesale Flat Chain (100pc)",
    category: "wholesale",
    weight: "20g ea",
    purity: "22K",
    price: 138600,
    imgIdx: 9,
    desc: "Bulk-packed classic flat chains for retail partners. Consistent weight, hallmarked purity, and competitive wholesale pricing per piece.",
  },
  {
    id: 11,
    name: "Wholesale Rope Bundle (50pc)",
    category: "wholesale",
    weight: "25g ea",
    purity: "22K",
    price: 173250,
    imgIdx: 10,
    desc: "Premium rope-twist chains in a 50-piece assortment. Ideal for showroom display and high-turnover retail environments.",
  },
  {
    id: 12,
    name: "Wholesale Designer Mix (200pc)",
    category: "wholesale",
    weight: "Various",
    purity: "22K",
    price: 152460,
    imgIdx: 11,
    desc: "A curated 200-piece assortment spanning Curb, Figaro, Rope, and Box styles. The ultimate starter pack for new retailers.",
  },
];

const CATS = [
  { key: "all", label: "All Collections" },
  { key: "men", label: "Men's Chains" },
  { key: "women", label: "Women's Chains" },
  { key: "bridal", label: "Bridal Chains" },
  { key: "wholesale", label: "Wholesale" },
];

const fmt = (p) => "₹" + p.toLocaleString("en-IN");

const Star = ({ f }) => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill={f ? "#D4AF37" : "none"} stroke="#D4AF37" strokeWidth="1.5">
    <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78z" />
  </svg>
);
const WAIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const Heart = ({ f }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={f ? "#D4AF37" : "none"} stroke="#D4AF37" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const Srch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);
const XBtn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const Min = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const Pls = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const Trsh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);
const Chk = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
);
const Bk = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);
const MpI = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhI = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const MlI = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);
const CartI = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const ChD = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function App() {
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]);
  const [vw, setVw] = useState("home");
  const [sel, setSel] = useState(null);
  const [cat, setCat] = useState("all");
  const [srch, setSrch] = useState("");
  const [cOpen, setCOpen] = useState(false);
  const [sort, setSort] = useState("default");
  const [frm, setFrm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
    notes: "",
  });
  const [oid, setOid] = useState("");
  const [sY, setSY] = useState(0);
  const [toast, setToast] = useState(null);
  const [vis, setVis] = useState(new Set());
  const refs = useRef({});
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const fn = () => setSY(window.scrollY || 0);
    window.addEventListener("scroll", fn, true);
    return () => window.removeEventListener("scroll", fn, true);
  }, []);
  useEffect(() => {
    const o = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) setVis((p) => new Set([...p, e.target.dataset.s]));
        });
      },
      { threshold: 0.12 },
    );
    Object.values(refs.current).forEach((el) => el && o.observe(el));
    return () => o.disconnect();
  }, [vw]);

  const noti = useCallback((m) => {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  }, []);
  const addC = (p) => {
    setCart((pv) => {
      const e = pv.find((i) => i.id === p.id);
      return e ? pv.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i)) : [...pv, { ...p, qty: 1 }];
    });
    noti(`${p.name} added`);
  };
  const uQ = (id, d) => setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const rC = (id) => setCart((p) => p.filter((i) => i.id !== id));
  const tW = (id) => setWish((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));
  const tot = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cnt = cart.reduce((s, i) => s + i.qty, 0);
  const filt = PRODUCTS.filter(
    (p) => (cat === "all" || p.category === cat) && (!srch || p.name.toLowerCase().includes(srch.toLowerCase())),
  ).sort((a, b) => (sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : 0));
  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const place = () => {
    if (!frm.name || !frm.phone || !frm.address || !frm.city || !frm.pincode) {
      noti("Please fill required fields");
      return;
    }
    setOid("MJ" + Date.now().toString().slice(-8));
    setVw("confirm");
    setCart([]);
  };
  const an = (n) => ({
    opacity: vis.has(n) ? 1 : 0,
    transform: vis.has(n) ? "translateY(0)" : "translateY(40px)",
    transition: "all .8s cubic-bezier(.16,1,.3,1)",
  });
  const nvs = [
    { l: "Home", a: () => { setVw("home"); setTimeout(() => go("hero"), 100); } },
    { l: "About", a: () => { setVw("home"); setTimeout(() => go("about"), 100); } },
    { l: "Collections", a: () => { setVw("home"); setTimeout(() => go("products"), 100); } },
    { l: "Gold Rate", a: () => { setVw("home"); setTimeout(() => go("goldrate"), 100); } },
    { l: "Contact", a: () => { setVw("home"); setTimeout(() => go("contact"), 100); } },
  ];

  return (
    <div className="M">
      <header
        className="hd"
        style={{
          background: sY > 50 ? "rgba(9,9,9,.95)" : "transparent",
          backdropFilter: sY > 50 ? "blur(20px)" : "none",
          borderBottom: `1px solid ${sY > 50 ? "rgba(212,175,55,.12)" : "transparent"}`,
        }}
      >
        <div className="hd-in">
          <div className="lo" onClick={() => setVw("home")}>
            Mohini<sub>Jewellers</sub>
          </div>
          <nav className="nv">
            {nvs.map((n) => (
              <button key={n.l} className="nl" onClick={n.a}>
                {n.l}
              </button>
            ))}
          </nav>
          <div className="ni">
            <button className="ib" onClick={() => setCOpen(true)}>
              <CartI />
              {cnt > 0 && <span className="bg">{cnt}</span>}
            </button>
            <div className="hm" onClick={() => setMob(true)}>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </header>

      <div className={`mmenu ${mob ? "on" : ""}`}>
        <button className="mcl" onClick={() => setMob(false)}>
          <XBtn />
        </button>
        {nvs.map((n) => (
          <button
            key={n.l}
            onClick={() => {
              n.a();
              setMob(false);
            }}
          >
            {n.l}
          </button>
        ))}
      </div>

      <div className={`co2 ${cOpen ? "on" : ""}`} onClick={() => setCOpen(false)} />
      <div className={`dr ${cOpen ? "on" : ""}`}>
        <div className="dh">
          <h3>Your Cart ({cnt})</h3>
          <button className="ib" onClick={() => setCOpen(false)}>
            <XBtn />
          </button>
        </div>
        <div className="di">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "var(--tm)", fontFamily: "var(--sf)", fontSize: "18px" }}>Your cart is empty</p>
              <p style={{ color: "var(--tm)", fontSize: "12px", marginTop: "8px" }}>Explore our collections</p>
            </div>
          ) : (
            cart.map((it) => (
              <div key={it.id} className="ci">
                <div className="cim">
                  <img src={IMGS[it.imgIdx]} alt={it.name} />
                </div>
                <div className="cii">
                  <div className="cin">{it.name}</div>
                  <div className="cip">{fmt(it.price)}</div>
                  <div className="cic">
                    <button className="qb" onClick={() => uQ(it.id, -1)}>
                      <Min />
                    </button>
                    <span className="cq">{it.qty}</span>
                    <button className="qb" onClick={() => uQ(it.id, 1)}>
                      <Pls />
                    </button>
                    <button className="cr" onClick={() => rC(it.id)}>
                      <Trsh />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="df">
            <div className="dt2">
              <span className="dtl">Subtotal</span>
              <span className="dtv">{fmt(tot)}</span>
            </div>
            <button
              className="ckb"
              onClick={() => {
                setCOpen(false);
                setVw("checkout");
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {vw === "home" && (
        <>
          <section className="hr" id="hero">
            <div className="hor" style={{ top: "10%", left: "-5%", width: 300, height: 300 }} />
            <div className="hor" style={{ bottom: "5%", right: "-8%", width: 400, height: 400 }} />
            <div className="hrc">
              <div className="hb">Established Gold Wholesale Specialists</div>
              <h1>
                Mohini <em>Jewellers</em>
              </h1>
              <p className="htag">The House of Chain</p>
              <p className="hsub">
                Exquisite handcrafted gold chains, forged with tradition and delivered with trust. Sagwara&apos;s premier wholesale jeweller serving retailers across India.
              </p>
              <div className="hbtns">
                <button className="bg1" onClick={() => go("products")}>
                  Shop Collections
                </button>
                <button className="bo1" onClick={() => go("contact")}>
                  Contact Us
                </button>
              </div>
            </div>
            <div className="hscr" onClick={() => go("about")}>
              Scroll to explore
              <ChD />
            </div>
          </section>

          <section className="sc" id="about" ref={(el) => (refs.current.about = el)} data-s="about" style={an("about")}>
            <div className="sl">Our Legacy</div>
            <div className="st2">Crafting Gold, Building Trust</div>
            <div className="sd" />
            <div className="ag">
              <div className="ai">
                <img src={IMGS[6]} alt="Gold craftsmanship" />
                <div className="ae">
                  <div className="n">25+</div>
                  <div className="lb">Years of Excellence</div>
                </div>
              </div>
              <div className="at">
                <h3>Where Tradition Meets Perfection</h3>
                <p>
                  Mohini Jewellers stands as Sagwara&apos;s most trusted name in gold wholesale. For over two decades, we have been the backbone of retail jewellers across Rajasthan and beyond, supplying chains that marry traditional Indian craftsmanship with contemporary design sensibility.
                </p>
                <p>
                  Every link we forge carries our promise: certified purity, consistent weight, and designs that capture the imagination. From classic Curb and Rope chains to ornate bridal masterpieces, our collections are crafted to delight — and built to last.
                </p>
                <div className="af">
                  {["BIS Hallmarked & Certified Purity", "Direct Wholesale Pricing", "500+ Exclusive Chain Designs", "Pan-India Trusted Delivery"].map((f) => (
                    <div key={f} className="afi">
                      <div className="afic">✦</div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="sc" id="products" ref={(el) => (refs.current.products = el)} data-s="products" style={an("products")}>
            <div className="sl">Curated Collections</div>
            <div className="st2">Gold Chain Masterpieces</div>
            <div className="sd" />
            <div className="pb">
              <div className="cs">
                {CATS.map((c) => (
                  <button key={c.key} className={`cb ${cat === c.key ? "on" : ""}`} onClick={() => setCat(c.key)}>
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="sw">
                <div style={{ position: "relative" }}>
                  <span className="sic">
                    <Srch />
                  </span>
                  <input className="si2" placeholder="Search chains..." value={srch} onChange={(e) => setSrch(e.target.value)} />
                </div>
                <select className="sr" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="default">Sort By</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>
            </div>
            <div className="pg">
              {filt.map((p) => (
                <div
                  key={p.id}
                  className="pc"
                  onClick={() => {
                    setSel(p);
                    setVw("detail");
                  }}
                >
                  <div className="pi">
                    <img src={IMGS[p.imgIdx]} alt={p.name} />
                    <button
                      className="pw"
                      onClick={(e) => {
                        e.stopPropagation();
                        tW(p.id);
                      }}
                    >
                      <Heart f={wish.includes(p.id)} />
                    </button>
                    <span className="pp">{p.purity}</span>
                  </div>
                  <div className="pf">
                    <div className="pn">{p.name}</div>
                    <div className="pm">
                      <span>Weight: {p.weight}</span>
                      <span>Purity: {p.purity}</span>
                    </div>
                    <div className="pbt">
                      <span className="pr2">{fmt(p.price)}</span>
                      <button
                        className="ab"
                        onClick={(e) => {
                          e.stopPropagation();
                          addC(p);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filt.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--tm)", padding: "60px 0", fontFamily: "var(--sf)", fontSize: "20px" }}>No chains match your search.</p>
            )}
          </section>

          <section className="sc" id="goldrate" ref={(el) => (refs.current.goldrate = el)} data-s="goldrate" style={an("goldrate")}>
            <div className="sl">Market Pulse</div>
            <div className="st2">Today&apos;s Gold Rate</div>
            <div className="sd" />
            <div className="gr2">
              <div className="gi">
                {[
                  ["24K Gold", GOLD_PRICE_PER_GRAM],
                  ["22K Gold", Math.round(GOLD_PRICE_PER_GRAM * 0.916)],
                  ["18K Gold", Math.round(GOLD_PRICE_PER_GRAM * 0.75)],
                ].map(([l, v]) => (
                  <div key={l} className="git">
                    <div className="glb">{l}</div>
                    <div className="gv">₹{v.toLocaleString("en-IN")}</div>
                    <div className="gu">per gram</div>
                  </div>
                ))}
              </div>
              <p className="gn">* Rates are indicative. Final price includes making charges and may vary by design complexity and weight.</p>
            </div>
          </section>

          <section className="sc" id="contact" ref={(el) => (refs.current.contact = el)} data-s="contact" style={an("contact")}>
            <div className="sl">Get in Touch</div>
            <div className="st2">Connect With Us</div>
            <div className="sd" />
            <div className="cg">
              <div className="ci3">
                <h3>We&apos;d Love to Hear From You</h3>
                <p style={{ color: "var(--td)", fontSize: "14px", lineHeight: 1.85, marginBottom: "32px" }}>
                  Whether you&apos;re a retail jeweller looking for a wholesale partner or a customer seeking the perfect chain, our team is here to help.
                </p>
                {[
                  [<PhI />, "Phone", "+91 99296 89736"],
                  [<MpI />, "Visit Us", "Sagwara, Dungarpur, Rajasthan, India"],
                  [<MlI />, "Email", "info@mohinijewellers.com"],
                ].map(([ic, l, v], i) => (
                  <div key={i} className="cit">
                    <div className="cic2">{ic}</div>
                    <div className="cit2">
                      <strong>{l}</strong>
                      {v}
                    </div>
                  </div>
                ))}
                <a href="https://wa.me/919929689736" target="_blank" rel="noopener noreferrer" className="bg1" style={{ marginTop: "16px", textDecoration: "none" }}>
                  Message on WhatsApp
                </a>
              </div>
              <div>
                <div className="fm">
                  <input className="inp" placeholder="Your Name *" />
                  <input className="inp" placeholder="Phone Number *" />
                  <input className="inp" placeholder="Email Address" />
                  <select className="inp" defaultValue="">
                    <option value="" disabled>
                      Inquiry Type
                    </option>
                    <option>Wholesale Partnership</option>
                    <option>Custom Order</option>
                    <option>Product Inquiry</option>
                    <option>General Question</option>
                  </select>
                  <textarea className="inp ta" placeholder="Your Message..." />
                  <button className="bg1" style={{ width: "100%" }}>
                    Send Inquiry
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {vw === "detail" && sel && (
        <div className="det">
          <button
            onClick={() => setVw("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--g)",
              fontSize: "12px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "32px",
            }}
          >
            <Bk /> Back to Collections
          </button>
          <div className="dg">
            <div className="dim">
              <img src={IMGS[sel.imgIdx]} alt={sel.name} />
            </div>
            <div className="din">
              <span className="dcat">{CATS.find((c) => c.key === sel.category)?.label}</span>
              <h1>{sel.name}</h1>
              <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} f={i <= 4} />
                ))}
                <span style={{ fontSize: "11px", color: "var(--tm)", marginLeft: "8px" }}>(4.0)</span>
              </div>
              <div className="dpr">{fmt(sel.price)}</div>
              <p className="dde">{sel.desc}</p>
              <div className="dsp">
                {[
                  ["Weight", sel.weight],
                  ["Purity", sel.purity],
                  ["Hallmark", "BIS Certified"],
                  ["Finish", "High Polish"],
                ].map(([l, v]) => (
                  <div key={l} className="ds">
                    <div className="dsl">{l}</div>
                    <div className="dsv">{v}</div>
                  </div>
                ))}
              </div>
              <div className="dac">
                <button className="bg1" style={{ flex: 1 }} onClick={() => addC(sel)}>
                  Add to Cart
                </button>
                <button className="bo1" onClick={() => tW(sel.id)} style={{ padding: "14px 20px" }}>
                  <Heart f={wish.includes(sel.id)} />
                </button>
              </div>
              <p style={{ fontSize: "11px", color: "var(--tm)", marginTop: "20px", lineHeight: 1.7 }}>
                Free insured shipping on wholesale orders. Contact us for bulk pricing and custom design requests.
              </p>
            </div>
          </div>
        </div>
      )}

      {vw === "checkout" && (
        <div className="ckp">
          <button
            onClick={() => setVw("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--g)",
              fontSize: "12px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            <Bk /> Continue Shopping
          </button>
          <h2>Checkout</h2>
          <div className="ckg">
            <div>
              <h3 style={{ fontFamily: "var(--sf)", fontSize: "22px", color: "var(--g)", marginBottom: "24px", fontWeight: 400 }}>Delivery Information</h3>
              <div className="fgr">
                <label className="flb">Full Name *</label>
                <input className="inp" value={frm.name} onChange={(e) => setFrm((d) => ({ ...d, name: e.target.value }))} placeholder="Enter your full name" />
              </div>
              <div className="fr2">
                <div className="fgr">
                  <label className="flb">Phone *</label>
                  <input className="inp" value={frm.phone} onChange={(e) => setFrm((d) => ({ ...d, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="fgr">
                  <label className="flb">Email</label>
                  <input className="inp" value={frm.email} onChange={(e) => setFrm((d) => ({ ...d, email: e.target.value }))} placeholder="you@example.com" />
                </div>
              </div>
              <div className="fgr">
                <label className="flb">Address *</label>
                <input className="inp" value={frm.address} onChange={(e) => setFrm((d) => ({ ...d, address: e.target.value }))} placeholder="Street address, shop number" />
              </div>
              <div className="fr2">
                <div className="fgr">
                  <label className="flb">City *</label>
                  <input className="inp" value={frm.city} onChange={(e) => setFrm((d) => ({ ...d, city: e.target.value }))} placeholder="City" />
                </div>
                <div className="fgr">
                  <label className="flb">Pincode *</label>
                  <input className="inp" value={frm.pincode} onChange={(e) => setFrm((d) => ({ ...d, pincode: e.target.value }))} placeholder="PIN Code" />
                </div>
              </div>
              <div className="fgr">
                <label className="flb">State</label>
                <input className="inp" value={frm.state} onChange={(e) => setFrm((d) => ({ ...d, state: e.target.value }))} />
              </div>
              <div className="fgr">
                <label className="flb">Order Notes</label>
                <textarea className="inp ta" value={frm.notes} onChange={(e) => setFrm((d) => ({ ...d, notes: e.target.value }))} placeholder="Special instructions..." />
              </div>
            </div>
            <div>
              <div className="os">
                <h3>Order Summary</h3>
                {cart.map((it) => (
                  <div key={it.id} className="sit">
                    <span className="nm">
                      {it.name} × {it.qty}
                    </span>
                    <span className="pr">{fmt(it.price * it.qty)}</span>
                  </div>
                ))}
                <div className="sit" style={{ borderBottom: "none" }}>
                  <span className="nm">Shipping</span>
                  <span className="pr" style={{ color: "#25D366" }}>
                    Free
                  </span>
                </div>
                <div className="stt">
                  <span className="lb">Total</span>
                  <span className="vl">{fmt(tot)}</span>
                </div>
                <button className="ckb" style={{ marginTop: "24px" }} onClick={place}>
                  Place Order
                </button>
                <p style={{ fontSize: "10px", color: "var(--tm)", marginTop: "12px", textAlign: "center", lineHeight: 1.6 }}>
                  By placing your order, you agree to our terms. Final pricing confirmed based on current gold rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {vw === "confirm" && (
        <div className="cfm">
          <div className="cfi">
            <Chk />
          </div>
          <h2>Order Confirmed!</h2>
          <p className="oid">Order #{oid}</p>
          <p>Thank you for choosing Mohini Jewellers. Our team will contact you shortly to confirm details and arrange delivery.</p>
          <p style={{ color: "var(--ch)", fontSize: "12px", marginBottom: "40px" }}>For assistance: +91 99296 89736</p>
          <button className="bg1" onClick={() => setVw("home")}>
            Continue Shopping
          </button>
        </div>
      )}

      <footer className="ft">
        <div className="fi">
          <div className="fg2">
            <div>
              <div className="fb">Mohini Jewellers</div>
              <p className="fd">The House of Chain — Sagwara&apos;s premier gold wholesale jeweller, crafting exquisite chains for over 25 years.</p>
              <div className="fs">
                {["Fb", "Ig", "Tw", "Yt"].map((s) => (
                  <button key={s} className="fsi">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4>Quick Links</h4>
              {nvs.map((n) => (
                <span key={n.l} className="fl" onClick={n.a}>
                  {n.l}
                </span>
              ))}
            </div>
            <div>
              <h4>Collections</h4>
              {CATS.filter((c) => c.key !== "all").map((c) => (
                <span
                  key={c.key}
                  className="fl"
                  onClick={() => {
                    setCat(c.key);
                    setVw("home");
                    setTimeout(() => go("products"), 100);
                  }}
                >
                  {c.label}
                </span>
              ))}
            </div>
            <div>
              <h4>Contact</h4>
              <span className="fl">+91 99296 89736</span>
              <span className="fl">Sagwara, Dungarpur</span>
              <span className="fl">Rajasthan, India</span>
            </div>
          </div>
          <div className="fbt">
            <span className="fc">© 2026 Mohini Jewellers. All rights reserved.</span>
            <span className="fc">Crafted with passion in Sagwara</span>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/919929689736" target="_blank" rel="noopener noreferrer" className="wa">
        <WAIcon />
      </a>
      {toast && <div className="tst">{toast}</div>}
    </div>
  );
}
