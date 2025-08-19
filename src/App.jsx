import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { HashLink } from "react-router-hash-link";
import { jsPDF } from "jspdf";
import {
  Mail,
  Linkedin,
  Github,
  Youtube,
  MapPin,
  ExternalLink,
  ArrowRight,
  Phone,
  Briefcase,
  Code2,
  GraduationCap,
  Wrench,
  Cpu,
  Shield,
  ChevronRight,
  Moon,
  Sun,
  NotebookPen,
} from "lucide-react";

/*  App.jsx (refactored)
    --------------------
    • All mutable content (profile, experience, skills, education, settings) moved to /public/data/*.json
    • Portfolio list and items remain in /public/content/portfolio (index.json and *.md)
    • Uses Vite BASE_URL to fetch from the correct path on GitHub Pages
*/

// ----------helpers ----------
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "/");
const withBase = (relPath) => BASE + relPath.replace(/^\/+/, "");

async function fetchJSON(relPath, fallback) {
  try {
    const res = await fetch(withBase(relPath));
    if (!res.ok) throw new Error("http error");
    return await res.json();
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error("Failed to load " + relPath);
  }
}

async function fetchText(relPath, fallback) {
  try {
    const res = await fetch(withBase(relPath));
    if (!res.ok) throw new Error("http error");
    return await res.text();
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error("Failed to load " + relPath);
  }
}

const isAbs = (u) =>
  /^([a-z]+:)?\/\//i.test(u) || u?.startsWith("data:") || u?.startsWith("#");

const addBase = (u) =>
  isAbs(u) ? u : withBase(String(u || "").replace(/^\/+/, ""));

const ImgMD = (props) => (
  <img
    {...props}
    src={addBase(props.src)}
    loading="lazy"
    className="rounded-xl"
  />
);

const VideoMD = (props) => (
  <video
    {...props}
    src={props.src ? addBase(props.src) : undefined}
    controls
    className="w-full rounded-2xl border dark:border-zinc-800"
  />
);

const SourceMD = (props) => <source {...props} src={addBase(props.src)} />;

const IframeMD = ({ node, ...props }) => (
  <div
    className="relative w-full rounded-2xl overflow-hidden border dark:border-zinc-800"
    style={{ paddingTop: "56.25%" }}
  >
    <iframe
      {...props}
      className="absolute inset-0 w-full h-full"
      loading="lazy"
      allowFullScreen
    />
  </div>
);

function splitPara(doc, text, maxW) {
  const paragraphs = String(text || "").split(/\n{2,}/);
  return paragraphs.flatMap((p, i) => {
    const lines = doc.splitTextToSize(p.replace(/\n/g, " "), maxW);
    return i < paragraphs.length - 1 ? [...lines, ""] : lines;
  });
}

