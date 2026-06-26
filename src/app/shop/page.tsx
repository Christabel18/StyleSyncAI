import Link from "next/link";
import { ArrowLeft, Sparkles, ShoppingBag, Star } from "lucide-react";
export default function ShopPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">

      {/* Back */}
      <Link
        href="/results"
        className="inline-flex items-center gap-2 text-base text-ink-soft transition-colors hover:text-clay"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to your style report
      </Link>

      {/* Header */}
      <div className="mt-6">
        <span className="text-sm font-medium uppercase tracking-widest text-clay">
          Stylist&apos;s pick
        </span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Elevate your look ✦
        </h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Your stylist analysed your current outfit — black tee, wide-leg jeans,
          gold chain — and found the one piece that would take it somewhere.
        </p>
      </div>

      {/* Product card */}
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">

        {/* Product image */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-[#fffbe6]">
          {/* AI badge */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-ink/90 px-3 py-1.5 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-clay" />
            <span className="text-xs font-semibold text-cream">Nova&apos;s Pick</span>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/yellow-hoodie.jpg"
              alt="Vibrant Yellow Hoodie — Nova's pick"
              className="h-full w-full object-contain p-6"
            />
          </div>
        </div>

        {/* Product details */}
        <div className="space-y-6">

          {/* Nova quote */}
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-base text-white"
                style={{ background: "#5b61e8" }}
              >
                ✦
              </div>
              <div>
                <p className="font-semibold text-ink">Nova says</p>
                <p className="text-xs text-muted">Your streetwear stylist</p>
              </div>
            </div>
            <p className="mt-3 text-base italic leading-relaxed text-ink-soft">
              &ldquo;Black tee and wide-leg jeans is a solid base but it needs a
              pop. A yellow hoodie tied around the waist or worn open adds
              instant vibrance — the contrast with your dark tones is
              everything. This is the move.&rdquo;
            </p>
          </div>

          {/* Stars + name */}
          <div>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-4 w-4 fill-clay text-clay" />
              ))}
              <span className="text-sm text-muted">4.8 · 214 reviews</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
              Vibrant Yellow Hoodie
            </h2>
            <p className="mt-1 text-muted">Oversized fit · Unisex · Sizes XS–XXL</p>
          </div>

          {/* Why this works */}
          <div className="rounded-2xl bg-[#fffbe6] border border-[#ffe566] p-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">
              Why this works with your outfit
            </p>
            <ul className="space-y-2">
              {[
                "Yellow pops against your black tee — instant energy",
                "Wide-leg jeans + oversized hoodie = balanced silhouette",
                "Gold chain picks up the warm yellow tone perfectly",
              ].map(tip => (
                <li key={tip} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD600]" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-ink">$45.00</p>
              <p className="text-sm text-muted">Free shipping · Easy returns</p>
            </div>
          </div>

          <Link
            href="/checkout"
            className="btn-shimmer inline-flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-semibold transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="h-5 w-5" />
            Buy at Microsoft OutFitted
          </Link>

          <p className="text-center text-xs text-muted">
            Sold exclusively through{" "}
            <span className="font-semibold text-ink">Microsoft OutFitted</span> —
            your AI-curated fashion marketplace
          </p>
        </div>
      </div>

      {/* More picks teaser */}
      <div className="mt-16 rounded-3xl border border-line bg-white p-8 text-center">
        <p className="font-display text-2xl font-semibold text-ink">
          More pieces your stylist picked for you
        </p>
        <p className="mt-2 text-muted">
          Analyze more outfits to unlock your full personalised shop.
        </p>
        <Link
          href="/upload"
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-cream transition-colors hover:bg-clay"
        >
          <Sparkles className="h-4 w-4" />
          Analyze another outfit
        </Link>
      </div>

    </div>
  );
}
