import { useState, useEffect, useRef, useCallback } from "react";

const GOLD_PRICE_PER_GRAM = 7245;

const chainPatterns = [
  (c1,c2) => `<pattern id="p" width="24" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 L6 4 L12 10 L6 16Z" fill="none" stroke="${c1}" stroke-width="1.5"/><path d="M12 10 L18 4 L24 10 L18 16Z" fill="none" stroke="${c2}" stroke-width="1.5"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="28" height="16" patternUnits="userSpaceOnUse"><ellipse cx="8" cy="8" rx="7" ry="5" fill="none" stroke="${c1}" stroke-width="1.8"/><ellipse cx="20" cy="8" rx="7" ry="5" fill="none" stroke="${c2}" stroke-width="1.8"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 8 Q4 2 8 8 Q12 14 16 8" fill="none" stroke="${c1}" stroke-width="1.5"/><path d="M0 8 Q4 14 8 8 Q12 2 16 8" fill="none" stroke="${c2}" stroke-width="1.5"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="10" height="10" rx="1" fill="none" stroke="${c1}" stroke-width="1.2"/><rect x="5" y="5" width="4" height="4" rx="0.5" fill="none" stroke="${c2}" stroke-width="0.8"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="8" fill="none" stroke="${c1}" stroke-width="0.8"/><path d="M12 4 Q16 8 12 12 Q8 16 12 20" fill="none" stroke="${c2}" stroke-width="1"/><path d="M4 12 Q8 8 12 12 Q16 16 20 12" fill="none" stroke="${c2}" stroke-width="1"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="8" height="8" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="8" y2="8" stroke="${c1}" stroke-width="0.6"/><line x1="0" y1="4" x2="8" y2="12" stroke="${c2}" stroke-width="0.4"/><line x1="0" y1="-4" x2="8" y2="4" stroke="${c1}" stroke-width="0.4"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="10" fill="none" stroke="${c1}" stroke-width="1"/><circle cx="15" cy="15" r="6" fill="none" stroke="${c2}" stroke-width="1.5"/><circle cx="15" cy="15" r="2.5" fill="${c2}" opacity="0.4"/><line x1="15" y1="5" x2="15" y2="0" stroke="${c1}" stroke-width="0.5"/><line x1="15" y1="25" x2="15" y2="30" stroke="${c1}" stroke-width="0.5"/><line x1="5" y1="15" x2="0" y2="15" stroke="${c1}" stroke-width="0.5"/><line x1="25" y1="15" x2="30" y2="15" stroke="${c1}" stroke-width="0.5"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="32" height="18" patternUnits="userSpaceOnUse"><path d="M0 9 Q8 2 16 9 Q24 16 32 9" fill="none" stroke="${c1}" stroke-width="1.2"/><path d="M0 13 Q8 6 16 13 Q24 20 32 13" fill="none" stroke="${c2}" stroke-width="0.8"/><path d="M0 5 Q8 -2 16 5 Q24 12 32 5" fill="none" stroke="${c2}" stroke-width="0.8"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="22" height="26" patternUnits="userSpaceOnUse"><path d="M2 26 L2 10 Q2 2 11 2 Q20 2 20 10 L20 26" fill="none" stroke="${c1}" stroke-width="1.2"/><circle cx="11" cy="14" r="3" fill="none" stroke="${c2}" stroke-width="1"/><line x1="11" y1="18" x2="11" y2="26" stroke="${c2}" stroke-width="0.7"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="20" height="12" patternUnits="userSpaceOnUse"><rect x="1" y="2" width="8" height="8" rx="2" fill="none" stroke="${c1}" stroke-width="1.3"/><rect x="11" y="2" width="8" height="8" rx="2" fill="none" stroke="${c2}" stroke-width="1.3"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 6 Q3 0 6 6 Q9 12 12 6" fill="none" stroke="${c1}" stroke-width="1.8"/><circle cx="3" cy="3" r="1" fill="${c2}" opacity="0.3"/><circle cx="9" cy="9" r="1" fill="${c2}" opacity="0.3"/></pattern>`,
  (c1,c2) => `<pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0 L20 10 L10 20 L0 10Z" fill="none" stroke="${c1}" stroke-width="0.8"/><circle cx="10" cy="10" r="3" fill="none" stroke="${c2}" stroke-width="1.2"/></pattern>`,
];

const prodGrad = [
  ["#1a1206","#2a1f0a","#D4AF37","#B8860B"],
  ["#120e0a","#1f1a10","#C9A96E","#A67C52"],
  ["#0d0d0a","#1a180e","#F0D78C","#D4AF37"],
  ["#100c0c","#1e1616","#D4AF37","#C9A96E"],
  ["#0f0a0f","#1c141c","#E8C97A","#B8860B"],
  ["#0c0e0a","#161a10","#D4AF37","#A67C52"],
  ["#1a0a0a","#2a1010","#F0D78C","#D4AF37"],
  ["#0a0a12","#10101f","#E8C97A","#C9A96E"],
  ["#120a0a","#1f1010","#D4AF37","#B8860B"],
  ["#0e0e0a","#1a1a10","#C9A96E","#A67C52"],
  ["#0a0e0e","#101a1a","#D4AF37","#B8860B"],
  ["#100a0e","#1e101c","#F0D78C","#C9A96E"],
];

const icons = ["◆","⬮","⟐","▣","✿","≋","❖","≈","⌂","□","⟐","◇"];

