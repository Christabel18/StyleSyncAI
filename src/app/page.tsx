import {
  ArrowRight,
  Compass,
  UploadCloud,
  ScanSearch,
  Brain,
  Palette,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { STYLES } from "@/lib/styles";
import { PERSONAS } from "@/lib/personas";

const STEPS = [
  {
    icon: Compass,
    title: "Discover",
    body: "Pick the aesthetic you're going for, or swipe a few looks to find it.",
  },
  {
    icon: UploadCloud,
    title: "Upload",
    body: "Snap or upload your outfit. We read the items, colors, and patterns.",
  },
  {
    icon: ScanSearch,
    title: "Analyze",
    body: "Get a style score and see exactly how the look reads.",
  },
  {
    icon: Brain,
    title: "Remember",
    body: "Your stylist learns your colors and favorites over time.",
  },
];

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Outfit analysis",
    body: "Detects tops, bottoms, shoes, accessories, colors, and patterns from a single photo.",
  },
  {
    icon: Palette,
    title: "Style scoring",
    body: "Overall, style-match, and color-harmony scores make every fit feel like a game.",
  },
  {
    icon: MessageCircle,
    title: "AI stylist",
    body: "A dedicated persona — Nova, Ava, or Ivy — talks you through every recommendation.",
  },
  {
    icon: Sparkles,
    title: "Style memory",
    body: "Remembers your go-to colors and pieces so advice gets more personal each time.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-clay-soft blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-sand blur-3xl" />
        <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-clay" />
              Your personal AI stylist
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Dress like the
              <br />
              <span className="text-clay">best version</span> of you.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              StyleSync AI understands your wardrobe, learns your taste, and
              helps you build outfits with confidence — one look at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/onboarding" size="lg">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/upload" size="lg" variant="outline">
                Analyze an outfit
              </Button>
            </div>
          </div>

          {/* Decorative preview card */}
          <div className="relative mx-auto w-full max-w-sm animate-float-up">
            <div className="rounded-[2rem] border border-line bg-card p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nova font-display text-lg text-white">
                  ✦
                </span>
                <div>
                  <p className="font-display font-semibold text-ink">Nova</p>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Streetwear stylist
                  </p>
                </div>
                <span className="ml-auto rounded-full bg-clay px-3 py-1 text-sm font-semibold text-white">
                  82
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                “This outfit already aligns well with your streetwear
                preferences. To elevate it…”
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink">
                {["Add a silver chain", "Layer an oversized flannel", "Try chunkier sneakers"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-nova" />
                      {t}
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-5 flex gap-2">
                {["#1b1a17", "#f8f6f1", "#5b61e8", "#b45f45"].map((c) => (
                  <span
                    key={c}
                    className="h-7 w-7 rounded-full ring-1 ring-black/5"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-sand/40 py-16 sm:py-20">
        <Container>
          <h2 className="text-center font-display text-3xl font-semibold text-ink sm:text-4xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="rounded-3xl border border-line bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-clay-soft text-clay">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl text-line">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Everything you need to find your look.
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              From the first photo to a wardrobe that knows you, StyleSync AI
              turns getting dressed into something effortless.
            </p>
            <Button href="/onboarding" className="mt-6">
              Find your style
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-line bg-card p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-clay">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Personas */}
      <section className="border-t border-line bg-ink py-16 text-cream sm:py-24">
        <Container>
          <div className="text-center">
            <span className="text-xs uppercase tracking-widest text-cream/60">
              Meet your stylists
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              A stylist for every aesthetic.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {Object.values(PERSONAS).map((p) => (
              <div
                key={p.id}
                className="rounded-3xl border border-cream/10 bg-cream/5 p-7 text-center"
              >
                <span
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl text-white"
                  style={{ background: p.accentVar }}
                >
                  {p.emoji}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  {p.name}
                </h3>
                <p className="text-sm uppercase tracking-wider text-cream/50">
                  {p.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">
                  {p.blurb}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-card px-8 py-14 text-center">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-clay-soft blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                Ready to meet your stylist?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-ink-soft">
                Pick your aesthetic, upload a look, and get personalized advice
                in seconds.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {STYLES.slice(0, 5).map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full border border-line bg-cream px-4 py-1.5 text-sm text-ink-soft"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
              <Button href="/onboarding" size="lg" className="mt-8">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-line py-8">
        <Container className="flex flex-col items-center justify-between gap-2 text-sm text-muted sm:flex-row">
          <p>StyleSync AI — HackyGirls for the Win</p>
          <p>Your personal stylist, powered by AI.</p>
        </Container>
      </footer>
    </div>
  );
}
