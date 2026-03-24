import speakerNotesSource from "../res/speaker_notes.md?raw";

export type SpeakerNotesBySlide = Record<number, string[]>;

function normalizeLine(line: string) {
  return line.replace(/\t/g, "    ").replace(/\s+$/g, "");
}

export function parseSpeakerNotes(markdown: string): SpeakerNotesBySlide {
  const notesBySlide: SpeakerNotesBySlide = {};
  const lines = markdown.split(/\r?\n/);

  let currentSlideNumber: number | null = null;

  for (const rawLine of lines) {
    const line = normalizeLine(rawLine);
    const slideMatch = line.match(/^##\s+Slide\s+(\d+)\s*:?\s*$/i);

    if (slideMatch) {
      currentSlideNumber = Number.parseInt(slideMatch[1], 10);
      notesBySlide[currentSlideNumber] = [];
      continue;
    }

    if (currentSlideNumber === null || line.trim().length === 0) {
      continue;
    }

    notesBySlide[currentSlideNumber].push(line);
  }

  return notesBySlide;
}

export const speakerNotesBySlide = parseSpeakerNotes(speakerNotesSource);
