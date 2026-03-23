
## Slide 5:
- AlphaEvolve:
    - take a base program
    - improve 
    - test against base
    - only works for highly structured problems


## Slide 10:
- Overseer can add messages into agent context
- Can cancel agents

## Slide 11:
- the open files and directory tree is context bloat the agent could just run grep or ls or search using glob
- also the core prompt includes all open files and contents. this is also context bloat

## Slide 17:
- file_editing: Given a real repo at a pre-change commit and the desired target file contents, edit the file so it exactly matches the target version.(src:  base_agent/src/benchmarks/file_editing.py:397)
- symbol_location: Given a symbol usage in a real repo, find and return the exact file, line, and column where that symbol is defined. (src: base_agent/src/benchmarks/symbol_location.py:233)

## Slide 18:
- coming up with novel ideas is difficult (takes a lot of turns)
- a bad idea hast long and expensive consequences because it lingers for several iterations
- the 5 min timeout might be quite low

## Slide 21:
- AIME 2024 — American Invitational Mathematics Examination, testing olympiad-level mathematical reasoning
- GPQA Diamond — These graduate-level physics, biology, and chemistry questions can only be consistently solved by domain experts with PhDs, making them ideal for testing true scientific reasoning capabilities. — The most challenging 198 questions from GPQA, where PhD experts achieve 65% accuracy but skilled non-experts only reach 34% despite web access.



