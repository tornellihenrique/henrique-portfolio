import React, { useEffect, useMemo, useState } from "react";
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Mail, Linkedin, Github, Youtube, MapPin, ExternalLink, ArrowRight, Phone, Briefcase, Code2, GraduationCap, Wrench, Cpu, Shield, ChevronRight, Moon, Sun } from "lucide-react";

/*
  Henrique — Resume + Portfolio SPA
  ---------------------------------
  • Frontend-only, GitHub Pages-ready (HashRouter avoids rewrite rules)
  • Content-first: portfolio pages live as Markdown under /content/portfolio/*.md
  • A manifest /content/portfolio/index.json declares the list and basic metadata
  • Adding/removing items = edit index.json + drop a new .md file

  Folder structure (recommended):
  /public
    /content/portfolio/index.json
    /content/portfolio/ghostrush.md
    /content/portfolio/minecraft-royale.md
    /content/portfolio/any-new-project.md
  /src
    (this file)
*/

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  return { theme, setTheme };
}

const PROFILE = {
  name: "Henrique Tornelli Duarte",
  title: "C++ Gameplay Programmer — Unreal Engine",
  location: "Uberlândia, Brazil",
  email: "tornelli.henrique@gmail.com",
  phone: "+55 (34) 99639-4089",
  links: {
    linkedin: "https://www.linkedin.com/in/henrique-tornelli",
    github: "https://github.com/",
    youtube: "https://youtube.com/"
  },
  summary:
    "Gameplay programmer focused on FPS, networking, prediction, and animation systems. Prior background in backend/microservices.",
  highlights: [
    { label: "Unreal Engine 5", value: "Expert" },
    { label: "C++", value: "Advanced" },
    { label: "GAS", value: "Advanced" },
    { label: "Networking", value: "Experienced" },
  ],
  rolesOpenTo: ["Senior Gameplay Programmer", "Gameplay Systems", "Networked Gameplay", "Technical Lead (Gameplay)"]
};

const EXPERIENCE = [
  {
    company: "Nevith Games",
    role: "Gameplay Programmer (C++)",
    location: "Remote — South Korea",
    start: "Aug 2023",
    end: "Present",
    bullets: [
      { text: "Implemented FPS gameplay loops (weapons, abilities, hit reactions)", tags: ["tech"] },
      { text: "Worked across prediction/replication, GAS, and animation systems", tags: ["tech"] },
      { text: "Partnered with design to tune feel and pacing", tags: ["mgr"] }
    ]
  },
  {
    company: "cVortex",
    role: "Senior Software Engineer",
    location: "Brazil",
    start: "Oct 2022",
    end: "Jul 2023",
    bullets: [
      { text: "Microservices with Spring, Kafka, MongoDB; telemetry with Prometheus/Grafana", tags: ["tech"] },
      { text: "Improved reliability and incident response with tracing (Jaeger)", tags: ["mgr","tech"] }
    ]
  },
  {
    company: "Callink",
    role: "Software Architect & Tech Lead → Full-Stack Developer",
    location: "Brazil",
    start: "Jan 2021",
    end: "Oct 2022",
    bullets: [
      { text: "Led product roadmap; split work, reviewed code, mentored devs", tags: ["mgr"] },
      { text: "Spring Boot, Elasticsearch, PostgreSQL, GCP; CI/CD with Jenkins", tags: ["tech"] }
    ]
  }
];

const SKILLS = [
  {
    group: "Game/Realtime",
    items: ["Unreal Engine 5", "GAS", "Replication & Prediction", "Animation Systems", "C++", "AI/BT/EQS"]
  },
  {
    group: "Engine/Graphics",
    items: ["OpenGL basics", "ImGui", "Profiling", "Optimization"]
  },
  {
    group: "Backend (past)",
    items: ["Java/Spring", "Kafka", "MongoDB", "Redis", "Docker", "GCP/AWS"]
  }
];

const EDUCATION = [
  { name: "UFU — BSc Information Systems", period: "2018–2021" },
  { name: "IFSP — Technician, Informatics", period: "2015–2017" }
];

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Not found");
  return await res.json();
}

async function fetchText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Not found");
  return await res.text();
}

const FALLBACK_MANIFEST = [
  {
    slug: "ghostrush",
    title: "GhostRush — FPS Horror Prototype",
    summary: "UE5 FPS horror prototype using GAS; weapon loop, procedural aim offset, networked firing.",
    tags: ["Unreal", "C++", "GAS"],
    year: 2025
  },
  {
    slug: "minecraft-royale",
    title: "Minecraft Royale — Clash Royale-like (UE5)",
    summary: "Card abilities, gameplay cues, attributes; full loop with GAS.",
    tags: ["Unreal", "GAS", "Gameplay"],
    year: 2024
  }
];