async function generateResumePdf(site) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 48;
  const maxW = pageW - M * 2;
  let y = M;

  const rule = (space = 10) => {
    y += space;
    doc.setDrawColor(200);
    doc.line(M, y, pageW - M, y);
    y += 8 * 2;
  };
  const ensure = (h = 14) => {
    if (y + h > pageH - M) {
      doc.addPage();
      y = M;
    }
  };
  const h1 = (t) => {
    y += 12;
    ensure(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(t, M, y);
    y += 24;
  };
  const h2 = (t) => {
    y += 8;
    ensure(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(t, M, y);
    y += 16;
  };
  const small = (t) => {
    y += 6;
    ensure(12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(t, M, y);
    y += 12;
  };
  const body = (t) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    splitPara(doc, t, maxW).forEach((line) => {
      ensure(14);
      doc.text(line, M, y);
      y += 14;
    });
  };
  
  const softWrap = (s) =>
    String(s).replace(/\S{30,}/g, (m) => m.replace(/(.{12})/g, "$1\u200B"));

  function bullets(arr) {
    const indent = 14; // space after bullet
    const lineH = 14;
    const maxLineW = maxW - indent; // use page-wide maxW from above

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    (arr || []).forEach((t) => {
      const lines = doc.splitTextToSize(softWrap(t), maxLineW);

      // first line: draw bullet glyph, then text
      ensure(lineH);
      doc.text("•", M, y);
      doc.text(lines[0], M + indent, y);
      y += lineH;

      // continuation lines: indent without bullet
      for (let i = 1; i < lines.length; i++) {
        ensure(lineH);
        doc.text(lines[i], M + indent, y);
        y += lineH;
      }
    });
  }

  // Header
  const p = site.profile || {};
  h1(`${p.name || ""}`);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  if (p.title) {
    doc.text(p.title, M, y);
    y += 16;
  }

  // Contact row
  const contactBits = [p.location, p.email, p.phone].filter(Boolean);
  if (contactBits.length) {
    small(contactBits.join("  •  "));
  }

  rule();

  // Summary
  h2("Summary");
  body(p.summary || "");

  // Highlights
  if (Array.isArray(p.highlights) && p.highlights.length) {
    h2("Highlights");
    const line = p.highlights
      .map((h) => `${h.label}${h.value ? `: ${h.value}` : ""}`)
      .join("  •  ");
    small(line);
  }

  // Skills
  const skills = site.skills || [];
  if (skills.length) {
    rule();
    h2("Skills");
    skills.forEach((g) => small(`${g.group}: ${(g.items || []).join(", ")}`));
  }

  // Experience
  const exp = site.experience || [];
  if (exp.length) {
    rule();
    h2("Experience");
    exp.forEach((e) => {
      y += 14;
      ensure(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${e.role || ""} — ${e.company || ""}`, M, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const when = `${e.start_text ?? e.start ?? ""} — ${
        e.end_text ?? (e.present ? "Present" : e.end ?? "")
      }`;
      const dur = e?.duration?.text ? `  •  ${e.duration.text}` : "";
      const loc = e.location ? `  •  ${e.location}` : "";
      doc.text(`${when}${dur}${loc}`, M, y);
      y += 12;

      // merge tech + mgr bullets (resume version)
      const lines = (e.bullets || []).map((b) => b.text).slice(0, 6);
      bullets(lines);
      y += 2;
    });
  }

  // Education
  const edu = site.education || [];
  if (edu.length) {
    rule();
    h2("Education");
    edu.forEach((ed) => {
      y += 14;
      ensure(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(ed.name || "", M, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      if (ed.period) {
        doc.text(ed.period, M, y);
        y += 12;
      }
      if (ed.summary) {
        body(ed.summary);
      }
      if (ed.finalWorkTitle) {
        small(`Final work: ${ed.finalWorkTitle}`);
      }
      y += 4;
    });
  }

  // Footer page numbers
  const count = doc.getNumberOfPages();
  for (let i = 1; i <= count; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`${i}/${count}`, pageW - M, pageH - 16, { align: "right" });
  }

  doc.save(`${(p.name || "resume").replace(/\s+/g, "_")}_Resume.pdf`);
}

// ---------- Fallbacks (kept minimal to avoid blank UI if JSON missing) ----------
const FALLBACK = {
  profile: {
    name: "Your Name",
    title: "Your Role",
    location: "City, Country",
    email: "email@example.com",
    phone: "",
    links: { linkedin: "#", github: "#", youtube: "#" },
    summary: "Short professional summary.",
    highlights: [{ label: "Skill A", value: "Advanced" }],
    rolesOpenTo: ["Role 1", "Role 2"],
  },
  experience: [],
  skills: [],
  education: [],
  settings: {
    hrBlurb: "Short HR-friendly blurb can go here.",
  },
  portfolioManifest: [],
};

// ---------- Frontmatter parsing (robust) ----------
function parseFrontmatterBlock(fullText) {
  const match = fullText.match(
    /^---\s*[\r\n]+([\s\S]*?)^---\s*[\r\n]+([\s\S]*)$/m
  );
  if (!match) return { meta: null, body: fullText };
  return { meta: parseFrontmatter(match[1]), body: match[2] };
}

function parseFrontmatter(src) {
  const lines = src.split(/\r?\n/);
  const obj = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (m) {
      const key = m[1].trim();
      let val = m[2].trim();

      // Nested map (e.g., "links:")
      if (val === "") {
        const nested = {};
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])) {
          const m2 = lines[i].match(/^\s+([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
          if (m2) nested[m2[1]] = m2[2].trim();
          i++;
        }
        obj[key] = nested;
        continue;
      }

      if (val.startsWith("[") && val.endsWith("]")) {
        try {
          obj[key] = JSON.parse(val);
        } catch {
          obj[key] = val;
        }
      } else {
        obj[key] = val;
      }
    }
    i++;
  }
  return obj;
}

// ---------- UI atoms ----------
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
      <div className="rounded-2xl border p-4 dark:border-zinc-800">
        {children}
      </div>
    </section>
  );
}

// ---------- Theme toggle ----------
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

// ---------- Audience context ----------
const AudienceContext = React.createContext(null);
function useAudience() {
  return React.useContext(AudienceContext);
}

function AudienceToggle() {
  const [audience, setAudience] = useAudience();
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border p-1 text-xs dark:border-zinc-800">
      {[
        { key: "all", label: "All" },
        { key: "tech", label: "Technical" },
        { key: "mgr", label: "Manager/HR" },
      ].map((opt) => (
        <button
          key={opt.key}
          onClick={() => setAudience(opt.key)}
          className={`px-2 py-1 rounded-lg ${
            audience === opt.key
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : ""
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Data loader hook ----------
function useSiteData() {
  const [data, setData] = useState({
    profile: FALLBACK.profile,
    experience: FALLBACK.experience,
    skills: FALLBACK.skills,
    education: FALLBACK.education,
    settings: FALLBACK.settings,
    manifest: FALLBACK.portfolioManifest,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      const [profile, experience, skills, education, settings, manifest] =
        await Promise.all([
          fetchJSON("data/profile.json", FALLBACK.profile),
          fetchJSON("data/experience.json", FALLBACK.experience),
          fetchJSON("data/skills.json", FALLBACK.skills),
          fetchJSON("data/education.json", FALLBACK.education),
          fetchJSON("data/settings.json", FALLBACK.settings),
          fetchJSON("content/portfolio/index.json", FALLBACK.portfolioManifest),
        ]);
      setData({
        profile,
        experience,
        skills,
        education,
        settings,
        manifest,
        loading: false,
      });
    })();
  }, []);

  return data;
}

// ---------- Nav & layout ----------
function Nav({ profile }) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur border-b bg-white/70 dark:bg-zinc-950/60 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          {(profile?.name || "HT").split(" ")[0].slice(0, 1)}
          {(profile?.name || "").split(" ").slice(-1)[0]?.slice(0, 1)}
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <HashLink smooth to="/#about">
            About
          </HashLink>
          <HashLink smooth to="/#portfolio">
            Portfolio
          </HashLink>
          <HashLink smooth to="/#experience">
            Experience
          </HashLink>
          <HashLink smooth to="/#skills">
            Skills
          </HashLink>
          <HashLink smooth to="/#contact">
            Contact
          </HashLink>
          <button
            aria-label="Toggle theme"
            className="p-2 rounded-xl border dark:border-zinc-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <Shield /> : <ChevronRight />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t dark:border-zinc-900 px-4 pb-3 space-y-2">
          {[
            ["#about", "About"],
            ["#portfolio", "Portfolio"],
            ["#experience", "Experience"],
            ["#skills", "Skills"],
            ["#contact", "Contact"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="block py-1">
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero({ profile }) {
  return (
    <header className="pt-10 pb-6">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {profile.name}
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300">
            {profile.title}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.highlights?.map((h, i) => (
              <Chip key={i}>
                {h.label}: {h.value}
              </Chip>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <HashLink
              className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
              smooth
              to="/#portfolio"
            >
              View Portfolio <ArrowRight className="h-4 w-4" />
            </HashLink>
            <HashLink
              className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
              smooth
              to="/role/current-role"
            >
              What I Do <Briefcase className="h-4 w-4" />
            </HashLink>
            <HashLink
              className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
              smooth
              to="/#contact"
            >
              Contact <Mail className="h-4 w-4" />
            </HashLink>
          </div>
        </div>
        <div className="rounded-2xl border p-4 dark:border-zinc-800">
          <ul className="text-sm space-y-2">
            {!!profile.location && (
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {profile.location}
              </li>
            )}
            {!!profile.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />{" "}
                <a href={`mailto:${profile.email}`} className="underline">
                  {profile.email}
                </a>
              </li>
            )}
            {!!profile.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />{" "}
                <a href={`tel:${profile.phone}`} className="underline">
                  {profile.phone}
                </a>
              </li>
            )}
            {profile.links?.linkedin && (
              <li className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />{" "}
                <a
                  className="underline"
                  href={profile.links.linkedin}
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
            )}
            {profile.links?.github && (
              <li className="flex items-center gap-2">
                <Github className="h-4 w-4" />{" "}
                <a
                  className="underline"
                  href={profile.links.github}
                  target="_blank"
                >
                  GitHub
                </a>
              </li>
            )}
            {profile.links?.youtube && (
              <li className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />{" "}
                <a
                  className="underline"
                  href={profile.links.youtube}
                  target="_blank"
                >
                  YouTube
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

function About({ profile }) {
  return (
    <Section id="about" title="About" icon={Code2}>
      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
        {profile.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {profile.rolesOpenTo?.map((r, i) => (
          <Chip key={i}>{r}</Chip>
        ))}
      </div>
    </Section>
  );
}

function Experience({ items }) {
  const [audience] = useAudience();
  return (
    <Section
      id="experience"
      title="Experience"
      icon={Briefcase}
      right={<AudienceToggle />}
    >
      <div className="space-y-6">
        {items.map((e, idx) => (
          <div key={idx} className="grid md:grid-cols-[1fr,2fr] gap-3">
            <div>
              <div className="font-medium">{e.role}</div>
              <div className="text-sm text-zinc-500">
                {e.company}
                {e.location ? ` • ${e.location}` : ""}
              </div>
              <div className="text-xs text-zinc-500 flex items-center gap-2">
                <span>
                  {(e.start_text ?? e.start) || ""}
                  {" — "}
                  {(e.end_text ?? (e.present ? "Present" : e.end)) || ""}
                </span>
                {e.duration?.text && <Chip>{e.duration.text}</Chip>}
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-zinc-700 dark:text-zinc-300">
              {(e.bullets || [])
                .filter(
                  (b) =>
                    audience === "all" ||
                    (audience === "tech"
                      ? b.tags?.includes("tech")
                      : b.tags?.includes("mgr"))
                )
                .map((b, i) => (
                  <li key={i}>{b.text}</li>
                ))}
            </ul>
            {e.detailSlug && (
              <div className="mt-2">
                <Link
                  to={`/role/${e.detailSlug}`}
                  className="text-sm underline"
                >
                  Read deep dive
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function RoleDeepDives() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      const data = await fetchJSON("content/roles/index.json", []);
      setItems(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Section id="roles" title="Role Deep Dives" icon={Briefcase}>
      {loading ? (
        <div className="text-sm text-zinc-500">Loading…</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <button
              key={r.slug}
              onClick={() => navigate(`/role/${r.slug}`)}
              className="text-left rounded-2xl border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800 flex"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.title}</div>
                <div className="mt-1 text-sm text-zinc-500 line-clamp-2">
                  {r.summary}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(r.tags || []).map((t, i) => (
                    <Chip key={i}>{t}</Chip>
                  ))}
                </div>
              </div>
              {r.cover && (
                <img
                  src={withBase(r.cover)}
                  alt=""
                  loading="lazy"
                  className="ml-3 hidden sm:block h-16 w-28 object-cover rounded-lg shrink-0"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}

function Skills({ groups }) {
  return (
    <Section id="skills" title="Skills" icon={Wrench}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((grp, i) => (
          <div key={i} className="rounded-2xl border p-4 dark:border-zinc-800">
            <div className="font-medium mb-2">{grp.group}</div>
            <div className="flex flex-wrap gap-2">
              {(grp.items || []).map((it, j) => (
                <Chip key={j}>{it}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Education({ items }) {
  return (
    <Section title="Education" icon={GraduationCap}>
      <div className="space-y-4">
        {items.map((e, i) => (
          <div key={i} className="rounded-2xl border p-4 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="font-medium">{e.name}</span>
              <span className="text-sm text-zinc-500">{e.period}</span>
            </div>
            {e.summary && (
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                {e.summary}
              </p>
            )}
            {e.finalWorkTitle && e.finalWorkTitle.trim() && (
              <div className="mt-2 text-sm">
                <strong>Final work:</strong> {e.finalWorkTitle}
              </div>
            )}
            {Array.isArray(e.links) && e.links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {e.links.map((l, idx) => (
                  <a
                    key={idx}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm underline"
                  >
                    {l.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Portfolio({ manifest }) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // manifest already loaded by useSiteData; use it
      setItems(manifest);
      setLoading(false);
    })();
  }, [manifest]);

  return (
    <Section id="portfolio" title="Portfolio" icon={Cpu}>
      {loading && <div className="text-sm text-zinc-500">Loading…</div>}
      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <button
              key={p.slug}
              onClick={() => navigate(`/portfolio/${p.slug}`)}
              className="text-left rounded-2xl border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800 flex"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.title}</div>
                <div className="mt-1 text-sm text-zinc-500 line-clamp-2">
                  {p.summary}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(p.tags || []).map((t, i) => (
                    <Chip key={i}>{t}</Chip>
                  ))}
                  {p.year && <Chip>{p.year}</Chip>}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300">
                  Open <ExternalLink className="h-4 w-4" />
                </div>
              </div>

              {p.cover && (
                <img
                  src={withBase(p.cover)}
                  alt=""
                  loading="lazy"
                  className="ml-3 hidden sm:block h-16 w-28 object-cover rounded-lg shrink-0"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}

function Contact({ profile, settings }) {
  return (
    <Section id="contact" title="Contact" icon={Mail}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Prefer email for opportunities:
          </div>
          <div className="mt-1 text-lg">
            <a className="underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
          <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Or reach me on:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.links?.linkedin && (
              <a
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {profile.links?.youtube && (
              <a
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                href={profile.links.youtube}
                target="_blank"
                rel="noreferrer"
              >
                <Youtube className="h-4 w-4" /> YouTube
              </a>
            )}
            {profile.links?.github && (
              <a
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
          </div>
        </div>
        <div className="rounded-2xl border p-4 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">Quick blurb</div>
          <p className="mt-1 text-zinc-700 dark:text-zinc-300">
            {settings.blurb}
          </p>
        </div>
      </div>
    </Section>
  );
}

function Footer({ site }) {
  return (
    <footer className="mt-10 py-8 text-center text-xs text-zinc-500">
      © {new Date().getFullYear()} — Built with React & Tailwind.{" "}
      <button onClick={() => generateResumePdf(site)} className="underline">
        Download PDF résumé
      </button>
    </footer>
  );
}

// ---------- Pages ----------

function PortfolioPage() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manifestItem, setManifestItem] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await fetchText(`content/portfolio/${slug}.md`);
        const { meta, body } = parseFrontmatterBlock(raw);
        setMeta(meta);
        setContent(body);

        const man = await fetchJSON("content/portfolio/index.json", []);
        setManifestItem(man.find((x) => x.slug === slug) || null);
      } catch {
        setMeta(null);
        setContent("# Not Found\nThis project will be added soon.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const coverSrc = (meta && meta.cover) || (manifestItem && manifestItem.cover);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-zinc-500 hover:underline">
        ← Back
      </Link>
      {loading ? (
        <div className="mt-6 text-sm text-zinc-500">Loading…</div>
      ) : (
        <article className="mt-2 prose prose-zinc dark:prose-invert max-w-none">
          {coverSrc && (
            <img
              src={withBase(String(coverSrc).replace(/^\/+/, ""))}
              alt=""
              className="w-full rounded-2xl border dark:border-zinc-800 mb-6 object-cover"
            />
          )}
          {meta && (
            <header>
              <h1 className="mb-2">{meta.title || slug}</h1>
              <div className="not-prose flex flex-wrap gap-2 mb-4">
                {Array.isArray(meta.tech) &&
                  meta.tech.map((t, i) => <Chip key={i}>{t}</Chip>)}
                {meta.year && <Chip>{meta.year}</Chip>}
              </div>
              <div className="not-prose flex flex-wrap gap-2 mb-6">
                {meta.links?.video && (
                  <a
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                    href={meta.links.video}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Youtube className="h-4 w-4" /> Watch video
                  </a>
                )}
                {meta.links?.github && (
                  <a
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                    href={meta.links.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-4 w-4" /> Source
                  </a>
                )}
                {meta.links?.page && (
                  <a
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                    href={meta.links.page}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" /> Live page
                  </a>
                )}
              </div>
            </header>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ImgMD,
              video: VideoMD,
              source: SourceMD,
              iframe: IframeMD,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      )}
    </main>
  );
}

function RolePage() {
  const { slug } = useParams();
  const [content, setContent] = React.useState("");
  const [meta, setMeta] = React.useState(null);
  const [manifestItem, setManifestItem] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const raw = await fetchText(
        `content/roles/${slug}.md`,
        "# Not Found\nThis page will be added soon."
      );
      const { meta, body } = parseFrontmatterBlock(raw);
      setMeta(meta);
      setContent(body);
      const man = await fetchJSON("content/roles/index.json", []);
      setManifestItem(man.find((x) => x.slug === slug) || null);
      setLoading(false);
    })();
  }, [slug]);

  const coverSrc = (meta && meta.cover) || (manifestItem && manifestItem.cover);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-zinc-500 hover:underline">
        ← Back
      </Link>
      {loading ? (
        <div className="mt-6 text-sm text-zinc-500">Loading…</div>
      ) : (
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          {coverSrc && (
            <img
              src={withBase(String(coverSrc).replace(/^\/+/, ""))}
              alt=""
              className="w-full rounded-2xl border dark:border-zinc-800 mb-6 object-cover"
            />
          )}
          {meta && (
            <header>
              <h1 className="mb-2">{meta.title || slug}</h1>
              <div className="not-prose flex flex-wrap gap-2 mb-4">
                {Array.isArray(meta.tech) &&
                  meta.tech.map((t, i) => <Chip key={i}>{t}</Chip>)}
                {meta.year && <Chip>{meta.year}</Chip>}
              </div>
              <div className="not-prose flex flex-wrap gap-2 mb-6">
                {meta.links?.video && (
                  <a
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                    href={meta.links.video}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Youtube className="h-4 w-4" /> Watch video
                  </a>
                )}
                {meta.links?.github && (
                  <a
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                    href={meta.links.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-4 w-4" /> Source
                  </a>
                )}
                {meta.links?.page && (
                  <a
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 dark:border-zinc-800"
                    href={meta.links.page}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" /> Website
                  </a>
                )}
              </div>
            </header>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ImgMD,
              video: VideoMD,
              source: SourceMD,
              iframe: IframeMD,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      )}
    </main>
  );
}

// ---------- App ----------
export default function App() {
  const [audience, setAudience] = useState("all");
  const site = useSiteData();

  return (
    <AudienceContext.Provider value={[audience, setAudience]}>
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Router>
          <Nav profile={site.profile} />
          <Routes>
            <Route path="/" element={<Home site={site} />} />
            <Route path="/portfolio/:slug" element={<PortfolioPage />} />
            <Route path="/role/:slug" element={<RolePage />} />
          </Routes>
        </Router>
      </div>
    </AudienceContext.Provider>
  );
}

function Home({ site }) {
  return (
    <main>
      <Hero profile={site.profile} />
      <div className="mx-auto max-w-6xl px-4 space-y-8 pb-12">
        <About profile={site.profile} />
        <Portfolio manifest={site.manifest} />
        <Experience items={site.experience} />
        <RoleDeepDives />
        <Skills groups={site.skills} />
        <Education items={site.education} />
        <Contact profile={site.profile} settings={site.settings} />
        <Footer site={site} />
      </div>
    </main>
  );
}
