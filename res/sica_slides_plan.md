# SICA Slide Deck Plan

## Deck goals
- Target length: 25-30 minutes.
- Tone: interested but critical; do not sell the paper harder than the evidence supports.
- Rule of thumb: one core idea per slide, lots of concrete examples, visible citations, and frequent reminders of what actually improved.
- Main thesis for the talk: SICA is an interesting proof of self-editing, but much of the reported gain looks like scaffold optimization, not open-ended autonomous invention.


## Template cues to preserve

- use this as a design/implementation template: /Users/bruol/code/App/presentation-standalone

---

## Slide 1 - Title / framing

### On-slide title
Can a coding agent rewrite itself?

### On-slide subtitle
A critical reading of "A Self-Improving Coding Agent" (Robeyns et al., 2025)

### On-slide content
- Claim of the paper: a coding agent can edit its own code and improve benchmark performance.
- My framing: interesting systems paper, but the gains are narrower than the headline suggests.
- Preview: what is new, what really improved, and where the method likely breaks.

### Speaker notes
- Open with the strongest possible concise summary: this is not recursive superintelligence.
- It is a benchmark-driven search loop over an agent scaffold.
- Set audience expectation that the interesting part is the engineering loop, not the raw benchmark jump alone.


### Graphics / assets
- Background or right-side graphic: `a%20self%20improving%20coding%20agent/_page_1_Figure_0.jpeg`

### References
- Paper: `https://arxiv.org/pdf/2504.15228`

---

## Slide 2 - Why this paper exists

### On-slide title
Self-improvement is the next step after prompting tricks

### On-slide content
- LLM progress often comes from scaffolding, not just better base models.
- We moved from direct input-output prompting to CoT, self-consistency, tree search, debate, and self-refinement.
- SICA asks: if scaffolds matter so much, can the scaffold optimize itself?

### Speaker notes
- Use this slide to place SICA in the history of prompting and agent design.
- Mention that the paper is really about automated scaffold search over code, not weight updates.
- Briefly name CoT, STaR, Tree of Thoughts, and the broader prompting literature.



### Graphics / assets
- Main figure: `notes/RTSE%20Presentation/image.png`

### References
- Tree of Thoughts: https://arxiv.org/pdf/2305.10601
- STaR: https://arxiv.org/pdf/2203.14465
- Prompting survey / Prompt Report: https://arxiv.org/pdf/2406.06608

---

## Slide 3 - What is actually new here?

### On-slide title
ADAS improves an agent; SICA tries to improve itself

### On-slide content
- ADAS has a fixed meta-agent that improves a separate target agent.
- SICA removes that separation: the best archived agent becomes the next improver.
- Paper's core hypothesis: if the improver also gets better, improvements might compound.

### Speaker notes
- Be precise here because this is the conceptual novelty claim.
- Contrast SICA with ADAS and mention why AlphaEvolve is related but more structured and easier to evaluate.
- Note that ADAS was tested on math/science-style tasks, not full general coding.



### Graphics / assets
- Main figure: `notes/RTSE%20Presentation/image%201.png`

### References
- ADAS: https://arxiv.org/pdf/2408.08435
- AlphaEvolve: use paper reference [28] from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 4 - The SICA loop in one picture

### On-slide title
Archive -> improve -> benchmark -> repeat

### On-slide content
- Start with a base coding agent and benchmark suite.
- Keep an archive of old agents plus their scores.
- Pick the current best agent, let it propose one improvement, evaluate it, and add it back to the archive.

### Speaker notes
- This is the cleanest explanation of the method.
- Emphasize that there are no weight updates.
- Everything happens through code edits, prompts, tool changes, and orchestration changes.



### Graphics / assets
- Main figure: `notes/RTSE%20Presentation/_page_1_Figure_0.jpeg`
- Optional backup/high-res: `a%20self%20improving%20coding%20agent/_page_1_Figure_0.jpeg`

### References
- Paper Figure 1 from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 5 - The selection objective shapes behavior

### On-slide title
It does not optimize accuracy alone

### On-slide content
- Utility mixes three things: benchmark score, dollar cost, and wall-clock time.
- Cost is capped at `$10` per problem; time is capped at `300s`.
- So the system is rewarded for becoming cheaper and faster, not just better.

