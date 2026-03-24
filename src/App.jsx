import { useEffect, useState } from "react";
import {
  COMMUNITY_PERKS,
  EMAIL,
  PROCESS_STEPS,
  SERVICES,
  SETUP_DOC_LINK,
  SETUP_GUIDE,
  TEAM_DE,
  TEAM_DEVOPS,
  TEAM_SDE,
  TESTIMONIALS,
  WHATSAPP_COMMUNITY,
  WHATSAPP_LINK,
} from "./data/siteContent.js";
import { useCounter } from "./hooks/useCounter.js";
import { useInView } from "./hooks/useInView.js";

/* ═══════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════ */

function StatCard({stat,label,accent,delay}) {
  const [ref,iv] = useInView();
  const a = useCounter(stat,1800,iv);
  return <div ref={ref} style={{opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(30px)",transition:`all .7s cubic-bezier(.22,1,.36,1) ${delay}s`}}>
    <span style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:accent,fontFamily:"'Outfit',sans-serif",display:"block",lineHeight:1}}>{a}</span>
    <span style={{fontSize:".8rem",color:"#8A8F98",letterSpacing:".08em",textTransform:"uppercase",marginTop:4,display:"block"}}>{label}</span>
  </div>;
}

const WA = ({size=20,fill="#fff"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

function WhatsAppFloat() {
  return <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{position:"fixed",bottom:28,right:28,zIndex:9999,width:60,height:60,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 24px rgba(37,211,102,.4)",textDecoration:"none",animation:"wa-pulse 2s infinite",transition:"transform .3s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><WA size={30}/></a>;
}

/* ═══════════════════════════════════════════
   HACKER AVATAR SVG
   ═══════════════════════════════════════════ */

function HackerAvatar({size=120}) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00E5A0" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#7B61FF" stopOpacity="0.15"/>
        </linearGradient>
        <radialGradient id="hg2" cx="60" cy="45" r="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00E5A0" stopOpacity="0.15"/>
          <stop offset="1" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#hg1)"/>
      <circle cx="60" cy="45" r="55" fill="url(#hg2)"/>
      {/* Hood */}
      <path d="M25 55C25 32 40 15 60 15C80 15 95 32 95 55L95 65C95 65 85 60 60 60C35 60 25 65 25 65L25 55Z" fill="#1A1B23" stroke="#00E5A0" strokeWidth="1" strokeOpacity="0.3"/>
      {/* Face shadow */}
      <ellipse cx="60" cy="58" rx="25" ry="20" fill="#12131A"/>
      {/* Glowing eyes */}
      <rect x="42" y="50" width="14" height="5" rx="2" fill="#00E5A0" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite"/>
      </rect>
      <rect x="64" y="50" width="14" height="5" rx="2" fill="#00E5A0" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite"/>
      </rect>
      {/* Eye glare */}
      <rect x="44" y="51" width="4" height="2" rx="1" fill="#fff" opacity="0.5"/>
      <rect x="66" y="51" width="4" height="2" rx="1" fill="#fff" opacity="0.5"/>
      {/* Body */}
      <path d="M30 85C30 75 43 68 60 68C77 68 90 75 90 85L90 120L30 120Z" fill="#1A1B23" stroke="#00E5A0" strokeWidth="0.8" strokeOpacity="0.2"/>
      {/* Laptop glow */}
      <rect x="42" y="88" width="36" height="22" rx="3" fill="#0D0E14" stroke="#00E5A0" strokeWidth="0.8" strokeOpacity="0.4"/>
      <rect x="46" y="92" width="28" height="14" rx="2" fill="#0A1F15"/>
      {/* Code lines on screen */}
      <rect x="49" y="95" width="12" height="1.5" rx="0.75" fill="#00E5A0" opacity="0.7"/>
      <rect x="49" y="98.5" width="18" height="1.5" rx="0.75" fill="#7B61FF" opacity="0.5"/>
      <rect x="49" y="102" width="8" height="1.5" rx="0.75" fill="#00E5A0" opacity="0.4"/>
      {/* Matrix rain effect */}
      <text x="20" y="35" fill="#00E5A0" opacity="0.15" fontSize="8" fontFamily="monospace">01</text>
      <text x="90" y="30" fill="#00E5A0" opacity="0.12" fontSize="7" fontFamily="monospace">10</text>
      <text x="15" y="80" fill="#7B61FF" opacity="0.1" fontSize="6" fontFamily="monospace">{'{ }'}</text>
      <text x="92" y="78" fill="#00E5A0" opacity="0.1" fontSize="7" fontFamily="monospace">{'</>'}</text>
    </svg>
  );
}

function DefaultAvatar({size=120, name, accent="#7B61FF"}) {
  const initials = name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`ag-${name}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor={accent} stopOpacity="0.25"/>
          <stop offset="1" stopColor={accent} stopOpacity="0.08"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill={`url(#ag-${name})`}/>
      <circle cx="60" cy="60" r="58" fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.2"/>
      {/* Head */}
      <circle cx="60" cy="42" r="18" fill="#1A1B23" stroke={accent} strokeWidth="1" strokeOpacity="0.3"/>
      {/* Body */}
      <path d="M30 95C30 78 43 68 60 68C77 68 90 78 90 95L90 120L30 120Z" fill="#1A1B23" stroke={accent} strokeWidth="0.8" strokeOpacity="0.2"/>
      {/* Initials */}
      <text x="60" y="47" textAnchor="middle" fill={accent} fontSize="16" fontFamily="monospace" fontWeight="bold" opacity="0.9">{initials}</text>
      {/* Decorative code symbols */}
      <text x="18" y="35" fill={accent} opacity="0.12" fontSize="8" fontFamily="monospace">{'<>'}</text>
      <text x="92" y="90" fill={accent} opacity="0.1" fontSize="7" fontFamily="monospace">{'/>'}</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label:"Services", href:"#services" },
    { label:"Team", href:"#team" },
    { label:"Setup Guide", href:"#setup-guide" },
    { label:"Process", href:"#process" },
    { label:"Pricing", href:"#pricing" },
    { label:"Reviews", href:"#testimonials" },
    { label:"Job Updates", href:"#community" },
    { label:"Contact", href:"#contact" },
  ];

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:scrolled?"12px 0":"20px 0",background:scrolled?"rgba(8,9,14,0.92)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(255,255,255,0.06)":"none",transition:"all .4s ease"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <a href="#" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}} style={{textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#00E5A0,#7B61FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",fontWeight:900,color:"#08090E",fontFamily:"'Outfit',sans-serif"}}>HQ</div>
          <span style={{fontSize:"1.25rem",fontWeight:700,color:"#fff",fontFamily:"'Outfit',sans-serif",letterSpacing:"-0.02em"}}>HireQuest</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:22}} className="nav-desktop">
          {links.map(l=>(
            <a key={l.label} href={l.href} onClick={e=>scrollTo(e,l.href)} style={{color:"#B0B5BE",textDecoration:"none",fontSize:".85rem",fontWeight:500,fontFamily:"'Outfit',sans-serif",transition:"color .2s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#B0B5BE"}>{l.label}</a>
          ))}
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{background:"linear-gradient(135deg,#00E5A0,#00C48C)",color:"#08090E",padding:"10px 22px",borderRadius:50,textDecoration:"none",fontWeight:700,fontSize:".88rem",fontFamily:"'Outfit',sans-serif",boxShadow:"0 0 20px rgba(0,229,160,.3)",transition:"all .2s",whiteSpace:"nowrap"}}
            onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}
          >WhatsApp Us →</a>
        </div>
        <button onClick={()=>setMenuOpen(!menuOpen)} className="nav-hamburger" style={{display:"none",background:"none",border:"none",color:"#fff",fontSize:"1.5rem",cursor:"pointer"}}>{menuOpen?"✕":"☰"}</button>
      </div>
      {menuOpen && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"rgba(8,9,14,.97)",backdropFilter:"blur(20px)",padding:"20px 24px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          {links.map(l=>(
            <a key={l.label} href={l.href} onClick={e=>scrollTo(e,l.href)} style={{display:"block",color:"#B0B5BE",textDecoration:"none",padding:"14px 0",fontSize:"1rem",fontFamily:"'Outfit',sans-serif",borderBottom:"1px solid rgba(255,255,255,.04)"}}>{l.label}</a>
          ))}
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{display:"block",color:"#25D366",textDecoration:"none",padding:"14px 0",fontSize:"1rem",fontFamily:"'Outfit',sans-serif",fontWeight:700}}>💬 WhatsApp Us</a>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */

