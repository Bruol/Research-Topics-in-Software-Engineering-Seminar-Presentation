const segments = [
  {
    label: "Benchmark score",
    value: 50,
    color: "var(--ink)",
    note: "",
    text: "#fff8ef",
    radius: "999px 0 0 999px",
  },
  {
    label: "Cost efficiency",
    value: 25,
    color: "var(--accent)",
    note: "cap: $10 USD",
    text: "#fff8ef",
    radius: "0",
  },
  {
    label: "Time efficiency",
    value: 25,
    color: "var(--highlight)",
    note: "cap: 300 seconds",
    text: "#fff8ef",
    radius: "0 999px 999px 0",
  },
] as const;

export function UtilityVisual() {
  return (
    <div className="w-full rounded-[1.75rem] bg-[var(--paper-warm)] p-6 text-[var(--ink)]">
      <div className="rounded-[1.5rem] border border-[rgba(18,18,18,0.12)] bg-white px-8 py-7">
        <div className="mb-6">
          <div className="font-serif text-[clamp(1.3rem,1.8vw,1.6rem)] leading-none text-[var(--ink)]">Utility weights</div>
          <div className="mt-2 font-mono text-[clamp(0.62rem,0.75vw,0.72rem)] uppercase tracking-[0.08em] text-[var(--muted)]">
            one blended objective across score, cost, and runtime
          </div>
        </div>

        <div className="mb-7 overflow-hidden rounded-full bg-[rgba(18,18,18,0.08)]">
          <div className="flex h-12 w-full">
            {segments.map((segment) => (
              <div
                key={segment.label}
                className="flex items-center justify-center font-serif text-[clamp(1rem,1.2vw,1.2rem)]"
                style={{
                  width: `${segment.value}%`,
                  background: segment.color,
                  color: segment.text,
                  borderRadius: segment.radius,
                }}
              >
                {segment.value}%
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-8 gap-y-3">
          {segments.map((segment) => (
            <div key={segment.label} className="contents">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: segment.color }} />
                <span className="truncate font-sans text-[clamp(0.95rem,1vw,1.05rem)] text-[var(--ink-soft)]">{segment.label}</span>
              </div>
              <div className="justify-self-end whitespace-nowrap font-mono text-[clamp(0.64rem,0.72vw,0.75rem)] uppercase tracking-[0.08em] text-[var(--muted)]">
                {segment.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