### Speaker notes
- This is important because many later improvements are really infrastructure/tooling improvements.
- Tell the audience this is a good engineering choice, but it complicates the headline claim of "self-improvement".
- Add the critique explicitly: an agent can improve utility by undoing inefficiencies in its own scaffold.



### Graphics / assets
- Main figure: `notes/RTSE%20Presentation/image%203.png`

### References
- Utility definition from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 6 - The base agent is already a heavy scaffold

### On-slide title
The starting point is not minimal at all

### On-slide content
- Base tools: file open/close, overwrite, bash, calculator, submit, subagent returns, archive analysis.
- Extra machinery: multiple subagents plus an asynchronous overseer.
- The agent context also includes open files and the directory tree.

### Speaker notes
- This slide sets up the main critique that the authors start from a fairly opinionated scaffold.
- Mention the one-hour meta-improvement step and the 30-second overseer cadence.
- Say clearly: this is not "a model starts from scratch and invents tools"; it inherits a lot.


### Graphics / assets
- Main figure: `notes/RTSE%20Presentation/image%204.png`

### References
- Context structure from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 7 - Core critique: too many tools, too much context

### On-slide title
The scaffold may be hurting the model

### On-slide content
- SICA starts with many tools and agent roles.
- Tool-rich, text-heavy harnesses can reduce agent performance.
- If so, some "self-improvement" may just be the agent removing self-inflicted friction.

### Speaker notes
- Use the notes' concrete comparison: Claude Code / Codex-style agents often keep the tool set much smaller.
- Mention CodeAct's argument that code execution is often a better action space than verbose JSON or text action formats.
- This is one of your strongest interpretive slides.


### Graphics / assets
- Main figure: `notes/RTSE%20Presentation/image%205.png`

### References
- CodeAct: https://arxiv.org/pdf/2402.01030

---

## Slide 8 - Benchmark 1: SWE-Bench Verified

### On-slide title
Real GitHub issues, patch generation, test-based evaluation

### On-slide content
- Task: take a real repository plus issue, generate a patch, and pass the tests.
- This is the most convincing benchmark in the paper because it looks like actual software engineering.
- Reported result in the run: from `17%` to `53%` on a random subset.

### Speaker notes
- Explain SWE-Bench clearly; some audience members may not know it.
- Then immediately add the caveat: it is a subset, not the full benchmark, and comparison to outside results is messy.
- Use this slide to earn trust by being fair: this is the paper's strongest empirical evidence.


### Graphics / assets
- No existing figure required; design a custom benchmark explainer.

### References
- SWE-Bench Verified: https://openai.com/index/introducing-swe-bench-verified/
- Paper benchmark details from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 9 - Benchmark 2: LiveCodeBench

### On-slide title
Good coding benchmark, weak comparison protocol

### On-slide content
- LiveCodeBench is closer to LeetCode / competitive programming.
- The paper samples `50` problems randomly across easy, medium, and hard.
- That breaks comparability to official results because difficulty mix matters a lot.

### Speaker notes
- Use the concrete example from your notes: Sonnet 3.5 has very different scores by difficulty.
- That makes a pooled random sample hard to compare fairly against leaderboard numbers.
- So the result is suggestive, but not a clean benchmark claim.


### Graphics / assets
- No existing figure required; build a simple custom difficulty-composition visual.

### References
- LiveCodeBench reference from paper ref [26] in `a self improving coding agent/a self improving coding agent.md`
- Anthropic Claude 3.5 Sonnet benchmark note from your notes: https://www.anthropic.com/news/claude-3-5-sonnet

---

## Slide 10 - Synthetic benchmarks reward scaffold-specific fixes

### On-slide title
The custom tasks line up with the custom improvements

### On-slide content
- Synthetic task 1: file editing to match a target version.
- Synthetic task 2: symbol location in a real repo.
- The biggest gains come from exactly the kinds of tools SICA later adds: smart edit tools and AST-based symbol location.

### Speaker notes
- This is not a knock on synthetic benchmarks; they are useful.
- But it does mean we should expect the optimization loop to discover benchmark-local tricks.
- Phrase it carefully: the agent got better at the tasks it was explicitly shaped to do.


### Graphics / assets
- Optional inset from result curve later, but this slide can work as a custom diagram-only slide.

### References
- Paper synthetic benchmark descriptions from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 11 - Main result: the gains track concrete scaffold changes

