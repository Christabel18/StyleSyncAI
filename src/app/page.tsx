import Link from "next/link";
import { ArrowRight, Zap, Camera, ScanSearch, Brain, Palette, MessageCircle } from "lucide-react";
import { STYLES } from "@/lib/styleConfig";
import { NovaAvatar, AvaAvatar, IvyAvatar } from "@/components/PersonaAvatars";

const STEPS = [
  { emoji: "🎨", n: "01", title: "Pick your vibe", body: "Choose from 8 aesthetics or swipe through looks to find your style DNA." },
  { emoji: "📸", n: "02", title: "Snap & upload", body: "Drop your OOTD. Our AI reads every item, color, and pattern." },
  { emoji: "⚡", n: "03", title: "Get scored", body: "See your style match + color harmony score in seconds." },
  { emoji: "🧠", n: "04", title: "Level up", body: "Your stylist gets smarter every look. Hyper-personalized over time." },
];

const FEATURES = [
  { icon: ScanSearch, title: "Vision AI", body: "Azure-powered outfit scanning detects your pieces, colors & patterns." },
  { icon: Palette, title: "Style scoring", body: "Overall, style-match, and color-harmony — see exactly where you stand." },
  { icon: MessageCircle, title: "Your AI stylist", body: "Nova, Ava, or Ivy gives you real talk & personalized tips." },
  { icon: Brain, title: "Style memory", body: "Remembers your fave colors and pieces. Gets better with every fit." },
];

