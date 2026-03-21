import { useEffect, useState, type ReactNode } from "react";

const TOTAL_SLIDES = 30;
const APPENDIX_START = 26;

function clampIndex(nextIndex: number, max: number) {
  return Math.max(0, Math.min(max - 1, nextIndex));
}

function UtilityVisual() {
  return (
    <svg viewBox="0 0 880 520" className="h-full w-full">
      <defs>
        <linearGradient id="utilityFill" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#6c52d1" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f2a562" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="840" height="480" rx="28" fill="#fcfbf8" />
      <text x="70" y="90" fill="#2a2240" fontSize="34" fontFamily="Georgia, serif">
        Utility is a weighted blend, not a pure accuracy metric
      </text>
      <text x="70" y="130" fill="#6c6780" fontSize="19" fontFamily="system-ui, sans-serif">
        Score gets 50%, but cost and time still control selection pressure
      </text>
      {[
        { label: "Benchmark score", value: 50, y: 185 },
        { label: "Cost efficiency", value: 25, y: 270 },
        { label: "Time efficiency", value: 25, y: 355 },
      ].map((bar) => (
        <g key={bar.label}>
          <text x="70" y={bar.y} fill="#44385f" fontSize="22" fontFamily="system-ui, sans-serif">
            {bar.label}
          </text>
          <rect x="290" y={bar.y - 24} width="470" height="34" rx="17" fill="#ede8fb" />
          <rect x="290" y={bar.y - 24} width={4.7 * bar.value} height="34" rx="17" fill="url(#utilityFill)" />
          <text x="780" y={bar.y} fill="#2a2240" fontSize="22" fontFamily="Georgia, serif" textAnchor="end">
            {bar.value}%
          </text>
        </g>
      ))}
    </svg>
  );
}

