import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import totFigure from "./assets/notes/image.png";
import adasFigure from "./assets/notes/image-1.png";
import algorithmFigure from "./assets/notes/image-2.png";
import utilityFigure from "./assets/notes/image-3.png";
import contextFigure from "./assets/notes/image-4.png";
import codeActFigure from "./assets/notes/image-5.png";
import resultsFigure from "./assets/notes/image-6.png";
import agentsMdFigure from "./assets/notes/image-7.png";
import contextBloatFigure from "./assets/notes/image-8.png";
import loopFigure from "./assets/notes/loop.jpeg";
import performanceFigure from "./assets/paper/performance.jpeg";
import "./index.css";

/* ================================================================
   DATA
   ================================================================ */

type SlideKind = "claim" | "method" | "result" | "critique" | "demo" | "takeaway";

type Stat = { label: string; value: string };

type Slide = {
  id: string;
  marker: string;
  kind: SlideKind;
  eyebrow: string;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  stats?: Stat[];
  quote?: string;
  image?: string;
  imageAlt?: string;
  imageWide?: boolean;
  figureNote?: string;
  note?: string;
  footer?: string;
  splitNote?: { heading: string; text: string }[];
  overviewSlideIds?: string[];
  overviewOnly?: boolean;
  titleJsx?: boolean;
};

const kindLabel: Record<SlideKind, string> = {
  claim: "Claim",
  method: "Method",
  result: "Result",
  critique: "Critique",
  demo: "Demo",
  takeaway: "Takeaway",
};

const kindColors: Record<SlideKind, { bg: string; border: string; text: string }> = {
  claim: { bg: "rgba(102,73,255,0.08)", border: "rgba(102,73,255,0.22)", text: "#6649ff" },
  method: { bg: "rgba(58,34,199,0.08)", border: "rgba(58,34,199,0.22)", text: "#3a22c7" },
  result: { bg: "rgba(73,255,193,0.1)", border: "rgba(73,255,193,0.3)", text: "#1a8a5e" },
  critique: { bg: "rgba(255,73,135,0.08)", border: "rgba(255,73,135,0.22)", text: "#d4305e" },
  demo: { bg: "rgba(255,165,0,0.08)", border: "rgba(255,165,0,0.22)", text: "#b87300" },
  takeaway: { bg: "rgba(102,73,255,0.06)", border: "rgba(102,73,255,0.18)", text: "#6649ff" },
};