### On-slide title
The curve improves when the agent adds specific utilities

### On-slide content
- Early gain: `Smart Edit` tool.
- Mid-run gain: code context summarization and file edit verification.
- Late gain: AST symbol locator and then a hybrid symbol locator.

### Speaker notes
- This is the key result slide; spend time here.
- Interpret the figure as evidence for a practical agent engineering loop, not a mysterious emergent process.
- Say that the annotations are actually the most convincing part of the paper because they tell us what changed.



### Graphics / assets
- Main figure: `notes/RTSE%20Presentation/image%206.png`
- Optional backup/high-res: `a%20self%20improving%20coding%20agent/_page_4_Figure_7.jpeg`

### References
- Paper Figure 3 from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 12 - Strongest critique: baseline comparisons are not very flattering

### On-slide title
How much of this beats a simpler modern agent?

### On-slide content
- Anthropic reported about `49%` on SWE-Bench Verified for a Claude Sonnet agent with a much simpler harness.
- SICA reaches `53%`, but on a random subset and after a costly 15-iteration run.
- That makes the absolute gain much less dramatic than the headline suggests.

### Speaker notes
- This is where you can be sharp without being unfair.
- Say: impressive as a self-editing demonstration, less impressive as a practical coding-agent result.
- Mention the run cost from the paper: about `$7,000` for 15 iterations.


### Graphics / assets
- No existing figure required; build a clean table slide.

### References
- Anthropic SWE-Bench Sonnet: https://www.anthropic.com/engineering/swe-bench-sonnet
- Paper cost/result details from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 13 - Reasoning tasks barely move

### On-slide title
The scaffold helps agentic coding more than raw reasoning

### On-slide content
- On AIME 2024 and GPQA Diamond, SICA shows little improvement.
- The paper's own explanation: strong reasoning models may already be near the scaffold's ceiling.
- Worse, extra reasoning scaffolds may interrupt a reasoning model rather than help it.

### Speaker notes
- This slide is important because it narrows the claim.
- Say that the system seems helpful when orchestration and tool use matter, not when the base model already dominates.
- This supports your larger thesis that the scaffold is the object being optimized, not general intelligence.


### Graphics / assets
- Custom redraw suggested; the extracted figure is not available in the notes assets.

### References
- AIME/GPQA discussion from `a self improving coding agent/a self improving coding agent.md`
- OpenAI o1 system card: https://openai.com/index/openai-o1-system-card/

---

## Slide 14 - Limitations that matter

### On-slide title
Most failure modes are exactly where you would expect

### On-slide content
- Novel ideas are hard; bad ideas are expensive and can bias later iterations.
- Five-minute timeouts likely depress the baseline and over-reward speed hacks.
- The authors heavily steer the initial design, so the search space is narrower than the headline implies.

### Speaker notes
- This should feel like a synthesis slide, not a complaints dump.
- Add your strongest hypothesis explicitly: the scaffold may have hurt performance, and the agent partly learned to undo that harm.
- Mention that results on modern coding agents may depend strongly on the harness because models are RL-shaped on harness behavior.


### Graphics / assets
- Optional small inset of the utility formula again: `notes/RTSE%20Presentation/image%203.png`

### References
- Paper limitations section from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 15 - Supporting evidence for the context-bloat critique

### On-slide title
More instructions and more whitespace can hurt

### On-slide content
- Recent evidence suggests added agent instruction files can reduce benchmark performance.
- Long, cluttered prompts also degrade performance.
- That makes SICA's open-files + directory-tree + tool-doc heavy context especially suspect.

### Speaker notes
- This slide makes your critique feel evidence-based, not stylistic.
- Tie it directly back to Slide 6.
- If you want a punchier line: `Before asking whether the agent can self-improve, ask whether we handicapped it first.`



### Graphics / assets
- Left figure: `notes/RTSE%20Presentation/image%207.png`
- Right figure: `notes/RTSE%20Presentation/image%208.png`

### References
- Agents.md benchmark effect: https://arxiv.org/pdf/2602.11988
- Long context / clutter effect: https://arxiv.org/pdf/2510.05381v1

---

## Slide 16 - Safety section: reasonable, but not the real story

### On-slide title
The paper talks safety; the system is still fairly weak