const FALLBACK_MARKDOWN = {
  ghostrush: `---
title: GhostRush — FPS Horror Prototype
role: Gameplay Programmer
tech: [C++, Unreal Engine 5, GAS]
year: 2025
links:
  video: https://youtu.be/demo
---

# Overview
A compact FPS horror prototype focusing on shooting feel, replication, prediction and reactive animation.

## Responsibilities
- Weapon state machine (idle/ads/fire/reload).
- Procedural aim offset node in C++ for spine chain.
- Deterministic firing with target data + server validation.

## Highlights
- Stable 120+ FPS on target hardware.
- Clean GAS-based extensibility (per-weapon abilities, costs, cues).

## Tech Notes
- LocalPredicted abilities with ServerSetReplicatedTargetData.
- Recoil & sway authored as additive layers.
`,
  "minecraft-royale": `---
title: Minecraft Royale — Clash Royale-like
role: Gameplay Programmer
tech: [Unreal, GAS]
year: 2024
links:
  video: https://youtu.be/demo2
---

# Overview
Prototype inspired by Clash Royale using Minecraft-like assets, all gameplay with GAS.

## Systems
- Card ability activation via gameplay events.
- Costs via SetByCaller and effect specs.
- Cues for VFX/SFX and UI.

## Notes
Focused on architecture and iteration speed; AI not polished.
`
};

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium dark:border-zinc-700 dark:text-zinc-200">
      {children}
    </span>
  );
}

