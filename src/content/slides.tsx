import type { Slide } from "../types";

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
          <text
            x="70"
            y={bar.y}
            fill="#44385f"
            fontSize="22"
            fontFamily="system-ui, sans-serif"
          >
            {bar.label}
          </text>
          <rect
            x="290"
            y={bar.y - 24}
            width="470"
            height="34"
            rx="17"
            fill="#ede8fb"
          />
          <rect
            x="290"
            y={bar.y - 24}
            width={4.7 * bar.value}
            height="34"
            rx="17"
            fill="url(#utilityFill)"
          />
          <text
            x="780"
            y={bar.y}
            fill="#2a2240"
            fontSize="22"
            fontFamily="Georgia, serif"
            textAnchor="end"
          >
            {bar.value}%
          </text>
        </g>
      ))}

      <g transform="translate(70,410)">
        <rect width="700" height="52" rx="16" fill="#f5efe6" />
        <text x="24" y="33" fill="#5a4e3f" fontSize="18" fontFamily="system-ui, sans-serif">
          Hard caps: $10 cost ceiling per problem, 300s timeout, partial penalty on timed-out runs
        </text>
      </g>
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
          <rect
            x={node.x}
            y={node.y}
            width={node.w}
            height={node.h}
            rx="24"
            fill={index === 0 ? "#6c52d1" : "#ffffff"}
            stroke="#6c52d1"
            strokeWidth="2"
          />
          <text
            x={node.x + 18}
            y={node.y + 30}
            fill={index === 0 ? "#fff8ef" : "#2a2240"}
            fontSize="23"
            fontFamily="Georgia, serif"
          >
            {node.label}
          </text>
          <text
            x={node.x + 18}
            y={node.y + 56}
            fill={index === 0 ? "rgba(255,248,239,0.86)" : "#6c6780"}
            fontSize="15"
            fontFamily="system-ui, sans-serif"
          >
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

      {[
        { x: 120, y: 280, title: "Main agent", body: "orchestration state" },
        { x: 330, y: 320, title: "Developer", body: "tool testing + edits" },
        { x: 560, y: 320, title: "Archive explorer", body: "history analysis" },
        { x: 680, y: 240, title: "Reasoning agent", body: "hard subproblem" },
      ].map((node) => (
        <g key={node.title}>
          <rect x={node.x} y={node.y} width="170" height="84" rx="22" fill="#ffffff" stroke="#6c52d1" strokeWidth="2" />
          <text x={node.x + 18} y={node.y + 30} fill="#2a2240" fontSize="22" fontFamily="Georgia, serif">
            {node.title}
          </text>
          <text x={node.x + 18} y={node.y + 56} fill="#6c6780" fontSize="15" fontFamily="system-ui, sans-serif">
            {node.body}
          </text>
        </g>
      ))}

      {[
        { x1: 440, y1: 212, x2: 205, y2: 280 },
        { x1: 440, y1: 212, x2: 415, y2: 320 },
        { x1: 440, y1: 212, x2: 645, y2: 320 },
        { x1: 440, y1: 212, x2: 765, y2: 240 },
      ].map((arrow, index) => (
        <path
          key={index}
          d={`M${arrow.x1} ${arrow.y1} C ${arrow.x1} ${arrow.y1 + 70}, ${arrow.x2} ${arrow.y2 - 60}, ${arrow.x2} ${arrow.y2}`}
          stroke="#6c52d1"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ))}

      <rect x="56" y="408" width="768" height="44" rx="14" fill="#f5efe6" />
      <text x="78" y="436" fill="#5a4e3f" fontSize="17" fontFamily="system-ui, sans-serif">
        Important limitation: safety language is present, but the actual system is still weak and tightly bounded
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
        {
          x: 58,
          y: 168,
          w: 236,
          title: "SWE-Bench Verified",
          body: "real repositories, real issues, patch judged by tests",
          color: "#6c52d1",
        },
        {
          x: 322,
          y: 168,
          w: 236,
          title: "LiveCodeBench",
          body: "coding-problem benchmark with easy / medium / hard mix",
          color: "#f2a562",
        },
        {
          x: 586,
          y: 168,
          w: 236,
          title: "Synthetic tasks",
          body: "file editing and symbol lookup shaped around agent tools",
          color: "#2d8b79",
        },
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

      <text x="58" y="396" fill="#44385f" fontSize="22" fontFamily="Georgia, serif">
        Strongest claim: SWE-Bench. Weakest comparability: LiveCodeBench and synthetic tasks.
      </text>
    </svg>
  );
}

