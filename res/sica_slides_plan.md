# SICA / "Self-Improving Coding Agent" Slide Plan

**use this as a desing/implementation template: /Users/bruol/code/App/presentation-standalone**

## Suggested talk shape
- Act 1: Why this paper matters and what it claims.
- Act 2: What the system actually is.
- Act 3: What the results really show.
- Act 4: Why the headline is weaker than it sounds.
- Act 5: What would make a stronger follow-up paper.

## Slide list

### 1. Title
- Presentation title: `A Self-Improving Coding Agent`
  -- strikethrough improving and replace with healing
- Subtitle: by lorin Urbantat
- Very short framing: interesting result, but probably more scaffold optimization than open-ended self-improvement.
- cite url 
- https://arxiv.org/pdf/2504.15228

### 2. The one-sentence claim
- State the paper's central claim as fairly as possible.
- first agent of this kind
- Mention the headline number: `17% -> 53%` on a random subset of SWE-Bench Verified.
- Immediately clarify what "self-improving" means here:
  - no weight updates
  - code edits to the agent scaffold
  - benchmark-driven iteration

### 3. Why people care about self-improving agents
- Place the paper in the broader trend:
  - prompting strategies
  - scaffolds/orchestrators
  - agent systems
  - automated prompt/system search
- Mention Chain-of-Thought, STaR, Tree of Thoughts, prompt engineering literature.
- Key message: performance gains often come from scaffolding, so automating scaffold design is a natural next step. 

### 3.5 Some detail about prompting strategies (CoT, etc)
- 

### 4. What is actually new here?
- Contrast SICA with ADAS.
- Explain the novelty claim:
  - ADAS has separate meta-agent and target agent
  - SICA makes the improved agent itself become the next improver
- Mention AlphaEvolve as related but more structured and easier to evaluate.

### 5. The SICA loop
- Explain the basic loop:
  - start with base agent + benchmarks
  - pick best archived agent
  - propose one improvement
  - evaluate
  - archive and repeat
- This should be the cleanest "method in one slide" view.
- Visual-heavy slide using the paper's main loop figure.

### 6. What the system optimizes
- Explain the utility function at a high level.
- Benchmark score is only part of the objective.
- It also optimizes cost and wall-clock time.
- Mention the caps:
  - `$10` per problem
  - `300s` timeout
- Key critical point: the paper is not optimizing accuracy alone.
- add the utility functkoin. also add a small visual. you can generate an svg here


### 6.5 The agent roles and why they matter
- Briefly show the sub-agent decomposition:
  - main orchestrator
  - software developer
  - general problem solver
  - archive explorer
  - meta-agent design reviewer
  - reasoning agent
- Emphasize that each role has tools, prompt text, and control overhead.
- Key message: this is a rich handcrafted system, not an unconstrained self-design process.
- cerate a vusual(svg to showcase the different sub-agents and their role)


### 7
- explain overseer agebnt
- add visual svg


### 7.1 slide about the system prompt.
- add graphic. mention that all open files are included and the entire directory structure

### 7.5 The base agent is already a complex scaffold
- Explain the initial toolset and agent setup.
- Mention:
  - file tools
  - shell
  - calculator
  - benchmark submission
  - subagents
  - archive analysis
  - asynchronous overseer
- Key message: the agent does not start from a minimal baseline.
- compare to claude code 10 tools -- this far more tools

### 8. Core critique: too many tools, too much context
- Present your main criticism clearly.
- The scaffold may itself be hurting performance.
- Open files, directory trees, large instructions, and many tools may create context bloat.
- Hypothesis: some "self-improvement" may simply be removing self-inflicted friction.
- Mention CodeAct and the broader idea that code/bash action spaces can outperform verbose agent scaffolds.
- 

### 10. Benchmark 1: SWE-Bench Verified
- Explain what SWE-Bench Verified is for audience members unfamiliar with it.
- Why it is the strongest benchmark in the paper:
  - real GitHub issues
  - patch generation
  - test-based evaluation
- Mention the reported improvement and the fact it is a random subset.
- 17% -> 53%

### 11. Benchmark 2: LiveCodeBench
- Explain that this is much closer to coding contest / LeetCode style tasks.
- Mention the issue with the evaluation protocol:
  - they randomly sample 50 tasks
  - difficulty mix matters a lot (threre are 3 difficulties numbers dfor sonnet 3.5 are only published per difficulty thus this does not allow to compare against baseline results)
  - this limits comparability to official benchmark results
- Key message: the result is suggestive, but not cleanly comparable.
- 65% -> 71%

### 12. Benchmark 3: Synthetic tasks
- Explain the two synthetic tasks:
  - file editing
  - symbol location
- Critical framing:
  - these tasks align strongly with the exact tools the system later invents or improves
  - so gains here are useful but not surprising
- also this allows no comparrison to other result/agent harnesses
- file: 82% -> 94%, sym: 35% -> 40%

### 13. Main result figure
- Show the result curve over iterations.
- Walk through the annotated improvements:
  - Smart Edit
  - code context summarization
  - file edit verification
  - AST symbol locator
  - hybrid symbol locator