const slides: Slide[] = [
  {
    id: "title",
    marker: "01",
    kind: "claim",
    eyebrow: "RTSE Presentation",
    title: 'A Self-Improving Coding Agent',
    titleJsx: true,
    subtitle: "A critical reading — can a coding agent really rewrite itself?",
    body: "Interesting systems paper, but the gains look narrower than the headline. The loop is real; the mythology is overstated.",
    stats: [
      { label: "Published", value: "16.05.2025" },
      { label: "Core claim", value: "Self-editing scaffold" },
      { label: "Thesis", value: "Useful, not magical" },
    ],
    image: loopFigure,
    imageAlt: "SICA meta-agent loop overview",
    figureNote: "Paper Figure 1: self-improvement loop over archived agents.",
    footer: "Robeyns et al., 2025",
  },
  {
    id: "why-now",
    marker: "02",
    kind: "claim",
    eyebrow: "Framing",
    title: "Self-improvement is the next step after prompting tricks.",
    body: "SICA sits in a lineage from direct prompting to reasoning scaffolds to automated search over agent scaffolds.",
    bullets: [
      "Prompting strategy can dominate benchmark outcomes.",
      "Tree of Thoughts and STaR already treat reasoning as a search problem.",
      "SICA extends that idea from prompts to the full agent codebase.",
    ],
    image: totFigure,
    imageAlt: "Prompting and tree-of-thoughts comparison figure",
    figureNote: "References: Tree of Thoughts, STaR, Prompt Report.",
    footer: "ToT 2023, STaR 2022, Prompt Report 2024",
  },
  {
    id: "adas-vs-sica",
    marker: "03",
    kind: "method",
    eyebrow: "Conceptual novelty",
    title: "ADAS improves an agent. SICA tries to improve itself.",
    body: "The claimed novelty is removing the fixed meta-agent: the best archived agent becomes the next improver.",
    bullets: [
      "ADAS: fixed meta-agent, separate target agent.",
      "SICA: no meta/target separation; the archive chooses the next improver.",
      "Hypothesis: if the improver gets better too, progress compounds.",
    ],
    note: "Compounding is hypothesized, not really demonstrated.",
    image: adasFigure,
    imageAlt: "ADAS automated design of agentic systems figure",
    figureNote: "ADAS is the clearest prior art for the improvement loop.",
    footer: "Hu et al., ADAS 2024",
  },
  {
    id: "loop",
    marker: "04",
    kind: "method",
    eyebrow: "Method",
    title: "Archive -> improve -> benchmark -> repeat.",
    body: "No weight updates. The system edits code, prompts, tools, and orchestration, then re-enters evaluation.",
    bullets: [
      "Start from a base coding agent and benchmark suite.",
      "Store every agent iteration and its scores in an archive.",
      "Pick the best archived agent to propose one improvement.",
      "Evaluate and append the new version back to the archive.",
    ],
    image: algorithmFigure,
    imageAlt: "Algorithm for self-referential agent improvement",
    figureNote: "The cleanest statement of the method is the pseudocode.",
    footer: "Paper Algorithm 1",
  },
  {
    id: "utility",
    marker: "05",
    kind: "method",
    eyebrow: "Objective",
    title: "It does not optimize accuracy alone.",
    body: "The utility function rewards benchmark score, low cost, and low wall-clock time. That is sensible engineering, but it changes how to interpret improvement.",
    stats: [
      { label: "Score weight", value: "0.50" },
      { label: "Cost cap", value: "$10" },
      { label: "Time cap", value: "300s" },
    ],
    quote: "Cheap hacks can dominate if the baseline scaffold is bloated.",
    image: utilityFigure,
    imageAlt: "Utility function used to rank agent iterations",
    figureNote: "Utility mixes capability with cost and latency.",
    footer: "Paper Eq. 1-2",
  },
  {
    id: "base-agent",
    marker: "06",
    kind: "method",
    eyebrow: "Starting point",
    title: "The base agent is already a heavy scaffold.",
    body: "SICA does not begin from a minimal coding interface. It inherits many tools, multiple subagents, open-file context, directory views, and an asynchronous overseer.",
    bullets: [
      "Base tools: file open/close, overwrite, bash, calculator, submit, archive analysis.",
      "Subagents: coding, problem solving, reasoning, archive exploration, review roles.",
      "Overseer runs every 30s to steer or cancel runs.",
    ],
    image: contextFigure,
    imageAlt: "LLM context window structure from the paper",
    figureNote: "Open files and directory tree are injected into context.",
    footer: "Paper Figure 2",
  },
  {
    id: "tool-bloat",
    marker: "07",
    kind: "critique",
    eyebrow: "Core critique",
    title: "The scaffold may be hurting the model.",
    body: "Tool-rich, text-heavy harnesses can reduce agent performance. Some of SICA's gains may simply come from undoing self-inflicted friction.",
    bullets: [
      "Too many tools widen the action space.",
      "Open files and directory trees create context bloat.",
      "CodeAct argues that code execution is often a better action space than verbose structured actions.",
    ],
    note: "Before asking whether the agent can self-improve, ask whether we handicapped it first.",
    image: codeActFigure,
    imageAlt: "CodeAct comparison figure",
    figureNote: "CodeAct compares code-as-action against JSON/text action formats.",
    footer: "CodeAct 2024",
  },
  {
    id: "swebench",
    marker: "08",
    kind: "result",
    eyebrow: "Benchmark 1",
    title: "SWE-Bench Verified is the paper's strongest evidence.",
    body: "This is the most software-engineering-like benchmark in the paper: solve a real repository issue by generating a patch that passes tests.",
    stats: [
      { label: "Task", value: "Issue -> patch" },
      { label: "Evaluation", value: "Tests" },
      { label: "Reported run", value: "17% -> 53%" },
    ],
    splitNote: [
      { heading: "Why it matters", text: "It looks closer to actual software work than synthetic toy tasks." },
      { heading: "Caveat", text: "It is still a random subset, so external comparisons are messy." },
    ],
    footer: "SWE-Bench Verified; paper Table 1",
  },
  {
    id: "livecodebench",
    marker: "09",
    kind: "critique",
    eyebrow: "Benchmark 2",
    title: "LiveCodeBench is useful, but the comparison protocol is weak.",
    body: "The paper samples 50 random problems across easy, medium, and hard. That difficulty mix matters a lot, so the result is suggestive rather than cleanly comparable.",
    stats: [
      { label: "Easy", value: "91.2" },
      { label: "Medium", value: "34.3" },
      { label: "Hard", value: "8.2" },
    ],
    bullets: [
      "Random pooling across difficulties breaks direct leaderboard comparison.",
      "So any absolute LiveCodeBench claim needs caution.",
      "The benchmark still helps show the agent can handle competitive-style coding tasks.",
    ],
    footer: "LiveCodeBench note from paper and Anthropic Sonnet benchmark writeup",
  },
  {
    id: "synthetic",
    marker: "10",
    kind: "critique",
    eyebrow: "Synthetic tasks",
    title: "The custom tasks line up with the custom improvements.",
    body: "The system gets synthetic file-editing and symbol-location tasks, then later discovers exactly the sorts of tools that directly help those tasks.",
    bullets: [
      "Synthetic task 1: edit one file to exactly match a target version.",
      "Synthetic task 2: find the exact location of a symbol definition.",
      "That makes later smart-edit and AST-symbol tools very benchmark-aligned.",
    ],
    quote: "Useful engineering, but not necessarily broad autonomy.",
    footer: "Paper benchmark descriptions",
  },
  {
    id: "curve",
    marker: "11",
    kind: "result",
    eyebrow: "Main result",
    title: "The gains track concrete scaffold changes.",
    body: "The most convincing part of the paper is not the headline number; it is the annotation of what changed at each jump.",
    bullets: [
      "Early jump: Smart Edit tool.",
      "Mid-run: code-context summarization and file-edit verification.",
      "Late run: AST symbol locator and then hybrid symbol locator.",
    ],
    image: resultsFigure,
    imageAlt: "Performance across agent iterations with annotated improvements",
    figureNote: "Utility rises when the system adds specific practical tools.",
    footer: "Paper Figure 3",
  },
  {
    id: "baseline",
    marker: "12",
    kind: "critique",
    eyebrow: "Comparison",
    title: "Interesting method, modest edge.",
    body: "Anthropic reported around 49% on SWE-Bench Verified with a much simpler Sonnet harness. SICA reaches 53%, but on a random subset and after a costly 15-iteration search.",
    stats: [
      { label: "SICA run cost", value: "$7k" },
      { label: "Iterations", value: "15" },
      { label: "Outside reference", value: "~49%" },
    ],
    splitNote: [
      { heading: "What is impressive", text: "Self-editing and self-evaluation work at all on real coding benchmarks." },
      { heading: "What is less impressive", text: "The absolute performance edge over simpler modern agents is small." },
    ],
    footer: "Anthropic SWE-Bench Sonnet comparison + paper cost report",
  },
  {
    id: "reasoning",
    marker: "13",
    kind: "result",
    eyebrow: "Saturation",
    title: "Reasoning tasks barely move.",
    body: "On AIME 2024 and GPQA Diamond, SICA shows little improvement. The paper's own explanation is plausible: if the base reasoning model is already strong, the scaffold may add noise rather than value.",
    bullets: [
      "The main agent often just delegates to the reasoning subagent.",
      "Crude reasoning scaffolds may interrupt an already-strong model.",
      "This narrows the claim: SICA helps agentic coding more than raw reasoning.",
    ],
    image: performanceFigure,
    imageAlt: "Paper performance export used as supporting visual texture",
    figureNote: "Use as visual support; the reasoning discussion is the key message here.",
    footer: "Paper Sec. 4.1",
  },
  {
    id: "limitations",
    marker: "14",
    kind: "critique",
    eyebrow: "Limitations",
    title: "Most failure modes are exactly where you would expect.",
    bullets: [
      "Novel ideas are hard; bad ideas are expensive and linger in the search trajectory.",
      "Five-minute timeouts likely depress the baseline and over-reward speed hacks.",
      "The initial scaffold strongly steers what kinds of improvements are even discoverable.",
    ],
    quote: "My main hypothesis: the scaffold hurt performance, and the agent partly learned to undo that harm.",
    footer: "Paper limitations + presentation notes",
  },
  {
    id: "evidence",
    marker: "15",
    kind: "critique",
    eyebrow: "Supporting evidence",
    title: "More instructions and more whitespace can hurt.",
    body: "Recent evidence supports the broader context-bloat critique: extra agent instruction layers and prompt clutter can lower benchmark performance.",
    splitNote: [
      { heading: "agents.md effect", text: "Additional instruction files can reduce benchmark performance instead of helping." },
      { heading: "Context clutter", text: "Longer, noisier prompts can degrade multiple task families as whitespace and filler grow." },
    ],
    image: agentsMdFigure,
    imageAlt: "agents.md benchmark effect figure",
    figureNote: "Pair this with the next figure during the talk.",
    footer: "agents.md effect; long-context degradation",
  },
  {
    id: "evidence-2",
    marker: "16",
    kind: "critique",
    eyebrow: "Context bloat",
    title: "SICA's prompt shape makes this critique hard to ignore.",
    body: "Open files, directory tree, tool docs, subagent docs, assistant history, and overseer notifications all compete for the same context budget.",
    bullets: [
      "That is expensive in tokens and attention.",
      "It also makes the harness highly benchmark-dependent.",
      "So 'self-improvement' may partly mean 'recovering from a cluttered interface'.",
    ],
    image: contextBloatFigure,
    imageAlt: "Whitespace and context clutter performance degradation figure",
    figureNote: "The exact paper is less important than the consistent pattern: clutter costs performance.",
    footer: "Long-context degradation evidence",
  },
  {
    id: "future",
    marker: "17",
    kind: "takeaway",
    eyebrow: "Future work",
    title: "A stronger follow-up would optimize model and scaffold together.",
    bullets: [
      "Fine-tune models jointly with the evolving tool scaffold.",
      "Use dynamic or self-generated benchmarks to reduce static overfitting.",
      "Test on leaner, modern coding harnesses with fewer tools.",
      "Compare directly against current production coding agents.",
    ],
    quote: "The next version should optimize the harness and the model together.",
    footer: "Future work from paper + talk synthesis",
  },
  {
    id: "demo",
    marker: "18",
    kind: "demo",
    eyebrow: "Live demo concept",
    title: "Tool Budget Challenge",
    body: "A fun side-by-side demo while talking: same tiny repo task, two agents, different harness complexity.",
    stats: [
      { label: "Agent A", value: "bloated" },
      { label: "Agent B", value: "lean" },
      { label: "Goal", value: "same task" },
    ],
    bullets: [
      "Mini task options: symbol lookup, one-file bug fix, or toy repo maze.",
      "Show success, turns, tool calls, and latency live on the slide.",
      "Expected punchline: simpler harness often wins or ties.",
    ],
    footer: "Demo slide intentionally designed as a live panel placeholder",
  },
  {
    id: "verdict",
    marker: "19",
    kind: "takeaway",
    eyebrow: "Overview",
    title: "",
    overviewSlideIds: ["loop", "utility", "curve", "limitations"],
    overviewOnly: true,
  },
];

