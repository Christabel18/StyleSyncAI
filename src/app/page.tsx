import Link from "next/link";
import { ArrowRight, Zap, Camera } from "lucide-react";
import { STYLES } from "@/lib/styleConfig";
import { NovaAvatar, AvaAvatar, IvyAvatar } from "@/components/PersonaAvatars";

const STEPS = [
  { emoji: "🎨", n: "01", title: "Pick your vibe", body: "Choose from 8 aesthetics or swipe through looks to find your style DNA." },
  { emoji: "📸", n: "02", title: "Snap & upload", body: "Drop your OOTD. Our AI reads every item, color, and pattern." },
  { emoji: "⚡", n: "03", title: "Get scored", body: "See your style match + color harmony score in seconds. It's giving." },
  { emoji: "🧠", n: "04", title: "Level up", body: "Your stylist gets smarter every look. Hyper-personalized over time." },
];

const FEATURES = [
  { emoji: "👁️", title: "Vision AI", body: "Azure-powered outfit scanning detects your pieces, colors & patterns." },
  { emoji: "🎯", title: "Style scoring", body: "Overall, style-match, and color-harmony — see exactly where you stand." },
  { emoji: "💬", title: "Your AI bestie", body: "Nova, Ava, or Ivy slides into your feed with real talk & tips." },
  { emoji: "📖", title: "Style memory", body: "Remembers your fave colors and pieces. Gets better with every fit." },
];

