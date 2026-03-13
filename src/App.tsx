import { useEffect, useMemo, useState } from "react";
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

type SlideKind = "claim" | "method" | "result" | "critique" | "demo" | "takeaway";

type Stat = {
  label: string;
  value: string;
};

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
};

const kindLabel: Record<SlideKind, string> = {
  claim: "Claim",
  method: "Method",
  result: "Result",
  critique: "Critique",
  demo: "Demo",
  takeaway: "Takeaway",
};

const slides: Slide[] = [
  {
    id: "title",
    marker: "01",
    kind: "claim",
    eyebrow: "RTSE Presentation",
    title: "Can a coding agent rewrite itself?",
    subtitle: 'A critical reading of "A Self-Improving Coding Agent"',
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
      {
        heading: "Why it matters",
        text: "It looks closer to actual software work than synthetic toy tasks.",
      },
      {
        heading: "Caveat",
        text: "It is still a random subset, so external comparisons are messy.",
      },
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
      {
        heading: "What is impressive",
        text: "Self-editing and self-evaluation work at all on real coding benchmarks.",
      },
      {
        heading: "What is less impressive",
        text: "The absolute performance edge over simpler modern agents is small.",
      },
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
      {
        heading: "agents.md effect",
        text: "Additional instruction files can reduce benchmark performance instead of helping.",
      },
      {
        heading: "Context clutter",
        text: "Longer, noisier prompts can degrade multiple task families as whitespace and filler grow.",
      },
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

function SectionRule() {
  return <div className="h-1 w-24 bg-[var(--accent)]" />;
}

function StatBlock({ stat }: { stat: Stat }) {
  return (
    <div className="border border-[var(--accent-pink)] px-4 py-3 bg-white/55 backdrop-blur-sm shadow-[0_10px_30px_rgba(255,73,135,0.08)]">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">{stat.label}</div>
      <div className="mt-2 font-[var(--font-display)] text-[clamp(1.4rem,2vw,2.3rem)] leading-none text-[var(--accent)]">{stat.value}</div>
    </div>
  );
}

function KindPill({ kind }: { kind: SlideKind }) {
  return (
    <div className="inline-flex items-center rounded-full border border-[color:rgba(102,73,255,0.18)] bg-[color:rgba(102,73,255,0.08)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
      {kindLabel[kind]}
    </div>
  );
}

function SlideImage({ slide }: { slide: Slide }) {
  if (!slide.image) return null;

  return (
    <figure className="relative w-full overflow-hidden rounded-[1.2rem] border-2 border-[var(--accent)] bg-white shadow-[0_22px_60px_rgba(102,73,255,0.16)]">
      <img alt={slide.imageAlt ?? slide.title} className={`w-full object-contain ${slide.imageWide ? "max-h-[34rem]" : "max-h-[30rem]"}`} src={slide.image} />
      {slide.figureNote ? (
        <figcaption className="border-t border-[color:rgba(102,73,255,0.12)] px-5 py-3 font-mono text-[11px] leading-relaxed text-[var(--muted)]">
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
      <img alt={slide.imageAlt ?? slide.title} className="w-full max-h-[5.5in] object-contain bg-white" src={slide.image} />
      {slide.figureNote ? <figcaption className="border-t border-[color:rgba(102,73,255,0.12)] px-4 py-2 font-mono text-[9px] leading-relaxed text-[var(--muted)]">{slide.figureNote}</figcaption> : null}
    </figure>
  );
}

function getSlideSummary(slide: Slide) {
  return slide.body ?? slide.quote ?? slide.note ?? slide.bullets?.[0] ?? slide.splitNote?.[0]?.text ?? slide.stats?.[0]?.value;
}

function MiniSlidePreview({ slide }: { slide: Slide }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-[1rem] border border-[color:rgba(102,73,255,0.16)] bg-[var(--paper)] shadow-[0_16px_40px_rgba(102,73,255,0.12)]">
      <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,rgba(18,18,18,0.08)_1px,transparent_0)] [background-size:14px_14px]" />
      <div className="relative flex h-full flex-col gap-3 p-4 pl-6">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--muted)]">Slide {slide.marker}</div>
          <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--accent)]">{slide.eyebrow}</div>
        </div>
        <div className="h-[3px] w-12 bg-[var(--accent)]" />
        <div className="line-clamp-3 font-[var(--font-display)] text-[1.05rem] leading-[0.98] tracking-[-0.03em] text-[var(--ink-deep)]">
          {slide.title}
        </div>
        {slide.image ? (
          <div className="mt-auto overflow-hidden rounded-[0.8rem] border border-[color:rgba(102,73,255,0.16)] bg-white">
            <img alt={slide.imageAlt ?? slide.title} className="h-28 w-full object-cover object-top" src={slide.image} />
          </div>
        ) : (
          <div className="mt-auto grid gap-2">
            {(slide.bullets ?? []).slice(0, 3).map(bullet => (
              <div className="flex items-start gap-2" key={bullet}>
                <div className="mt-[0.35rem] h-[6px] w-[6px] shrink-0 bg-[var(--accent)]" />
                <div className="line-clamp-2 font-[var(--font-editorial)] text-[0.78rem] leading-[1.3] text-[var(--body)]">{bullet}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewGrid({ slideIds }: { slideIds: string[] }) {
  const overviewSlides = slideIds
    .map(id => slides.find(candidate => candidate.id === id))
    .filter((candidate): candidate is Slide => Boolean(candidate));

  return (
    <section className="slide-page relative flex h-[calc(100vh-56px)] items-center justify-center overflow-hidden bg-[var(--paper)] px-8 py-8 print:h-[100vh] print:min-h-0 print:break-after-page print:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(18,18,18,0.08)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="grid w-full max-w-[1420px] grid-cols-2 gap-6 print:gap-5">
        {overviewSlides.map(overviewSlide => (
          <MiniSlidePreview key={overviewSlide.id} slide={overviewSlide} />
        ))}
      </div>
    </section>
  );
}

function PdfSlideCard({ slide }: { slide: Slide }) {
  if (slide.overviewOnly && slide.overviewSlideIds) {
    return (
      <section className="pdf-slide-page relative box-border h-[9in] w-[16in] overflow-hidden break-after-page bg-[var(--paper)] p-[0.45in] text-[var(--ink)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,rgba(18,18,18,0.08)_1px,transparent_0)] [background-size:18px_18px]" />
        <div className="grid h-full grid-cols-2 gap-5">
          {slide.overviewSlideIds.map(id => slides.find(candidate => candidate.id === id)).filter((candidate): candidate is Slide => Boolean(candidate)).map(overviewSlide => (
            <MiniSlidePreview key={overviewSlide.id} slide={overviewSlide} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="pdf-slide-page relative box-border h-[9in] w-[16in] overflow-hidden break-after-page bg-[var(--paper)] p-[0.55in] text-[var(--ink)]">
      <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(18,18,18,0.08)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="absolute left-[0.55in] top-[0.32in] z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
        Slide {slide.marker}
      </div>

      <div className={`relative z-10 mx-auto flex h-full w-[14.8in] gap-[0.45in] pl-[0.15in] ${slide.image ? "items-center justify-between" : "items-start"}`}>
        <div className={`${slide.image ? "w-[6.35in]" : "w-full max-w-[9.8in]"} flex flex-col gap-4`}>
          <div className="flex items-center gap-3">
            <KindPill kind={slide.kind} />
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">{slide.eyebrow}</div>
          </div>

          <SectionRule />

          <div className="space-y-3">
            <h2 className="font-[var(--font-display)] text-[0.54in] leading-[0.94] tracking-[-0.03em] text-[var(--ink)]">{slide.title}</h2>
            {getSlideSummary(slide) ? <p className="max-w-[6in] font-[var(--font-editorial)] text-[0.2in] leading-[1.5] text-[var(--body)]">{getSlideSummary(slide)}</p> : null}
          </div>

          {slide.footer ? <p className="mt-auto pt-2 font-mono text-[10px] leading-relaxed text-[var(--muted)]">{slide.footer}</p> : null}
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
      {slides.map(slide => (
        <PdfSlideCard key={slide.id} slide={slide} />
      ))}
    </div>
  );
}

function SlideCard({ slide }: { slide: Slide }) {
  if (slide.overviewOnly && slide.overviewSlideIds) {
    return <OverviewGrid slideIds={slide.overviewSlideIds} />;
  }

  return (
    <section className="slide-page relative flex h-[calc(100vh-56px)] items-center overflow-hidden border-b border-[color:rgba(18,18,18,0.06)] px-8 py-20 md:px-14 xl:px-24 print:h-[100vh] print:min-h-0 print:break-after-page print:px-12 print:py-10">
      <div className="absolute inset-y-0 left-0 w-[6px] bg-[var(--accent)] print:w-[4px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:radial-gradient(circle_at_1px_1px,rgba(18,18,18,0.08)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="absolute left-8 top-8 z-10 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] md:left-14 xl:left-24 print:top-5 print:left-12">
        Slide {slide.marker}
      </div>

      <div className={`relative z-10 mx-auto grid w-full max-w-[1200px] gap-12 ${slide.image ? "xl:grid-cols-[1.02fr_0.98fr]" : "max-w-[880px]"} items-center`}>
        <div className="flex max-w-[720px] flex-col gap-6">
          <div className="flex items-center gap-3">
            <KindPill kind={slide.kind} />
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">{slide.eyebrow}</div>
          </div>

          <SectionRule />

          <header className="space-y-4">
            <h2 className="font-[var(--font-display)] text-[clamp(2.6rem,5vw,5.25rem)] leading-[0.97] tracking-[-0.03em] text-[var(--ink)]">
              {slide.title}
            </h2>
            {getSlideSummary(slide) ? <p className="max-w-[44rem] font-[var(--font-editorial)] text-[clamp(1.08rem,1.35vw,1.22rem)] leading-[1.6] text-[var(--body)]">{getSlideSummary(slide)}</p> : null}
          </header>

          {slide.footer ? <p className="pt-3 font-mono text-[11px] leading-relaxed text-[var(--muted)]">{slide.footer}</p> : null}
        </div>

        {slide.image ? (
          <div className="self-center">
            <SlideImage slide={slide} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Header() {
  return null;
}

function DeckHeader({
  currentIndex,
  onSelect,
}: {
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  const currentSlide = slides[currentIndex];

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[color:rgba(102,73,255,0.08)] bg-[color:rgba(254,252,250,0.82)] px-5 py-3 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">RTSE / SICA / Critical reading</div>
          <div className="truncate font-[var(--font-regular)] text-sm text-[var(--ink-deep)]">{currentSlide.marker} - {currentSlide.title || currentSlide.eyebrow}</div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {slides.map((slide, index) => (
            <button
              className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition ${index === currentIndex ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-transparent text-[var(--muted)] hover:border-[color:rgba(102,73,255,0.15)] hover:bg-[color:rgba(102,73,255,0.07)] hover:text-[var(--accent)]"}`}
              key={slide.id}
              onClick={() => onSelect(index)}
              type="button"
            >
              {slide.marker}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export function App() {
  const isPdfExport = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("export") === "pdf";

  const initialSlideIndex = useMemo(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    const hash = window.location.hash.replace(/^#/, "");
    const hashIndex = slides.findIndex(slide => slide.id === hash);
    return hashIndex >= 0 ? hashIndex : 0;
  }, []);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);

  if (isPdfExport) {
    return <PdfDeck />;
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      const isTypingTarget = tagName === "INPUT" || tagName === "TEXTAREA" || target?.isContentEditable;

      if (isTypingTarget) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp" || (event.key === " " && event.shiftKey)) {
        event.preventDefault();
        setCurrentSlideIndex(index => Math.max(index - 1, 0));
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") {
        event.preventDefault();
        setCurrentSlideIndex(index => Math.min(index + 1, slides.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const slide = slides[currentSlideIndex];
    if (!slide) {
      return;
    }

    window.history.replaceState(null, "", `#${slide.id}`);
  }, [currentSlideIndex]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <DeckHeader currentIndex={currentSlideIndex} onSelect={setCurrentSlideIndex} />
      <main className="relative h-screen pt-[56px]">
        <div id={currentSlide.id} key={currentSlide.id}>
          <SlideCard slide={currentSlide} />
        </div>
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex items-center justify-center gap-3 px-5 print:hidden">
          <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[color:rgba(102,73,255,0.14)] bg-[color:rgba(254,252,250,0.84)] px-4 py-2 backdrop-blur-md">
            <button
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted-strong)] disabled:opacity-35"
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex(index => Math.max(index - 1, 0))}
              type="button"
            >
              Prev
            </button>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
              {currentSlideIndex + 1} / {slides.length}
            </div>
            <button
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted-strong)] disabled:opacity-35"
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => setCurrentSlideIndex(index => Math.min(index + 1, slides.length - 1))}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