function AgentRolesVisual() {
  const nodes = [
    { x: 330, y: 42, w: 220, h: 78, label: "Main Orchestrator", sub: "Routes work, synthesizes outputs" },
    { x: 70, y: 188, w: 220, h: 84, label: "Software Developer", sub: "Implements tools, edits code" },
    { x: 330, y: 188, w: 220, h: 84, label: "General Problem Solver", sub: "Handles benchmark tasks directly" },
    { x: 590, y: 188, w: 220, h: 84, label: "Archive Explorer", sub: "Finds what improved and failed" },
    { x: 200, y: 348, w: 220, h: 84, label: "Design Reviewer", sub: "Critiques candidate changes" },
    { x: 460, y: 348, w: 220, h: 84, label: "Reasoning Agent", sub: "o3-mini support on hard reasoning" },
  ];
  return (
    <svg viewBox="0 0 880 500" className="h-full w-full">
      <rect x="18" y="18" width="844" height="464" rx="28" fill="#fcfbf8" />
      <text x="50" y="70" fill="#2a2240" fontSize="34" fontFamily="Georgia, serif">
        SICA starts as a multi-agent organization chart
      </text>
      <text x="50" y="108" fill="#6c6780" fontSize="18" fontFamily="system-ui, sans-serif">
        Each role adds prompt text, tool docs, state, and control tokens to the total harness
      </text>
      <path d="M440 120 L440 158" stroke="#6c52d1" strokeWidth="4" strokeLinecap="round" />
      <path d="M180 272 L180 330 L310 330" stroke="#6c52d1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M440 272 L440 330" stroke="#6c52d1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M700 272 L700 330 L570 330" stroke="#6c52d1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M440 158 L180 158 L180 188" stroke="#6c52d1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M440 158 L700 158 L700 188" stroke="#6c52d1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M440 158 L440 188" stroke="#6c52d1" strokeWidth="3" fill="none" strokeLinecap="round" />
      {nodes.map((node, index) => (
        <g key={node.label}>
          <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="24" fill={index === 0 ? "#6c52d1" : "#ffffff"} stroke="#6c52d1" strokeWidth="2" />
          <text x={node.x + 18} y={node.y + 30} fill={index === 0 ? "#fff8ef" : "#2a2240"} fontSize="23" fontFamily="Georgia, serif">
            {node.label}
          </text>
          <text x={node.x + 18} y={node.y + 56} fill={index === 0 ? "rgba(255,248,239,0.86)" : "#6c6780"} fontSize="15" fontFamily="system-ui, sans-serif">
            {node.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

function OverseerVisual() {
  return (
    <svg viewBox="0 0 880 500" className="h-full w-full">
      <rect x="18" y="18" width="844" height="464" rx="28" fill="#fcfbf8" />
      <text x="48" y="72" fill="#2a2240" fontSize="34" fontFamily="Georgia, serif">
        An asynchronous overseer checks the run every 30 seconds
      </text>
      <text x="48" y="108" fill="#6c6780" fontSize="18" fontFamily="system-ui, sans-serif">
        It can notify, steer, or cancel agents that drift, loop, or test changes incorrectly
      </text>
      <circle cx="440" cy="140" r="72" fill="#f0ebfe" stroke="#6c52d1" strokeWidth="4" />
      <text x="440" y="134" textAnchor="middle" fill="#2a2240" fontSize="26" fontFamily="Georgia, serif">
        Overseer
      </text>
      <text x="440" y="164" textAnchor="middle" fill="#6c6780" fontSize="15" fontFamily="system-ui, sans-serif">
        monitor • notify • cancel
      </text>
    </svg>
  );
}

function BenchmarkVisual() {
  return (
    <svg viewBox="0 0 880 500" className="h-full w-full">
      <rect x="18" y="18" width="844" height="464" rx="28" fill="#fcfbf8" />
      <text x="50" y="74" fill="#2a2240" fontSize="34" fontFamily="Georgia, serif">
        The paper mixes three benchmark styles
      </text>
      <text x="50" y="112" fill="#6c6780" fontSize="18" fontFamily="system-ui, sans-serif">
        Each one supports a different strength of claim
      </text>
      {[
        { x: 58, y: 168, w: 236, title: "SWE-Bench Verified", body: "real repositories, real issues, patch judged by tests", color: "#6c52d1" },
        { x: 322, y: 168, w: 236, title: "LiveCodeBench", body: "coding-problem benchmark with easy / medium / hard mix", color: "#f2a562" },
        { x: 586, y: 168, w: 236, title: "Synthetic tasks", body: "file editing and symbol lookup shaped around agent tools", color: "#2d8b79" },
      ].map((card) => (
        <g key={card.title}>
          <rect x={card.x} y={card.y} width={card.w} height="176" rx="24" fill="#ffffff" stroke={card.color} strokeWidth="3" />
          <rect x={card.x} y={card.y} width={card.w} height="16" rx="8" fill={card.color} />
          <text x={card.x + 20} y={card.y + 58} fill="#2a2240" fontSize="24" fontFamily="Georgia, serif">
            {card.title}
          </text>
          <text x={card.x + 20} y={card.y + 96} fill="#6c6780" fontSize="17" fontFamily="system-ui, sans-serif">
            {card.body}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PromptingTimelineVisual({ activeStep = 4 }: { activeStep?: 1 | 2 | 3 | 4 }) {
  const steps = [
    { label: "Prompting", label2: "LLM Directly", sub: "Zero-shot, few-shot" },
    { label: "Prompt", label2: "Engineering", sub: "Chain-of-thought" },
    { label: "Self-Improving", label2: "Agent", sub: "Automated scaffold search" },
  ];
  const stepWidth = 160;
  const stepHeight = 100;
  const gap = 40;
  const startX = 30;
  const startY = 60;
  
  return (
    <svg viewBox="0 0 850 250" className="h-full w-full">
      <rect x="0" y="0" width="850" height="250" rx="20" fill="#fcfbf8" />
      
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
      
      {/* Arrow at the end */}
      <polygon 
        points={`${startX + (stepWidth + gap) * 2 + stepWidth / 2 + 12},${startY + stepHeight + 25} ${startX + (stepWidth + gap) * 2 + stepWidth / 2},${startY + stepHeight + 18} ${startX + (stepWidth + gap) * 2 + stepWidth / 2},${startY + stepHeight + 32}`}
        fill="#ff4987"
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

function SlideFrame({
  slideNumber,
  eyebrow,
  title,
  byline,
  thesis,
  visual,
  image,
  imageAlt,
  image2,
  image2Alt,
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
  image2?: string;
  image2Alt?: string;
  appendix?: boolean;
  printMode?: boolean;
  children?: ReactNode;
  sourceLinks?: { label: string; href: string }[];
}) {
  const hasVisual = !!(visual || image || image2);
  return (
    <section
      className={[
        "relative flex items-center justify-center",
        printMode ? "print-slide h-[7.5in] w-[13.333in] overflow-hidden break-after-page px-8 py-6" : "min-h-screen w-full px-[5vw] py-[4vh]",
      ].join(" ")}
    >
      <div className={["absolute inset-y-0 left-0 w-[5px]", appendix ? "bg-[var(--muted)] opacity-40" : "bg-[var(--accent)]"].join(" ")} />
      <div className={["grid w-full max-w-[1600px] gap-[3vw] pl-6", hasVisual ? "grid-cols-1 items-start lg:grid-cols-[1.1fr_0.9fr]" : "max-w-[900px] grid-cols-1"].join(" ")}>
        <div className="flex flex-col gap-[1.5vh]">
          <span className="font-mono text-[clamp(0.6rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.15em] text-[var(--accent)]">
            No. {String(slideNumber).padStart(2, "0")}
          </span>
          <hr className="h-[3px] w-[60px] border-0 bg-[var(--accent)]" />
          {eyebrow ? <p className="font-mono text-[clamp(0.65rem,0.9vw,0.85rem)] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{eyebrow}</p> : null}
          <h2 className={["m-0 max-w-[22ch] font-display text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.02em]", appendix ? "text-[var(--ink-soft)]" : "text-[var(--ink)]"].join(" ")}>
            {title}
          </h2>
          {byline ? <p className="m-0 font-mono text-[clamp(1rem,1.8vw,1.5rem)] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{byline}</p> : null}
          <hr className="max-w-[400px] border-0 border-t border-[rgba(18,18,18,0.15)]" />
          {thesis ? <p className="m-0 max-w-[56ch] font-serif text-[clamp(1rem,1.4vw,1.25rem)] italic leading-[1.5] text-[var(--ink-soft)]">{thesis}</p> : null}
          {children}
          {sourceLinks?.length ? <SourcePills links={sourceLinks} /> : null}
        </div>
        {hasVisual ? (
          <div className="flex flex-col gap-[1.5vh]">
            {visual ? <div className="mt-50 overflow-hidden rounded-xl border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.8)] p-[1vw] shadow-[0_8px_24px_rgba(102,73,255,0.06)] [&_svg]:max-h-[60vh] [&_svg]:w-full">{visual}</div> : null}
            {image ? <div className="mt-50 overflow-hidden rounded-xl border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.75)] p-[0.8vw] shadow-[0_8px_24px_rgba(102,73,255,0.06)]"><img src={image} alt={imageAlt ?? "Slide visual"} className="block max-h-[55vh] w-full rounded-lg object-contain" /></div> : null}
            {image2 ? <div className="mt-50 overflow-hidden rounded-xl border border-[rgba(102,73,255,0.12)] bg-[rgba(255,255,255,0.75)] p-[0.8vw] shadow-[0_8px_24px_rgba(102,73,255,0.06)]"><img src={image2} alt={image2Alt ?? "Secondary visual"} className="block max-h-[45vh] w-full rounded-lg object-contain" /></div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProgressNav({ currentIndex, setCurrentIndex }: { currentIndex: number; setCurrentIndex: (index: number) => void }) {
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

function renderSlide(slideIndex: number, printMode = false) {
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
            <StatCard label="improvement" value="Edit Agent Harness Code" />
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
        <SlideFrame slideNumber={3} eyebrow="Context" title="From Prompting strategies to Agent Harnesses" thesis="A lot of LLM progress comes from scaffolding rather than base-model changes, so automating scaffold design is an obvious next step." visual={<PromptingTimelineVisual activeStep={1} />} printMode={printMode} />
      );

    // Slide 4
    case 3:
      return (
        <SlideFrame slideNumber={4} eyebrow="Context" title="SICA arrives after years of prompt and scaffold tricks" thesis="Chain-of-thought, STaR, Tree of Thoughts, and self-refinement all support the same lesson: orchestration choices can matter nearly as much as model weights." visual={<PromptingTimelineVisual activeStep={2} />} printMode={printMode} />
      );

    // Slide 5
    case 4:
      return (
        <SlideFrame slideNumber={5} eyebrow="Context" title="What is actually new relative to ADAS and AlphaEvolve?" thesis="ADAS improves a separate target agent, while SICA makes the current best agent become the next improver, which is the paper’s core novelty claim." visual={<PromptingTimelineVisual activeStep={4} />} printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="ADAS" body="Fixed meta-agent, separate target agent, more constrained setting." />
            <InfoCard title="SICA" body="The improver and target collapse into one evolving coding-agent scaffold." />
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
        <SlideFrame slideNumber={7} eyebrow="Method Detail" title="The pseudocode makes the self-referential step explicit" thesis="Algorithm 1 shows the key move: at each iteration the best archived agent becomes the one that generates the next candidate." image="/notes/algorithm.png" imageAlt="Algorithm figure" printMode={printMode} />
      );

    // Slide 8
    case 7:
      return (
        <SlideFrame slideNumber={8} eyebrow="Objective" title="SICA does not optimize benchmark score alone" thesis="The utility function gives 50% weight to score and 25% each to cost and time, so infrastructure fixes count as improvement by design." visual={<UtilityVisual />} printMode={printMode} />
      );

    // Slide 9
    case 8:
      return (
        <SlideFrame slideNumber={9} eyebrow="Architecture" title="The starting point is already a staffed multi-agent company" thesis="SICA begins with multiple specialized roles, each carrying prompt logic, tool descriptions, and control overhead, so the base agent is not remotely minimal." visual={<AgentRolesVisual />} printMode={printMode} />
      );

    // Slide 10
    case 9:
      return (
        <SlideFrame slideNumber={10} eyebrow="Oversight" title="An overseer agent watches the run and can intervene" thesis="The overseer checks traces every 30 seconds, sends steering messages, and can cancel agents that loop or test changes incorrectly." visual={<OverseerVisual />} printMode={printMode} />
      );

    // Slide 11
    case 10:
      return (
        <SlideFrame slideNumber={11} eyebrow="Prompt Surface" title="The system prompt is already huge before the agent does any work" thesis="The context window already includes tool docs, sub-agent docs, problem statement, open files, directory tree, tool results, and overseer notifications." image="/notes/system prompt.png" imageAlt="System prompt figure" printMode={printMode} />
      );

    // Slide 12
    case 11:
      return (
        <SlideFrame slideNumber={12} eyebrow="Scaffold Critique" title="The base agent starts overloaded compared with lean coding harnesses" thesis="The initial system bundles many tools, roles, and prompt assumptions before self-improvement even begins, which makes self-repair a plausible interpretation of later gains." printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="empirical risk" body="A bloated baseline can make later improvements look larger than they would against a leaner harness." />
            <InfoCard title="interpretive risk" body="The story shifts from invention toward undoing an overbuilt starting scaffold." />
          </div>
        </SlideFrame>
      );

    // Slide 13
    case 12:
      return (
        <SlideFrame slideNumber={13} eyebrow="Core Critique" title="Too many tools and too much text may be the hidden baseline problem" thesis="If instruction-heavy, tool-rich harnesses degrade performance, then some of SICA’s measured gain may simply be the agent removing self-inflicted friction." image="/notes/code act vs. tool calls.png" imageAlt="CodeAct comparison" printMode={printMode} />
      );

    // Slide 14
    case 13:
      return (
        <SlideFrame slideNumber={14} eyebrow="Evaluation Setup" title="The evaluation story mixes strong and weak evidence" thesis="SWE-Bench Verified is the strongest benchmark in the paper, LiveCodeBench is harder to compare cleanly, and the synthetic tasks are the most benchmark-shaped." visual={<BenchmarkVisual />} printMode={printMode} />
      );

    // Slide 15
    case 14:
      return (
        <SlideFrame slideNumber={15} eyebrow="Benchmark 1" title="SWE-Bench Verified is the paper’s strongest empirical result" thesis="This benchmark looks most like real coding-agent behavior: real repository, real issue, patch generation, and tests as the judge."  printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="Initial" value="17%" />
            <StatCard label="Final" value="53%" />
          </div>
        </SlideFrame>
      );

    // Slide 16
    case 15:
      return (
        <SlideFrame slideNumber={16} eyebrow="Benchmark 2" title="LiveCodeBench improves, but the comparison protocol is messy" thesis="The paper reports 65% to 71% on a 50-problem random sample, but difficulty mix matters enough that the result is not cleanly comparable to published leaderboard numbers." printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="Initial" value="65%" />
            <StatCard label="Final" value="71%" />
          </div>
        </SlideFrame>
      );

    // Slide 17
    case 16:
      return (
        <SlideFrame slideNumber={17} eyebrow="Benchmark 3" title="The synthetic tasks reward the exact utilities the system later learns" thesis="File editing and symbol location are useful agent tasks, but they also strongly reward smart-edit and AST-based retrieval improvements, so gains here are less surprising." printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="File Editing" value="82% → 94%" />
            <StatCard label="Symbol Location" value="35% → 40%" />
          </div>
        </SlideFrame>
      );

    // Slide 18
    case 17:
      return (
        <SlideFrame slideNumber={18} eyebrow="Main Result" title="The improvement curve is most convincing as annotated agent engineering" thesis="The best evidence is not just that utility rises, but that each jump lines up with concrete scaffold changes like Smart Edit, summarization, verification, and symbol tools." image="/notes/immprovement.png" imageAlt="Improvement curve" printMode={printMode} />
      );

    // Slide 19
    case 18:
      return (
        <SlideFrame slideNumber={19} eyebrow="Interpretation" title="What actually improved was mostly the scaffold" thesis="The pattern of gains looks much more like automated agent engineering than like open-ended self-improvement in the strong sense." printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="short version" body="The agent gets better at being a practical coding harness, not at becoming generally self-improving in an unbounded way." />
            <InfoCard title="why that matters" body="That interpretation is narrower, but it is also much better supported by the evidence in the paper." />
          </div>
        </SlideFrame>
      );

    // Slide 20
    case 19:
      return (
        <SlideFrame slideNumber={20} eyebrow="Practical Critique" title="Compared with Anthropic’s simpler baseline, the absolute gain looks less dramatic" thesis="Anthropic reported about 49% on SWE-Bench Verified with a much leaner Sonnet-based harness, so SICA’s 53% looks modest once you compare it to strong simple systems."  printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="SICA Final" value="53%" />
            <StatCard label="Anthropic Sonnet" value="~49%" />
          </div>
        </SlideFrame>
      );

    // Slide 21
    case 20:
      return (
        <SlideFrame slideNumber={21} eyebrow="Claim Narrowing" title="The reasoning benchmarks barely move" thesis="On AIME 2024 and GPQA Diamond, SICA provides little improvement, which suggests the loop helps most when orchestration and tool use matter more than raw reasoning." printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="reading" body="SICA looks more like a coding-agent harness optimizer than a general recursive self-improvement mechanism." />
            <InfoCard title="evidence value" body="The weak result here is useful because it narrows the claim instead of supporting a universal story." />
          </div>
        </SlideFrame>
      );

    // Slide 22
    case 21:
      return (
        <SlideFrame slideNumber={22} eyebrow="Sharper Critique" title="The harness may be the bottleneck, and the agent may be learning to undo it" thesis="My strongest hypothesis is that the initial scaffold hurts performance enough that part of SICA’s success comes from removing unnecessary prompt and tool overhead." image="/notes/agents_md.png" imageAlt="Agents md chart" image2="/notes/context alone hurts performance.png" image2Alt="Context clutter chart" printMode={printMode} />
      );

    // Slide 23
    case 22:
      return (
        <SlideFrame slideNumber={23} eyebrow="Discussion" title="Are we seeing genuine gains or benchmark-local test-time learning?" thesis="A static benchmark suite with task-aligned utilities creates a real risk that the loop is learning the evaluation setup rather than discovering broadly transferable improvements."  printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="class question" body="What evidence would convince us that the discovered changes transfer beyond this benchmark and harness combination?" />
            <InfoCard title="missing evidence" body="The paper does not yet show a strong transfer story to unseen or dynamically generated tasks." />
          </div>
        </SlideFrame>
      );

    // Slide 24
    case 23:
      return (
        <SlideFrame slideNumber={24} eyebrow="Current Context" title="The paper already looks somewhat dated against newer coding systems" thesis="Even if SICA is first in its exact category, the practical coding-agent landscape moved quickly enough that the paper now looks stronger as a conceptual milestone than as a current-state system result."  printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="historical value" body="It may age well as a first self-editing scaffold paper." />
            <InfoCard title="practical value" body="It ages less well as a template for current frontier coding-agent design." />
          </div>
        </SlideFrame>
      );

    // Slide 25
    case 24:
      return (
        <SlideFrame slideNumber={25} eyebrow="Future Work" title="A stronger follow-up would jointly improve the model, the harness, and the evaluation" thesis="The next serious step is to combine scaffold evolution with model adaptation, leaner baselines, and dynamic benchmarks that cannot be overfit as easily."  printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="mechanism" body="Optimize the harness and the model together rather than freezing the model forever." />
            <InfoCard title="evaluation" body="Separate within-loop gains from external-transfer gains on fresher tasks." />
          </div>
        </SlideFrame>
      );

    // Slide 26
    case 25:
      return (
        <SlideFrame slideNumber={26} eyebrow="Verdict" title="I buy the loop. I do not yet buy the mythology." thesis="SICA is a real proof that an agent can edit its own scaffold and improve benchmark utility, but the best evidence points toward automated agent engineering, not broad open-ended recursive self-improvement." visual={<PromptingTimelineVisual activeStep={4} />} printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <StatCard label="Most Persuasive" value="Annotated scaffold gains" />
            <StatCard label="Biggest Caveat" value="Heavy starting harness" />
          </div>
        </SlideFrame>
      );

    // Slide 27
    case 26:
      return (
        <SlideFrame slideNumber={27} eyebrow="Appendix / Asset Bank" title="Reference slide: key figures to revisit while polishing the deck" thesis="Keep one place in the deck for the main visual evidence so you can quickly pull visuals into revised slides without re-reading the paper markdown each time." appendix visual={<PromptingTimelineVisual activeStep={4} />} printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="core figures" body="Loop figure, algorithm, utility, system prompt, and improvement curve." />
            <InfoCard title="workflow use" body="This appendix is for building and revising the talk, not for presenting in full." />
          </div>
        </SlideFrame>
      );

    // Slide 28
    case 27:
      return (
        <SlideFrame slideNumber={28} eyebrow="Appendix / Prompt Reference" title="Reference slide: the prompts show how heavily the behavior is already engineered" thesis="The appendix prompts do not read like a blank-slate agent. They read like a strongly opinionated workflow plus monitoring logic." appendix visual={<PromptingTimelineVisual activeStep={4} />} printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="main prompt" body="Delegates, routes, and constrains the system’s top-level behavior." />
            <InfoCard title="worker + overseer" body="Encodes coding workflow habits and defines when agents should be steered or canceled." />
          </div>
        </SlideFrame>
      );

    // Slide 29
    case 28:
      return (
        <SlideFrame slideNumber={29} eyebrow="Appendix / Tool Inventory" title="Reference slide: the tool inventory is already crowded before self-improvement" thesis="Showing the initial tool and role matrix makes the context-bloat critique concrete instead of merely stylistic." appendix visual={<PromptingTimelineVisual activeStep={4} />} printMode={printMode}>
          <div className="mt-[1vh] grid max-w-[32rem] grid-cols-2 gap-[1vw]">
            <InfoCard title="main point" body="Even the base agent is already a substantial engineered scaffold." />
            <InfoCard title="use case" body="Keep this as backup for pushback on the claim that the starting harness is overbuilt." />
          </div>
        </SlideFrame>
      );

    // Slide 30
    case 29:
      return (
        <SlideFrame slideNumber={30} eyebrow="Backup / Context Evidence" title="Reference slide: evidence that more instructions and more whitespace can hurt" thesis="There is direct empirical reason to suspect that instruction clutter and expanded context windows can harm model behavior." image="/notes/context rot.png" imageAlt="Context rot chart" image2="/notes/system prompt.png" image2Alt="System prompt context stack" appendix printMode={printMode} />
      );

    default:
      return null;
  }
}

export default function App() {
  const printMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("print") === "1";
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (printMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        setCurrentIndex((index) => clampIndex(index + 1, TOTAL_SLIDES));
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        setCurrentIndex((index) => clampIndex(index - 1, TOTAL_SLIDES));
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
      <main className={["relative z-[1]", printMode ? "print-deck w-[13.333in]" : "min-h-screen overflow-hidden"].join(" ")}>
        {!printMode ? (
          <>
            <ProgressNav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
            {renderSlide(currentIndex, false)}
          </>
        ) : (
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
          </div>
        )}
      </main>
    </>
  );
}