const STYLE_EMOJIS: Record<string, string> = {
  streetwear: "🔥", minimalist: "🤍", classic: "✨", bohemian: "🌿",
  sporty: "⚡", preppy: "🎀", edgy: "🖤", romantic: "🌸",
};

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[90vh] overflow-hidden bg-ink">
        <div className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-pop-purple/30 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 top-20 h-[400px] w-[400px] rounded-full bg-pop-pink/20 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-pop-cyan/10 blur-[80px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
          <div className="animate-float-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pop-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pop-green" />
              </span>
              AI-powered &middot; free to use &middot; no cap
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[1.0] tracking-tight text-white sm:text-7xl">
              Your fits,{" "}
              <span className="gradient-text">but make it</span>
              <br />
              <span className="gradient-text">AI.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
              Upload your OOTD, get a style score, and get inspired by your
              personal AI stylist. No filter needed.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="btn-shimmer inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Find my style ✦
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/upload"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                <Camera className="h-4 w-4" />
                Analyze my fit
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#9b5de5","#f15bb5","#fee440","#00bbf9"].map(c => (
                  <div key={c} className="h-7 w-7 rounded-full border-2 border-ink" style={{ background: c }} />
                ))}
              </div>
              <p className="text-sm text-white/50">
                <strong className="text-white">1,000+</strong> fits analyzed this week 🔥
              </p>
            </div>
          </div>

          {/* Demo chat card */}
          <div className="mx-auto w-full max-w-sm animate-float-up">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-pop-pink" />
                  <div className="h-2.5 w-2.5 rounded-full bg-pop-yellow" />
                  <div className="h-2.5 w-2.5 rounded-full bg-pop-green" />
                </div>
                <span className="mx-auto text-xs font-medium text-white/40">stylesync &middot; nova</span>
              </div>

              <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Overall score</p>
                  <p className="text-3xl font-black text-white">82 <span className="text-lg text-white/40">/100</span></p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40">Style match</div>
                  <div className="font-bold text-pop-cyan">90%</div>
                  <div className="text-xs text-white/40">Color harmony</div>
                  <div className="font-bold text-pop-green">75%</div>
                </div>
              </div>

              <div className="flex items-end gap-3">
                <div className="shrink-0 overflow-hidden rounded-full" style={{ boxShadow: "0 0 0 2px #5b61e8" }}>
                  <NovaAvatar size={48} />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-nova p-3 text-sm text-white shadow">
                  ok bestie this fit is giving streetwear ✦ add a silver chain and you&apos;re serving 🔥
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {["hoodie 94%","sneakers 93%","cargo 91%","cap 85%"].map(t => (
                  <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="rounded-full bg-pop-purple/10 px-4 py-1.5 text-sm font-semibold text-pop-purple">
              How it works
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">
              Four steps to your <span className="gradient-text">glow-up</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.title} className="group relative overflow-hidden rounded-3xl border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute -right-4 -top-4 text-6xl opacity-10 transition-opacity group-hover:opacity-20">{s.emoji}</div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{s.emoji}</span>
                  <span className="text-2xl font-black text-line">{s.n}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-ink py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="rounded-full bg-pop-pink/20 px-4 py-1.5 text-sm font-semibold text-pop-pink">Features</span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Not just a <span className="gradient-text-2">vibe check.</span>
                <br />It&apos;s science.
              </h2>
              <p className="mt-4 max-w-md text-white/60">Real AI (Azure Vision + GPT) + rule-based scoring + a stylist who actually remembers you.</p>
              <Link href="/onboarding" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-ink transition-colors hover:bg-pop-yellow">
                Let&apos;s go <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:bg-white/10">
                  <span className="text-3xl">{f.emoji}</span>
                  <h3 className="mt-3 text-base font-bold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/50">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MEET THE STYLISTS */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="rounded-full bg-clay-soft px-4 py-1.5 text-sm font-semibold text-clay">Your stylists</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">
              Pick your <span className="gradient-text">bestie.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">Each stylist has a different personality. Your preferred style picks yours automatically.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { Avatar: NovaAvatar, name: "Nova", color: "#5b61e8", bg: "#eef0fd", styles: "Streetwear · Y2K · Casual", blurb: "Your hype girl. Warm, encouraging, always finds something to love first.", quote: '"okay bestie this is giving!! 🔥"', badge: "#1" },
              { Avatar: AvaAvatar, name: "Ava", color: "#7c8a72", bg: "#eff2ed", styles: "Minimalist · Clean Girl · Preppy", blurb: "The bold fashion editor. Direct, fierce, and she will push you to be bolder.", quote: '"we need more edge. add something unexpected."', badge: null },
              { Avatar: IvyAvatar, name: "Ivy", color: "#2f5e4e", bg: "#e8f0ee", styles: "Classic · Old Money · Bohemian", blurb: "The analytical stylist. Color theory, proportions, data-backed advice.", quote: '"color harmony score: 75. here\'s why..."', badge: null },
            ].map(({ Avatar, name, color, bg, styles, blurb, quote, badge }) => (
              <div key={name} className="group relative overflow-hidden rounded-3xl border p-8 text-center transition-all hover:-translate-y-1 hover:shadow-xl" style={{ borderColor: color + "50", background: bg }}>
                <div className="relative mx-auto w-fit">
                  <div className="mx-auto overflow-hidden rounded-full border-4 shadow-lg" style={{ borderColor: color + "50", boxShadow: `0 8px 24px ${color}30` }}>
                    <Avatar size={100} />
                  </div>
                  {badge && <span className="absolute -right-1 -top-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: color }}>{badge}</span>}
                </div>
                <h3 className="mt-4 text-2xl font-black text-ink">{name}</h3>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{styles}</p>
                <p className="mt-2 text-sm text-muted">{blurb}</p>
                <div className="mt-4 rounded-xl px-3 py-2 text-sm italic" style={{ background: color + "15", color }}>
                  {quote}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-sand/40 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pop-purple/30 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-pop-pink/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                What&apos;s your <span className="gradient-text">aesthetic?</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-white/60">Pick one and your stylist is ready. Takes 10 seconds.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {STYLES.map((s) => (
                  <Link key={s.id} href="/onboarding"
                    className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition-all hover:border-white/40 hover:bg-white/20 hover:text-white"
                  >
                    {STYLE_EMOJIS[s.id]} {s.name}
                  </Link>
                ))}
              </div>
              <Link href="/onboarding"
                className="btn-shimmer mt-8 inline-flex h-12 items-center gap-2 rounded-full px-10 text-sm font-black shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                <Zap className="h-4 w-4" />
                Start my style journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 text-sm text-muted sm:flex-row sm:px-8">
          <p>StyleSync AI — HackyGirls for the Win 🏆</p>
          <p>Built with 💜 + Azure Vision + GPT</p>
        </div>
      </footer>
    </div>
  );
}