/* ================================================================
   REUSABLE COMPONENTS
   ================================================================ */

function SectionRule({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="h-[4px] w-20 origin-left bg-[var(--accent)]"
      style={{
        animation: `rule-grow 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
      }}
    />
  );
}

function StatBlock({ stat, index = 0 }: { stat: Stat; index?: number }) {
  return (
    <div
      className="group relative overflow-hidden border border-[var(--accent-pink)] bg-white/60 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(255,73,135,0.12)]"
      style={{
        animation: `fade-up 0.6s cubic-bezier(0.22,1,0.36,1) ${200 + index * 100}ms both`,
      }}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <div className="relative">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
          {stat.label}
        </div>
        <div className="mt-2 font-[var(--font-display)] text-[clamp(1.4rem,2.2vw,2.4rem)] leading-none tracking-[-0.02em] text-[var(--accent)]">
          {stat.value}
        </div>
      </div>
    </div>
  );
}

function KindPill({ kind }: { kind: SlideKind }) {
  const colors = kindColors[kind];
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
      style={{
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      <span
        className="inline-block h-[6px] w-[6px] rounded-full"
        style={{ background: colors.text }}
      />
      {kindLabel[kind]}
    </div>
  );
}

function SlideImage({ slide }: { slide: Slide }) {
  if (!slide.image) return null;

  return (
    <figure
      className="group relative w-full overflow-hidden rounded-[1.4rem] border-2 border-[var(--accent)] bg-white shadow-[0_28px_70px_rgba(102,73,255,0.14)] transition-all duration-500 hover:shadow-[0_32px_80px_rgba(102,73,255,0.22)]"
      style={{ animation: "scale-in 0.7s cubic-bezier(0.22,1,0.36,1) 400ms both" }}
    >
      {/* Purple gradient corner accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[var(--accent)] opacity-[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.12]" />
      <img
        alt={slide.imageAlt ?? slide.title}
        className={`w-full object-contain transition-transform duration-700 group-hover:scale-[1.02] ${slide.imageWide ? "max-h-[34rem]" : "max-h-[30rem]"}`}
        src={slide.image}
      />
      {slide.figureNote ? (
        <figcaption className="border-t border-[color:rgba(102,73,255,0.1)] bg-[color:rgba(254,252,250,0.6)] px-5 py-3 font-mono text-[11px] leading-relaxed text-[var(--muted)] backdrop-blur-sm">
          {slide.figureNote}
        </figcaption>
      ) : null}
    </figure>
  );
}

function PdfSlideImage({ slide }: { slide: Slide }) {
  if (!slide.image) return null;

  return (
    <figure className="w-full max-w-[7.6in] overflow-hidden rounded-[0.18in] border-2 border-[var(--accent)] bg-white shadow-[0_18px_40px_rgba(102,73,255,0.12)]">
      <img
        alt={slide.imageAlt ?? slide.title}
        className="w-full max-h-[5.5in] object-contain bg-white"
        src={slide.image}
      />
      {slide.figureNote ? (
        <figcaption className="border-t border-[color:rgba(102,73,255,0.12)] px-4 py-2 font-mono text-[9px] leading-relaxed text-[var(--muted)]">
          {slide.figureNote}
        </figcaption>
      ) : null}
    </figure>
  );
}

function BulletList({ bullets, delay = 0 }: { bullets: string[]; delay?: number }) {
  return (
    <ul className="mt-4 space-y-3">
      {bullets.map((bullet, i) => (
        <li
          className="flex items-start gap-3"
          key={bullet}
          style={{
            animation: `slide-in-left 0.5s cubic-bezier(0.22,1,0.36,1) ${delay + i * 80}ms both`,
          }}
        >
          <span className="mt-[0.45rem] flex h-[8px] w-[8px] shrink-0 items-center justify-center">
            <span className="block h-[7px] w-[7px] rotate-45 bg-[var(--accent)]" />
          </span>
          <span className="font-[var(--font-editorial)] text-[clamp(0.95rem,1.2vw,1.1rem)] leading-[1.65] text-[var(--body)]">
            {bullet}
          </span>
        </li>
      ))}
    </ul>
  );
}

function QuoteBlock({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <blockquote
      className="relative mt-6 border-l-4 border-[var(--accent-pink)] py-1 pl-6"
      style={{ animation: `fade-up 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` }}
    >
      <p className="font-[var(--font-accent)] text-[clamp(1.2rem,2vw,1.6rem)] italic leading-[1.4] text-[var(--ink-deep)]">
        {text}
      </p>
    </blockquote>
  );
}

function NoteBlock({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <div
      className="mt-4 rounded-lg border border-dashed border-[color:rgba(102,73,255,0.2)] bg-[color:rgba(102,73,255,0.04)] px-5 py-3"
      style={{ animation: `fade-up 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` }}
    >
      <p className="font-[var(--font-editorial)] text-[0.95rem] italic leading-[1.6] text-[var(--muted-strong)]">
        {text}
      </p>
    </div>
  );
}

function SplitNotes({ notes, delay = 0 }: { notes: { heading: string; text: string }[]; delay?: number }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {notes.map((note, i) => (
        <div
          className="group relative overflow-hidden rounded-xl border border-[color:rgba(102,73,255,0.12)] bg-white/50 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-[color:rgba(102,73,255,0.25)] hover:bg-white/70"
          key={note.heading}
          style={{
            animation: `fade-up 0.5s cubic-bezier(0.22,1,0.36,1) ${delay + i * 120}ms both`,
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-pink)] opacity-60" />
          <h4 className="mb-2 font-[var(--font-display)] text-[0.85rem] tracking-[-0.01em] text-[var(--ink-deep)]">
            {note.heading}
          </h4>
          <p className="font-[var(--font-editorial)] text-[0.9rem] leading-[1.55] text-[var(--body)]">
            {note.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function getSlideSummary(slide: Slide) {
  return slide.body ?? slide.subtitle ?? "";
}

/* ================================================================
   MINI SLIDE PREVIEW (for overview grid)
   ================================================================ */

function MiniSlidePreview({ slide }: { slide: Slide }) {
  return (
    <div className="group relative aspect-[16/9] overflow-hidden rounded-[1.2rem] border border-[color:rgba(102,73,255,0.14)] bg-[var(--paper)] shadow-[0_20px_50px_rgba(102,73,255,0.1)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(102,73,255,0.18)]">
      {/* Left accent bar */}
      <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent)]" />
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] dot-grid-overlay" />
      <div className="relative flex h-full flex-col gap-3 p-5 pl-7">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Slide {slide.marker}
          </div>
          <KindPill kind={slide.kind} />
        </div>
        <div className="h-[3px] w-12 bg-[var(--accent)]" />
        <div className="line-clamp-3 font-[var(--font-display)] text-[1.1rem] leading-[0.98] tracking-[-0.03em] text-[var(--ink-deep)]">
          {slide.title}
        </div>
        {slide.image ? (
          <div className="mt-auto overflow-hidden rounded-[0.8rem] border border-[color:rgba(102,73,255,0.14)] bg-white transition-transform duration-500 group-hover:scale-[1.02]">
            <img
              alt={slide.imageAlt ?? slide.title}
              className="h-28 w-full object-cover object-top"
              src={slide.image}
            />
          </div>
        ) : (
          <div className="mt-auto grid gap-2">
            {(slide.bullets ?? []).slice(0, 2).map((bullet) => (
              <div className="flex items-start gap-2" key={bullet}>
                <span className="mt-[0.3rem] block h-[5px] w-[5px] shrink-0 rotate-45 bg-[var(--accent)]" />
                <div className="line-clamp-1 font-[var(--font-editorial)] text-[0.75rem] leading-[1.3] text-[var(--body)]">
                  {bullet}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   OVERVIEW GRID
   ================================================================ */

function OverviewGrid({ slideIds }: { slideIds: string[] }) {
  const overviewSlides = slideIds
    .map((id) => slides.find((s) => s.id === id))
    .filter((s): s is Slide => Boolean(s));

  return (
    <section className="slide-page relative flex h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-[var(--paper)] px-10 py-10 print:h-[100vh] print:min-h-0 print:break-after-page print:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] dot-grid-overlay" />
      {/* Large decorative circle */}
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full border border-[color:rgba(102,73,255,0.06)]" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-[color:rgba(102,73,255,0.04)]" />
      <div className="grid w-full max-w-[1440px] grid-cols-2 gap-7 print:gap-5">
        {overviewSlides.map((s, i) => (
          <div
            key={s.id}
            style={{ animation: `scale-in 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms both` }}
          >
            <MiniSlidePreview slide={s} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   SLIDE CARD (INTERACTIVE)
   ================================================================ */

function SlideCard({ slide, direction }: { slide: Slide; direction: "next" | "prev" }) {
  if (slide.overviewOnly && slide.overviewSlideIds) {
    return <OverviewGrid slideIds={slide.overviewSlideIds} />;
  }

  const hasImage = Boolean(slide.image);
  const isTitle = slide.id === "title";
  const animOffset = direction === "next" ? 1 : -1;

  return (
    <section
      className="slide-page relative flex h-[calc(100vh-72px)] items-center overflow-hidden px-8 py-16 md:px-14 xl:px-24 print:h-[100vh] print:min-h-0 print:break-after-page print:px-12 print:py-10"
      style={{
        animation: `fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both`,
      }}
    >
      {/* Left accent bar with gradient */}
      <div className="absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-[var(--accent)] via-[var(--accent-soft)] to-[var(--accent-pink)] print:w-[4px] print:bg-[var(--accent)]" />

      {/* Dot grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] dot-grid-overlay" />

      {/* Decorative corner circles */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[color:rgba(102,73,255,0.05)]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[color:rgba(102,73,255,0.02)]" />

      {/* Slide number marker */}
      <div
        className="absolute left-8 top-6 z-10 flex items-center gap-3 md:left-14 xl:left-24 print:left-12 print:top-5"
        style={{ animation: "fade-in 0.4s ease 100ms both" }}
      >
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          No. {slide.marker}
        </span>
        <span className="h-[1px] w-8 bg-[color:rgba(18,18,18,0.15)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--accent)]">
          {slide.eyebrow}
        </span>
      </div>

      {/* Content grid */}
      <div
        className={`relative z-10 mx-auto grid w-full max-w-[1260px] gap-14 ${
          hasImage ? "xl:grid-cols-[1.05fr_0.95fr]" : "max-w-[900px]"
        } items-center`}
      >
        {/* Text column */}
        <div className="flex max-w-[740px] flex-col gap-5">
          {/* Kind pill */}
          <div style={{ animation: "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 100ms both" }}>
            <KindPill kind={slide.kind} />
          </div>

          {/* Section rule */}
          <SectionRule delay={180} />

           {/* Title */}
          <header className="space-y-4">
            <h2
              className={`font-[var(--font-display)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] ${
                isTitle
                  ? "text-[clamp(2.6rem,5.8vw,5.2rem)]"
                  : "text-[clamp(2.4rem,4.5vw,4.8rem)]"
              }`}
              style={{ animation: "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 200ms both" }}
            >
              {slide.titleJsx ? (
                <>
                  A{" "}
                  <span className="relative -top-[0.02em] inline-flex flex-col items-start leading-[1.05]">
                    <span className="font-[var(--font-regular)] text-[0.42em] tracking-[0.01em] text-[var(--accent)] opacity-80">Self-Healing ^</span>
                    <span className="text-[var(--accent-pink)]/40 line-through decoration-[2.5px] decoration-[var(--accent-pink)]">Self-Improving</span>
                  </span>{" "}
                  Coding Agent
                </>
              ) : (
                slide.title
              )}
            </h2>
            {slide.subtitle ? (
              <p
                className="max-w-[44rem] font-[var(--font-accent)] text-[clamp(1.1rem,1.5vw,1.35rem)] italic leading-[1.5] text-[var(--muted-strong)]"
                style={{ animation: "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 300ms both" }}
              >
                {slide.subtitle}
              </p>
            ) : null}
            {slide.body ? (
              <p
                className="max-w-[44rem] font-[var(--font-editorial)] text-[clamp(1.02rem,1.3vw,1.18rem)] leading-[1.65] text-[var(--body)]"
                style={{ animation: "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 320ms both" }}
              >
                {slide.body}
              </p>
            ) : null}
          </header>

          {/* Stats row */}
          {slide.stats ? (
            <div className="mt-1 grid grid-cols-3 gap-3">
              {slide.stats.map((stat, i) => (
                <StatBlock key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          ) : null}

          {/* Bullets */}
          {slide.bullets ? <BulletList bullets={slide.bullets} delay={400} /> : null}

          {/* Quote */}
          {slide.quote ? <QuoteBlock text={slide.quote} delay={500} /> : null}

          {/* Note */}
          {slide.note ? <NoteBlock text={slide.note} delay={550} /> : null}

          {/* Split notes */}
          {slide.splitNote ? <SplitNotes notes={slide.splitNote} delay={450} /> : null}

          {/* Footer citation */}
          {slide.footer ? (
            <p
              className="mt-auto pt-3 font-mono text-[11px] leading-relaxed text-[var(--muted)]"
              style={{ animation: "fade-in 0.5s ease 600ms both" }}
            >
              {slide.footer}
            </p>
          ) : null}
        </div>

        {/* Image column */}
        {hasImage ? (
          <div className="self-center" style={{ animation: "scale-in 0.6s cubic-bezier(0.22,1,0.36,1) 350ms both" }}>
            <SlideImage slide={slide} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ================================================================
   PDF COMPONENTS
   ================================================================ */

function PdfSlideCard({ slide }: { slide: Slide }) {
  if (slide.overviewOnly && slide.overviewSlideIds) {
    return (
      <section className="pdf-slide-page relative box-border h-[9in] w-[16in] overflow-hidden break-after-page bg-[var(--paper)] p-[0.45in] text-[var(--ink)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] dot-grid-overlay" />
        <div className="grid h-full grid-cols-2 gap-5">
          {slide.overviewSlideIds
            .map((id) => slides.find((s) => s.id === id))
            .filter((s): s is Slide => Boolean(s))
            .map((s) => (
              <MiniSlidePreview key={s.id} slide={s} />
            ))}
        </div>
      </section>
    );
  }

  return (
    <section className="pdf-slide-page relative box-border h-[9in] w-[16in] overflow-hidden break-after-page bg-[var(--paper)] p-[0.55in] text-[var(--ink)]">
      <div className="absolute inset-y-0 left-0 w-[5px] bg-gradient-to-b from-[var(--accent)] to-[var(--accent-pink)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] dot-grid-overlay" />
      <div className="absolute left-[0.55in] top-[0.32in] z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
        No. {slide.marker}
      </div>

      <div
        className={`relative z-10 mx-auto flex h-full w-[14.8in] gap-[0.45in] pl-[0.15in] ${
          slide.image ? "items-center justify-between" : "items-start"
        }`}
      >
        <div className={`${slide.image ? "w-[6.35in]" : "w-full max-w-[9.8in]"} flex flex-col gap-4`}>
          <div className="flex items-center gap-3">
            <KindPill kind={slide.kind} />
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
              {slide.eyebrow}
            </div>
          </div>

          <div className="h-[4px] w-20 bg-[var(--accent)]" />

          <div className="space-y-3">
            <h2 className="font-[var(--font-display)] text-[0.54in] leading-[0.94] tracking-[-0.03em] text-[var(--ink)]">
              {slide.title}
            </h2>
            {getSlideSummary(slide) ? (
              <p className="max-w-[6in] font-[var(--font-editorial)] text-[0.2in] leading-[1.5] text-[var(--body)]">
                {getSlideSummary(slide)}
              </p>
            ) : null}
          </div>

          {slide.footer ? (
            <p className="mt-auto pt-2 font-mono text-[10px] leading-relaxed text-[var(--muted)]">
              {slide.footer}
            </p>
          ) : null}
        </div>

        {slide.image ? (
          <div className="flex w-[7.85in] justify-center overflow-hidden">
            <PdfSlideImage slide={slide} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PdfDeck() {
  return (
    <div className="bg-[var(--paper)]">
      {slides.map((slide) => (
        <PdfSlideCard key={slide.id} slide={slide} />
      ))}
    </div>
  );
}

/* ================================================================
   DECK HEADER
   ================================================================ */

function DeckHeader({
  currentIndex,
  onSelect,
}: {
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  const currentSlide = slides[currentIndex];

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[color:rgba(102,73,255,0.06)] bg-[color:rgba(246,241,233,0.78)] px-6 py-3.5 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex max-w-[1340px] items-center justify-between gap-5">
        {/* Left: title + context */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-block h-[3px] w-[3px] rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              RTSE / SICA / Critical reading
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 truncate font-[var(--font-regular)] text-[13px] text-[var(--ink-deep)]">
            <span className="font-mono text-[10px] text-[var(--accent)]">
              {currentSlide.marker}
            </span>
            <span className="h-[12px] w-[1px] bg-[color:rgba(18,18,18,0.12)]" />
            <span className="truncate">
              {currentSlide.title || currentSlide.eyebrow}
            </span>
          </div>
        </div>

        {/* Right: slide pills */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            const colors = kindColors[slide.kind];
            return (
              <button
                className={`relative rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] transition-all duration-250 ${
                  isActive
                    ? "text-white shadow-[0_2px_12px_rgba(102,73,255,0.25)]"
                    : "text-[var(--muted)] hover:text-[var(--accent)]"
                }`}
                key={slide.id}
                onClick={() => onSelect(index)}
                style={
                  isActive
                    ? { background: "var(--accent)" }
                    : undefined
                }
                type="button"
              >
                {slide.marker}
                {/* Progress dot underneath */}
                {!isActive && index < currentIndex && (
                  <span className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-40" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

/* ================================================================
   BOTTOM NAV
   ================================================================ */

function BottomNav({
  currentIndex,
  total,
  onPrev,
  onNext,
}: {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex items-center justify-center px-5 print:hidden">
      <div className="pointer-events-auto relative overflow-hidden rounded-full border border-[color:rgba(102,73,255,0.1)] bg-[color:rgba(246,241,233,0.82)] backdrop-blur-xl">
        {/* Progress bar */}
        <div
          className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-pink)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="flex items-center gap-4 px-5 py-2.5">
          <button
            className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted-strong)] transition-colors duration-200 hover:text-[var(--accent)] disabled:opacity-30"
            disabled={currentIndex === 0}
            onClick={onPrev}
            type="button"
          >
            Prev
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] font-semibold tabular-nums text-[var(--accent)]">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] text-[var(--muted)]">/</span>
            <span className="font-mono text-[10px] tabular-nums text-[var(--muted)]">
              {String(total).padStart(2, "0")}
            </span>
          </div>
          <button
            className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted-strong)] transition-colors duration-200 hover:text-[var(--accent)] disabled:opacity-30"
            disabled={currentIndex === total - 1}
            onClick={onNext}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN APP
   ================================================================ */

export function App() {
  const isPdfExport =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("export") === "pdf";

  const initialSlideIndex = useMemo(() => {
    if (typeof window === "undefined") return 0;
    const hash = window.location.hash.replace(/^#/, "");
    const hashIndex = slides.findIndex((s) => s.id === hash);
    return hashIndex >= 0 ? hashIndex : 0;
  }, []);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback(
    (index: number) => {
      if (index === currentSlideIndex) return;
      setDirection(index > currentSlideIndex ? "next" : "prev");
      setCurrentSlideIndex(index);
    },
    [currentSlideIndex],
  );

  const goNext = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setDirection("next");
      setCurrentSlideIndex((i) => i + 1);
    }
  }, [currentSlideIndex]);

  const goPrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      setDirection("prev");
      setCurrentSlideIndex((i) => i - 1);
    }
  }, [currentSlideIndex]);

  if (isPdfExport) {
    return <PdfDeck />;
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || target?.isContentEditable) return;

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        event.preventDefault();
        goPrev();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Hash sync
  useEffect(() => {
    const slide = slides[currentSlideIndex];
    if (!slide) return;
    window.history.replaceState(null, "", `#${slide.id}`);
  }, [currentSlideIndex]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <DeckHeader currentIndex={currentSlideIndex} onSelect={goTo} />
      <main className="relative h-screen pt-[72px]">
        <div id={currentSlide.id} key={currentSlide.id}>
          <SlideCard slide={currentSlide} direction={direction} />
        </div>
        <BottomNav
          currentIndex={currentSlideIndex}
          total={slides.length}
          onPrev={goPrev}
          onNext={goNext}
        />
      </main>
    </div>
  );
}

export default App;