function Section({ title, icon: Icon, right, children, id }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {Icon && <Icon className="h-5 w-5" />} {title}
        </h2>
        {right}
      </div>
      <div className="rounded-2xl border p-4 dark:border-zinc-800">{children}</div>
    </section>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur border-b bg-white/70 dark:bg-zinc-950/60 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">HT</Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#about" className="hover:underline">About</a>
          <a href="#experience" className="hover:underline">Experience</a>
          <a href="#skills" className="hover:underline">Skills</a>
          <a href="#portfolio" className="hover:underline">Portfolio</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <button aria-label="Toggle theme" className="p-2 rounded-xl border dark:border-zinc-800" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>{open ? <Shield/> : <ChevronRight/>}</button>
      </div>
      {open && (
        <div className="md:hidden border-t dark:border-zinc-900 px-4 pb-3 space-y-2">
          {[["#about","About"],["#experience","Experience"],["#skills","Skills"],["#portfolio","Portfolio"],["#contact","Contact"]].map(([href,label]) => (
            <a key={href} href={href} className="block py-1">{label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <header className="pt-10 pb-6">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{PROFILE.name}</h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300">{PROFILE.title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PROFILE.highlights.map((h) => (
              <Chip key={h.label}>{h.label}: {h.value}</Chip>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <a className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800" href="#portfolio">
              View Portfolio <ArrowRight className="h-4 w-4"/>
            </a>
            <a className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800" href="#contact">
              Contact <Mail className="h-4 w-4"/>
            </a>
          </div>
        </div>
        <div className="rounded-2xl border p-4 dark:border-zinc-800">
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {PROFILE.location}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> <a href={`mailto:${PROFILE.email}`} className="underline">{PROFILE.email}</a></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4"/> <a href={`tel:${PROFILE.phone}`} className="underline">{PROFILE.phone}</a></li>
            <li className="flex items-center gap-2"><Linkedin className="h-4 w-4"/> <a className="underline" href={PROFILE.links.linkedin} target="_blank">LinkedIn</a></li>
            <li className="flex items-center gap-2"><Github className="h-4 w-4"/> <a className="underline" href={PROFILE.links.github} target="_blank">GitHub</a></li>
            <li className="flex items-center gap-2"><Youtube className="h-4 w-4"/> <a className="underline" href={PROFILE.links.youtube} target="_blank">YouTube</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
}

function About() {
  return (
    <Section id="about" title="About" icon={Code2}>
      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{PROFILE.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PROFILE.rolesOpenTo.map((r) => <Chip key={r}>{r}</Chip>)}
      </div>
    </Section>
  );
}

function AudienceToggle() {
  const [audience, setAudience] = useAudience();
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border p-1 text-xs dark:border-zinc-800">
      {[
        { key: 'all', label: 'All' },
        { key: 'tech', label: 'Technical' },
        { key: 'mgr', label: 'Manager/HR' }
      ].map(opt => (
        <button key={opt.key} onClick={() => setAudience(opt.key)} className={`px-2 py-1 rounded-lg ${audience===opt.key? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900':''}`}>{opt.label}</button>
      ))}
    </div>
  );
}

const AudienceContext = React.createContext(null);
function useAudience(){
  const ctx = React.useContext(AudienceContext);
  return ctx;
}

function Experience() {
  const [audience] = useAudience();
  return (
    <Section id="experience" title="Experience" icon={Briefcase} right={<AudienceToggle/>}>
      <div className="space-y-6">
        {EXPERIENCE.map((e, idx) => (
          <div key={idx} className="grid md:grid-cols-[1fr,2fr] gap-3">
            <div>
              <div className="font-medium">{e.role}</div>
              <div className="text-sm text-zinc-500">{e.company} • {e.location}</div>
              <div className="text-xs text-zinc-500">{e.start} — {e.end}</div>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-zinc-700 dark:text-zinc-300">
              {e.bullets
                .filter(b => audience === 'all' || (audience === 'tech' ? b.tags?.includes('tech') : b.tags?.includes('mgr')))
                .map((b, i) => <li key={i}>{b.text}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" title="Skills" icon={Wrench}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILLS.map((grp, i) => (
          <div key={i} className="rounded-xl border p-4 dark:border-zinc-800">
            <div className="font-medium mb-2">{grp.group}</div>
            <div className="flex flex-wrap gap-2">
              {grp.items.map((it) => <Chip key={it}>{it}</Chip>)}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Education() {
  return (
    <Section title="Education" icon={GraduationCap}>
      <ul className="space-y-2">
        {EDUCATION.map((e, i) => (
          <li key={i} className="flex items-center justify-between">
            <span>{e.name}</span>
            <span className="text-sm text-zinc-500">{e.period}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Portfolio() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJSON('/content/portfolio/index.json');
        setItems(data);
      } catch {
        setItems(FALLBACK_MANIFEST);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Section id="portfolio" title="Portfolio" icon={Cpu}>
      {loading && <div className="text-sm text-zinc-500">Loading…</div>}
      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <button key={p.slug} onClick={() => navigate(`/portfolio/${p.slug}`)} className="text-left rounded-2xl border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800">
              <div className="font-medium">{p.title}</div>
              <div className="mt-1 text-sm text-zinc-500">{p.summary}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.tags?.map((t) => <Chip key={t}>{t}</Chip>)}
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300">Open <ExternalLink className="h-4 w-4"/></div>
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" title="Contact" icon={Mail}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Prefer email for opportunities:</div>
          <div className="mt-1 text-lg"><a className="underline" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></div>
          <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Or reach me on:</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <a className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800" href={PROFILE.links.linkedin} target="_blank"><Linkedin className="h-4 w-4"/> LinkedIn</a>
            <a className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800" href={PROFILE.links.youtube} target="_blank"><Youtube className="h-4 w-4"/> YouTube</a>
          </div>
        </div>
        <div className="rounded-2xl border p-4 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">Quick blurb for HR/Managers</div>
          <p className="mt-1 text-zinc-700 dark:text-zinc-300">"Gameplay programmer with strong communication and mentoring history from previous tech-lead roles. Comfortable aligning engineering work with product milestones and constraints."</p>
        </div>
      </div>
    </Section>
  );
}

function Footer(){
  return (
    <footer className="mt-10 py-8 text-center text-xs text-zinc-500">
      © {new Date().getFullYear()} Henrique Tornelli Duarte — Built with React & Tailwind. <a className="underline" href="#" onClick={() => window.print()}>Print / Save PDF</a>
    </footer>
  );
}

function PortfolioPage(){
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const text = await fetchText(`/content/portfolio/${slug}.md`);
        const match = text.match(/^---([\s\S]*?)---\n([\s\S]*)$/);
        if (match) {
          const fm = parseFrontmatter(match[1]);
          setMeta(fm);
          setContent(match[2]);
        } else {
          setContent(text);
        }
      } catch {
        setMeta(null);
        setContent(FALLBACK_MARKDOWN[slug] || "# Not Found\nThis project will be added soon.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-zinc-500 hover:underline">← Back</Link>
      {loading ? (
        <div className="mt-6 text-sm text-zinc-500">Loading…</div>
      ) : (
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          {meta && (
            <header>
              <h1 className="mb-2">{meta.title || slug}</h1>
              <div className="not-prose flex flex-wrap gap-2 mb-4">
                {Array.isArray(meta.tech) && meta.tech.map((t) => <Chip key={t}>{t}</Chip>)}
                {meta.year && <Chip>{meta.year}</Chip>}
              </div>
              {meta.links && (
                <div className="not-prose flex gap-3 mb-6">
                  {Object.entries(meta.links).map(([k, v]) => (
                    <a className="inline-flex items-center gap-1 text-sm underline" key={k} href={v} target="_blank">{k} <ExternalLink className="h-4 w-4"/></a>
                  ))}
                </div>
              )}
            </header>
          )}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      )}
    </main>
  );
}

function parseFrontmatter(src){
  const obj = {};
  src.split(/\r?\n/).forEach(line => {
    if (!line.trim()) return;
    if (line.includes(":")) {
      const [k, ...rest] = line.split(":");
      let v = rest.join(":").trim();
      if (v.startsWith("[") && v.endsWith("]")) {
        try { obj[k.trim()] = JSON.parse(v); return; } catch {}
      }
      obj[k.trim()] = v.replace(/^\s+/, "");
    }
  });
  return obj;
}

export default function App(){
  const [audience, setAudience] = useState('all');
  return (
    <AudienceContext.Provider value={[audience, setAudience]}>
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Router>
          <Nav/>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/portfolio/:slug" element={<PortfolioPage/>} />
          </Routes>
        </Router>
      </div>
    </AudienceContext.Provider>
  );
}

function Home(){
  return (
    <main>
      <Hero/>
      <div className="mx-auto max-w-6xl px-4 space-y-8 pb-12">
        <About/>
        <Experience/>
        <Skills/>
        <Education/>
        <Portfolio/>
        <Contact/>
        <Footer/>
      </div>
    </main>
  );
}