### On-slide content
- The paper emphasizes observability and an asynchronous overseer.
- That is sensible, but this system is not yet powerful enough to be the scary case.
- The real safety jump would come only if scaffold updates were combined with weight updates.

### Speaker notes
- Be calm here, not dismissive.
- Give the authors credit for thinking about observability.
- Then say the more interesting safety question is future recursive systems with model adaptation, not this one.


### Graphics / assets
- Optional reuse of context-window figure as a faint background: `notes/RTSE%20Presentation/image%204.png`

### References
- Safety section from `a self improving coding agent/a self improving coding agent.md`

---

## Slide 17 - Future work that would make this genuinely stronger

### On-slide title
What would a better follow-up paper do?

### On-slide content
- Fine-tune models jointly with the evolving scaffold.
- Use dynamic or self-generated benchmarks so the system cannot overfit a static set.
- Test on modern coding harnesses with fewer tools and better action abstractions.
- Compare directly against current systems, not just older baselines.

### Speaker notes
- This slide should sound constructive.
- Mention AlphaEvolve here again as evidence that structured search plus reliable evaluation can work very well in narrow domains.
- If you want a strong closing line for this slide: `The next version should optimize the harness and the model together.`



### Graphics / assets
- Optional small inset: `notes/RTSE%20Presentation/image%201.png`

### References
- AlphaEvolve: use paper reference [28] from `a self improving coding agent/a self improving coding agent.md`
- OMNI-EPIC / benchmark generation idea: paper ref [12] in `a self improving coding agent/a self improving coding agent.md`

---

## Slide 18 - Live demo concept

### On-slide title
Live demo: the tiny self-improvement game

### On-slide content
- Show two tiny toy agents solving the same repo task.
- Agent A gets a bloated harness; Agent B gets a lean harness.
- Task options:
  - find a symbol definition in a tiny repo
  - edit one buggy function to match a target test
  - navigate a toy maze/game by issuing file + bash actions
- The punchline: simpler harness often wins or ties.

### Speaker notes
- This should run while you talk, not require a big reveal.
- Best version: a tiny deterministic repo with a visible scoreboard for `time`, `turns`, `tokens`, and `success`.
- If you want it to feel playful, frame it as `Tool Budget Challenge` or `Agent Boss Fight: 10 tools vs 3 tools`.


- Bottom: mono scoreboard with `success`, `turn count`, `latency`, `tool calls` styled like the template stat blocks.

### Graphics / assets
- No static paper graphic needed; this should be a live embedded demo or animated mockup.

### References
- Conceptually supported by CodeAct and your context-bloat critique.

---

## Slide 19 - Final takeaway

### On-slide title
Verdict

### On-slide content
- SICA is a real and interesting proof that an agent can edit its own scaffold.
- The strongest gains come from practical tooling and context-management improvements.
- The paper is more convincing as automated agent engineering than as evidence for open-ended recursive self-improvement.

### Speaker notes
- End with a balanced sentence.
- My suggested final line: `I buy the loop; I do not yet buy the mythology.`



### Graphics / assets
- Optional faint background from the loop figure: `notes/RTSE%20Presentation/_page_1_Figure_0.jpeg`

### References
- Paper overall.

---

## Backup slides

### Backup 1 - Algorithm slide

#### Purpose
- If someone asks for the exact optimization loop, show the pseudocode directly.

#### Graphics / assets
- `notes/RTSE%20Presentation/image%202.png`

#### Talking point
- The best archived agent becomes the next improver; this is the paper's cleanest conceptual difference from ADAS.

### Backup 2 - Full tool inventory critique

#### Purpose
- If you want to really press the "too many tools" point, show the actual starting roles and tools.

#### On-slide content
- `main_orchestrator`
- `software_developer`
- `general_problem_solver`
- `archive_explorer`
- `meta_agent_design_reviewer`
- `reasoning_agent`

#### Speaker note
- Then point out that each role also inherits auto-added control tools, which further expands the action space.

### Backup 3 - High-res result figure

#### Graphics / assets
- `a%20self%20improving%20coding%20agent/_page_4_Figure_7.jpeg`

### Backup 4 - If you want a "related systems" side note

#### On-slide content
- Mention recent coding systems such as OpenClaw / Codex / Claude Code only as practical context.
- Use them qualitatively unless you add verified current benchmark numbers.

#### Speaker note
- This keeps you current without over-claiming any direct apples-to-apples comparison.