const slides: Slide[] = [
  {
    id: "title",
    eyebrow: "A Self-~Improving~ Healing Coding Agent",
    title: "A Self-Improving Coding Agent",
    thesis:
      "A critical reading of Robeyns et al. (2025): interesting proof of self-editing, but the biggest gains look more like scaffold cleanup than open-ended recursive intelligence.",
    bullets: [
      "Paper framing: first self-improving coding agent that edits its own Python scaffold.",
      "Talk framing: take the systems result seriously, but separate the engineering loop from the mythology.",
      "Seminar goal: understand what actually improved, what is benchmark-local, and where the claim narrows.",
      "Author line for the deck: Lorin Urbantat.",
    ],
    stats: [
      { label: "Published", value: "16 May 2025" },
      { label: "Paper", value: "arXiv:2504.15228" },
      { label: "Talk Length", value: "25-30 min" },
      { label: "Claim Under Review", value: "17% -> 53%" },
    ],
    image: "/notes/agent improvement.jpeg",
    imageAlt: "Main SICA meta-improvement loop figure",
    takeaway:
      "Start fair. If the audience trusts that you see the paper’s real contribution, the later critique lands as interpretation rather than as hostility.",
    citations: ["Robeyns et al. 2025", "https://arxiv.org/pdf/2504.15228"],
  },
  {
    id: "claim",
    eyebrow: "Claim",
    title: "What does the paper actually claim?",
    thesis:
      "A coding agent can edit its own codebase, benchmark itself, keep the best version in an archive, and improve measured utility over time without any weight updates.",
    bullets: [
      "The paper positions SICA as the first general-purpose self-improving coding agent rather than a narrow math or DSL optimizer.",
      "The headline result is a jump from 17% to 53% on a random subset of SWE-Bench Verified.",
      "Self-improvement here means code-level scaffold updates: tools, prompts, orchestration, context handling, and verification behavior.",
      "The loop is benchmark-driven. The reward signal does not come from user deployment or online environment feedback.",
      "This is a systems paper about agent harness optimization, not a paper about learned internal adaptation.",
    ],
    stats: [
      { label: "Weight Updates", value: "None" },
      { label: "Improvement Medium", value: "Python code edits" },
      { label: "Selection Unit", value: "Archived agent version" },
      { label: "Primary Result", value: "17% -> 53%" },
    ],
    takeaway:
      "That distinction matters for the entire talk: if the mechanism is scaffold search, then the right standard of evidence is different from the standard for broad recursive self-improvement.",
    citations: ["Abstract", "Section 1"],
  },
  {
    id: "why-care",
    eyebrow: "Context",
    title: "Why do people care about self-improving agents at all?",
    thesis:
      "Because a large amount of LLM progress in practice comes from scaffolding rather than base-model changes, and SICA asks whether the scaffold can optimize itself.",
    bullets: [
      "Agent performance often depends heavily on prompting strategies, decomposition, tool use, and orchestration policy.",
      "That makes manual agent design a search problem with a huge design space and a lot of human trial-and-error.",
      "If a good coding agent can rewrite prompts, tools, and control flow, then agent engineering itself becomes automatable.",
      "The promise is compounding improvement: later agents may become better improvers than earlier ones.",
      "The skeptical version of the same story is that you are only automating harness tuning for a static benchmark set.",
    ],
    sections: [
      {
        title: "Paper-level motivation",
        body:
          "The paper sits in the lineage from prompt engineering to automated prompt engineering to automated agent design.",
      },
      {
        title: "Critical tension",
        body:
          "A self-editing loop is genuinely interesting even if the final interpretation is narrower than the headline implies.",
      },
    ],
    takeaway:
      "This slide earns the right to discuss the paper seriously before you start taking it apart.",
    citations: ["Prompt Report", "ADAS", "Related Work"],
  },
  {
    id: "prompting-landscape",
    eyebrow: "Prompting Lineage",
    title: "SICA arrives after years of prompt and scaffold tricks",
    thesis:
      "Chain-of-thought, STaR, Tree of Thoughts, debate, and self-refinement all push the same broad lesson: orchestration choices can matter as much as model weights.",
    bullets: [
      "CoT showed that reasoning style can be elicited through prompt structure.",
      "STaR introduced a bootstrapping loop where models learn from successful reasoning traces.",
      "Tree of Thoughts and debate-style methods turn inference into structured search rather than a single forward pass.",
      "Prompt engineering matured into a systems discipline. SICA treats that discipline itself as target code.",
      "So the paper is not emerging from nowhere; it is an attempt to automate an already proven source of gains.",
    ],
    image: "/notes/agent archive.png",
    imageAlt: "ADAS figure showing archive-driven automated agent improvement",
    takeaway:
      "This is the right conceptual prehistory: SICA is best understood as automated scaffold search generalized into a coding-agent setting.",
    citations: ["CoT", "STaR", "Tree of Thoughts", "Prompt Report", "ADAS"],
  },
  {
    id: "novelty",
    eyebrow: "Novelty Claim",
    title: "What is actually new relative to ADAS and AlphaEvolve?",
    thesis:
      "ADAS improves a separate target agent. SICA removes that separation by letting the best archived agent become the next improver, which is the central novelty claim.",
    sections: [
      {
        title: "ADAS",
        body:
          "Fixed meta-agent, separate target agent, optimized in a constrained DSL and evaluated mostly on math/science settings.",
      },
      {
        title: "SICA",
        body:
          "The improving agent and target agent are the same object class. It edits its full Python codebase instead of a narrow forward function.",
      },
      {
        title: "AlphaEvolve",
        body:
          "Also uses iterative search over code, but in highly structured settings with cleaner evaluation, stronger constraints, and narrower problem classes.",
      },
      {
        title: "Interpretation",
        body:
          "SICA’s novelty is conceptual and architectural, not that it suddenly solves open-ended autonomous invention.",
      },
    ],
    takeaway:
      "Be precise here. If the audience sees the exact novelty, they will also understand the exact limits of the claim.",
    citations: ["ADAS", "AlphaEvolve", "Section 2"],
  },
  {
    id: "loop",
    eyebrow: "Method",
    title: "The SICA loop is simple in structure",
    thesis:
      "Start from a base coding agent, evaluate it, pick the current best archived agent, ask it for one improvement, benchmark the result, add it back to the archive, and repeat.",
    bullets: [
      "The archive stores both previous agents and their benchmark outcomes.",
      "Selection uses utility rather than raw accuracy, so faster and cheaper agents can beat more accurate but slower ones.",
      "Each improvement step is one concrete change proposal, not a wholesale redesign of the system.",
      "No learned weights are modified; everything happens through code, prompting, and tool scaffolding.",
      "The clean loop is one of the strongest parts of the paper because it makes the experimental story legible.",
    ],
    image: "/notes/agent improvement.jpeg",
    imageAlt: "Main loop figure showing archived agent improvement iterations",
    takeaway:
      "This is the picture to keep returning to throughout the talk. It grounds the later critique in a method the audience already understands.",
    citations: ["Figure 1", "Section 3"],
  },
  {
    id: "algorithm",
    eyebrow: "Method Detail",
    title: "The pseudocode makes the core difference with ADAS explicit",
    thesis:
      "Algorithm 1 shows the key move: at each iteration the best archived agent A-hat becomes the agent that generates the next candidate.",
    bullets: [
      "That means the improver is itself improving over time, at least in principle.",
      "This is the conceptual step that turns a normal meta-optimization loop into a self-referential one.",
      "The archive matters twice: it stores history, and it determines which agent gets the right to propose the next change.",
      "The method is elegantly compact even if the actual scaffold underneath is quite heavy.",
    ],
    image: "/notes/algorithm.png",
    imageAlt: "Algorithm 1 pseudocode",
    takeaway:
      "This slide usually helps when someone asks what is genuinely self-referential here rather than merely benchmark-driven.",
    citations: ["Algorithm 1"],
  },
  {
    id: "utility",
    eyebrow: "Objective",
    title: "SICA does not optimize benchmark score alone",
    thesis:
      "The utility function puts 50% weight on score and 25% each on cost and time, with hard caps at $10 per problem and 300 seconds.",
    bullets: [
      "This is a sensible engineering objective if you want practical agents rather than benchmark-only monsters.",
      "But it also changes how we should read the later gains: some improvements are rewarded because they are cheaper or faster, not because they are more capable.",
      "A scaffold can improve utility by deleting inefficiency or by reducing context overhead.",
      "That is one reason the term self-improvement sounds bigger than the measured objective actually is.",
    ],
    image: "/notes/utility function.png",
    imageAlt: "Utility function formula",
    visual: <UtilityVisual />,
    takeaway:
      "This is one of the most important slides for the critique. Once cost and time are in the objective, infrastructure fixes count as improvement by design.",
    citations: ["Equation 1", "Equation 2"],
  },
  {
    id: "roles",
    eyebrow: "Architecture",
    title: "The starting point is already a staffed multi-agent company",
    thesis:
      "SICA begins with six specialized roles, each carrying its own prompt logic, tool descriptions, and control overhead, which means the base agent is not remotely minimal.",
    bullets: [
      "Main orchestrator: delegates and synthesizes results.",
      "Software developer: edits code, runs commands, writes and debugs tools.",
      "General problem solver: benchmark-facing worker for non-tool-heavy tasks.",
      "Archive explorer: mines success and failure patterns across prior agents.",
      "Design reviewer and reasoning agent: additional critique and reasoning capacity.",
      "Every role expands the action space and inflates the system prompt/context surface.",
    ],
    visual: <AgentRolesVisual />,
    takeaway:
      "This is where the paper starts to look less like emergent autonomous design and more like a highly engineered scaffold learning to retune itself.",
    citations: ["Section 3.1", "Appendix prompts"],
  },
  {
    id: "overseer",
    eyebrow: "Oversight",
    title: "An overseer agent watches the whole run and can intervene",
    thesis:
      "The overseer is an asynchronous monitor that periodically checks execution traces, sends steering messages, and can cancel agents that loop or drift.",
    bullets: [
      "It runs every 30 seconds and monitors both local agent behavior and global progress.",
      "The prompt explicitly tells it to intervene if the agent tests meta-improvement features the wrong way.",
      "This adds a safety and control layer, but it also adds more system behavior hand-authored by the designers.",
      "The paper presents this as observability and governance, which is fair, but it also means the loop is not just 'agent edits itself and we watch what happens'.",
    ],
    visual: <OverseerVisual />,
    takeaway:
      "The more engineered control planes the system has, the harder it is to treat the final result as a pure demonstration of open-ended self-design.",
    citations: ["Overseer prompt", "Section 3.1"],
  },
  {
    id: "prompt-context",
    eyebrow: "Prompt Surface",
    title: "The system prompt is already huge before the agent does any work",
    thesis:
      "The context window includes system prompt material, tool documentation, sub-agent docs, the problem statement, open files, the directory tree, tool results, and overseer notifications.",
    bullets: [
      "The main prompt does not just say 'solve the task'. It encodes workflow, tool philosophy, cleanup habits, and testing preferences.",
      "Open files and the directory tree are auto-included, which is convenient but expensive in context budget.",
      "That means the base system is already making strong assumptions about how a good coding agent should behave.",
      "This matters because a later self-edit may just be undoing these initial design assumptions.",
    ],
    image: "/notes/system prompt.png",
    imageAlt: "System prompt and context window figure",
    takeaway:
      "This slide often makes the critique click for the audience because they can literally see the prompt surface that the model has to carry around.",
    citations: ["Section 3.1", "Appendix A", "Appendix C"],
  },
  {
    id: "base-scaffold",
    eyebrow: "Scaffold Critique",
    title: "The base agent starts overloaded compared with lean coding harnesses",
    thesis:
      "The initial system bundles file tools, shell, calculator, benchmark submission, sub-agent returns, archive analysis, an overseer, and multiple specialized roles before self-improvement even begins.",
    bullets: [
      "That is already a sophisticated scaffold with lots of moving parts and lots of text for the model to reason through.",
      "Your notes make the practical comparison well: modern coding agents like Claude Code or Codex-style harnesses often expose far fewer tools.",
      "If too many tools and too much context reduce model performance, SICA may partly be learning to escape its own starting handicap.",
      "This becomes the main interpretive hypothesis of the talk.",
    ],
    sections: [
      {
        title: "Why this matters empirically",
        body:
          "A poor starting harness can make later 'improvements' look bigger than they would against a leaner baseline.",
      },
      {
        title: "Why this matters rhetorically",
        body:
          "It shifts the claim from 'the agent invented major new capabilities' toward 'the agent repaired an overbuilt scaffold'.",
      },
    ],
    takeaway:
      "This slide is the bridge from description into critique. After this point, the audience has enough detail to evaluate the criticism seriously.",
    citations: ["Section 3.1", "Your notes"],
  },
  {
    id: "too-many-tools",
    eyebrow: "Core Critique",
    title: "Too many tools and too much text may be the hidden baseline problem",
    thesis:
      "If tool-rich, instruction-heavy harnesses degrade performance, then some of SICA’s measured gain may just be the agent removing self-inflicted friction rather than discovering fundamentally new abilities.",
    bullets: [
      "The starting scaffold exposes many tools and role boundaries, which increases decision complexity.",
      "The context includes open files, directory structure, and long prompt boilerplate, which can crowd out task-relevant information.",
      "CodeAct supports a related claim: code or bash as an action space can outperform verbose JSON/text action interfaces.",
      "A lean harness may already recover a lot of the gain without any self-referential improvement loop.",
    ],
    image: "/notes/code act vs. tool calls.png",
    imageAlt: "CodeAct comparison figure",
    takeaway:
      "This is one of the strongest interpretive slides in the whole deck. If the audience buys this, the paper’s headline gets substantially narrower.",
    citations: ["CodeAct 2024", "Your notes"],
  },
  {
    id: "benchmarks",
    eyebrow: "Evaluation Setup",
    title: "The evaluation story mixes strong and weak evidence",
    thesis:
      "SWE-Bench Verified is the most convincing benchmark in the paper, LiveCodeBench is harder to compare cleanly, and the synthetic tasks are the most benchmark-shaped.",
    bullets: [
      "SWE-Bench Verified looks like real software engineering: repository context, issue statement, patch generation, and test-based validation.",
      "LiveCodeBench is closer to coding contests and algorithmic task solving than to open-ended repository work.",
      "The synthetic tasks reward precisely the kinds of tools the system later adds, especially smart editing and symbol location.",
      "So the benchmark suite supports a real engineering story, but not a simple universal self-improvement story.",
    ],
    visual: <BenchmarkVisual />,
    takeaway:
      "Segmenting the evidence this way helps the audience keep separate what is strong, what is suggestive, and what is self-reinforcing.",
    citations: ["SWE-Bench Verified", "LiveCodeBench", "Synthetic benchmarks"],
  },
  {
    id: "swebench",
    eyebrow: "Benchmark 1",
    title: "SWE-Bench Verified is the paper’s strongest empirical result",
    thesis:
      "This is the benchmark most aligned with real coding-agent behavior: take a real GitHub issue, edit the repository, produce a patch, and let tests decide whether you solved it.",
    bullets: [
      "That makes the benchmark more persuasive than toy algorithm tasks or text-only benchmarks.",
      "The paper reports a jump from 17% to 53% on a random subset, which is a big within-paper improvement.",
      "The critical caveat is the random subset: it is not a clean full-benchmark comparison against every external baseline.",
      "Still, if you want one result from the paper to take seriously, this is the one.",
    ],
    stats: [
      { label: "Initial", value: "17%" },
      { label: "Final", value: "53%" },
      { label: "Task Type", value: "Real repo + issue" },
      { label: "Judge", value: "Tests" },
    ],
    takeaway:
      "It is important to give the paper this point. The later critique is stronger if you first acknowledge where the empirical evidence is genuinely interesting.",
    citations: ["SWE-Bench Verified", "Paper run details"],
  },
  {
    id: "livecodebench",
    eyebrow: "Benchmark 2",
    title: "LiveCodeBench improves, but the comparison protocol is messy",
    thesis:
      "The paper reports 65% to 71% on a 50-problem random sample, but LiveCodeBench difficulty matters enough that this random mixture is not cleanly comparable to leaderboard-style published results.",
    bullets: [
      "The benchmark pools easy, medium, and hard tasks, and model performance can swing dramatically across those buckets.",
      "Your notes point to Anthropic’s Sonnet 3.5 numbers: very high on easy, much weaker on medium, and very low on hard.",
      "Once difficulty composition varies, a pooled random sample is suggestive but not apples-to-apples with official baseline tables.",
      "So this result supports 'the agent improved on its own sampled tasks', not necessarily 'it beat known external baselines'.",
    ],
    stats: [
      { label: "Initial", value: "65%" },
      { label: "Final", value: "71%" },
      { label: "Sample Size", value: "50 tasks" },
      { label: "Caveat", value: "Difficulty mix" },
    ],
    takeaway:
      "This is where you start distinguishing within-paper improvement from community-comparable benchmark claims.",
    citations: ["LiveCodeBench", "Anthropic Sonnet 3.5 note"],
  },
  {
    id: "synthetic",
    eyebrow: "Benchmark 3",
    title: "The synthetic tasks reward the exact utilities the system later learns",
    thesis:
      "File editing and symbol location are useful agent tasks, but they are also especially likely to reward smart-edit and AST-based retrieval improvements, so large gains here are less surprising.",
    bullets: [
      "File editing jumps from 82% to 94%, which is consistent with later additions like smarter edit tools and verification.",
      "Symbol location rises from 35% to 40%, consistent with AST and hybrid symbol locators discovered later in the run.",
      "These tasks are not meaningless; they are practical sub-skills in coding agents.",
      "But they are also custom enough that they do not tell us much about how SICA compares with modern external harnesses.",
    ],
    stats: [
      { label: "File Editing", value: "82% -> 94%" },
      { label: "Symbol Location", value: "35% -> 40%" },
      { label: "Best For", value: "Tool-level diagnosis" },
      { label: "Weakness", value: "External comparability" },
    ],
    takeaway:
      "These tasks are best read as internal diagnostics for what changed, not as the strongest evidence for broad improvement.",
    citations: ["Synthetic benchmark descriptions"],
  },
  {
    id: "result-figure",
    eyebrow: "Main Result",
    title: "The improvement curve is most convincing when read as annotated agent engineering",
    thesis:
      "The paper’s most persuasive figure is not just that utility rises, but that the rise lines up with concrete, legible scaffold changes added at specific iterations.",
    bullets: [
      "Iteration 1: Smart Edit produces the first step up.",
      "Middle iterations: code context summarization and file edit verification stabilize further gains.",
      "Later iterations: AST and hybrid symbol locators push symbol-search behavior forward.",
      "The annotations reduce the sense of mystery. We can see what changed and why utility likely moved.",
    ],
    image: "/notes/immprovement.png",
    imageAlt: "Main improvement curve with annotated interventions",
    takeaway:
      "This figure actually supports your critique: the gains track concrete utilities, not some vague emergent meta-intelligence.",
    citations: ["Figure 3"],
  },
  {
    id: "interpretation",
    eyebrow: "Interpretation",
    title: "What actually improved was mostly the scaffold",
    thesis:
      "The pattern of gains looks much more like automated agent engineering than like open-ended self-improvement in the strong sense.",
    sections: [
      {
        title: "Early gains",
        body:
          "Smart editing directly helps on the synthetic editing task and likely helps on repository patching as well.",
      },
      {
        title: "Mid-run gains",
        body:
          "Context summarization and verification reduce noise and execution errors. That is scaffold hygiene, not a new reasoning paradigm.",
      },
      {
        title: "Late gains",
        body:
          "Symbol-location improvements target a known bottleneck in repository navigation and code retrieval.",
      },
      {
        title: "Overall read",
        body:
          "The agent seems to get better at being a practical coding harness, not better at being generally self-improving in an unbounded way.",
      },
    ],
    takeaway:
      "This is the intellectual center of the talk. Everything before it sets up the evidence; everything after it explores the consequences.",
    citations: ["Figure 3", "Your notes"],
  },
  {
    id: "anthropic-baseline",
    eyebrow: "Practical Critique",
    title: "Compared with Anthropic’s simpler baseline, the absolute gain looks less dramatic",
    thesis:
      "Anthropic reported roughly 49% on SWE-Bench Verified with a much leaner Sonnet-based harness, so SICA’s 53% looks more modest once you compare it to strong simple systems rather than to its own starting point.",
    bullets: [
      "The within-paper gain remains large, but the outside-world gain over a leaner modern agent is much smaller.",
      "SICA gets to its best result only after a 15-iteration search costing roughly $7,000.",
      "Anthropic’s reported agent used a much simpler tool setup than the one SICA starts with.",
      "That makes the practical value proposition of SICA weaker than the headline suggests, even if the self-editing demonstration is still real.",
    ],
    stats: [
      { label: "SICA Final", value: "53%" },
      { label: "Anthropic Sonnet", value: "~49%" },
      { label: "Search Cost", value: "~$7k" },
      { label: "Iterations", value: "15" },
    ],
    takeaway:
      "This is where the paper shifts from 'impressive self-editing demo' to 'less impressive practical coding-agent result'.",
    citations: ["Anthropic SWE-Bench Sonnet", "Paper run cost"],
  },
  {
    id: "reasoning",
    eyebrow: "Claim Narrowing",
    title: "The reasoning benchmarks barely move",
    thesis:
      "On AIME 2024 and GPQA Diamond, SICA provides little improvement, which suggests the loop helps most when orchestration and tool use matter more than raw model reasoning.",
    bullets: [
      "AIME measures high-level mathematical reasoning, where scaffolding may add less than in coding-harness tasks.",
      "GPQA Diamond tests expert-level science reasoning, again favoring strong base models over elaborate orchestration.",
      "The paper itself notes that strong reasoning models may already be near the ceiling of what this scaffold can add.",
      "That is a useful negative result: it narrows the scope of what SICA is actually good for.",
    ],
    sections: [
      {
        title: "Takeaway for this talk",
        body:
          "SICA looks more like a coding-agent harness optimizer than a general recursive self-improvement mechanism.",
      },
      {
        title: "Why this is good evidence",
        body:
          "Negative results are informative because they show the effect is not uniform across tasks.",
      },
    ],
    takeaway:
      "This slide helps prevent the audience from overgeneralizing the coding benchmark results into a story about general intelligence.",
    citations: ["AIME 2024", "GPQA Diamond", "Paper discussion"],
  },
  {
    id: "harness-bottleneck",
    eyebrow: "Sharper Critique",
    title: "The harness may be the bottleneck, and the agent may be learning to undo it",
    thesis:
      "My strongest hypothesis is that the initial scaffold hurts performance enough that part of SICA’s measured success comes from removing unnecessary prompt and tool overhead.",
    bullets: [
      "Recent evidence suggests added agent instruction files can lower benchmark performance.",
      "Other evidence suggests clutter, whitespace, and longer contexts can degrade model behavior.",
      "The system prompt figure shows exactly the kind of prompt surface that should make us suspicious.",
      "If the baseline is artificially bloated, self-improvement partly becomes self-repair.",
    ],
    image: "/notes/agents_md.png",
    imageAlt: "Agents.md performance figure",
    image2: "/notes/context alone hurts performance.png",
    image2Alt: "Context clutter hurts performance figure",
    takeaway:
      "You do not have to prove this hypothesis absolutely. You only need to show that it is plausible enough to weaken the paper’s strongest interpretation.",
    citations: ["agents.md paper", "long context clutter paper"],
  },
  {
    id: "discussion-overfit",
    eyebrow: "Discussion",
    title: "Are we seeing genuine capability gains or benchmark-local test-time learning?",
    thesis:
      "The more the loop is evaluated on a static benchmark suite with task-aligned utilities, the more it risks becoming benchmark-local agent tuning rather than broadly useful self-improvement.",
    bullets: [
      "Synthetic tasks already align closely with the discovered utilities.",
      "LiveCodeBench is sampled in a non-standard way, so external comparison is weak.",
      "Utility rewards cost and latency, which encourages scaffold-specific optimization.",
      "A static benchmark archive can create incentives to learn the evaluation harness rather than the broader problem class.",
    ],
    sections: [
      {
        title: "Class discussion angle",
        body:
          "This is the right place to raise the question of overfitting versus generalization: what evidence would convince us that the learned changes transfer?",
      },
      {
        title: "What the paper lacks",
        body:
          "There is not yet a strong transfer story to unseen, differently structured, or dynamically generated tasks.",
      },
    ],
    takeaway:
      "If you want one discussion question for the room, this is the one.",
    citations: ["Your notes", "Benchmark setup"],
  },
  {
    id: "newer-systems",
    eyebrow: "Current Context",
    title: "The paper also already looks somewhat dated against newer coding systems",
    thesis:
      "Even if SICA is first in its exact category, the broader practical coding-agent landscape moved quickly, which makes the paper feel less impressive as a current-state benchmark result than as a conceptual milestone.",
    bullets: [
      "Your notes call out OpenClaw, Codex-style systems, Claude Code, and the agents.md discussion as later context.",
      "Modern harnesses often focus on fewer tools, cleaner action spaces, and stronger alignment with how current frontier models were trained to operate.",
      "That makes SICA historically interesting even if it is not the best template for present-day practical agents.",
      "So the paper may age well as a first self-editing scaffold paper and less well as a practical systems baseline.",
    ],
    takeaway:
      "This keeps the conclusion balanced: the paper can be an important first without being the best current system.",
    citations: ["Your notes", "Qualitative modern systems context"],
  },
  {
    id: "future-work",
    eyebrow: "Future Work",
    title: "A stronger follow-up paper would jointly improve the model, the harness, and the evaluation",
    thesis:
      "The next serious step would be to combine scaffold evolution with model adaptation, leaner baselines, and dynamic benchmarks that cannot be overfit as easily.",
    bullets: [
      "Jointly fine-tune or post-train models on the evolving harness rather than treating the model as frozen forever.",
      "Use dynamic, generated, or continually refreshed benchmark tasks so the loop cannot simply specialize to a static suite.",
      "Compare against stronger contemporary coding harnesses with fewer tools and better action abstractions.",
      "Measure transfer: do improvements found on one benchmark family help on another, or only on the tasks that reward the same utilities?",
    ],
    sections: [
      {
        title: "Most important improvement",
        body:
          "Optimize the harness and the model together. That is where recursive improvement starts becoming strategically more serious.",
      },
      {
        title: "Most important evaluation change",
        body:
          "Separate within-loop benchmark gains from external-transfer gains. Without that separation, the headline remains ambiguous.",
      },
    ],
    takeaway:
      "The constructive end-state is not 'the paper is bad'. It is 'the paper is an interesting first step, but the next step has to raise the bar substantially'.",
    citations: ["AlphaEvolve", "OMNI-EPIC", "Your notes"],
  },
  {
    id: "final",
    eyebrow: "Verdict",
    title: "I buy the loop. I do not yet buy the mythology.",
    thesis:
      "SICA is a real proof that an agent can edit its own scaffold and improve benchmark utility, but the best evidence points toward automated agent engineering, not broad open-ended recursive self-improvement.",
    bullets: [
      "The loop is real and worth taking seriously.",
      "The cleanest gains come from practical tool and context-management changes.",
      "The strongest benchmark evidence is SWE-Bench Verified, not the whole suite equally.",
      "The main unresolved question is transfer: do these changes generalize beyond the benchmark/harness combination that discovered them?",
    ],
    stats: [
      { label: "Most Persuasive", value: "Annotated scaffold gains" },
      { label: "Most Important Caveat", value: "Heavy starting harness" },
      { label: "Best Critique", value: "Self-repair vs self-improvement" },
      { label: "Bottom Line", value: "Interesting, narrower than headline" },
    ],
    takeaway:
      "That final sentence is short enough to remember and precise enough to defend.",
    citations: ["Whole paper", "Your notes synthesis"],
  },
  {
    id: "appendix-figures",
    eyebrow: "Appendix / Asset Bank",
    title: "Reference slide: key figures to revisit while polishing the deck",
    thesis:
      "Keep one place in the deck for the main visual evidence so you can quickly pull visuals into revised slides without re-reading the paper markdown each time.",
    bullets: [
      "Main loop figure: /notes/agent improvement.jpeg",
      "ADAS / archive figure: /notes/agent archive.png",
      "Algorithm slide: /notes/algorithm.png",
      "Utility function formula: /notes/utility function.png",
      "System prompt / context stack: /notes/system prompt.png",
      "Result curve: /notes/immprovement.png",
    ],
    appendix: true,
    takeaway:
      "This is mostly for your workflow when you continue editing the deck.",
    citations: ["Local asset bank"],
  },
  {
    id: "appendix-prompts",
    eyebrow: "Appendix / Prompt Reference",
    title: "Reference slide: the prompts show how heavily the behavior is already engineered",
    thesis:
      "The appendix prompts do not read like a blank-slate agent. They read like a strongly opinionated set of workflow instructions plus monitoring logic.",
    sections: [
      {
        title: "Main orchestrator prompt",
        body:
          "Delegates the problem to one or more sub-agents, stresses accurate routing, and frames the main agent as planner/router rather than direct worker.",
      },
      {
        title: "Base sub-agent prompt",
        body:
          "Tells the model to slow down, inspect docs, explore the repo, design minimally, edit carefully, test end-to-end, and clean up afterward.",
      },
      {
        title: "Overseer prompt",
        body:
          "Defines when to notify, when to cancel, and even how to judge whether an agent is testing meta-improvement changes in the wrong way.",
      },
      {
        title: "Why it matters",
        body:
          "A lot of the behavior credited to the system is already scaffolded into prompt policy before the loop ever starts improving itself.",
      },
    ],
    appendix: true,
    takeaway:
      "Use this if someone asks how much of the system’s success comes from prompting versus tool invention.",
    citations: ["Appendix A", "Appendix C"],
  },
  {
    id: "appendix-tools",
    eyebrow: "Appendix / Tool Inventory",
    title: "Reference slide: the tool inventory is already crowded before self-improvement",
    thesis:
      "Showing the initial tool/role matrix makes the context-bloat critique concrete instead of merely stylistic.",
    bullets: [
      "Main orchestrator: submit_answer, open/close files, view_directory, meta-improvement tools, plus control tools.",
      "Software developer and problem solver: shell, search, file overwrite, calculator, review committee, plus control tools.",
      "Archive explorer: compare iterations, best/worst problems, file viewing, plus control tools.",
      "Reasoning agent: fewer explicit tools, but still wrapped in the larger orchestration framework.",
      "Bottom line: even the 'base' agent is already a substantial engineered scaffold.",
    ],
    appendix: true,
    takeaway:
      "Use this backup slide when someone pushes back on the claim that the scaffold is overbuilt.",
    citations: ["Your notes tool inventory"],
  },
  {
    id: "appendix-context-rot",
    eyebrow: "Backup / Context Evidence",
    title: "Reference slide: evidence that more instructions and more whitespace can hurt",
    thesis:
      "Your critique is not just aesthetic. There is direct empirical reason to suspect that instruction clutter and expanded context windows can harm model behavior.",
    image: "/notes/context rot.png",
    imageAlt: "Context rot chart",
    image2: "/notes/system prompt.png",
    image2Alt: "System prompt context stack",
    bullets: [
      "Context-rot style results suggest retrieval and reasoning quality can decay as irrelevant or repeated text expands.",
      "The system prompt figure shows exactly the kind of long structured context that should make us cautious.",
      "That does not prove SICA’s baseline is bad, but it makes the self-repair hypothesis technically credible.",
    ],
    appendix: true,
    takeaway:
      "This backup gives you supporting evidence if the audience wants harder justification for the context-bloat critique.",
    citations: ["https://research.trychroma.com/context-rot", "Your notes"],
  },
];

export { slides };
