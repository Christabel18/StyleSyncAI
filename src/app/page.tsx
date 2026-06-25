import Link from "next/link";
import { ArrowRight, Compass, UploadCloud, ScanSearch, Sparkles, MessageCircle, Brain, Palette } from "lucide-react";
import { STYLES, PERSONAS } from "@/lib/styleConfig";

const STEPS = [
  { icon: Compass, n: "01", title: "Discover", body: "Pick your aesthetic or swipe a few looks to find it." },
  { icon: UploadCloud, n: "02", title: "Upload", body: "Snap or upload your outfit — full body, good light." },
  { icon: ScanSearch, n: "03", title: "Analyze", body: "Azure Vision reads items, colors, and patterns instantly." },
  { icon: Brain, n: "04", title: "Remember", body: "Your stylist learns your palette and preferences over time." },
];

const FEATURES = [
  { icon: ScanSearch, title: "Outfit analysis", body: "Detects tops, bottoms, shoes, accessories, colors, and patterns." },
  { icon: Palette, title: "Style scoring", body: "Overall, style-match, and color-harmony scores per look." },
  { icon: MessageCircle, title: "AI stylist", body: "Nova, Ava, or Ivy talks you through every recommendation." },
  { icon: Brain, title: "Style memory", body: "Your go-to colors and pieces power more personal advice each time." },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-clay-soft/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-48 h-72 w-72 rounded-full bg-sand blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-clay" />
              Your personal AI stylist
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Dress like the{" "}
              <span className="text-clay">best version</span> of you.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              StyleSync AI understands your wardrobe, learns your taste, and
              helps you build outfits with confidence — one look at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-cream transition-colors hover:bg-clay"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/upload"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-7 text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
              >
                Analyze an outfit
              </Link>
            </div>
          </div>

          {/* Demo card */}
          <div className="mx-auto w-full max-w-sm animate-float-up">
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nova text-xl text-white">
                  ✦
                </span>
                <div>
                  <p className="font-semibold text-ink">Nova</p>
                  <p className="text-xs uppercase tracking-wider text-muted">Streetwear stylist</p>
                </div>
                <span className="ml-auto rounded-full bg-clay px-3 py-1 text-sm font-bold text-white">82</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                "This outfit already aligns well with your streetwear
                preferences. To elevate it…"
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink">
                {["Add a silver chain", "Layer an oversized flannel", "Try chunkier sneakers"].map(t => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-nova" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2">
                {["#000000", "#FFFFFF", "#5b61e8", "#b45f45"].map(c => (
                  <span key={c} className="h-7 w-7 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-line bg-sand/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-ink sm:text-4xl">How it works</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.title} className="rounded-3xl border border-line bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-clay-soft text-clay">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-3xl font-bold text-line">{s.n}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-ink sm:text-4xl">
                Everything you need to find your look.
              </h2>
              <p className="mt-4 max-w-md text-ink-soft">
                From the first photo to a wardrobe that knows you — StyleSync AI
                turns getting dressed into something effortless.
              </p>
              <Link
                href="/onboarding"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-cream transition-colors hover:bg-clay"
              >
                Find your style <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-3xl border border-line bg-white p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-clay">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Personas ── */}
      <section className="border-t border-line bg-ink py-16 text-cream sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs uppercase tracking-widest text-cream/60">Meet your stylists</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A stylist for every aesthetic.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {Object.values(PERSONAS).map((p) => (
              <div key={p.name} className="rounded-3xl border border-cream/10 bg-cream/5 p-7 text-center">
                <span
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white"
                  style={{ background: p.color }}
                >
                  {p.emoji}
                </span>
                <h3 className="mt-4 text-2xl font-bold">{p.name}</h3>
                <p className="text-sm uppercase tracking-wider text-cream/50">{p.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{p.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-white px-8 py-14 text-center">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-clay-soft/60 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-ink sm:text-4xl">
                Ready to meet your stylist?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-ink-soft">
                Pick your aesthetic, upload a look, and get personalized advice in seconds.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {STYLES.slice(0, 5).map((s) => (
                  <span key={s.id} className="rounded-full border border-line bg-cream px-4 py-1.5 text-sm text-ink-soft">
                    {s.name}
                  </span>
                ))}
              </div>
              <Link
                href="/onboarding"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-8 text-sm font-semibold text-cream transition-colors hover:bg-clay"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 text-sm text-muted sm:flex-row sm:px-8">
          <p>StyleSync AI — HackyGirls for the Win</p>
          <p>Your personal stylist, powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}