function mkImg(idx, sz=400) {
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
    <rect x="${s*.08}" y="${s*.08}" width="${s*.84}" height="${s*.84}" fill="url(#p)" opacity="0.25" rx="4"/>
    <ellipse cx="${s/2}" cy="${s/2}" rx="${s*.28}" ry="${s*.28}" fill="none" stroke="${g[2]}" stroke-width="1.5" opacity="0.12"/>
    <ellipse cx="${s/2}" cy="${s/2}" rx="${s*.35}" ry="${s*.35}" fill="none" stroke="${g[2]}" stroke-width="0.5" opacity="0.08"/>
    <line x1="${s*.35}" y1="${s*.22}" x2="${s*.65}" y2="${s*.22}" stroke="url(#cg)" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M${s*.28} ${s*.22} Q${s*.22} ${s*.22} ${s*.22} ${s*.30} L${s*.22} ${s*.55}" stroke="url(#cg)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M${s*.72} ${s*.22} Q${s*.78} ${s*.22} ${s*.78} ${s*.30} L${s*.78} ${s*.55}" stroke="url(#cg)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M${s*.22} ${s*.55} Q${s*.22} ${s*.72} ${s*.38} ${s*.78} L${s*.5} ${s*.82}" stroke="url(#cg)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M${s*.78} ${s*.55} Q${s*.78} ${s*.72} ${s*.62} ${s*.78} L${s*.5} ${s*.82}" stroke="url(#cg)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <circle cx="${s*.5}" cy="${s*.82}" r="${s*.04}" fill="${g[2]}" opacity="0.35"/>
    <circle cx="${s*.5}" cy="${s*.82}" r="${s*.02}" fill="${g[2]}" opacity="0.6"/>
    <circle cx="${s*.5}" cy="${s*.48}" r="${s*.15}" fill="none" stroke="${g[2]}" stroke-width="1" opacity="0.15"/>
    <text x="${s/2}" y="${s*.50}" text-anchor="middle" fill="${g[2]}" font-family="Georgia,serif" font-size="${s*.07}" opacity="0.7" font-weight="600">${ic}</text>
    <text x="${s/2}" y="${s*.60}" text-anchor="middle" fill="${g[2]}" font-family="Georgia,serif" font-size="${s*.03}" letter-spacing="3" opacity="0.35">MOHINI</text>
    <rect x="${s*.05}" y="${s*.05}" width="${s*.9}" height="${s*.9}" fill="none" stroke="${g[2]}" stroke-width="0.5" opacity="0.1" rx="2"/>
  </svg>`)}`;
}

const IMGS = Array.from({length:12},(_,i) => mkImg(i));

const PRODUCTS = [
  {id:1,name:"Royal Bismark Chain",category:"men",weight:"45g",purity:"22K",price:326025,imgIdx:0,desc:"Bold interlocking links with a regal presence. The Bismark weave delivers unmatched strength and sophistication for the modern gentleman."},
  {id:2,name:"Classic Curb Link",category:"men",weight:"38g",purity:"22K",price:275310,imgIdx:1,desc:"Timeless flat-link design polished to a mirror finish. A versatile staple that transitions effortlessly from boardroom to evening wear."},
  {id:3,name:"Sovereign Rope Chain",category:"men",weight:"52g",purity:"24K",price:376740,imgIdx:2,desc:"Tightly twisted strands create a lustrous, textured surface that catches light from every angle. Pure 24-karat gold at its finest."},
  {id:4,name:"Venetian Box Chain",category:"women",weight:"18g",purity:"22K",price:130410,imgIdx:3,desc:"Sleek square links create an elegant, fluid drape. Lightweight yet eye-catching — perfect for layering or wearing solo."},
  {id:5,name:"Filigree Charm Necklace",category:"women",weight:"22g",purity:"22K",price:159390,imgIdx:4,desc:"Delicate open-metalwork pendants dance along a fine cable chain, blending heritage artistry with contemporary grace."},
  {id:6,name:"Silk Thread Gold Chain",category:"women",weight:"15g",purity:"22K",price:108675,imgIdx:5,desc:"Micro-woven gold threads form a fabric-soft chain with a satin sheen. Feather-light luxury for everyday elegance."},
  {id:7,name:"Bridal Kundan Haar",category:"bridal",weight:"85g",purity:"22K",price:615825,imgIdx:6,desc:"A statement multi-strand masterpiece set with Kundan stones. Crafted to make every bride the centre of attention on her special day."},
  {id:8,name:"Rani Layered Set",category:"bridal",weight:"72g",purity:"22K",price:521640,imgIdx:7,desc:"Three cascading layers of graduating gold beads and filigree links create an opulent waterfall of pure gold."},
  {id:9,name:"Temple Choker Collection",category:"bridal",weight:"65g",purity:"22K",price:470925,imgIdx:8,desc:"Traditional temple motifs hand-carved into a wide choker band. A timeless symbol of grace, devotion, and bridal splendour."},
  {id:10,name:"Wholesale Flat Chain (100pc)",category:"wholesale",weight:"20g ea",purity:"22K",price:138600,imgIdx:9,desc:"Bulk-packed classic flat chains for retail partners. Consistent weight, hallmarked purity, and competitive wholesale pricing per piece."},
  {id:11,name:"Wholesale Rope Bundle (50pc)",category:"wholesale",weight:"25g ea",purity:"22K",price:173250,imgIdx:10,desc:"Premium rope-twist chains in a 50-piece assortment. Ideal for showroom display and high-turnover retail environments."},
  {id:12,name:"Wholesale Designer Mix (200pc)",category:"wholesale",weight:"Various",purity:"22K",price:152460,imgIdx:11,desc:"A curated 200-piece assortment spanning Curb, Figaro, Rope, and Box styles. The ultimate starter pack for new retailers."},
];

const CATS = [{key:"all",label:"All Collections"},{key:"men",label:"Men's Chains"},{key:"women",label:"Women's Chains"},{key:"bridal",label:"Bridal Chains"},{key:"wholesale",label:"Wholesale"}];

const fmt = p => "₹"+p.toLocaleString("en-IN");

const Star = ({f}) => <svg width="14" height="14" viewBox="0 0 20 20" fill={f?"#D4AF37":"none"} stroke="#D4AF37" strokeWidth="1.5"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78z"/></svg>;
const WAIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const Heart = ({f}) => <svg width="20" height="20" viewBox="0 0 24 24" fill={f?"#D4AF37":"none"} stroke="#D4AF37" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const Srch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const XBtn = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Min = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Pls = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Trsh = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;
const Chk = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>;
const Bk = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>;
const MpI = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const PhI = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const MlI = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>;
const CartI = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const ChD = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>;

export default function App() {
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]);
  const [vw, setVw] = useState("home");
  const [sel, setSel] = useState(null);
  const [cat, setCat] = useState("all");
  const [srch, setSrch] = useState("");
  const [cOpen, setCOpen] = useState(false);
  const [sort, setSort] = useState("default");
  const [frm, setFrm] = useState({name:"",phone:"",email:"",address:"",city:"",state:"Rajasthan",pincode:"",notes:""});
  const [oid, setOid] = useState("");
  const [sY, setSY] = useState(0);
  const [toast, setToast] = useState(null);
  const [vis, setVis] = useState(new Set());
  const refs = useRef({});
  const [mob, setMob] = useState(false);

  useEffect(() => { const fn=()=>setSY(window.scrollY||0); window.addEventListener("scroll",fn,true); return()=>window.removeEventListener("scroll",fn,true); },[]);
  useEffect(() => { const o=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)setVis(p=>new Set([...p,e.target.dataset.s]));});},{threshold:.12}); Object.values(refs.current).forEach(el=>el&&o.observe(el)); return()=>o.disconnect(); },[vw]);

  const noti = useCallback(m => { setToast(m); setTimeout(()=>setToast(null),2200); },[]);
  const addC = p => { setCart(pv=>{const e=pv.find(i=>i.id===p.id);return e?pv.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...pv,{...p,qty:1}];}); noti(`${p.name} added`); };
  const uQ = (id,d) => setCart(p=>p.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));
  const rC = id => setCart(p=>p.filter(i=>i.id!==id));
  const tW = id => setWish(p=>p.includes(id)?p.filter(i=>i!==id):[...p,id]);
  const tot = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cnt = cart.reduce((s,i)=>s+i.qty,0);
  const filt = PRODUCTS.filter(p=>(cat==="all"||p.category===cat)&&(!srch||p.name.toLowerCase().includes(srch.toLowerCase()))).sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:0);
  const go = id => { const el=document.getElementById(id); if(el)el.scrollIntoView({behavior:"smooth"}); };
  const place = () => { if(!frm.name||!frm.phone||!frm.address||!frm.city||!frm.pincode){noti("Please fill required fields");return;} setOid("MJ"+Date.now().toString().slice(-8)); setVw("confirm"); setCart([]); };
  const an = n => ({opacity:vis.has(n)?1:0,transform:vis.has(n)?"translateY(0)":"translateY(40px)",transition:"all .8s cubic-bezier(.16,1,.3,1)"});
  const nvs = [{l:"Home",a:()=>{setVw("home");setTimeout(()=>go("hero"),100);}},{l:"About",a:()=>{setVw("home");setTimeout(()=>go("about"),100);}},{l:"Collections",a:()=>{setVw("home");setTimeout(()=>go("products"),100);}},{l:"Gold Rate",a:()=>{setVw("home");setTimeout(()=>go("goldrate"),100);}},{l:"Contact",a:()=>{setVw("home");setTimeout(()=>go("contact"),100);}}];

  return (
    <div className="M">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .M{--g:#D4AF37;--gl:#F0D78C;--gd:#B8860B;--ch:#C9A96E;--bg:#090909;--bg2:#0f0f0f;--bg3:#181818;--cd:#121212;--cb:rgba(212,175,55,.12);--t:#F5F0E8;--td:#8A8278;--tm:#5A554D;--sf:'Cormorant Garamond',Georgia,serif;--sn:'DM Sans',sans-serif;font-family:var(--sn);background:var(--bg);color:var(--t);min-height:100vh;overflow-x:hidden;line-height:1.6;-webkit-font-smoothing:antialiased}
        .M *{box-sizing:border-box;margin:0;padding:0}.M button{font-family:var(--sn);cursor:pointer;border:none;background:none;color:inherit}.M input,.M textarea,.M select{font-family:var(--sn)}
        .M::-webkit-scrollbar{width:5px}.M::-webkit-scrollbar-thumb{background:var(--gd);border-radius:3px}
        .hd{position:sticky;top:0;z-index:100;padding:0 24px;transition:all .4s}.hd-in{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:72px}
        .lo{font-family:var(--sf);font-size:28px;font-weight:600;color:var(--g);letter-spacing:1px;cursor:pointer}.lo sub{display:block;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:var(--ch);font-family:var(--sn);font-weight:400;vertical-align:baseline}
        .nv{display:flex;gap:28px}.nl{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--td);transition:color .3s;font-weight:500}.nl:hover{color:var(--g)}
        .ni{display:flex;gap:14px;align-items:center}.ib{position:relative;color:var(--td);transition:color .3s;padding:4px}.ib:hover{color:var(--g)}.bg{position:absolute;top:-4px;right:-6px;background:var(--g);color:var(--bg);font-size:9px;font-weight:700;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center}
        .hm{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px}.hm span{display:block;width:22px;height:2px;background:var(--g);transition:all .3s}
        .hr{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:radial-gradient(ellipse at 50% 30%,rgba(212,175,55,.07) 0%,transparent 60%),var(--bg);overflow:hidden}
        .hr::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 99px,rgba(212,175,55,.025) 99px,rgba(212,175,55,.025) 100px),repeating-linear-gradient(0deg,transparent,transparent 99px,rgba(212,175,55,.025) 99px,rgba(212,175,55,.025) 100px)}
        .hr::after{content:'';position:absolute;top:50%;left:50%;width:600px;height:600px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.04) 0%,transparent 70%)}
        .hrc{position:relative;z-index:2;padding:40px 24px}
        .hb{display:inline-block;font-size:10px;letter-spacing:6px;text-transform:uppercase;color:var(--ch);border:1px solid var(--cb);padding:10px 28px;margin-bottom:36px;font-weight:500}
        .hr h1{font-family:var(--sf);font-size:clamp(52px,9vw,100px);font-weight:300;color:var(--g);line-height:1;margin-bottom:12px;letter-spacing:-2px}
        .hr h1 em{font-style:italic;color:var(--gl)}
        .htag{font-family:var(--sf);font-size:clamp(16px,2.5vw,24px);color:var(--ch);font-weight:300;letter-spacing:8px;text-transform:uppercase;margin-bottom:20px}
        .hsub{font-size:14px;color:var(--td);max-width:480px;margin:0 auto 44px;line-height:1.8}
        .hbtns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
        .bg1{background:linear-gradient(135deg,var(--g),var(--gd));color:var(--bg);padding:15px 40px;font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;transition:all .3s;border:none;display:inline-block;text-decoration:none}.bg1:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(212,175,55,.3)}
        .bo1{border:1px solid var(--g);color:var(--g);padding:15px 40px;font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;background:transparent;transition:all .3s}.bo1:hover{background:rgba(212,175,55,.08)}
        .hor{position:absolute;border:1px solid rgba(212,175,55,.05);border-radius:50%}
        .hscr{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);color:var(--tm);font-size:10px;letter-spacing:4px;text-transform:uppercase;display:flex;flex-direction:column;align-items:center;gap:8px;animation:fl 2s ease-in-out infinite}
        @keyframes fl{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
        .sc{padding:100px 24px;max-width:1280px;margin:0 auto}.sl{font-size:10px;letter-spacing:6px;text-transform:uppercase;color:var(--ch);margin-bottom:14px;text-align:center;font-weight:500}
        .st2{font-family:var(--sf);font-size:clamp(32px,5vw,52px);color:var(--g);text-align:center;font-weight:400;margin-bottom:16px;line-height:1.1}.sd{width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--g),transparent);margin:0 auto 52px}
        .ag{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}.ai{position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--cd);border:1px solid var(--cb)}.ai img{width:100%;height:100%;object-fit:cover}
        .ae{position:absolute;bottom:24px;left:24px;background:rgba(9,9,9,.92);backdrop-filter:blur(12px);border:1px solid var(--cb);padding:20px 24px}.ae .n{font-family:var(--sf);font-size:44px;color:var(--g);line-height:1}.ae .lb{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--td)}
        .at h3{font-family:var(--sf);font-size:36px;color:var(--g);font-weight:400;margin-bottom:20px}.at p{color:var(--td);font-size:14px;line-height:1.85;margin-bottom:16px}
        .af{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:32px}.afi{display:flex;align-items:center;gap:12px;padding:16px;background:var(--cd);border:1px solid var(--cb)}.afic{width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:var(--g);font-size:18px;border:1px solid var(--cb);flex-shrink:0}.afi span{font-size:12px;color:var(--td);letter-spacing:.5px}
        .pb{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:40px}.cs{display:flex;gap:6px;flex-wrap:wrap}
        .cb{padding:8px 18px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;border:1px solid var(--cb);color:var(--td);transition:all .3s;background:transparent}.cb.on{background:var(--g);color:var(--bg);border-color:var(--g)}.cb:hover:not(.on){border-color:var(--g);color:var(--g)}
        .sw{display:flex;gap:8px;align-items:center}.si2{background:var(--cd);border:1px solid var(--cb);color:var(--t);padding:8px 16px 8px 36px;font-size:12px;width:200px;outline:none;transition:border-color .3s}.si2:focus{border-color:var(--g)}.sic{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--tm)}
        .sr{background:var(--cd);border:1px solid var(--cb);color:var(--td);padding:8px 10px;font-size:11px;outline:none}.sr option{background:var(--bg2)}
        .pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}
        .pc{background:var(--cd);border:1px solid var(--cb);overflow:hidden;transition:all .4s cubic-bezier(.16,1,.3,1);position:relative;cursor:pointer}.pc:hover{transform:translateY(-6px);border-color:rgba(212,175,55,.25);box-shadow:0 20px 60px rgba(0,0,0,.5)}
        .pi{position:relative;aspect-ratio:1;overflow:hidden;background:var(--bg2)}.pi img{width:100%;height:100%;object-fit:cover;transition:transform .6s}.pc:hover .pi img{transform:scale(1.06)}
        .pw{position:absolute;top:12px;right:12px;z-index:2;background:rgba(9,9,9,.75);backdrop-filter:blur(8px);width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid var(--cb);transition:all .3s}.pw:hover{border-color:var(--g)}
        .pp{position:absolute;top:12px;left:12px;background:rgba(212,175,55,.12);backdrop-filter:blur(8px);color:var(--g);font-size:10px;font-weight:600;letter-spacing:1.5px;padding:4px 10px;border:1px solid rgba(212,175,55,.15)}
        .pf{padding:20px}.pn{font-family:var(--sf);font-size:20px;color:var(--t);margin-bottom:8px;font-weight:500}.pm{display:flex;gap:16px;margin-bottom:12px}.pm span{font-size:11px;color:var(--tm);letter-spacing:.5px}.pbt{display:flex;justify-content:space-between;align-items:center}
        .pr2{font-family:var(--sf);font-size:22px;color:var(--g);font-weight:600}
        .ab{background:linear-gradient(135deg,var(--g),var(--gd));color:var(--bg);padding:8px 16px;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;transition:all .3s}.ab:hover{box-shadow:0 4px 20px rgba(212,175,55,.3)}
        .gr2{background:linear-gradient(135deg,rgba(212,175,55,.04),rgba(184,134,11,.02));border:1px solid var(--cb);padding:52px;position:relative;overflow:hidden}
        .gr2::before{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.05),transparent 70%)}
        .gi{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;position:relative;z-index:1}.git{text-align:center}.glb{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--tm);margin-bottom:8px}.gv{font-family:var(--sf);font-size:clamp(28px,4vw,44px);color:var(--g);font-weight:600}.gu{font-size:12px;color:var(--td);margin-top:4px}.gn{text-align:center;margin-top:28px;font-size:11px;color:var(--tm);font-style:italic;position:relative;z-index:1}
        .co2{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;opacity:0;pointer-events:none;transition:opacity .3s}.co2.on{opacity:1;pointer-events:all}
        .dr{position:fixed;top:0;right:0;bottom:0;width:min(420px,90vw);background:var(--bg2);z-index:201;transform:translateX(100%);transition:transform .4s cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column;border-left:1px solid var(--cb)}.dr.on{transform:translateX(0)}
        .dh{display:flex;justify-content:space-between;align-items:center;padding:24px;border-bottom:1px solid var(--cb)}.dh h3{font-family:var(--sf);font-size:24px;color:var(--g);font-weight:400}
        .di{flex:1;overflow-y:auto;padding:16px 24px}
        .ci{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--cb)}.cim{width:72px;height:72px;flex-shrink:0;overflow:hidden;border:1px solid var(--cb)}.cim img{width:100%;height:100%;object-fit:cover}
        .cii{flex:1}.cin{font-family:var(--sf);font-size:15px;color:var(--t);margin-bottom:3px}.cip{font-size:13px;color:var(--g)}
        .cic{display:flex;align-items:center;gap:10px;margin-top:8px}.qb{width:26px;height:26px;display:flex;align-items:center;justify-content:center;border:1px solid var(--cb);color:var(--td);transition:all .3s}.qb:hover{border-color:var(--g);color:var(--g)}.cq{font-size:13px;color:var(--t);min-width:18px;text-align:center}.cr{color:var(--tm);transition:color .3s;margin-left:auto}.cr:hover{color:#e74c3c}
        .df{padding:24px;border-top:1px solid var(--cb)}.dt2{display:flex;justify-content:space-between;margin-bottom:16px}.dtl{font-size:13px;color:var(--td)}.dtv{font-family:var(--sf);font-size:22px;color:var(--g);font-weight:600}
        .ckb{width:100%;background:linear-gradient(135deg,var(--g),var(--gd));color:var(--bg);padding:16px;font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;transition:all .3s}.ckb:hover{box-shadow:0 8px 30px rgba(212,175,55,.3)}
        .cg{display:grid;grid-template-columns:1fr 1fr;gap:64px}.ci3 h3{font-family:var(--sf);font-size:28px;color:var(--g);margin-bottom:24px;font-weight:400}
        .cit{display:flex;gap:16px;align-items:flex-start;margin-bottom:24px}.cic2{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:1px solid var(--cb);color:var(--g);flex-shrink:0}.cit2{font-size:13px;color:var(--td);line-height:1.6}.cit2 strong{color:var(--t);display:block;margin-bottom:2px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase}
        .fm{display:flex;flex-direction:column;gap:14px}
        .inp{background:var(--cd);border:1px solid var(--cb);color:var(--t);padding:14px 18px;font-size:13px;outline:none;transition:border-color .3s;width:100%}.inp:focus{border-color:var(--g)}.inp::placeholder{color:var(--tm)}.ta{min-height:110px;resize:vertical}
        .ft{background:var(--bg2);border-top:1px solid var(--cb);padding:64px 24px 28px}.fi{max-width:1280px;margin:0 auto}
        .fg2{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px}.fb{font-family:var(--sf);font-size:28px;color:var(--g);margin-bottom:12px}.fd{font-size:12px;color:var(--tm);line-height:1.7;max-width:280px}
        .ft h4{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--ch);margin-bottom:20px;font-weight:500}.fl{display:block;font-size:12px;color:var(--tm);margin-bottom:11px;transition:color .3s;cursor:pointer}.fl:hover{color:var(--g)}
        .fs{display:flex;gap:10px;margin-top:16px}.fsi{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border:1px solid var(--cb);color:var(--tm);transition:all .3s;font-size:12px}.fsi:hover{border-color:var(--g);color:var(--g)}
        .fbt{border-top:1px solid var(--cb);padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}.fc{font-size:11px;color:var(--tm)}
        .det{padding:40px 24px;max-width:1280px;margin:0 auto}.dg{display:grid;grid-template-columns:1fr 1fr;gap:64px}
        .dim{aspect-ratio:1;overflow:hidden;background:var(--cd);border:1px solid var(--cb)}.dim img{width:100%;height:100%;object-fit:cover}
        .din h1{font-family:var(--sf);font-size:36px;color:var(--g);font-weight:400;margin-bottom:8px}.dcat{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--ch);margin-bottom:24px;display:inline-block}
        .dpr{font-family:var(--sf);font-size:32px;color:var(--g);margin-bottom:24px}.dde{font-size:14px;color:var(--td);line-height:1.85;margin-bottom:32px}
        .dsp{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:32px}.ds{background:var(--cd);border:1px solid var(--cb);padding:16px}.dsl{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--tm);margin-bottom:4px}.dsv{font-family:var(--sf);font-size:20px;color:var(--t)}.dac{display:flex;gap:12px}
        .ckp{padding:40px 24px;max-width:960px;margin:0 auto}.ckp h2{font-family:var(--sf);font-size:32px;color:var(--g);margin-bottom:40px;text-align:center;font-weight:400}
        .ckg{display:grid;grid-template-columns:1.2fr .8fr;gap:48px}.fgr{margin-bottom:18px}.flb{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--tm);margin-bottom:8px;display:block}.fr2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .os{background:var(--cd);border:1px solid var(--cb);padding:32px;position:sticky;top:96px}.os h3{font-family:var(--sf);font-size:22px;color:var(--g);margin-bottom:24px;font-weight:400}
        .sit{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--cb);font-size:13px}.sit .nm{color:var(--td)}.sit .pr{color:var(--t)}
        .stt{display:flex;justify-content:space-between;padding-top:16px;margin-top:8px}.stt .lb{font-size:13px;color:var(--td);text-transform:uppercase;letter-spacing:1px}.stt .vl{font-family:var(--sf);font-size:24px;color:var(--g);font-weight:600}
        .cfm{padding:80px 24px;max-width:600px;margin:0 auto;text-align:center}.cfi{width:80px;height:80px;border:2px solid var(--g);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 32px}
        .cfm h2{font-family:var(--sf);font-size:36px;color:var(--g);font-weight:400;margin-bottom:12px}.cfm p{color:var(--td);font-size:14px;line-height:1.7;margin-bottom:12px}.cfm .oid{font-family:var(--sf);font-size:22px;color:var(--ch);margin-bottom:32px;letter-spacing:2px}
        .wa{position:fixed;bottom:24px;right:24px;z-index:150;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,.4);transition:all .3s;text-decoration:none}.wa:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(37,211,102,.5)}
        .tst{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:rgba(212,175,55,.95);color:var(--bg);padding:12px 28px;font-size:12px;font-weight:600;letter-spacing:.5px;z-index:300;animation:tin .3s ease-out;box-shadow:0 8px 30px rgba(0,0,0,.3)}
        @keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .mmenu{display:none;position:fixed;inset:0;z-index:150;background:rgba(9,9,9,.97);backdrop-filter:blur(20px);flex-direction:column;align-items:center;justify-content:center;gap:32px}.mmenu.on{display:flex}.mmenu button{font-family:var(--sf);font-size:28px;color:var(--g);font-weight:400;letter-spacing:2px}.mcl{position:absolute;top:24px;right:24px;color:var(--g)}
        @media(max-width:900px){.nv{display:none}.hm{display:flex}.ag,.cg,.dg,.ckg,.fg2{grid-template-columns:1fr}.gi{grid-template-columns:1fr;gap:24px}.fg2{grid-template-columns:1fr 1fr}.pg{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}.af{grid-template-columns:1fr}.fr2{grid-template-columns:1fr}}
        @media(max-width:480px){.fg2{grid-template-columns:1fr}.pg{grid-template-columns:1fr}.dsp{grid-template-columns:1fr}}
      `}</style>

      {/* HEADER */}
      <header className="hd" style={{background:sY>50?"rgba(9,9,9,.95)":"transparent",backdropFilter:sY>50?"blur(20px)":"none",borderBottom:`1px solid ${sY>50?"rgba(212,175,55,.12)":"transparent"}`}}>
        <div className="hd-in">
          <div className="lo" onClick={()=>setVw("home")}>Mohini<sub>Jewellers</sub></div>
          <nav className="nv">{nvs.map(n=><button key={n.l} className="nl" onClick={n.a}>{n.l}</button>)}</nav>
          <div className="ni">
            <button className="ib" onClick={()=>setCOpen(true)}><CartI/>{cnt>0&&<span className="bg">{cnt}</span>}</button>
            <div className="hm" onClick={()=>setMob(true)}><span/><span/><span/></div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mmenu ${mob?"on":""}`}>
        <button className="mcl" onClick={()=>setMob(false)}><XBtn/></button>
        {nvs.map(n=><button key={n.l} onClick={()=>{n.a();setMob(false);}}>{n.l}</button>)}
      </div>

      {/* CART */}
      <div className={`co2 ${cOpen?"on":""}`} onClick={()=>setCOpen(false)}/>
      <div className={`dr ${cOpen?"on":""}`}>
        <div className="dh"><h3>Your Cart ({cnt})</h3><button className="ib" onClick={()=>setCOpen(false)}><XBtn/></button></div>
        <div className="di">
          {cart.length===0?<div style={{textAlign:"center",padding:"60px 0"}}><p style={{color:"var(--tm)",fontFamily:"var(--sf)",fontSize:"18px"}}>Your cart is empty</p><p style={{color:"var(--tm)",fontSize:"12px",marginTop:"8px"}}>Explore our collections</p></div>
          :cart.map(it=><div key={it.id} className="ci"><div className="cim"><img src={IMGS[it.imgIdx]} alt={it.name}/></div><div className="cii"><div className="cin">{it.name}</div><div className="cip">{fmt(it.price)}</div><div className="cic"><button className="qb" onClick={()=>uQ(it.id,-1)}><Min/></button><span className="cq">{it.qty}</span><button className="qb" onClick={()=>uQ(it.id,1)}><Pls/></button><button className="cr" onClick={()=>rC(it.id)}><Trsh/></button></div></div></div>)}
        </div>
        {cart.length>0&&<div className="df"><div className="dt2"><span className="dtl">Subtotal</span><span className="dtv">{fmt(tot)}</span></div><button className="ckb" onClick={()=>{setCOpen(false);setVw("checkout");}}>Proceed to Checkout</button></div>}
      </div>

      {/* HOME */}
      {vw==="home"&&<>
        <section className="hr" id="hero">
          <div className="hor" style={{top:"10%",left:"-5%",width:300,height:300}}/><div className="hor" style={{bottom:"5%",right:"-8%",width:400,height:400}}/>
          <div className="hrc">
            <div className="hb">Established Gold Wholesale Specialists</div>
            <h1>Mohini <em>Jewellers</em></h1>
            <p className="htag">The House of Chain</p>
            <p className="hsub">Exquisite handcrafted gold chains, forged with tradition and delivered with trust. Sagwara's premier wholesale jeweller serving retailers across India.</p>
            <div className="hbtns"><button className="bg1" onClick={()=>go("products")}>Shop Collections</button><button className="bo1" onClick={()=>go("contact")}>Contact Us</button></div>
          </div>
          <div className="hscr" onClick={()=>go("about")}>Scroll to explore<ChD/></div>
        </section>

        <section className="sc" id="about" ref={el=>refs.current.about=el} data-s="about" style={an("about")}>
          <div className="sl">Our Legacy</div><div className="st2">Crafting Gold, Building Trust</div><div className="sd"/>
          <div className="ag">
            <div className="ai"><img src={IMGS[6]} alt="Gold craftsmanship"/><div className="ae"><div className="n">25+</div><div className="lb">Years of Excellence</div></div></div>
            <div className="at">
              <h3>Where Tradition Meets Perfection</h3>
              <p>Mohini Jewellers stands as Sagwara's most trusted name in gold wholesale. For over two decades, we have been the backbone of retail jewellers across Rajasthan and beyond, supplying chains that marry traditional Indian craftsmanship with contemporary design sensibility.</p>
              <p>Every link we forge carries our promise: certified purity, consistent weight, and designs that capture the imagination. From classic Curb and Rope chains to ornate bridal masterpieces, our collections are crafted to delight — and built to last.</p>
              <div className="af">{["BIS Hallmarked & Certified Purity","Direct Wholesale Pricing","500+ Exclusive Chain Designs","Pan-India Trusted Delivery"].map(f=><div key={f} className="afi"><div className="afic">✦</div><span>{f}</span></div>)}</div>
            </div>
          </div>
        </section>

        <section className="sc" id="products" ref={el=>refs.current.products=el} data-s="products" style={an("products")}>
          <div className="sl">Curated Collections</div><div className="st2">Gold Chain Masterpieces</div><div className="sd"/>
          <div className="pb">
            <div className="cs">{CATS.map(c=><button key={c.key} className={`cb ${cat===c.key?"on":""}`} onClick={()=>setCat(c.key)}>{c.label}</button>)}</div>
            <div className="sw"><div style={{position:"relative"}}><span className="sic"><Srch/></span><input className="si2" placeholder="Search chains..." value={srch} onChange={e=>setSrch(e.target.value)}/></div><select className="sr" value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Sort By</option><option value="low">Price: Low → High</option><option value="high">Price: High → Low</option></select></div>
          </div>
          <div className="pg">{filt.map(p=><div key={p.id} className="pc" onClick={()=>{setSel(p);setVw("detail");}}>
            <div className="pi"><img src={IMGS[p.imgIdx]} alt={p.name}/><button className="pw" onClick={e=>{e.stopPropagation();tW(p.id);}}><Heart f={wish.includes(p.id)}/></button><span className="pp">{p.purity}</span></div>
            <div className="pf"><div className="pn">{p.name}</div><div className="pm"><span>Weight: {p.weight}</span><span>Purity: {p.purity}</span></div><div className="pbt"><span className="pr2">{fmt(p.price)}</span><button className="ab" onClick={e=>{e.stopPropagation();addC(p);}}>Add to Cart</button></div></div>
          </div>)}</div>
          {filt.length===0&&<p style={{textAlign:"center",color:"var(--tm)",padding:"60px 0",fontFamily:"var(--sf)",fontSize:"20px"}}>No chains match your search.</p>}
        </section>

        <section className="sc" id="goldrate" ref={el=>refs.current.goldrate=el} data-s="goldrate" style={an("goldrate")}>
          <div className="sl">Market Pulse</div><div className="st2">Today's Gold Rate</div><div className="sd"/>
          <div className="gr2"><div className="gi">{[["24K Gold",GOLD_PRICE_PER_GRAM],["22K Gold",Math.round(GOLD_PRICE_PER_GRAM*.916)],["18K Gold",Math.round(GOLD_PRICE_PER_GRAM*.75)]].map(([l,v])=><div key={l} className="git"><div className="glb">{l}</div><div className="gv">₹{v.toLocaleString("en-IN")}</div><div className="gu">per gram</div></div>)}</div><p className="gn">* Rates are indicative. Final price includes making charges and may vary by design complexity and weight.</p></div>
        </section>

        <section className="sc" id="contact" ref={el=>refs.current.contact=el} data-s="contact" style={an("contact")}>
          <div className="sl">Get in Touch</div><div className="st2">Connect With Us</div><div className="sd"/>
          <div className="cg">
            <div className="ci3">
              <h3>We'd Love to Hear From You</h3>
              <p style={{color:"var(--td)",fontSize:"14px",lineHeight:1.85,marginBottom:"32px"}}>Whether you're a retail jeweller looking for a wholesale partner or a customer seeking the perfect chain, our team is here to help.</p>
              {[[<PhI/>,"Phone","+91 99296 89736"],[<MpI/>,"Visit Us","Sagwara, Dungarpur, Rajasthan, India"],[<MlI/>,"Email","info@mohinijewellers.com"]].map(([ic,l,v],i)=><div key={i} className="cit"><div className="cic2">{ic}</div><div className="cit2"><strong>{l}</strong>{v}</div></div>)}
              <a href="https://wa.me/919929689736" target="_blank" rel="noopener noreferrer" className="bg1" style={{marginTop:"16px",textDecoration:"none"}}>Message on WhatsApp</a>
            </div>
            <div><div className="fm"><input className="inp" placeholder="Your Name *"/><input className="inp" placeholder="Phone Number *"/><input className="inp" placeholder="Email Address"/><select className="inp" defaultValue=""><option value="" disabled>Inquiry Type</option><option>Wholesale Partnership</option><option>Custom Order</option><option>Product Inquiry</option><option>General Question</option></select><textarea className="inp ta" placeholder="Your Message..."/><button className="bg1" style={{width:"100%"}}>Send Inquiry</button></div></div>
          </div>
        </section>
      </>}

      {/* DETAIL */}
      {vw==="detail"&&sel&&<div className="det">
        <button onClick={()=>setVw("home")} style={{display:"flex",alignItems:"center",gap:"8px",color:"var(--g)",fontSize:"12px",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"32px"}}><Bk/> Back to Collections</button>
        <div className="dg">
          <div className="dim"><img src={IMGS[sel.imgIdx]} alt={sel.name}/></div>
          <div className="din">
            <span className="dcat">{CATS.find(c=>c.key===sel.category)?.label}</span>
            <h1>{sel.name}</h1>
            <div style={{display:"flex",gap:"4px",marginBottom:"20px"}}>{[1,2,3,4,5].map(i=><Star key={i} f={i<=4}/>)}<span style={{fontSize:"11px",color:"var(--tm)",marginLeft:"8px"}}>(4.0)</span></div>
            <div className="dpr">{fmt(sel.price)}</div>
            <p className="dde">{sel.desc}</p>
            <div className="dsp">{[["Weight",sel.weight],["Purity",sel.purity],["Hallmark","BIS Certified"],["Finish","High Polish"]].map(([l,v])=><div key={l} className="ds"><div className="dsl">{l}</div><div className="dsv">{v}</div></div>)}</div>
            <div className="dac"><button className="bg1" style={{flex:1}} onClick={()=>addC(sel)}>Add to Cart</button><button className="bo1" onClick={()=>tW(sel.id)} style={{padding:"14px 20px"}}><Heart f={wish.includes(sel.id)}/></button></div>
            <p style={{fontSize:"11px",color:"var(--tm)",marginTop:"20px",lineHeight:1.7}}>Free insured shipping on wholesale orders. Contact us for bulk pricing and custom design requests.</p>
          </div>
        </div>
      </div>}

      {/* CHECKOUT */}
      {vw==="checkout"&&<div className="ckp">
        <button onClick={()=>setVw("home")} style={{display:"flex",alignItems:"center",gap:"8px",color:"var(--g)",fontSize:"12px",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"24px"}}><Bk/> Continue Shopping</button>
        <h2>Checkout</h2>
        <div className="ckg">
          <div>
            <h3 style={{fontFamily:"var(--sf)",fontSize:"22px",color:"var(--g)",marginBottom:"24px",fontWeight:400}}>Delivery Information</h3>
            <div className="fgr"><label className="flb">Full Name *</label><input className="inp" value={frm.name} onChange={e=>setFrm(d=>({...d,name:e.target.value}))} placeholder="Enter your full name"/></div>
            <div className="fr2"><div className="fgr"><label className="flb">Phone *</label><input className="inp" value={frm.phone} onChange={e=>setFrm(d=>({...d,phone:e.target.value}))} placeholder="+91 XXXXX XXXXX"/></div><div className="fgr"><label className="flb">Email</label><input className="inp" value={frm.email} onChange={e=>setFrm(d=>({...d,email:e.target.value}))} placeholder="you@example.com"/></div></div>
            <div className="fgr"><label className="flb">Address *</label><input className="inp" value={frm.address} onChange={e=>setFrm(d=>({...d,address:e.target.value}))} placeholder="Street address, shop number"/></div>
            <div className="fr2"><div className="fgr"><label className="flb">City *</label><input className="inp" value={frm.city} onChange={e=>setFrm(d=>({...d,city:e.target.value}))} placeholder="City"/></div><div className="fgr"><label className="flb">Pincode *</label><input className="inp" value={frm.pincode} onChange={e=>setFrm(d=>({...d,pincode:e.target.value}))} placeholder="PIN Code"/></div></div>
            <div className="fgr"><label className="flb">State</label><input className="inp" value={frm.state} onChange={e=>setFrm(d=>({...d,state:e.target.value}))}/></div>
            <div className="fgr"><label className="flb">Order Notes</label><textarea className="inp ta" value={frm.notes} onChange={e=>setFrm(d=>({...d,notes:e.target.value}))} placeholder="Special instructions..."/></div>
          </div>
          <div><div className="os"><h3>Order Summary</h3>{cart.map(it=><div key={it.id} className="sit"><span className="nm">{it.name} × {it.qty}</span><span className="pr">{fmt(it.price*it.qty)}</span></div>)}<div className="sit" style={{borderBottom:"none"}}><span className="nm">Shipping</span><span className="pr" style={{color:"#25D366"}}>Free</span></div><div className="stt"><span className="lb">Total</span><span className="vl">{fmt(tot)}</span></div><button className="ckb" style={{marginTop:"24px"}} onClick={place}>Place Order</button><p style={{fontSize:"10px",color:"var(--tm)",marginTop:"12px",textAlign:"center",lineHeight:1.6}}>By placing your order, you agree to our terms. Final pricing confirmed based on current gold rates.</p></div></div>
        </div>
      </div>}

      {/* CONFIRM */}
      {vw==="confirm"&&<div className="cfm"><div className="cfi"><Chk/></div><h2>Order Confirmed!</h2><p className="oid">Order #{oid}</p><p>Thank you for choosing Mohini Jewellers. Our team will contact you shortly to confirm details and arrange delivery.</p><p style={{color:"var(--ch)",fontSize:"12px",marginBottom:"40px"}}>For assistance: +91 99296 89736</p><button className="bg1" onClick={()=>setVw("home")}>Continue Shopping</button></div>}

      {/* FOOTER */}
      <footer className="ft"><div className="fi">
        <div className="fg2">
          <div><div className="fb">Mohini Jewellers</div><p className="fd">The House of Chain — Sagwara's premier gold wholesale jeweller, crafting exquisite chains for over 25 years.</p><div className="fs">{["Fb","Ig","Tw","Yt"].map(s=><button key={s} className="fsi">{s}</button>)}</div></div>
          <div><h4>Quick Links</h4>{nvs.map(n=><span key={n.l} className="fl" onClick={n.a}>{n.l}</span>)}</div>
          <div><h4>Collections</h4>{CATS.filter(c=>c.key!=="all").map(c=><span key={c.key} className="fl" onClick={()=>{setCat(c.key);setVw("home");setTimeout(()=>go("products"),100);}}>{c.label}</span>)}</div>
          <div><h4>Contact</h4><span className="fl">+91 99296 89736</span><span className="fl">Sagwara, Dungarpur</span><span className="fl">Rajasthan, India</span></div>
        </div>
        <div className="fbt"><span className="fc">© 2026 Mohini Jewellers. All rights reserved.</span><span className="fc">Crafted with passion in Sagwara</span></div>
      </div></footer>

      <a href="https://wa.me/919929689736" target="_blank" rel="noopener noreferrer" className="wa"><WAIcon/></a>
      {toast&&<div className="tst">{toast}</div>}
    </div>
  );
}