const STYLE_EMOJIS: Record<string, string> = {
  streetwear: "🔥", minimalist: "🤍", classic: "✨", bohemian: "🌿",
  sporty: "⚡", preppy: "🎀", edgy: "🖤", business: "💼",
  "avant-garde": "🎭", "casual-cool": "😎",
};

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-cream">
        {/* Soft colour blobs — accents only */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-pop-purple/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-64 w-64 rounded-full bg-pop-pink/8 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium uppercase tracking-widest text-ink-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pop-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pop-green" />
              </span>
              AI-powered personal stylist
            </span>

            <h1 className="mt-6 text-6xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-7xl">
              <span aria-label="Dress like the best version of you.">
                Dress like the{" "}
                <span className="gradient-text" aria-hidden="true">best version</span>{" "}
                of you.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-xl leading-relaxed text-ink-soft">
              StyleSync AI understands your wardrobe, learns your taste, and
              helps you build outfits with confidence — one look at a time.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="btn-shimmer inline-flex h-13 items-center gap-2 rounded-full px-8 text-base font-semibold shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                Get started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/upload"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-line bg-white px-8 text-base font-semibold text-ink transition-colors hover:border-ink"
              >
                <Camera className="h-5 w-5" />
                Analyze an outfit
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#9b5de5","#f15bb5","#fee440","#00bbf9"].map(c => (
                  <div key={c} className="h-8 w-8 rounded-full border-2 border-cream" style={{ background: c }} />
                ))}
              </div>
              <p className="text-base text-muted">
                <strong className="text-ink">1,000+</strong> fits analyzed this week
              </p>
            </div>
          </div>

          {/* Demo card — editorial, cream */}
          <div className="mx-auto w-full max-w-sm animate-float-up">
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="overflow-hidden rounded-full" style={{ boxShadow: "0 0 0 3px #eef0fd, 0 0 0 5px #5b61e8" }}>
                  <NovaAvatar size={52} />
                </div>
                <div>
                  <p className="font-semibold text-ink">Nova</p>
                  <p className="text-xs uppercase tracking-wider text-muted">Streetwear stylist</p>
                </div>
                <span className="ml-auto rounded-full bg-clay px-3 py-1 text-sm font-semibold text-white">82</span>
              </div>
              <div className="mt-4 rounded-2xl rounded-tl-sm bg-nova p-3 text-sm text-white">
                This fit is giving streetwear ✦ Add a silver chain and you&apos;re serving.
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["hoodie 94%", "sneakers 93%", "cargo 91%"].map(t => (
                  <span key={t} className="rounded-full bg-sand px-2.5 py-1 text-xs text-ink-soft">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                {["#000000","#FFFFFF","#5b61e8","#b45f45"].map(c => (
                  <span key={c} className="h-7 w-7 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-y border-line bg-sand/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="rounded-full bg-pop-purple/10 px-4 py-2 text-sm font-medium text-pop-purple">How it works</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Four steps to your <span className="gradient-text">glow-up</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.title} className="group relative overflow-hidden rounded-3xl border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="absolute -right-4 -top-4 text-6xl opacity-5 transition-opacity group-hover:opacity-10">{s.emoji}</div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{s.emoji}</span>
                  <span className="text-3xl font-semibold text-line">{s.n}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="rounded-full bg-pop-pink/10 px-4 py-2 text-sm font-medium text-pop-purple">Features</span>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Everything you need to find your look.
              </h2>
              <p className="mt-4 max-w-md text-lg text-ink-soft">
                Real AI (Azure Vision + GPT) + rule-based scoring + a stylist who actually remembers you.
              </p>
              <Link href="/onboarding" className="mt-6 inline-flex h-13 items-center gap-2 rounded-full bg-ink px-8 text-base font-semibold text-cream transition-colors hover:bg-clay">
                Find your style <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-3xl border border-line bg-white p-6 transition-all hover:shadow-sm">
                  <span className="flex h-13 w-13 items-center justify-center rounded-full bg-sand text-clay">
                    <f.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MEET THE STYLISTS ── */}
      <section className="border-t border-line bg-sand/40 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="rounded-full bg-clay-soft px-4 py-2 text-sm font-medium text-clay">Your stylists</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              A stylist for every aesthetic.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">
              Your preferred style automatically assigns your stylist.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { Avatar: NovaAvatar, name: "Nova", color: "#5b61e8", bg: "#eef0fd", styles: "Streetwear · Y2K · Casual", blurb: "Warm, encouraging, always finds something to love first.", quote: "This fit is giving! Add a chain and you're done. 🔥" },
              { Avatar: AvaAvatar, name: "Ava", color: "#7c8a72", bg: "#eff2ed", styles: "Minimalist · Clean Girl · Preppy", blurb: "Direct and fierce — she'll push you to be bolder.", quote: "We need more edge. Add something unexpected." },
              { Avatar: IvyAvatar, name: "Ivy", color: "#2f5e4e", bg: "#e8f0ee", styles: "Classic · Old Money · Bohemian", blurb: "Precise, analytical, backed by color theory every time.", quote: "Color harmony: 75. Here's exactly why..." },
            ].map(({ Avatar, name, color, bg, styles, blurb, quote }) => (
              <div key={name} className="rounded-3xl border p-7 text-center transition-all hover:-translate-y-1 hover:shadow-md" style={{ borderColor: color + "40", background: bg }}>
                <div className="mx-auto overflow-hidden rounded-full border-4 w-fit shadow-md" style={{ borderColor: color + "40" }}>
                  <Avatar size={112} />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-ink">{name}</h3>
                <p className="text-sm font-semibold uppercase tracking-wider" style={{ color }}>{styles}</p>
                <p className="mt-2 text-base text-muted">{blurb}</p>
                <div className="mt-4 rounded-xl px-3 py-2.5 text-base italic" style={{ background: color + "15", color }}>
                  &ldquo;{quote}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-white px-8 py-14 text-center">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pop-purple/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-pop-pink/8 blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                What&apos;s your <span className="gradient-text">aesthetic?</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">
                Pick one and your stylist is ready. Takes 10 seconds.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {STYLES.map((s) => (
                  <Link key={s.id} href="/onboarding"
                    className="rounded-full border border-line bg-cream px-4 py-2 text-base text-ink-soft transition-all hover:border-clay hover:text-clay"
                  >
                    {STYLE_EMOJIS[s.id]} {s.name}
                  </Link>
                ))}
              </div>
              <Link href="/onboarding"
                className="btn-shimmer mt-8 inline-flex h-13 items-center gap-2 rounded-full px-10 text-base font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Zap className="h-5 w-5" />
                Start my style journey
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
