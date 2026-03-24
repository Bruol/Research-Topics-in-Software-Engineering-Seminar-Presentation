import { useEffect, useState, type ReactNode } from "react";
import { UtilityVisual } from "./components/UtilityVisual";
import { setPersistedSlide, subscribeToCurrentSlide } from "./presentationState";
import { speakerNotesBySlide } from "./speakerNotes";

const TOTAL_SLIDES = 36;
const APPENDIX_START = 26;
const PREVIEW_WIDTH = 1333;
const PREVIEW_HEIGHT = 750;

type ViewMode = "presentation" | "notes";
type SlideSetter = (value: number | ((currentIndex: number) => number)) => void;

function clampIndex(nextIndex: number, max: number) {
  return Math.max(0, Math.min(max - 1, nextIndex));
}

function getViewMode(pathname: string): ViewMode {
  return pathname === "/notes" ? "notes" : "presentation";
}

function ToolCountVisual() {
  const agents = [
    { agent: "main", tools: 9, tone: "bg-[rgba(102,73,255,0.14)] text-[var(--accent)]" },
    { agent: "software_developer", tools: 12, tone: "bg-[rgba(255,73,135,0.12)] text-[var(--highlight)]" },
    { agent: "general_problem_solver", tools: 12, tone: "bg-[rgba(255,73,135,0.12)] text-[var(--highlight)]" },
    { agent: "archive_explorer", tools: 10, tone: "bg-[rgba(73,255,193,0.18)] text-[#14795f]" },
    { agent: "meta_agent_design_reviewer", tools: 8, tone: "bg-[rgba(181,101,29,0.12)] text-[var(--stat-brown)]" },
    { agent: "reasoning_agent", tools: 4, tone: "bg-[rgba(18,18,18,0.08)] text-[var(--ink-soft)]" },
  ];

  return (
    <div className="flex h-full flex-col justify-between rounded-[1.5rem] bg-[#fcfbf8] p-[1.2rem] text-[var(--ink)]">
      <div>
        <div className="mb-[1.2rem] flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Tool Count by Agent
            </div>
          </div>

        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-[rgba(18,18,18,0.08)] bg-[rgba(255,255,255,0.84)]">
          <div className="grid grid-cols-[2.2fr_0.8fr] border-b border-[rgba(18,18,18,0.08)] bg-[rgba(102,73,255,0.06)] px-5 py-3 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            <div>Agent</div>
            <div className="text-center">Tools</div>
          </div>

          <div className="divide-y divide-[rgba(18,18,18,0.06)]">
            {agents.map((entry) => (
              <div key={entry.agent} className="grid grid-cols-[2.2fr_0.8fr] items-center px-5 py-3">
                <div className="font-mono text-[0.88rem] font-medium text-[var(--ink)]">{entry.agent}</div>
                <div className="flex justify-center">
                  <span className={["min-w-[3rem] rounded-full px-3 py-1 text-center font-mono text-[0.85rem] font-semibold", entry.tone].join(" ")}>
                    {entry.tools}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[rgba(255,73,135,0.2)] bg-[linear-gradient(135deg,rgba(255,73,135,0.08),rgba(102,73,255,0.08))]">
        <div className="border-b border-[rgba(18,18,18,0.08)] px-5 py-3 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--highlight)]">
          Comparison Point
        </div>
        <div className="grid grid-cols-[2.2fr_0.8fr] items-center px-5 py-3">
          <div className="font-mono text-[0.88rem] font-medium text-[var(--ink)]">Claude Code</div>
          <div className="flex justify-center">
            <span className="min-w-[3rem] rounded-full bg-[rgba(255,73,135,0.12)] px-3 py-1 text-center font-mono text-[0.85rem] font-semibold text-[var(--highlight)]">
              10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}



function PromptingTimelineVisual({ activeStep = 4 }: { activeStep?: 1 | 2 | 3 | 4 }) {
  const steps = [
    { label: "Prompting", label2: "LLM Directly", sub: "Zero-shot, few-shot" },
    { label: "Prompt", label2: "Engineering", sub: "Chain-of-thought" },
    { label: "Self-Improving", label2: "Agent", sub: "Automated scaffold search" },
  ];
  const svgWidth = 850;
  const stepWidth = 160;
  const stepHeight = 100;
  const gap = 40;
  const timelineWidth = steps.length * stepWidth + (steps.length - 1) * gap;
  const startX = (svgWidth - timelineWidth) / 2;
  const startY = 60;
  
  return (
    <svg viewBox={`0 0 ${svgWidth} 250`} className="h-full w-full">
      <rect x="0" y="0" width={svgWidth} height="250" rx="20" fill="#fcfbf8" />
      
      {/* Timeline line */}
      <line 
        x1={startX + stepWidth / 2} 
        y1={startY + stepHeight + 25} 
        x2={startX + (stepWidth + gap) * 2 + stepWidth / 2} 
        y2={startY + stepHeight + 25} 
        stroke="#ff4987" 
        strokeWidth="2" 
        strokeDasharray="6 4"
      />
      
   
      
      {steps.map((step, index) => {
        const x = startX + index * (stepWidth + gap);
        const isActive = index + 1 === activeStep;
        
        return (
          <g key={step.label}>
            {/* Card */}
            <rect 
              x={x} 
              y={startY} 
              width={stepWidth} 
              height={stepHeight} 
              rx="14" 
              fill={isActive ? "#6649ff" : "#ffffff"} 
              stroke="#ff4987" 
              strokeWidth="2"
            />
            
            {/* Step number circle */}
            <circle 
              cx={x + stepWidth / 2} 
              cy={startY + stepHeight + 25} 
              r="12" 
              fill={isActive ? "#6649ff" : "#ffffff"} 
              stroke="#ff4987" 
              strokeWidth="2"
            />
            <text 
              x={x + stepWidth / 2} 
              y={startY + stepHeight + 30} 
              textAnchor="middle" 
              fill={isActive ? "#ffffff" : "#ff4987"} 
              fontSize="12" 
              fontFamily="system-ui, sans-serif"
              fontWeight="600"
            >
              {index + 1}
            </text>
            
            {/* Label line 1 */}
            <text 
              x={x + stepWidth / 2} 
              y={startY + 32} 
              textAnchor="middle" 
              fill={isActive ? "#ffffff" : "#2a2240"} 
              fontSize="15" 
              fontFamily="Georgia, serif"
              fontWeight="600"
            >
              {step.label}
            </text>
            
            {/* Label line 2 */}
            <text 
              x={x + stepWidth / 2} 
              y={startY + 52} 
              textAnchor="middle" 
              fill={isActive ? "#ffffff" : "#2a2240"} 
              fontSize="15" 
              fontFamily="Georgia, serif"
              fontWeight="600"
            >
              {step.label2}
            </text>
            
            {/* Sub text */}
            <text 
              x={x + stepWidth / 2} 
              y={startY + 78} 
              textAnchor="middle" 
              fill={isActive ? "rgba(255,255,255,0.9)" : "#666"} 
              fontSize="11" 
              fontFamily="system-ui, sans-serif"
            >
              {step.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StatCard({ label, value }: { label?: string; value: string }) {
  const hasLabel = (label ?? "").trim().length > 0;
  return (
    <div className={["rounded-lg border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.7)] px-[1vw] py-[0.8vh]", hasLabel ? "" : "text-center"].join(" ")}>
      {hasLabel ? (
        <div className="mb-[0.4vh] font-mono text-[clamp(0.65rem,0.9vw,0.8rem)] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
          {label}
        </div>
      ) : null}
      <div className="font-display text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.1] text-[var(--ink)]">{value}</div>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-[rgba(18,18,18,0.06)] border-l-[3px] border-l-[var(--accent)] bg-[rgba(255,255,255,0.65)] px-[1vw] py-[0.8vh]">
      <div className="mb-[0.4vh] font-mono text-[clamp(0.5rem,0.7vw,0.65rem)] font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
        {title}
      </div>
      <p className="m-0 font-serif text-[clamp(0.8rem,1vw,0.95rem)] leading-[1.5] text-[var(--ink-soft)]">{body}</p>
    </div>
  );
}

function SourcePills({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div className="mt-[1vh] flex flex-wrap gap-[0.8vw]">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[rgba(102,73,255,0.18)] bg-[rgba(255,255,255,0.82)] px-[1vw] py-[0.5vh] font-mono text-[clamp(0.6rem,0.75vw,0.7rem)] font-semibold uppercase tracking-[0.06em] text-[var(--accent)] no-underline transition-all duration-200 ease-out hover:translate-y-[-1px] hover:border-[rgba(102,73,255,0.35)] hover:opacity-80"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function CodePanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(18,18,18,0.08)] bg-[rgba(255,255,255,0.82)] shadow-[0_8px_24px_rgba(102,73,255,0.06)]">
      <div className="border-b border-[rgba(18,18,18,0.08)] bg-[rgba(102,73,255,0.06)] px-4 py-3 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        {title}
      </div>
      <pre className="m-0 overflow-auto whitespace-pre-wrap px-4 py-4 font-mono text-[clamp(0.62rem,0.78vw,0.78rem)] leading-[1.5] text-[var(--ink-soft)]">
        {body}
      </pre>
    </div>
  );
}

function CompactTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(18,18,18,0.08)] bg-[rgba(255,255,255,0.82)] shadow-[0_8px_24px_rgba(102,73,255,0.06)]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[rgba(102,73,255,0.06)]">
            {headers.map((header) => (
              <th key={header} className="border-b border-[rgba(18,18,18,0.08)] px-3 py-2 text-left font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-[rgba(255,255,255,0.72)]" : "bg-[rgba(18,18,18,0.02)]"}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="border-b border-[rgba(18,18,18,0.05)] px-3 py-2 font-mono text-[clamp(0.58rem,0.72vw,0.72rem)] text-[var(--ink-soft)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SlideFrame({
  slideNumber,
  eyebrow,
  title,
  byline,
  thesis,
  visual,
  image,
  imageAlt,
  imageWrapperClassName,
  imageClassName,
  image2,
  image2Alt,
  wide = false,
  appendix = false,
  printMode = false,
  children,
  sourceLinks,
}: {
  slideNumber: number;
  eyebrow?: string;
  title: ReactNode;
  byline?: string;
  thesis?: string;
  visual?: ReactNode;
  image?: string;
  imageAlt?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  image2?: string;
  image2Alt?: string;
  wide?: boolean;
  appendix?: boolean;
  printMode?: boolean;
  children?: ReactNode;
  sourceLinks?: { label: string; href: string }[];
}) {
  const hasVisual = !!(visual || image || image2);
  const slideMarker = (
    <>
      <span className="font-mono text-[clamp(0.6rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.15em] text-[var(--accent)]">
        No. {String(slideNumber).padStart(2, "0")}
      </span>
      <hr className="h-[3px] w-[60px] border-0 bg-[var(--accent)]" />
      {eyebrow ? <p className="font-mono text-[clamp(0.65rem,0.9vw,0.85rem)] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{eyebrow}</p> : null}
    </>
  );
  const slideBody = (
    <>
      <h2 className={["m-0 max-w-[22ch] capitalize font-display text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.02em]", appendix ? "text-[var(--ink-soft)]" : "text-[var(--ink)]"].join(" ")}>
        {title}
      </h2>
      {byline ? <p className="m-0 font-mono text-[clamp(1rem,1.8vw,1.5rem)] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{byline}</p> : null}
      <hr className="max-w-[400px] border-0 border-t border-[rgba(18,18,18,0.15)]" />
      {thesis ? <p className="m-0 max-w-[56ch] font-serif text-[clamp(1rem,1.4vw,1.25rem)] italic leading-[1.5] text-[var(--ink-soft)]">{thesis}</p> : null}
      {children}
      {sourceLinks?.length ? <SourcePills links={sourceLinks} /> : null}
    </>
  );

  return (
    <section
      className={[
        "relative flex items-center justify-center",
        printMode ? "print-slide h-[7.5in] w-[13.333in] overflow-hidden break-after-page px-8 py-6" : "min-h-screen w-full px-[5vw] py-[4vh]",
      ].join(" ")}
    >
      <div className={["absolute inset-y-0 left-0 w-[5px]", appendix ? "bg-[var(--muted)] opacity-40" : "bg-[var(--accent)]"].join(" ")} />
      <div
        className={[
          "grid w-full max-w-[1600px] gap-[3vw] pl-6",
          hasVisual
            ? "grid-cols-1 items-start lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-[auto_1fr]"
            : wide
              ? "grid-cols-1"
              : "max-w-[900px] grid-cols-1",
        ].join(" ")}
      >
        <div className={["flex flex-col gap-[1.5vh]", hasVisual ? "lg:col-start-1 lg:row-start-1" : ""].join(" ")}>{slideMarker}</div>
        <div className={["flex flex-col gap-[1.5vh]", hasVisual ? "lg:col-start-1 lg:row-start-2" : ""].join(" ")}>{slideBody}</div>
        {hasVisual ? (
          <div className="flex flex-col gap-[1.5vh] lg:col-start-2 lg:row-start-2">
            {visual ? <div className="overflow-hidden rounded-xl border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.8)] p-[1vw] shadow-[0_8px_24px_rgba(102,73,255,0.06)] [&_svg]:max-h-[60vh] [&_svg]:w-full">{visual}</div> : null}
            {image ? <div className={["overflow-hidden rounded-xl border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.75)] p-[0.8vw] shadow-[0_8px_24px_rgba(102,73,255,0.06)]", imageWrapperClassName ?? ""].join(" ")}><img src={image} alt={imageAlt ?? "Slide visual"} className={["block max-h-[55vh] w-full rounded-lg object-contain", imageClassName ?? ""].join(" ")} /></div> : null}
            {image2 ? <div className="overflow-hidden rounded-xl border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.75)] p-[0.8vw] shadow-[0_8px_24px_rgba(102,73,255,0.06)]"><img src={image2} alt={image2Alt ?? "Secondary visual"} className="block max-h-[45vh] w-full rounded-lg object-contain" /></div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProgressNav({ currentIndex, setCurrentIndex }: { currentIndex: number; setCurrentIndex: SlideSetter }) {
  const currentIsAppendix = currentIndex >= APPENDIX_START;
  const start = currentIsAppendix ? APPENDIX_START : 0;
  const end = currentIsAppendix ? TOTAL_SLIDES : APPENDIX_START;
  return (
    <nav aria-label="Slide navigation" className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-0 rounded-full border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.85)] px-1.5 py-1.5 backdrop-blur-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {Array.from({ length: end - start }, (_, offset) => start + offset).map((index) => {
        const active = index === currentIndex;
        return (
          <button key={index} type="button" aria-label={`Go to slide ${index + 1}`} onClick={() => setCurrentIndex(index)} className="flex h-5 w-7 cursor-pointer items-center justify-center border-none bg-transparent p-0">
            <span
              style={{ width: active ? "24px" : "6px", height: active ? "16px" : "6px" }}
              className={[
                "flex items-center justify-center rounded-full font-mono text-[0.6rem] font-semibold transition-all duration-300 ease-out",
                active ? "bg-[var(--accent)] text-white" : currentIsAppendix ? "bg-[rgba(18,18,18,0.15)] hover:bg-[rgba(18,18,18,0.3)]" : "bg-[rgba(18,18,18,0.2)] hover:bg-[rgba(102,73,255,0.4)]",
              ].join(" ")}
            >
              {active ? index + 1 : null}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function renderSlide(slideIndex: number, printMode = false, onNavigate?: (index: number) => void) {
  switch (slideIndex) {
    // Slide 1
    case 0:
      return (
        <SlideFrame
          slideNumber={1}
          title={
            <>
              A Self-<span className="line-through decoration-[3px] text-[var(--ink)]/80">Improving</span>{" "}
              <span className="text-[var(--highlight)]">Healing</span>
              <br />
              Coding Agent
            </>
          }
          byline="Lorin Urbantat"
          thesis="Interesting proof of self-editing, but the biggest measured gain still looks more like scaffold optimization than open-ended recursive intelligence."
          printMode={printMode}
          sourceLinks={[{ label: "Source: arXiv", href: "https://arxiv.org/pdf/2504.15228" }]}
        >
          <div className="mt-[1vh] max-w-[24rem]">
            <StatCard label="SWE-Bench Verified" value="17% → 53%" />
          </div>
        </SlideFrame>
      );

    // Slide 2
    case 1:
      return (
        <SlideFrame slideNumber={2} eyebrow="Claim" title="From 17% to 53%" thesis="A coding agent can edit its own codebase, benchmark itself, keep the best version in an archive, and improve measured utility over time without any weight updates." printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="method" value="No Weight Updates" />
            <StatCard label="improvement" value="Edit Agent Scaffold Code" />
            <StatCard label="evaluation" value="Benchmarks" />
            <StatCard label="selection" value="First Self-Improving Agent*" />
          </div>
          <div className="max-w-[32rem] pt-[0.8vh] font-mono text-[clamp(0.7rem,0.7vw,0.9rem)] leading-[1.45] text-[var(--muted)]">
            * Claude Code was released before, which is arguably also self-improving.
          </div>
        </SlideFrame>
      );

    // Slide 3
    case 2:
      return (
        <SlideFrame slideNumber={3} eyebrow="Context" title="From Prompting Strategies To Agent Scaffold" thesis="We started with Zero-Shot Prompting" visual={<PromptingTimelineVisual activeStep={1} />} printMode={printMode} />
      );

    // Slide 4
    case 3:
      return (
        <SlideFrame slideNumber={4} eyebrow="Context" title="SICA arrives after years of prompt engineering" thesis="Chain-of-thought, STaR, Tree of Thoughts, Graph of Thought" visual={<PromptingTimelineVisual activeStep={2} />} printMode={printMode} />
      );

    // Slide 5
    case 4:
      return (
        <SlideFrame slideNumber={5} eyebrow="Context" title="What is actually new relative to ADAS and AlphaEvolve?" thesis="ADAS improves a separate target agent, while SICA makes the current best agent become the next improver, which is the paper’s core novelty claim." visual={<PromptingTimelineVisual activeStep={3} />} printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[38rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="ADAS" body="Fixed meta-agent, separate target agent, more constrained setting." />
            <InfoCard title="Alpha Evolve" body="Starts from a baseline program plus a reference test, then keeps iterating toward a faster objective - only works for highly structured problems." />
          </div>
        </SlideFrame>
      );

    // Slide 6
    case 5:
      return (
        <SlideFrame slideNumber={6} eyebrow="Method" title="The SICA loop is simple in structure" thesis="Start from a base agent, evaluate it, let the best archived agent propose one improvement, benchmark the result, archive it, and repeat." image="/notes/agent improvement.jpeg" imageAlt="Main loop figure" printMode={printMode} />
      );

    // Slide 7
    case 6:
      return (
        <SlideFrame slideNumber={7} eyebrow="Method Detail" title="The loop works through evaluation, archive selection, and one new edit" thesis="At each iteration, the current agent is benchmarked, the archive records agent-plus-score history, and the best archived agent becomes the improver that proposes the next version." image="/sica_loop.svg" imageAlt="SICA loop visual" printMode={printMode} />
      );

    // Slide 8
    case 7:
      return (
        <SlideFrame slideNumber={8} eyebrow="Objective" title="SICA does not optimize benchmark score alone" thesis="The utility function gives 50% weight to score and 25% each to cost and time, so infrastructure fixes count as improvement by design." visual={<UtilityVisual />} printMode={printMode} />
      );

    // Slide 9
    case 8:
      return (
        <SlideFrame slideNumber={9} eyebrow="Architecture" title="The starting point is already a staffed multi-agent company" thesis="SICA begins with multiple specialized roles, each carrying prompt logic, tool descriptions, and control overhead." image="/agent_hierarchy.svg" imageAlt="Test image" printMode={printMode} />
      );

    // Slide 10
    case 9:
      return (
        <SlideFrame slideNumber={10} eyebrow="Oversight" title="An overseer agent watches the run and can intervene" thesis="The overseer checks traces every 30 seconds, sends steering messages, and can cancel agents that loop or test changes incorrectly." image="/overseer.svg" imageAlt="Oversight agent figure" printMode={printMode} />
      );

    // Slide 11
    case 10:
      return (
        <SlideFrame slideNumber={11} eyebrow="Prompt Surface" title="The system prompt is already huge before the agent does any work" thesis="The context window already includes tool docs, sub-agent docs, problem statement, open files, directory tree, tool results, and overseer notifications." image="/notes/system prompt.png" imageAlt="System prompt figure" printMode={printMode} />
      );

    // Slide 12
    case 11:
      return (
        <SlideFrame slideNumber={12} eyebrow="Scaffold Critique" title="The base agent starts with a lot of tools/context compared with lean other Scafoflds" thesis="The initial system bundles many tools, roles, and prompt assumptions before self-improvement even begins, which makes self-repair a plausible interpretation of later gains." visual={<ToolCountVisual />} printMode={printMode}/>
      );

    // Slide 13
    case 12:
      return (
        <SlideFrame slideNumber={13} eyebrow="Core Critique" title="Too many tools and too much context" thesis="If instruction-heavy, tool-rich scaffolds degrade performance, then some of SICA’s measured gain may simply be the agent removing self-inflicted friction." image="/notes/code act vs. tool calls.png" imageAlt="CodeAct comparison" image2="/notes/context rot.png" image2Alt="Context rot comparison" printMode={printMode} sourceLinks={[{ label: "Code Act (Apple)", href: "https://arxiv.org/pdf/2402.01030" }, { label: "Context Rot (Chroma)", href: "https://research.trychroma.com/context-rot" }]} />
      );

    // Slide 14
    case 13:
      return (
        <SlideFrame slideNumber={14} eyebrow="Evaluation Setup" title="Three Benchmarks" thesis="50 random samples from SWE-Bench Verified, LiveCodeBench, and some synthetic tasks. Total cost ~7000 USD" image="Benchmark.png" imageAlt="Benchmarks figure" printMode={printMode} />
      );

    // Slide 15
    case 14:
      return (
        <SlideFrame slideNumber={15} eyebrow="Benchmark 1" title="SWE-Bench Verified" thesis="This benchmark looks most like real coding-agent behavior: real repository, real issue, patch generation, and tests as the judge." image="/SWEBench.svg" printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="Initial" value="17%" />
            <StatCard label="Final" value="53%" />
          </div>
        </SlideFrame>
      );

    // Slide 16
    case 15:
      return (
        <SlideFrame slideNumber={16} eyebrow="Benchmark 2" title="LiveCodeBench" thesis="The paper reports 65% to 71% on a 50-problem random sample, but difficulty mix matters enough that the result is not cleanly comparable to published leaderboard numbers." image="/lcb.svg"printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="Initial" value="65%" />
            <StatCard label="Final" value="71%" />
          </div>
        </SlideFrame>
      );

    // Slide 17
    case 16:
      return (
        <SlideFrame slideNumber={17} eyebrow="Benchmark 3" title="The synthetic Benchmark" thesis="File editing and symbol location are useful agent tasks, but they also strongly reward smart-edit and AST-based retrieval improvements, so gains here are less surprising." printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="File Editing" value="82% → 94%" />
            <StatCard label="Symbol Location" value="35% → 40%" />
          </div>
        </SlideFrame>
      );

    // Slide 18
    case 17:
      return (
        <SlideFrame slideNumber={18} eyebrow="Main Result" title="The improvement curve" thesis="The best evidence is not just that utility rises, but that each jump lines up with concrete scaffold changes like Smart Edit, summarization, verification, and symbol tools." image="/notes/immprovement.png" imageAlt="Improvement curve" printMode={printMode} />
      );

    // Slide 19
    case 18:
      return (
        <SlideFrame slideNumber={19} eyebrow="Benchmark Critique" title="Comparison to other benchmarks is hard" thesis="LiveCodeBench is sampled across different difficulty levels, the synthetic tasks are only used in this paper so this only leaves SWE-Bench Verified as a comparable benchmark." printMode={printMode}>
        </SlideFrame>
      );

    // Slide 20
    case 19:
      return (
        <SlideFrame slideNumber={20} eyebrow="Practical Critique" title="Compared with Anthropic’s simpler baseline, the absolute gain looks less dramatic" thesis="Anthropic reported about 49% on SWE-Bench Verified with a much leaner (file edit + bash tool) Sonnet-based Scaffold, so SICA’s 53% looks modest once you compare it to strong simple systems." image="/anthropic.webp" imageWrapperClassName="mx-auto w-1/2" printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="SICA Final" value="53%" />
            <StatCard label="Anthropic Sonnet" value="~49%" />
          </div>
        </SlideFrame>
      );

    // Slide 21
    case 20:
      return (
        <SlideFrame slideNumber={21} eyebrow="Claim Narrowing" title="The reasoning benchmarks barely move" thesis="On AIME 2024 and GPQA Diamond, SICA provides little improvement, which suggests the loop helps most when orchestration and tool use matter more than raw reasoning." image="/reasoning_performance.png" printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
          </div>
        </SlideFrame>
      );

    // Slide 22
    case 21:
      return (
        <SlideFrame slideNumber={22} eyebrow="Sharper Critique" title="The scaffold is the bottleneck, and the agent learns to undo it" thesis="My strongest hypothesis is that the initial scaffold hurts performance enough that part of SICA’s success comes from removing unnecessary prompt and tool overhead." image="/notes/agents_md.png" imageAlt="Agents md chart" image2="/notes/context alone hurts performance.png" image2Alt="Context clutter chart" printMode={printMode} sourceLinks={[{ label: "Agents MD", href: "https://arxiv.org/pdf/2602.11988" }, { label: "Context Length Alone Hurts LLM Performance", href: "https://arxiv.org/pdf/2510.05381v1" }]} />
      );

    // Slide 23
    case 22:
      return (
        <SlideFrame slideNumber={23} eyebrow="Discussion" title="Are we overfitting to the Benchmarks?" thesis="A static benchmark suite with task-aligned utilities creates a real risk that the loop is learning the evaluation setup rather than discovering broadly transferable improvements."  printMode={printMode}>

        </SlideFrame>
      );

    // Slide 24
    case 23:
      return (
        <SlideFrame slideNumber={24} eyebrow="Current Context" title="The paper already looks somewhat dated against newer coding systems" thesis="Even if SICA is first in its exact category, the practical coding-agent landscape moved quickly enough that the paper now looks stronger as a conceptual milestone than as a current-state system result."  image="/alternative.png"printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
          </div>
        </SlideFrame>
      );

    // Slide 25
    case 24:
      return (
        <SlideFrame slideNumber={25} eyebrow="Future Work" title="Future Work" thesis="The next serious step is to combine scaffold evolution with model adaptation, leaner baselines, and dynamic benchmarks that cannot be overfit as easily."  printMode={printMode}>
          
           <div className="mt-[1vh] grid max-w-[64rem] grid-cols-2 gap-[1vw]">
              <StatCard label="Scaffold Evolution + Model Adaptation" value="Update Weights And Scaffold" />
              <StatCard label="Better Benchmarks" value="Comparable Benchmarks" />
              <StatCard label="Dynamic Benchmarks" value="Dynamicially adapt Benchmarks alongside Agent" />
          </div>
        </SlideFrame>
      );

    // Slide 26
    case 25:
      return (
        <SlideFrame slideNumber={26} eyebrow="Conclusion" title="Conclusion" wide printMode={printMode}>
          <div className="mx-auto mt-[1vh] grid max-w-[70rem] grid-cols-2 justify-items-center gap-[1vw]">
            {[
              { title: "Method", image: "/sica_loop.svg", alt: "Method visual from slide 7", target: 6 },
              { title: "Benchmarks", image: "/Benchmark.png", alt: "Benchmark visual from slide 14", target: 13 },
              { title: "Improvement", image: "/notes/immprovement.png", alt: "Improvement visual from slide 18", target: 17 },
              { title: "Current Context", image: "/alternative.png", alt: "Visual from slide 24", target: 23 },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => onNavigate?.(item.target)}
                disabled={printMode || !onNavigate}
                className="flex w-full max-w-[32rem] cursor-pointer flex-col items-start overflow-hidden rounded-xl border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.78)] p-[0.8vw] text-left shadow-[0_8px_24px_rgba(102,73,255,0.06)] transition-all duration-200 ease-out hover:-translate-y-[2px] hover:border-[rgba(102,73,255,0.3)] disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:border-[rgba(102,73,255,0.12)]"
              >
                <div className="mb-[0.6vh] font-mono text-[clamp(0.58rem,0.72vw,0.7rem)] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                  {item.title}
                </div>
                <img src={item.image} alt={item.alt} className="block h-[22vh] w-full rounded-lg object-contain" />
              </button>
            ))}
          </div>
        </SlideFrame>
      );

    // Slide 27
    case 26:
      return (
        <SlideFrame slideNumber={27} eyebrow="Backup 1" title="Utility Function" thesis="The paper scores agents with a weighted utility over benchmark score, time, and cost, then applies a timeout penalty." image="/notes/utility function.png" imageAlt="Utility function equation" appendix printMode={printMode} />
      );

    // Slide 28
    case 27:
      return (
        <SlideFrame slideNumber={28} eyebrow="Backup 2" title="Algorithm" thesis="Algorithm 1 gives the clean high-level loop: select the best archived agent, let it edit the codebase, evaluate, archive, and repeat." image="/notes/algorithm.png" imageAlt="Algorithm screenshot" appendix printMode={printMode} />
      );

    // Slide 29
    case 28:
      return (
        <SlideFrame slideNumber={29} eyebrow="Backup 3" title="Benchmark Results" thesis="Table 1 is the compact view of the full run: synthetic tasks move a lot, SWE-Bench Verified rises materially, and LiveCodeBench improves more modestly." appendix wide printMode={printMode}>
          <div className="mx-auto mt-[1vh] w-full max-w-[74rem]">
            <CompactTable
              headers={["Iter", "File", "Sym", "SWE-Bv", "LCB", "Cost", "Time", "Tokens", "% Cached"]}
              rows={[
                ["0", "0.82", "0.35", "0.17", "0.65", "1.91", "130.2", "0.24", "32.5"],
                ["1", "0.87", "0.32", "0.14", "0.62", "1.71", "123.8", "0.24", "33.6"],
                ["2", "0.92", "0.31", "0.17", "0.58", "2.45", "151.4", "0.26", "34.3"],
                ["3", "0.82", "0.33", "0.22", "0.64", "1.84", "126.9", "0.29", "31.9"],
                ["4", "0.88", "0.31", "0.38", "0.54", "2.70", "148.3", "0.26", "30.9"],
                ["5", "0.89", "0.31", "0.30", "0.59", "2.17", "134.8", "0.23", "36.9"],
                ["6", "0.96", "0.31", "0.37", "0.64", "2.21", "134.1", "0.25", "36.1"],
                ["7", "0.92", "0.35", "0.33", "0.58", "2.15", "134.9", "0.23", "38.2"],
                ["8", "0.93", "0.33", "0.27", "0.64", "2.03", "128.5", "0.26", "36.4"],
                ["9", "0.88", "0.40", "0.47", "0.61", "2.03", "126.3", "0.27", "38.3"],
                ["10", "0.87", "0.41", "0.46", "0.66", "1.77", "107.0", "0.22", "40.9"],
                ["11", "0.89", "0.43", "0.44", "0.70", "2.25", "129.6", "0.27", "36.9"],
                ["12", "0.91", "0.38", "0.44", "0.64", "1.58", "103.9", "0.26", "39.0"],
                ["13", "0.86", "0.40", "0.27", "0.61", "1.66", "113.3", "0.29", "37.2"],
                ["14", "0.94", "0.34", "0.53", "0.67", "2.20", "117.1", "0.25", "37.2"],
                ["15", "0.91", "0.40", "0.51", "0.71", "1.70", "114.5", "0.30", "36.3"],
              ]}
            />
          </div>
        </SlideFrame>
      );

    // Slide 30
    case 29:
      return (
        <SlideFrame slideNumber={30} eyebrow="Backup 4" title="All Discovered Improvements" thesis="Section D shows that most of the discovered changes are tooling and harness optimizations around editing, summarization, verification, and symbol lookup." appendix wide printMode={printMode}>
          <div className="mx-auto mt-[1vh] grid w-full max-w-[74rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="1" body="Smart Editor: pick the right edit strategy for the change." />
            <InfoCard title="2" body="Quick Overwrite Tool: reduce token-heavy full overwrites." />
            <InfoCard title="3" body="Diff-Enhanced Smart Editor: smarter diff and pattern editing." />
            <InfoCard title="4" body="Simplified DiffVerifier Tests: improve maintainability." />
            <InfoCard title="5" body="Code Context Summarizer: summarize code context with ripgrep." />
            <InfoCard title="6" body="SmartEditor Input Normalizer: improve edit reliability." />
            <InfoCard title="7" body="Enhanced File Edit Verification: track file state more carefully." />
            <InfoCard title="8" body="Minimal Diff Output Optimization: shrink diff context." />
            <InfoCard title="9" body="AST Symbol Locator: add AST-based navigation." />
            <InfoCard title="10" body="Optimized File Edit Routing: route file tasks explicitly in MainAgent." />
            <InfoCard title="11" body="Enhanced File Size Optimization: threshold large files around 100 KB." />
            <InfoCard title="12" body="Hybrid Symbol Locator: combine ripgrep candidates with AST verification." />
            <InfoCard title="13" body="Context-Sensitive Diff Minimization: use AST or pattern-aware diff context." />
            <InfoCard title="14" body="Optimized AST Parsing in Hybrid Symbol Locator: parse only relevant regions." />
          </div>
        </SlideFrame>
      );

    // Slide 31
    case 30:
      return (
        <SlideFrame slideNumber={31} eyebrow="Backup 5" title="Agent Prompt Context" thesis="The system prompt screenshot makes the prompt surface visible: tools, sub-agents, instructions, and context scaffolding are all loaded before the agent even starts work." image="/notes/system prompt.png" imageAlt="System prompt screenshot" appendix printMode={printMode} />
      );

    // Slide 32
    case 31:
      return (
        <SlideFrame slideNumber={32} eyebrow="Backup 6" title="Main Agent Prompt" thesis="The top-level agent is mostly a router: it delegates, preserves the problem statement, and coordinates sub-agents rather than doing the substantive work itself." appendix wide printMode={printMode}>
          <div className="mx-auto mt-[1vh] w-full max-w-[74rem]">
            <CodePanel
              title="Appendix A: Main Agent Prompt"
              body={`Your task is to orchestrate sub-agents in order to solve the problem. Here is the problem to solve: 
Problem Statement ============================================================== 
{problem\_statement} 
End Problem Statement ========================================================== 
You must now delegate this problem to one, two or however many agents are required to thoroughly solve the problem. Ensure you relay the problem statement accurately and completely to the agent. Sub-agents will have access to the problem statement too, and so it should rarely be necessary to write it out verbatim. In particular, if the problem statement is very long, you should explicitly NOT write it out again in full. Instead, just give clear direction, and trust that the sub-agent can also refer to the problem statement. You have been given access to file and directory viewing tools, since these can help you get your bearings

and direct sub-agents more effectively. These are however meant to help you understand the context in which you operate. You are intentionally not directly equipped with any tools to conduct substantive work, because you are just the router, delegator and orchestrator. The tools that your sub-agents' have available are however listed, and you should carefully refer to these when considering which agent to call next. It is these sub-agents' job to make the necessary state changes to make progress on the task at hand.`}
            />
          </div>
        </SlideFrame>
      );

    // Slide 33
    case 32:
      return (
        <SlideFrame slideNumber={33} eyebrow="Backup 7" title="Sub-Agent Prompt" thesis="The worker prompt is opinionated and procedural: understand context first, make minimal edits, test end to end, and clean up after the change." appendix wide printMode={printMode}>
          <div className="mx-auto mt-[1vh] w-full max-w-[74rem]">
            <CodePanel
              title="Appendix A.1: Base Sub-Agent Prompt"
              body={`As a professional and experienced programmer, your approach is to: 
1. slow down and don't write files fully end-to-end in one go 
2. first understand your context thoroughly: 
2.1 explore the project to locate all the files that could be useful documentation (README.md files, common likely MD documentation files, etc) 
2.2 view each of these files, making notes or summaries, and closing irrelevant or long files 
2.3 explore the codebase as it relates to your instructions: find all relevant files, in order to identify existing design patterns and conventions 
3. (optional) prototype and design before starting coding 
3.1 come up with some simple toy examples in a testing directory 
3.2 use execution feedback to benchmark or compare the approaches 
3.3 synthesise the information and learnings into a final design or solution 
4. make code edits 
4.1 identify the most minimal and effective ways to make your required changes 
4.2 observe any existing stylistic conventions 
5. test end-to-end 5.1 Prefer end-to-end testing in testing scripts without test frameworks 
5.2 If this is not an option or the project already uses a testing framework, then use that 
5.3 Ensure your code is valid, hasn't introduced any regressions and works as intended 
6. Clean up after yourself 
6.1 Check that all the documentation is still up to date after your changes 
6.2 Clean up any temporary files or changes 

NOTE: - don't create virtual environments - avoid pytest and mocks if you can; prefer end-to-end scripts - if the request is clearly exploratory in nature, then you may bypass the rigorous procedure above, and address it appropriately - call your reasoning agent if you are stuck on a tricky algorithmic or mathematical problem, to help you gain insight and make progress`}
            />
          </div>
        </SlideFrame>
      );

    // Slide 34
    case 33:
      return (
        <SlideFrame slideNumber={34} eyebrow="Backup 8" title="Overseer Prompt" thesis="The overseer is a separate policy layer watching execution traces and deciding whether to steer, warn, or cancel agents." appendix wide printMode={printMode}>
          <div className="mx-auto mt-[1vh] w-full max-w-[74rem]">
            <CodePanel
              title="Appendix A.2: Overseer Prompt"
              body={`You are an expert system overseer responsible for monitoring agent execution in real-time. You will be shown execution traces as they develop and must make decisions about whether intervention is needed. You are running in a loop. 
                
Your task is to: 
1. Analyze the current execution state 
2. Determine if you have enough information to make confident assessments 
3. Evaluate whether agents are progressing healthily or need intervention 
4. Provide thoughtful and constructive steering notifications to running agents if intervention is needed 
5. In extreme cases, cancel the execution of an agent and notify its parent of why this is 
6. Leave notes for future evaluation iterations if needed 

You must provide your analysis in the following structured format: 


OVERSEER\_EXAMPLES 

Here is the current execution trace: 

graph\_repr 

Previous overseer notes (if any) 
self.\_previous\_notes if self.\_previous\_notes else 'No notes.' 

Key considerations: 
- Agents that have already returned cannot receive notifications 
- Look at timestamps and event counts to understand execution progress 
- Some agents may legitimately take long periods to complete 
- Consider both local agent health and global execution progress 
- If the agent appears stuck without terminating, remind it that it can exit by generating <COMPLETE>{COMPLETE\_STOP\_TOKEN} 
- If, when the agent has been tasked to work on its own code at meta-improvement time, it is attempting to test tools or other features directly (using its own running code), intervene immediately and tell it to either test a new agent end-to-end (python -m workdir.agent -p "<some prompt>"...) or to create test scripts to test the tools directly. 
- You may cancel an agent if it is no longer making progress, wasting resources, or very clearly going down the wrong path or deviating from its instructions. You must make at least one attempt to notify the agent of its wrongdoings before issuing a cancellation command. 
- When canceling an agent, you must also notify its parent calling agent of the reasons for the cancellation. 
- If the task becomes untenable, after multiple failed attempts, and the agent is appearing to repeat itself, instruct the main agent to use its early\_exit tool to exit early. 
- Use cancellations sparingly, as they are disruptive and ultimately more costly than guiding the agent to successful completion, since any new sub-agent will often have to start the task from scratch. 

The last time you checked was at: self.\_last\_check\_time.strftime("%H:%M:%S") if self.\_last\_check\_time else "N/A" 

The current timestamp is datetime.now().strftime("%H:%M:%S") 


Your analysis:`}
            />
          </div>
        </SlideFrame>
      );

    // Slide 35
    case 34:
      return (
        <SlideFrame slideNumber={35} eyebrow="Backup 9" title="Example Trace" thesis="Appendix B shows the kind of multi-agent execution tree the system actually produces: reasoning, problem solving, coding, debugging, verification, and final submission." appendix wide printMode={printMode}>
          <div className="mx-auto mt-[1vh] w-full max-w-[74rem]">
            <CodePanel
              title="Appendix B: Representative Execution Tree"
              body={`1 main [agent_b8845adf] (134.4s | 95752 tokens (cached 0.57%) | $0.185 | Success)
   [Stats] Events: 1 tool calls, 6 messages
   [Assistant] t+0.1s | "I'll orchestrate the solution to this problem foll..."
   1.3 reasoning_agent [agent_20fccbc1] (12.0s | 5673 tokens (cached 0.00%) | $0.013 | Success)
      [Stats] Events: 1 messages
      [Assistant] t+9.8s | "Below is an explanation that addresses the three p..."
   [Assistant] t+21.1s | "The reasoning agent has provided excellent analy..."
   1.2 solve_problem [agent_11804c1f] (17.6s | 54822 tokens (cached 0.68%) | $0.085 | Success)
      [Stats] Events: 3 tool calls, 4 messages
      [Assistant] t+26.1s | "Let me solve this step by step.1. UNDERSTANDING..."
      [Tool] calculate | 0.0s → Success
      [Assistant] t+32.4s | "Therefore there are floor(404.8) = 404 complete..."
      [Tool] return_result | 0.0s → Success
      [Assistant] t+42.1s | "<COMPLETE></COMPLETE>..."
   [Assistant] t+43.7s | "The problem solver has provided a solution..."
   1.1 software_developer [agent_0117a7ef] (69.7s | 208122 tokens (cached 0.68%) | $0.321 | Success)
      [Stats] Events: 8 tool calls, 10 messages
      [Assistant] t+49.3s | "I'll help solve this mathematical game problem thr..."
      [Tool] execute_command | 0.0s → Success
      [Assistant] t+54.6s | "<TOOL_CALL><TOOL_NAME>start_lsp_server</TOOL_NA..."
      [Tool] start_lsp_server | 2.2s → Success
      [Assistant] t+59.9s | "Now let's create our main implementation file:..."
      [Tool] overwrite_file | 0.0s → Success
      [Assistant] t+70.4s | "Now let's create a test script to verify our imp..."
      [Tool] overwrite_file | 0.0s → Success
      [Assistant] t+76.8s | "Now let's run our test script to verify everythi..."
      [Tool] execute_command | 0.0s → Success
      [Assistant] t+80.9s | "I notice that there's an issue with our pattern..."
      1.1.1 reasoning_agent [agent_8a69d943] (11.3s | 10231 tokens (cached 0.00%) | $0.017 | Success)
         [Stats] Events: 1 messages
         [Assistant] t+87.2s | "The problem comes from our backward induction func..."
      [Assistant] t+98.5s | "Based on the reasoning agent's analysis, let's u..."
      [Tool] overwrite_file | 0.0s → Success
      [Assistant] t+107.8s | "Now let's run our test script again to verify th..."
      [Tool] execute_command | 0.0s → Success
      [Assistant] t+112.0s | "Perfect! Our implementation now correctly:1. I..."
      [Tool] return_result | 0.0s → Success
      [Assistant] t+116.8s | "<COMPLETE></COMPLETE>..."
   [Assistant] t+119.0s | "Let's verify the software agent's answer since it di..."
   1.4 reasoning_agent [agent_6cd34374] (5.0s | 12025 tokens (cached 0.00%) | $0.016 | Success)
      [Stats] Events: 1 messages
      [Assistant] t+124.1s | "Answer synthesis: Our analysis starts..."
   [Assistant] t+129.1s | "Let's submit our final answer:<TOOL_CALL><TO..."
   [Tool] submit_answer | 0.0s → Success
   [Assistant] t+132.1s | "<COMPLETE></COMPLETE>..."
Total Duration: 249.9s
Total Tokens: 407766 (of which cached 232952)
Total Cost: $0.712`}
            />
          </div>
        </SlideFrame>
      );

    // Slide 36
    case 35:
      return (
        <SlideFrame slideNumber={36} eyebrow="Backup 10" title="Agent And Tool Inventory" thesis="The starting scaffold is already a multi-agent system with role-specific tool bundles plus a shared set of auto-added control tools." appendix wide printMode={printMode}>
          <div className="mx-auto mt-[1vh] grid w-full max-w-[74rem] grid-cols-2 gap-[1vw]">
            <CodePanel title="main" body={`submit_answer
open_files
close_files
view_directory
meta_improvement_reasoning_structure
meta_improvement_review_committee
early_exit
regenerate_context
complete`} />
            <CodePanel title="software_developer" body={`calculate
view_directory
execute_command
ripgrep_search
open_files
close_files
overwrite_file
meta_improvement_review_committee
early_exit
regenerate_context
return_result
complete`} />
            <CodePanel title="general_problem_solver" body={`calculate
view_directory
execute_command
open_files
close_files
overwrite_file
ripgrep_search
meta_improvement_review_committee
early_exit
regenerate_context
return_result
complete`} />
            <CodePanel title="archive_explorer" body={`view_directory
open_files
close_files
best_problems
worst_problems
compare_agent_iterations
early_exit
regenerate_context
return_result
complete`} />
            <CodePanel title="reasoning_agent" body={`No explicit tools

early_exit
regenerate_context
return_result
complete`} />
          </div>
        </SlideFrame>
      );

    default:
      return null;
  }
}

function NotesList({ currentIndex }: { currentIndex: number }) {
  const slideNumber = currentIndex + 1;
  const notes = speakerNotesBySlide[slideNumber] ?? [];

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-[rgba(18,18,18,0.08)] bg-[rgba(255,252,247,0.92)] shadow-[0_20px_60px_rgba(18,18,18,0.08)]">
      <div className="border-b border-[rgba(18,18,18,0.08)] px-6 py-5">
        <div className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Speaker Notes</div>
        <h1 className="m-0 mt-2 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1] text-[var(--ink)]">
          Slide {slideNumber}
        </h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {notes.length ? (
          <div className="flex flex-col gap-3">
            {notes.map((line, index) => {
              const leadingSpaces = line.length - line.trimStart().length;
              const indentLevel = Math.floor(leadingSpaces / 4);
              const isBullet = /^\s*-\s+/.test(line);
              const content = line.trimStart().replace(/^-\s+/, "");

              return (
                <div
                  key={`${slideNumber}-${index}`}
                  className="flex items-start gap-3"
                  style={{ paddingLeft: `${indentLevel * 1.1}rem` }}
                >
                  <span className={["mt-[0.45rem] block h-2 w-2 rounded-full", isBullet ? "bg-[var(--highlight)]" : "bg-transparent"].join(" ")} />
                  <p className="m-0 text-[1.02rem] leading-[1.65] text-[var(--ink-soft)]">{content}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-[rgba(18,18,18,0.14)] bg-[rgba(255,255,255,0.55)] px-5 py-4">
            <p className="m-0 font-serif text-[1rem] italic leading-[1.6] text-[var(--muted)]">
              No speaker notes for this slide in <code>res/speaker_notes.md</code>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SlidePreview({ currentIndex }: { currentIndex: number }) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-[rgba(18,18,18,0.08)] bg-[rgba(255,255,255,0.78)] shadow-[0_20px_60px_rgba(18,18,18,0.08)]">
      <div className="border-b border-[rgba(18,18,18,0.08)] px-6 py-5">
        <div className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Slide Preview</div>
        <p className="m-0 mt-2 text-[0.95rem] leading-[1.5] text-[var(--muted)]">
          This preview tracks the live slide index stored in RxDB and stays in sync with the presenter tab.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="flex h-full min-h-[18rem] items-start justify-center overflow-hidden rounded-[1.5rem] border border-[rgba(102,73,255,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,240,232,0.95))]">
          <div className="origin-top pt-4 [transform:scale(0.18)] sm:[transform:scale(0.24)] md:[transform:scale(0.32)] xl:[transform:scale(0.42)]">
            <div style={{ width: `${PREVIEW_WIDTH}px`, height: `${PREVIEW_HEIGHT}px` }}>
              {renderSlide(currentIndex, true)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotesView({
  currentIndex,
  setCurrentIndex,
}: {
  currentIndex: number;
  setCurrentIndex: SlideSetter;
}) {
  const slideNumber = currentIndex + 1;

  return (
    <main className="relative z-[1] min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] flex-col gap-4 sm:min-h-[calc(100vh-3rem)]">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[rgba(18,18,18,0.08)] bg-[rgba(255,252,247,0.88)] px-5 py-4 shadow-[0_12px_40px_rgba(18,18,18,0.06)] backdrop-blur-[10px]">
          <div>
            <div className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Notes View</div>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-display text-[clamp(1.4rem,2vw,2rem)] leading-none text-[var(--ink)]">Slide {slideNumber}</span>
              <a
                href="/presentation"
                className="rounded-full border border-[rgba(102,73,255,0.18)] bg-[rgba(255,255,255,0.8)] px-3 py-1 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--accent)] no-underline"
              >
                Open Presenter
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => index - 1)}
              className="rounded-full border border-[rgba(18,18,18,0.1)] bg-white px-4 py-2 font-mono text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink)] transition-colors hover:border-[rgba(102,73,255,0.28)] hover:text-[var(--accent)]"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => index + 1)}
              className="rounded-full border border-[rgba(102,73,255,0.18)] bg-[var(--accent)] px-4 py-2 font-mono text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
            >
              Next
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.35fr)]">
          <NotesList currentIndex={currentIndex} />
          <SlidePreview currentIndex={currentIndex} />
        </div>
      </div>
    </main>
  );
}

function PresentationView({
  currentIndex,
  setCurrentIndex,
}: {
  currentIndex: number;
  setCurrentIndex: SlideSetter;
}) {
  return (
    <main className="relative z-[1] min-h-screen overflow-hidden">
      <ProgressNav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      {renderSlide(currentIndex, false, (index) => setCurrentIndex(index))}
    </main>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "presentation";
    return getViewMode(window.location.pathname);
  });
  const printMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("print") === "1";
  const [currentIndex, setCurrentIndexState] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || printMode) return;

    const pathname = window.location.pathname;
    if (pathname !== "/presentation" && pathname !== "/notes") {
      window.history.replaceState({}, "", `/presentation${window.location.search}${window.location.hash}`);
      setViewMode("presentation");
    }
  }, [printMode]);

  useEffect(() => {
    if (typeof window === "undefined" || printMode) return;

    const onPopState = () => {
      setViewMode(getViewMode(window.location.pathname));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [printMode]);

  useEffect(() => {
    if (printMode) return;

    let unsubscribe: (() => void) | undefined;
    let disposed = false;

    void subscribeToCurrentSlide((index) => {
      if (disposed) return;
      setCurrentIndexState(clampIndex(index, TOTAL_SLIDES));
    }).then((cleanup) => {
      if (disposed) {
        cleanup();
        return;
      }
      unsubscribe = cleanup;
    });

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, [printMode]);

  const setCurrentIndex: SlideSetter = (value) => {
    setCurrentIndexState((previousIndex) => {
      const nextIndex = clampIndex(
        typeof value === "function" ? value(previousIndex) : value,
        TOTAL_SLIDES,
      );
      void setPersistedSlide(nextIndex);
      return nextIndex;
    });
  };

  useEffect(() => {
    if (printMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        setCurrentIndex((index) => index + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        setCurrentIndex((index) => index - 1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        setCurrentIndex(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        setCurrentIndex(TOTAL_SLIDES - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [printMode]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
      {printMode ? (
        <main className="relative z-[1] print-deck w-[13.333in]">
          <div className="bg-[var(--paper)]">
            {/* Slide 1 */}{renderSlide(0, true)}
            {/* Slide 2 */}{renderSlide(1, true)}
            {/* Slide 3 */}{renderSlide(2, true)}
            {/* Slide 4 */}{renderSlide(3, true)}
            {/* Slide 5 */}{renderSlide(4, true)}
            {/* Slide 6 */}{renderSlide(5, true)}
            {/* Slide 7 */}{renderSlide(6, true)}
            {/* Slide 8 */}{renderSlide(7, true)}
            {/* Slide 9 */}{renderSlide(8, true)}
            {/* Slide 10 */}{renderSlide(9, true)}
            {/* Slide 11 */}{renderSlide(10, true)}
            {/* Slide 12 */}{renderSlide(11, true)}
            {/* Slide 13 */}{renderSlide(12, true)}
            {/* Slide 14 */}{renderSlide(13, true)}
            {/* Slide 15 */}{renderSlide(14, true)}
            {/* Slide 16 */}{renderSlide(15, true)}
            {/* Slide 17 */}{renderSlide(16, true)}
            {/* Slide 18 */}{renderSlide(17, true)}
            {/* Slide 19 */}{renderSlide(18, true)}
            {/* Slide 20 */}{renderSlide(19, true)}
            {/* Slide 21 */}{renderSlide(20, true)}
            {/* Slide 22 */}{renderSlide(21, true)}
            {/* Slide 23 */}{renderSlide(22, true)}
            {/* Slide 24 */}{renderSlide(23, true)}
            {/* Slide 25 */}{renderSlide(24, true)}
            {/* Slide 26 */}{renderSlide(25, true)}
            {/* Slide 27 */}{renderSlide(26, true)}
            {/* Slide 28 */}{renderSlide(27, true)}
            {/* Slide 29 */}{renderSlide(28, true)}
            {/* Slide 30 */}{renderSlide(29, true)}
            {/* Slide 31 */}{renderSlide(30, true)}
            {/* Slide 32 */}{renderSlide(31, true)}
            {/* Slide 33 */}{renderSlide(32, true)}
            {/* Slide 34 */}{renderSlide(33, true)}
            {/* Slide 35 */}{renderSlide(34, true)}
            {/* Slide 36 */}{renderSlide(35, true)}
          </div>
        </main>
      ) : viewMode === "notes" ? (
        <NotesView currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      ) : (
        <PresentationView currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      )}
    </>
  );
}