- Key message: the gains track very concrete scaffold/tool changes.
- 

### 14. What actually improved?
- Interpret the result figure rather than just showing it.
- Argue that this is best read as automated agent engineering.
- The system appears to discover practical coding-agent utilities, not broad self-improvement in a deep sense.
- This is one of the most important interpretation slides.
- 

### 15. Comparison to anthropics baseline
- Present your strongest practical critique.
- Compare the paper's result to Anthropic's simpler Sonnet SWE-Bench agent.
- Key message:
  - SICA's final number is only modestly above a much simpler agent setup
  - and SICA gets there after an expensive multi-iteration search
- Mention rough run cost: about `$7,000` for 15 iterations.
- cite the anthropic article (url in notes)
- cant compare to other benches because they did a strange benchmark setup

### 16. Why the reasoning benchmarks barely move
- Cover AIME 2024 and GPQA Diamond briefly.
-  explain the benchmarks 
- Explain that SICA gives little benefit here.
- Interpretation:
  - scaffold search seems more useful for agentic coding tasks than for already-strong reasoning tasks
- This narrows the paper's true claim.
- 

### 17. Hidden limitation: the harness may be the bottleneck
- This is your sharper critique slide.
- Present the hypothesis directly:
  - the initial scaffold may have hurt performance
  - the system then learned to undo parts of that harm
- Mention evidence from recent work suggesting that longer instruction files / clutter can degrade agent performance.
- 

### Discussion:
- are they overfitting to the dataset/benchmark? — discuss in class
    - test time learning

### 18.5 compare to newer slef improving systems:
  - include follow up / future work
    - claude code
    - openclaw
    - agents.md

### 19. Future work
- Constructive follow-up slide.
- What would make the next paper stronger:
  - optimize model + scaffold jointly
  - use dynamic or generated benchmarks to reduce overfitting
  - compare against current coding agents with leaner harnesses 


### 21. Final takeaway
- Final verdict slide.
- Suggested message:
  - SICA is a real proof that an agent can edit its own scaffold
  - the strongest gains come from practical tooling/context-management changes
  - this is more convincing as automated scaffold engineering than as open-ended recursive self-improvement
- 

## Asset / reference slides to include in the main deck or appendix

### 22. Paper figure bank
- A slide or appendix section containing the important figures you may want to reuse later.
- Include labels for:
  - loop figure
  - algorithm / method figure
  - utility function figure
  - context / setup figure
  - main result curve
- Purpose: one place to quickly find paper visuals while building the final deck.

### 23. Prompt reference slide
- A slide or appendix section with
  - main orchestrator prompt
  - base sub-agent prompt
  - overseer prompt


### 24. Tool inventory reference slide
- One slide with the starting tool inventory and agent roles in a compact readable form.
- This can be used if someone asks whether the system really starts simple.
- Purpose: support the "too many tools / too much prompt/context" critique.

## Backup slides

### Backup 1. Full algorithm / pseudocode
- Show the algorithm or a simplified pseudocode version of the loop.
- Use when someone wants the exact optimization procedure.

### Backup 2. Exact utility function
- Show the full utility equation and timeout penalty.
- Use when discussing how score, time, and cost are combined.

### Backup 3. Exact benchmark setup
- Include:
  - SWE-Bench subset note
  - LiveCodeBench random sampling note
  - synthetic benchmark definitions
- Use when someone challenges the evaluation details.

### Backup 4. Exact tool and role breakdown
- Include the role list and their tool access.
- Use to defend the context-bloat critique with specifics.

### Backup 5. Prompt excerpts
- Include longer excerpts from the main prompt and overseer prompt.
- Use if someone asks how much behavior comes from prompting vs tool changes.


### Backup 8. Context-bloat evidence
- Include the two supporting references from your notes:
  - `agents.md` hurting performance -- cite https://arxiv.org/pdf/2602.11988
  - long/cluttered context hurting performance -- https://arxiv.org/pdf/2602.11988
  cite chroma research -- https://research.trychroma.com/context-rot
    --  they put information in a long text and then try to retreive it. -->
- Use to support the hypothesis that the starting scaffold is partly the problem.

## Concrete assets to gather later

### Figures from the paper folder
- `res/a self improving coding agent paper/_page_1_Figure_0.jpeg`
- `res/a self improving coding agent paper/_page_4_Figure_7.jpeg`
- `res/a self improving coding agent paper/2504.15228v2.md`

### Extracted figures from your notes folder
- `res/notes/_page_1_Figure_0.jpeg`
- `res/notes/image.png`
- `res/notes/image 1.png`
- `res/notes/image 2.png`
- `res/notes/image 3.png`
- `res/notes/image 4.png`
- `res/notes/image 5.png`
- `res/notes/image 6.png`
- `res/notes/image 7.png`
- `res/notes/image 8.png`

### Prompt locations in the paper markdown
- `A Agent Prompts`
- `A.1 Base Sub-Agent Prompts`
- `A.2 Overseer Prompt`
- `C Function Calling Interface`