function HeroSection() {
  const [ref,iv] = useInView(0.1);
  const scrollTo = (e,href) => { e.preventDefault(); const el=document.querySelector(href); if(el){const y=el.getBoundingClientRect().top+window.scrollY-80; window.scrollTo({top:y,behavior:"smooth"});} };
  return (
    <section id="hero" ref={ref} style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"120px 24px 80px"}}>
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,229,160,.12) 0%,transparent 70%)",top:"-10%",right:"-10%",animation:"float1 8s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(123,97,255,.1) 0%,transparent 70%)",bottom:"-5%",left:"-8%",animation:"float2 10s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,.08) 0%,transparent 70%)",top:"30%",left:"20%",animation:"float1 12s ease-in-out infinite reverse"}}/>
      <div style={{position:"absolute",inset:0,opacity:.03,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>

      <div style={{textAlign:"center",maxWidth:900,position:"relative",zIndex:1}}>
        <div style={{opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(40px)",transition:"all .8s cubic-bezier(.22,1,.36,1) .1s"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,229,160,.08)",border:"1px solid rgba(0,229,160,.2)",borderRadius:50,padding:"8px 20px",marginBottom:32}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"#00E5A0",animation:"pulse 2s infinite"}}/>
            <span style={{color:"#00E5A0",fontSize:".85rem",fontWeight:600,fontFamily:"'Outfit',sans-serif",letterSpacing:".05em"}}>TRUSTED BY 5000+ PROFESSIONALS</span>
          </div>
        </div>
        <h1 style={{fontSize:"clamp(2.5rem,6vw,5rem)",fontWeight:900,lineHeight:1.05,fontFamily:"'Outfit',sans-serif",color:"#fff",margin:"0 0 24px",letterSpacing:"-0.03em",opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(40px)",transition:"all .8s cubic-bezier(.22,1,.36,1) .25s"}}>
          Your Career,{" "}<span style={{background:"linear-gradient(135deg,#00E5A0,#7B61FF,#00B4D8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Our Expertise</span>
        </h1>
        <p style={{fontSize:"clamp(1.05rem,2vw,1.3rem)",color:"#8A8F98",maxWidth:620,margin:"0 auto 48px",lineHeight:1.7,fontFamily:"'DM Sans',sans-serif",opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(40px)",transition:"all .8s cubic-bezier(.22,1,.36,1) .4s"}}>
          From interview proxies to on-the-job support — we provide end-to-end career solutions that land you the role and help you excel in it.
        </p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(40px)",transition:"all .8s cubic-bezier(.22,1,.36,1) .55s"}}>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{background:"linear-gradient(135deg,#00E5A0,#00C48C)",color:"#08090E",padding:"16px 40px",borderRadius:50,textDecoration:"none",fontWeight:800,fontSize:"1.05rem",fontFamily:"'Outfit',sans-serif",boxShadow:"0 0 40px rgba(0,229,160,.3),inset 0 1px 0 rgba(255,255,255,.2)",transition:"all .3s",display:"inline-flex",alignItems:"center",gap:10}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 0 60px rgba(0,229,160,.5)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 0 40px rgba(0,229,160,.3)";}}
          ><WA size={20} fill="#08090E"/> Book Free Consultation</a>
          <a href="#services" onClick={e=>scrollTo(e,"#services")} style={{background:"rgba(255,255,255,.05)",color:"#fff",padding:"16px 40px",borderRadius:50,textDecoration:"none",fontWeight:600,fontSize:"1.05rem",fontFamily:"'Outfit',sans-serif",border:"1px solid rgba(255,255,255,.1)",transition:"all .3s"}}
            onMouseEnter={e=>e.target.style.background="rgba(255,255,255,.1)"} onMouseLeave={e=>e.target.style.background="rgba(255,255,255,.05)"}
          >View Services ↓</a>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"clamp(24px,5vw,64px)",marginTop:72,paddingTop:40,borderTop:"1px solid rgba(255,255,255,.06)"}}>
          <StatCard stat="98%" label="Success Rate" accent="#00E5A0" delay={.65}/>
          <StatCard stat="5000+" label="Clients Served" accent="#7B61FF" delay={.75}/>
          <StatCard stat="50+" label="Technologies" accent="#FF6B35" delay={.85}/>
        </div>
      </div>
    </section>
  );
}

function CommunityBanner() {
  const [ref, iv] = useInView(0.1);
  const [h, setH] = useState(false);
  return (
    <div
      ref={ref}
      style={{
        maxWidth: 1100,
        margin: "-20px auto 0",
        padding: "0 24px",
        position: "relative",
        zIndex: 10,
        opacity: iv ? 1 : 0,
        transform: iv ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s cubic-bezier(.22,1,.36,1) 0.1s",
      }}
    >
      <a
        href={WHATSAPP_COMMUNITY}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
          padding: "20px 32px",
          borderRadius: 18,
          background: h ? "linear-gradient(135deg, rgba(37,211,102,0.18), rgba(0,229,160,0.12))" : "linear-gradient(135deg, rgba(37,211,102,0.1), rgba(0,229,160,0.06))",
          border: "1px solid rgba(37,211,102,0.3)",
          textDecoration: "none",
          transition: "all 0.4s cubic-bezier(.22,1,.36,1)",
          transform: h ? "translateY(-2px)" : "translateY(0)",
          boxShadow: h ? "0 8px 40px rgba(37,211,102,0.2)" : "0 4px 20px rgba(37,211,102,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "200%",
            height: "100%",
            background: "linear-gradient(90deg, transparent 0%, rgba(37,211,102,0.06) 50%, transparent 100%)",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(37,211,102,0.2)",
              border: "1px solid rgba(37,211,102,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 2s infinite",
            }}
          >
            <WA size={22} fill="#25D366" />
          </div>
          <div>
            <span
              style={{
                color: "#25D366",
                fontSize: ".75rem",
                fontWeight: 800,
                fontFamily: "'Outfit',sans-serif",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              🔥 FREE JOB UPDATES
            </span>
            <span style={{ color: "#C5C9D2", fontSize: ".95rem", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>Join our WhatsApp Community — Latest jobs posted daily!</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#25D366",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 50,
            fontWeight: 800,
            fontSize: ".88rem",
            fontFamily: "'Outfit',sans-serif",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 0 20px rgba(37,211,102,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          Join Now — It&apos;s Free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════ */

function ServiceCard({service,index}) {
  const [ref,iv] = useInView(.15);
  const [h, setH] = useState(false);
  const rgb = service.accent==="#00E5A0"?"0,229,160":service.accent==="#7B61FF"?"123,97,255":service.accent==="#FF6B35"?"255,107,53":"0,180,216";
  return (
    <div ref={ref} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:h?`linear-gradient(135deg,rgba(${rgb},.08),rgba(255,255,255,.03))`:"rgba(255,255,255,.02)",border:`1px solid ${h?service.accent+"40":"rgba(255,255,255,.06)"}`,borderRadius:20,padding:"clamp(28px,4vw,44px)",position:"relative",overflow:"hidden",transition:"all .5s cubic-bezier(.22,1,.36,1)",transform:iv?(h?"translateY(-6px)":"translateY(0)"):"translateY(50px)",opacity:iv?1:0,transitionDelay:`${index*.1}s`,cursor:"pointer"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${service.accent}15 0%,transparent 70%)`,opacity:h?1:0,transition:"opacity .5s"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24}}>
          <div style={{fontSize:"2.5rem",width:64,height:64,borderRadius:16,background:`${service.accent}12`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${service.accent}20`}}>{service.icon}</div>
          <div style={{textAlign:"right"}}>
            <span style={{fontSize:"2rem",fontWeight:800,color:service.accent,fontFamily:"'Outfit',sans-serif",lineHeight:1}}>{service.stat}</span>
            <span style={{display:"block",fontSize:".75rem",color:"#6B7280",textTransform:"uppercase",letterSpacing:".08em",marginTop:2}}>{service.statLabel}</span>
          </div>
        </div>
        <h3 style={{fontSize:"1.5rem",fontWeight:800,color:"#fff",fontFamily:"'Outfit',sans-serif",margin:"0 0 6px"}}>{service.title}</h3>
        <p style={{fontSize:".9rem",color:service.accent,fontWeight:600,fontFamily:"'Outfit',sans-serif",margin:"0 0 16px"}}>{service.subtitle}</p>
        <p style={{fontSize:".95rem",color:"#8A8F98",lineHeight:1.7,fontFamily:"'DM Sans',sans-serif",margin:"0 0 24px"}}>{service.description}</p>
        <ul style={{listStyle:"none",padding:0,margin:0,display:"grid",gap:10}}>
          {service.features.map((f,i)=>(
            <li key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:".9rem",color:"#B0B5BE",fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{width:20,height:20,borderRadius:6,background:`${service.accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",color:service.accent,flexShrink:0}}>✓</span>{f}
            </li>
          ))}
        </ul>
        <div style={{marginTop:28,paddingTop:20,borderTop:"1px solid rgba(255,255,255,.06)"}}>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{color:service.accent,textDecoration:"none",fontWeight:700,fontSize:".9rem",fontFamily:"'Outfit',sans-serif",display:"inline-flex",alignItems:"center",gap:8,transition:"gap .3s"}}
            onMouseEnter={e=>e.currentTarget.style.gap="14px"} onMouseLeave={e=>e.currentTarget.style.gap="8px"}
          >Enquire Now <span>→</span></a>
        </div>
      </div>
    </div>
  );
}

function ServicesSection() {
  const [ref,iv] = useInView(.1);
  return (
    <section id="services" style={{padding:"100px 24px",position:"relative"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div ref={ref} style={{textAlign:"center",marginBottom:64,opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(30px)",transition:"all .7s cubic-bezier(.22,1,.36,1)"}}>
          <span style={{color:"#00E5A0",fontSize:".85rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>WHAT WE DO</span>
          <h2 style={{fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:900,color:"#fff",fontFamily:"'Outfit',sans-serif",margin:"12px 0 16px",letterSpacing:"-0.02em"}}>Our Services</h2>
          <p style={{color:"#6B7280",fontSize:"1.1rem",maxWidth:550,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>Four powerful services designed to fast-track your tech career.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,280px),1fr))",gap:24}}>
          {SERVICES.map((s,i)=><ServiceCard key={s.id} service={s} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TEAM SECTION
   ═══════════════════════════════════════════ */

function TeamMemberCard({ member, index, categoryAccent }) {
  const [ref, iv] = useInView(0.1);
  const [h, setH] = useState(false);
  const accent = categoryAccent;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? `rgba(255,255,255,0.04)` : "rgba(255,255,255,0.02)",
        border: `1px solid ${h ? accent + "40" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20,
        padding: "32px 24px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.5s cubic-bezier(.22,1,.36,1)",
        transform: iv ? (h ? "translateY(-8px)" : "translateY(0)") : "translateY(40px)",
        opacity: iv ? 1 : 0,
        transitionDelay: `${index * 0.08}s`,
      }}
    >
      {/* Glow */}
      <div style={{
        position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
        width: 160, height: 160, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)`,
        opacity: h ? 1 : 0, transition: "opacity 0.5s",
      }} />

      {member.isLead && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: `${accent}20`, border: `1px solid ${accent}30`,
          borderRadius: 8, padding: "4px 10px",
          fontSize: ".65rem", fontWeight: 800, color: accent,
          fontFamily: "'Outfit',sans-serif", letterSpacing: ".08em",
          textTransform: "uppercase",
        }}>LEAD</div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Avatar */}
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          margin: "0 auto 20px",
          overflow: "hidden",
          border: `2px solid ${h ? accent + "60" : "rgba(255,255,255,0.08)"}`,
          transition: "border-color 0.4s",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.3)",
        }}>
          {member.avatar === "hacker" ? (
            <HackerAvatar size={100} />
          ) : (
            <DefaultAvatar size={100} name={member.name} accent={accent} />
          )}
        </div>

        <h4 style={{
          color: "#fff", fontSize: "1.1rem", fontWeight: 700,
          fontFamily: "'Outfit',sans-serif", margin: "0 0 4px",
        }}>{member.name}</h4>

        <p style={{
          color: accent, fontSize: ".82rem", fontWeight: 600,
          fontFamily: "'Outfit',sans-serif", margin: "0 0 8px",
        }}>{member.role}</p>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8, padding: "6px 14px",
        }}>
          <span style={{ fontSize: ".7rem", opacity: 0.5 }}>🏢</span>
          <span style={{
            color: "#8A8F98", fontSize: ".8rem",
            fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
          }}>{member.company}</span>
        </div>
      </div>
    </div>
  );
}

function TeamCategory({ cat, isLast }) {
  const [cRef, cIv] = useInView(0.1);
  return (
    <div style={{ marginBottom: isLast ? 0 : 64 }}>
      <div
        ref={cRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
          opacity: cIv ? 1 : 0,
          transform: cIv ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div
          style={{
            width: 4,
            height: 40,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${cat.accent}, ${cat.accent}40)`,
          }}
        />
        <div>
          <h3
            style={{
              color: "#fff",
              fontSize: "1.3rem",
              fontWeight: 800,
              fontFamily: "'Outfit',sans-serif",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {cat.title}
          </h3>
          <p
            style={{
              color: "#6B7280",
              fontSize: ".85rem",
              fontFamily: "'DM Sans',sans-serif",
              margin: "2px 0 0",
            }}
          >
            {cat.subtitle}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            height: 1,
            background: `linear-gradient(90deg, ${cat.accent}20, transparent)`,
            marginLeft: 8,
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${cat.members.length <= 2 ? "220px" : "195px"}, 1fr))`,
          gap: 20,
          maxWidth: cat.members.length <= 2 ? 560 : "none",
        }}
      >
        {cat.members.map((m, mi) => (
          <TeamMemberCard key={m.name} member={m} index={mi} categoryAccent={cat.accent} />
        ))}
      </div>
    </div>
  );
}

function TeamSection() {
  const [ref, iv] = useInView(0.1);

  const categories = [
    { title: "Software Engineers", subtitle: "SDE / Full-Stack / Backend Experts", accent: "#00E5A0", members: TEAM_SDE },
    { title: "Data Engineers", subtitle: "ETL / Big Data / Analytics Experts", accent: "#7B61FF", members: TEAM_DE },
    { title: "DevOps Engineers", subtitle: "Cloud / CI-CD / Infrastructure Experts", accent: "#00B4D8", members: TEAM_DEVOPS },
  ];

  return (
    <section id="team" style={{ padding: "100px 24px", position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent, rgba(0,229,160,0.015), rgba(123,97,255,0.015), transparent)",
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 72,
          opacity: iv ? 1 : 0, transform: iv ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s cubic-bezier(.22,1,.36,1)",
        }}>
          <span style={{ color: "#FF6B35", fontSize: ".85rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", fontFamily: "'Outfit',sans-serif" }}>
            MEET THE EXPERTS
          </span>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, color: "#fff", fontFamily: "'Outfit',sans-serif", margin: "12px 0 16px", letterSpacing: "-0.02em" }}>
            Our Team
          </h2>
          <p style={{ color: "#6B7280", fontSize: "1.1rem", maxWidth: 580, margin: "0 auto", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
            Industry veterans from top tech companies who've been in the trenches — now they're in your corner.
          </p>
        </div>

        {categories.map((cat, ci) => (
          <TeamCategory key={cat.title} cat={cat} isLast={ci === categories.length - 1} />
        ))}

        {/* Join the team CTA */}
        <div style={{
          marginTop: 64, textAlign: "center",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: "36px 24px",
        }}>
          <p style={{ color: "#8A8F98", fontSize: "1rem", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
            Are you an expert in your domain?
          </p>
          <h4 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, fontFamily: "'Outfit',sans-serif", margin: "0 0 20px" }}>
            Join Our Growing Team of 50+ Experts
          </h4>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.25)",
            color: "#00E5A0", padding: "12px 28px", borderRadius: 50,
            textDecoration: "none", fontWeight: 700, fontSize: ".9rem",
            fontFamily: "'Outfit',sans-serif", transition: "all 0.3s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,229,160,0.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,229,160,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <WA size={18} fill="#00E5A0" /> Apply via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SETUP GUIDE
   ═══════════════════════════════════════════ */

const SETUP_TOOL_BADGES = [
  { name: "Chrome Remote Desktop", icon: "🖥️", color: "#4285F4" },
  { name: "Otter.ai", icon: "🧠", color: "#7B61FF" },
  { name: "Google Meet", icon: "🎙️", color: "#00E5A0" },
  { name: "Wired Headphones", icon: "🎧", color: "#FF6B35" },
];

function ExternalLinkIcon({ size = 16, stroke = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function SetupGuideSection() {
  const [ref, iv] = useInView(0.1);
  const [act, setAct] = useState(0);
  return (
    <section id="setup-guide" style={{ padding: "100px 24px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent,rgba(123,97,255,.03),transparent)" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: iv ? 1 : 0,
            transform: iv ? "translateY(0)" : "translateY(30px)",
            transition: "all .7s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <span style={{ color: "#7B61FF", fontSize: ".85rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", fontFamily: "'Outfit',sans-serif" }}>SETUP GUIDE</span>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, color: "#fff", fontFamily: "'Outfit',sans-serif", margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Interview Proxy Setup Instructions</h2>
          <p style={{ color: "#8A8F98", fontSize: "1.05rem", maxWidth: 650, margin: "0 auto", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7 }}>
            For interviews, we use <span style={{ color: "#fff", fontWeight: 600 }}>Chrome Remote Desktop</span> for remote access and <span style={{ color: "#fff", fontWeight: 600 }}>Otter</span> for voice assistance. Please ensure the following setup is ready before the interview.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 40,
            opacity: iv ? 1 : 0,
            transform: iv ? "translateY(0)" : "translateY(20px)",
            transition: "all .7s cubic-bezier(.22,1,.36,1) .15s",
          }}
        >
          {SETUP_TOOL_BADGES.map((t) => (
            <div
              key={t.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: `${t.color}10`,
                border: `1px solid ${t.color}25`,
                borderRadius: 50,
                padding: "8px 18px",
              }}
            >
              <span style={{ fontSize: ".95rem" }}>{t.icon}</span>
              <span style={{ color: t.color, fontSize: ".82rem", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>{t.name}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {SETUP_GUIDE.map((s, i) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setAct(i)}
              style={{
                background: act === i ? "rgba(123,97,255,.15)" : "rgba(255,255,255,.03)",
                border: `1px solid ${act === i ? "rgba(123,97,255,.4)" : "rgba(255,255,255,.06)"}`,
                borderRadius: 12,
                padding: "12px 20px",
                cursor: "pointer",
                color: act === i ? "#fff" : "#6B7280",
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 600,
                fontSize: ".85rem",
                transition: "all .3s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
              <span className="guide-tab-label">{s.title}</span>
            </button>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 24, padding: "clamp(28px,5vw,48px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,#7B61FF ${((act + 1) / SETUP_GUIDE.length) * 100}%,rgba(255,255,255,.06) 0%)`, transition: "background .5s" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ fontSize: "2.5rem", width: 64, height: 64, borderRadius: 16, background: "rgba(123,97,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(123,97,255,.2)" }}>{SETUP_GUIDE[act].icon}</div>
            <div>
              <span style={{ color: "#7B61FF", fontSize: ".8rem", fontWeight: 700, fontFamily: "'Outfit',sans-serif", letterSpacing: ".1em" }}>STEP {SETUP_GUIDE[act].step}</span>
              <h3 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Outfit',sans-serif", margin: 0 }}>{SETUP_GUIDE[act].title}</h3>
            </div>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {SETUP_GUIDE[act].items.map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(255,255,255,.02)", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(255,255,255,.04)", transition: "all .3s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(123,97,255,.05)";
                  e.currentTarget.style.borderColor = "rgba(123,97,255,.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.04)";
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(123,97,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#7B61FF", fontSize: ".75rem", fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}>{i + 1}</div>
                <p style={{ color: "#C5C9D2", fontSize: ".95rem", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif", margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.06)", flexWrap: "wrap", gap: 12 }}>
            <button type="button" onClick={() => setAct(Math.max(0, act - 1))} disabled={act === 0} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "10px 20px", color: act === 0 ? "#3B3F46" : "#B0B5BE", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: ".85rem", cursor: act === 0 ? "default" : "pointer", transition: "all .2s" }}>
              ← Previous
            </button>
            <a
              href={SETUP_DOC_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(123,97,255,.12)",
                border: "1px solid rgba(123,97,255,.3)",
                color: "#B8A9FF",
                padding: "10px 24px",
                borderRadius: 50,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: ".85rem",
                fontFamily: "'Outfit',sans-serif",
                transition: "all .3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(123,97,255,.22)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(123,97,255,.12)";
                e.currentTarget.style.color = "#B8A9FF";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <ExternalLinkIcon size={16} />
              Read Full Setup Guide
            </a>
            <button type="button" onClick={() => setAct(Math.min(SETUP_GUIDE.length - 1, act + 1))} disabled={act === SETUP_GUIDE.length - 1} style={{ background: act === SETUP_GUIDE.length - 1 ? "rgba(255,255,255,.05)" : "rgba(123,97,255,.15)", border: `1px solid ${act === SETUP_GUIDE.length - 1 ? "rgba(255,255,255,.1)" : "rgba(123,97,255,.3)"}`, borderRadius: 10, padding: "10px 20px", color: act === SETUP_GUIDE.length - 1 ? "#3B3F46" : "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: ".85rem", cursor: act === SETUP_GUIDE.length - 1 ? "default" : "pointer", transition: "all .2s" }}>
              Next →
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            textAlign: "center",
            background: "linear-gradient(135deg,rgba(123,97,255,.06),rgba(0,229,160,.04))",
            border: "1px solid rgba(123,97,255,.15)",
            borderRadius: 16,
            padding: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.3rem" }}>📄</span>
            <span style={{ color: "#C5C9D2", fontSize: ".95rem", fontFamily: "'DM Sans',sans-serif" }}>Want the complete step-by-step document?</span>
          </div>
          <a
            href={SETUP_DOC_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#7B61FF",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 50,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: ".9rem",
              fontFamily: "'Outfit',sans-serif",
              transition: "all .3s",
              boxShadow: "0 0 24px rgba(123,97,255,.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(123,97,255,.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(123,97,255,.3)";
            }}
          >
            <ExternalLinkIcon size={16} stroke="#fff" />
            Open Full Guide →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROCESS
   ═══════════════════════════════════════════ */

function ProcessStep({ s, index }) {
  const [sR, sI] = useInView(0.2);
  return (
    <div
      ref={sR}
      style={{
        textAlign: "center",
        opacity: sI ? 1 : 0,
        transform: sI ? "translateY(0)" : "translateY(40px)",
        transition: `all .6s cubic-bezier(.22,1,.36,1) ${index * 0.12}s`,
      }}
    >
      <div
        style={{
          fontSize: "3.5rem",
          fontWeight: 900,
          background: "linear-gradient(135deg,rgba(123,97,255,.2),rgba(0,229,160,.2))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "'Outfit',sans-serif",
          lineHeight: 1,
          marginBottom: 16,
        }}
      >
        {s.step}
      </div>
      <h4 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Outfit',sans-serif", margin: "0 0 8px" }}>{s.title}</h4>
      <p style={{ color: "#6B7280", fontSize: ".9rem", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
    </div>
  );
}

function ProcessSection() {
  const [ref,iv] = useInView(.1);
  return (
    <section id="process" style={{padding:"100px 24px",position:"relative"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent,rgba(0,229,160,.02),transparent)"}}/>
      <div style={{maxWidth:1000,margin:"0 auto",position:"relative"}}>
        <div ref={ref} style={{textAlign:"center",marginBottom:64,opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(30px)",transition:"all .7s cubic-bezier(.22,1,.36,1)"}}>
          <span style={{color:"#00E5A0",fontSize:".85rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>HOW IT WORKS</span>
          <h2 style={{fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:900,color:"#fff",fontFamily:"'Outfit',sans-serif",margin:"12px 0",letterSpacing:"-0.02em"}}>Simple 4-Step Process</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:32}}>
          {PROCESS_STEPS.map((s, i) => (
            <ProcessStep key={s.step} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════ */

const PRICING_PLANS = [
  {name:"Mock Interview",price:"$100",period:"per session",accent:"#7B61FF",features:["1-on-1 Expert Session","Detailed Feedback Report","DSA or System Design Focus","Recording Provided"],popular:false},
  {name:"Interview Proxy",price:"$200",period:"per session",accent:"#00E5A0",features:["Complete Interview Coverage","Technical + HR Rounds","50+ Technology Stack","Post-Interview Debrief","100% Confidential"],popular:true},
  {name:"Job Support",price:"$600",period:"per month",accent:"#00B4D8",features:["3 Hours Daily Expert Assistance","More Hours = More Days Covered","Code Review & Debugging","Sprint Support","Dedicated Expert"],popular:false,note:"Base: 3 hrs/day. Need more hours? Extra days scale automatically."},
];

function PricingCard({ plan, index }) {
  const p = plan;
  const [pR, pI] = useInView(0.2);
  return (
    <div
      ref={pR}
      style={{
        background: p.popular ? "linear-gradient(135deg,rgba(0,229,160,.08),rgba(123,97,255,.05))" : "rgba(255,255,255,.02)",
        border: `1px solid ${p.popular ? "rgba(0,229,160,.3)" : "rgba(255,255,255,.06)"}`,
        borderRadius: 24,
        padding: "clamp(28px,4vw,44px)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        transform: pI ? (p.popular ? "scale(1.03)" : "scale(1)") : "translateY(40px)",
        opacity: pI ? 1 : 0,
        transition: `all .6s cubic-bezier(.22,1,.36,1) ${index * 0.1}s`,
      }}
    >
      {p.popular && (
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg,#00E5A0,#7B61FF)",
            color: "#08090E",
            fontSize: ".75rem",
            fontWeight: 800,
            padding: "6px 20px",
            borderRadius: "0 0 12px 12px",
            fontFamily: "'Outfit',sans-serif",
            letterSpacing: ".05em",
          }}
        >
          MOST POPULAR
        </div>
      )}
      <h3 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, fontFamily: "'Outfit',sans-serif", margin: "0 0 16px" }}>{p.name}</h3>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: "2.8rem", fontWeight: 900, color: p.accent, fontFamily: "'Outfit',sans-serif" }}>{p.price}</span>
        <span style={{ color: "#6B7280", fontSize: ".9rem", fontFamily: "'DM Sans',sans-serif" }}> {p.period}</span>
      </div>
      {p.note && (
        <div
          style={{
            background: `${p.accent}10`,
            border: `1px solid ${p.accent}20`,
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 20,
            fontSize: ".82rem",
            color: "#B0B5BE",
            fontFamily: "'DM Sans',sans-serif",
            lineHeight: 1.5,
          }}
        >
          💡 {p.note}
        </div>
      )}
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "grid", gap: 12, flex: 1 }}>
        {p.features.map((f, fi) => (
          <li key={fi} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: ".9rem", color: "#B0B5BE", fontFamily: "'DM Sans',sans-serif" }}>
            <span style={{ color: p.accent, fontSize: ".8rem" }}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          padding: "14px 24px",
          borderRadius: 50,
          textDecoration: "none",
          fontWeight: 700,
          fontSize: ".95rem",
          fontFamily: "'Outfit',sans-serif",
          background: p.popular ? "linear-gradient(135deg,#00E5A0,#00C48C)" : "rgba(255,255,255,.05)",
          color: p.popular ? "#08090E" : "#fff",
          border: p.popular ? "none" : "1px solid rgba(255,255,255,.1)",
          boxShadow: p.popular ? "0 0 30px rgba(0,229,160,.3)" : "none",
          transition: "all .3s",
        }}
      >
        Get Started
      </a>
    </div>
  );
}

function PricingSection() {
  const [ref,iv] = useInView(.1);
  return (
    <section id="pricing" style={{padding:"100px 24px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div ref={ref} style={{textAlign:"center",marginBottom:64,opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(30px)",transition:"all .7s cubic-bezier(.22,1,.36,1)"}}>
          <span style={{color:"#00B4D8",fontSize:".85rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>PRICING</span>
          <h2 style={{fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:900,color:"#fff",fontFamily:"'Outfit',sans-serif",margin:"12px 0",letterSpacing:"-0.02em"}}>Transparent Pricing</h2>
          <p style={{color:"#6B7280",fontSize:"1.05rem",maxWidth:480,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>No hidden fees. No surprises. Pay only for what you need.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,alignItems:"stretch"}}>
          {PRICING_PLANS.map((p, i) => (
            <PricingCard key={p.name} plan={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════ */

function TestimonialCard({ testimonial, index }) {
  const t = testimonial;
  const [tR, tI] = useInView(0.2);
  return (
    <div
      ref={tR}
      style={{
        background: "rgba(255,255,255,.02)",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: 20,
        padding: "clamp(24px,3vw,36px)",
        opacity: tI ? 1 : 0,
        transform: tI ? "translateY(0)" : "translateY(40px)",
        transition: `all .6s cubic-bezier(.22,1,.36,1) ${index * 0.1}s`,
      }}
    >
      <div style={{ fontSize: "1.1rem", color: "#FFB800", marginBottom: 16, letterSpacing: 2 }}>{"★".repeat(t.rating)}</div>
      <p style={{ color: "#C5C9D2", fontSize: "1rem", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif", margin: "0 0 24px", fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
      <div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: ".95rem", fontFamily: "'Outfit',sans-serif", display: "block" }}>{t.name}</span>
        <span style={{ color: "#00E5A0", fontSize: ".8rem", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>{t.role}</span>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [ref,iv] = useInView(.1);
  return (
    <section id="testimonials" style={{padding:"100px 24px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div ref={ref} style={{textAlign:"center",marginBottom:64,opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(30px)",transition:"all .7s cubic-bezier(.22,1,.36,1)"}}>
          <span style={{color:"#FF6B35",fontSize:".85rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>SUCCESS STORIES</span>
          <h2 style={{fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:900,color:"#fff",fontFamily:"'Outfit',sans-serif",margin:"12px 0",letterSpacing:"-0.02em"}}>What Our Clients Say</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityPerkCard({ perk, index }) {
  const p = perk;
  const [pRef, pIv] = useInView(0.1);
  return (
    <div
      ref={pRef}
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 14,
        padding: "20px",
        opacity: pIv ? 1 : 0,
        transform: pIv ? "translateY(0)" : "translateY(25px)",
        transition: `all 0.5s cubic-bezier(.22,1,.36,1) ${index * 0.06}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(37,211,102,0.04)";
        e.currentTarget.style.borderColor = "rgba(37,211,102,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          flexShrink: 0,
          background: "rgba(37,211,102,0.08)",
          border: "1px solid rgba(37,211,102,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
        }}
      >
        {p.icon}
      </div>
      <div>
        <h4 style={{ color: "#fff", fontSize: ".95rem", fontWeight: 700, fontFamily: "'Outfit',sans-serif", margin: "0 0 4px" }}>{p.title}</h4>
        <p style={{ color: "#6B7280", fontSize: ".85rem", margin: 0, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{p.desc}</p>
      </div>
    </div>
  );
}

function CommunitySection() {
  const [ref, iv] = useInView(0.1);

  return (
    <section id="community" style={{ padding: "100px 24px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent, rgba(37,211,102,0.03), transparent)" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 56,
            opacity: iv ? 1 : 0,
            transform: iv ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(37,211,102,0.1)",
              border: "1px solid rgba(37,211,102,0.25)",
              borderRadius: 50,
              padding: "8px 20px",
              marginBottom: 20,
            }}
          >
            <span style={{ animation: "pulse 1.5s infinite", fontSize: "1rem" }}>🔴</span>
            <span style={{ color: "#25D366", fontSize: ".82rem", fontWeight: 700, fontFamily: "'Outfit',sans-serif", letterSpacing: ".06em" }}>LIVE COMMUNITY — 100% FREE</span>
          </div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, color: "#fff", fontFamily: "'Outfit',sans-serif", margin: "0 0 16px", letterSpacing: "-0.02em" }}>Join Our WhatsApp Community</h2>
          <p style={{ color: "#8A8F98", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7 }}>
            Stay ahead of the competition. We post <span style={{ color: "#25D366", fontWeight: 700 }}>latest job openings</span> daily from top companies across the tech industry. Don&apos;t miss out on your next opportunity.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 48 }}>
          {COMMUNITY_PERKS.map((p, i) => (
            <CommunityPerkCard key={p.title} perk={p} index={i} />
          ))}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(37,211,102,0.1), rgba(37,211,102,0.04))",
            border: "2px solid rgba(37,211,102,0.3)",
            borderRadius: 24,
            padding: "clamp(36px,5vw,56px)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.4,
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(37,211,102,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(37,211,102,0.06) 0%, transparent 50%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                margin: "0 auto 24px",
                background: "rgba(37,211,102,0.15)",
                border: "2px solid rgba(37,211,102,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "pulse 2s infinite",
              }}
            >
              <WA size={40} fill="#25D366" />
            </div>

            <h3 style={{ color: "#fff", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 900, fontFamily: "'Outfit',sans-serif", margin: "0 0 12px" }}>Never Miss a Job Opportunity Again</h3>
            <p style={{ color: "#8A8F98", fontSize: "1rem", maxWidth: 500, margin: "0 auto 8px", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
              Our community members get access to job postings before they hit public job boards.
            </p>
            <p style={{ color: "#25D366", fontSize: ".9rem", fontWeight: 600, fontFamily: "'Outfit',sans-serif", margin: "0 0 32px" }}>✅ 100% Free &nbsp;&nbsp; ✅ No Spam &nbsp;&nbsp; ✅ Daily Updates</p>

            <a
              href={WHATSAPP_COMMUNITY}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "#25D366",
                color: "#fff",
                padding: "18px 48px",
                borderRadius: 60,
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "1.15rem",
                fontFamily: "'Outfit',sans-serif",
                boxShadow: "0 0 50px rgba(37,211,102,0.4), 0 0 100px rgba(37,211,102,0.15)",
                transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
                letterSpacing: ".01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 0 70px rgba(37,211,102,0.5), 0 0 120px rgba(37,211,102,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 0 50px rgba(37,211,102,0.4), 0 0 100px rgba(37,211,102,0.15)";
              }}
            >
              <WA size={24} fill="#fff" />
              Join WhatsApp Community →
            </a>

            <p style={{ color: "#4B5563", fontSize: ".8rem", marginTop: 16, fontFamily: "'DM Sans',sans-serif" }}>👥 Join 2000+ professionals already in the community</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════ */

function ContactSection() {
  const [ref,iv] = useInView(.1);
  return (
    <section id="contact" style={{padding:"100px 24px"}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <div ref={ref} style={{background:"linear-gradient(135deg,rgba(0,229,160,.05),rgba(123,97,255,.05))",border:"1px solid rgba(255,255,255,.06)",borderRadius:28,padding:"clamp(32px,5vw,56px)",textAlign:"center",opacity:iv?1:0,transform:iv?"translateY(0)":"translateY(40px)",transition:"all .8s cubic-bezier(.22,1,.36,1)"}}>
          <span style={{color:"#00E5A0",fontSize:".85rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>GET IN TOUCH</span>
          <h2 style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:900,color:"#fff",fontFamily:"'Outfit',sans-serif",margin:"12px 0 16px",letterSpacing:"-0.02em"}}>Ready to Level Up?</h2>
          <p style={{color:"#6B7280",fontSize:"1rem",marginBottom:40,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>Reach out to us directly — we respond within 30 minutes.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20,marginBottom:32}}>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{background:"rgba(37,211,102,.08)",border:"1px solid rgba(37,211,102,.2)",borderRadius:18,padding:"28px 24px",textDecoration:"none",transition:"all .3s",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(37,211,102,.14)";e.currentTarget.style.transform="translateY(-4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(37,211,102,.08)";e.currentTarget.style.transform="translateY(0)";}}
            >
              <WA size={36} fill="#25D366"/>
              <span style={{color:"#25D366",fontWeight:800,fontSize:"1.1rem",fontFamily:"'Outfit',sans-serif"}}>WhatsApp</span>
              <span style={{color:"#8A8F98",fontSize:".9rem",fontFamily:"'DM Sans',sans-serif"}}>+91 96492 24523</span>
              <span style={{background:"#25D366",color:"#fff",padding:"8px 24px",borderRadius:50,fontWeight:700,fontSize:".85rem",fontFamily:"'Outfit',sans-serif",marginTop:4}}>Chat Now →</span>
            </a>
            <a href={`mailto:${EMAIL}`} style={{background:"rgba(123,97,255,.08)",border:"1px solid rgba(123,97,255,.2)",borderRadius:18,padding:"28px 24px",textDecoration:"none",transition:"all .3s",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(123,97,255,.14)";e.currentTarget.style.transform="translateY(-4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(123,97,255,.08)";e.currentTarget.style.transform="translateY(0)";}}
            >
              <div style={{fontSize:"2.2rem"}}>✉️</div>
              <span style={{color:"#7B61FF",fontWeight:800,fontSize:"1.1rem",fontFamily:"'Outfit',sans-serif"}}>Email</span>
              <span style={{color:"#8A8F98",fontSize:".82rem",fontFamily:"'DM Sans',sans-serif",wordBreak:"break-all",textAlign:"center"}}>{EMAIL}</span>
              <span style={{background:"#7B61FF",color:"#fff",padding:"8px 24px",borderRadius:50,fontWeight:700,fontSize:".85rem",fontFamily:"'Outfit',sans-serif",marginTop:4}}>Send Email →</span>
            </a>
          </div>
          <p style={{color:"#4B5563",fontSize:".85rem",fontFamily:"'DM Sans',sans-serif"}}>⚡ Average response time: under 30 minutes</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */

function Footer() {
  const scrollTo = (e,href) => { e.preventDefault(); const el=document.querySelector(href); if(el){const y=el.getBoundingClientRect().top+window.scrollY-80; window.scrollTo({top:y,behavior:"smooth"});} };
  return (
    <footer style={{borderTop:"1px solid rgba(255,255,255,.06)",padding:"48px 24px 32px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",flexWrap:"wrap",gap:40,justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{minWidth:200}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#00E5A0,#7B61FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".95rem",fontWeight:900,color:"#08090E",fontFamily:"'Outfit',sans-serif"}}>HQ</div>
            <span style={{fontSize:"1.1rem",fontWeight:700,color:"#fff",fontFamily:"'Outfit',sans-serif"}}>HireQuest</span>
          </div>
          <p style={{color:"#6B7280",fontSize:".85rem",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,maxWidth:280}}>Your trusted partner for career acceleration. From interviews to on-the-job success.</p>
        </div>
        <div style={{display:"flex",gap:48,flexWrap:"wrap"}}>
          <div>
            <h4 style={{color:"#fff",fontSize:".85rem",fontWeight:700,fontFamily:"'Outfit',sans-serif",marginBottom:16,letterSpacing:".05em",textTransform:"uppercase"}}>Quick Links</h4>
            {[{l:"Services",h:"#services"},{l:"Our Team",h:"#team"},{l:"Setup Guide",h:"#setup-guide"},{l:"Pricing",h:"#pricing"},{l:"Testimonials",h:"#testimonials"},{l:"Job Updates",h:"#community"}].map(x=>(
              <a key={x.l} href={x.h} onClick={e=>scrollTo(e,x.h)} style={{display:"block",color:"#6B7280",textDecoration:"none",fontSize:".9rem",fontFamily:"'DM Sans',sans-serif",padding:"4px 0",transition:"color .2s",cursor:"pointer"}}
                onMouseEnter={e=>e.target.style.color="#B0B5BE"} onMouseLeave={e=>e.target.style.color="#6B7280"}>{x.l}</a>
            ))}
          </div>
          <div>
            <h4 style={{color:"#fff",fontSize:".85rem",fontWeight:700,fontFamily:"'Outfit',sans-serif",marginBottom:16,letterSpacing:".05em",textTransform:"uppercase"}}>Contact</h4>
            <a href={`mailto:${EMAIL}`} style={{display:"block",color:"#6B7280",textDecoration:"none",fontSize:".85rem",fontFamily:"'DM Sans',sans-serif",padding:"4px 0"}}>{EMAIL}</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{display:"block",color:"#6B7280",textDecoration:"none",fontSize:".9rem",fontFamily:"'DM Sans',sans-serif",padding:"4px 0"}}>+91 96492 24523</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{display:"block",color:"#25D366",textDecoration:"none",fontSize:".9rem",fontFamily:"'DM Sans',sans-serif",padding:"4px 0",fontWeight:600}}>💬 WhatsApp Chat</a>
            <a href={WHATSAPP_COMMUNITY} target="_blank" rel="noopener noreferrer" style={{display:"block",color:"#25D366",textDecoration:"none",fontSize:".9rem",fontFamily:"'DM Sans',sans-serif",padding:"4px 0",fontWeight:600}}>🔥 Job Updates Community</a>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"40px auto 0",paddingTop:24,borderTop:"1px solid rgba(255,255,255,.04)",textAlign:"center",color:"#4B5563",fontSize:".8rem",fontFamily:"'DM Sans',sans-serif"}}>© 2026 HireQuest. All rights reserved.</div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */

export default function App() {
  return (
    <div style={{background:"#08090E",minHeight:"100vh",color:"#fff",overflow:"hidden"}}>
      <Navbar/>
      <HeroSection/>
      <CommunityBanner/>
      <ServicesSection/>
      <TeamSection/>
      <SetupGuideSection/>
      <ProcessSection/>
      <PricingSection/>
      <TestimonialsSection/>
      <CommunitySection/>
      <ContactSection/>
      <Footer/>
      <WhatsAppFloat/>
    </div>
  );
}
