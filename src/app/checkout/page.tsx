"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CheckCircle, Lock } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState<"cart" | "details" | "confirm">("cart");

  if (step === "confirm") {
    return <OrderConfirmed />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-base text-ink-soft transition-colors hover:text-clay"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to outfit upgrade
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Checkout
        </h1>
        <span className="ml-auto flex items-center gap-1.5 text-sm text-muted">
          <Lock className="h-3.5 w-3.5" />
          Secure checkout
        </span>
      </div>

      {/* Steps indicator */}
      <div className="mt-6 flex items-center gap-2">
        {["Cart", "Your details", "Confirm"].map((s, i) => {
          const stepMap = ["cart", "details", "confirm"];
          const active = stepMap[i] === step;
          const done = stepMap.indexOf(step) > i;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                active ? "bg-ink text-cream" : done ? "bg-clay text-white" : "bg-sand text-muted"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-sm ${active ? "font-semibold text-ink" : "text-muted"}`}>{s}</span>
              {i < 2 && <div className="h-px w-8 bg-line" />}
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

        {/* Left — form */}
        <div>
          {step === "cart" && <CartStep onNext={() => setStep("details")} />}
          {step === "details" && <DetailsStep onNext={() => setStep("confirm")} onBack={() => setStep("cart")} />}
        </div>

        {/* Right — order summary */}
        <OrderSummary />
      </div>
    </div>
  );
}

// ── Cart step ─────────────────────────────────────────────────────────────────
function CartStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-ink">Your cart</h2>

      <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
        {/* Mini jacket icon */}
        <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl bg-sand">
          <span className="text-3xl">🧥</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-ink">Vibrant Yellow Hoodie</p>
          <p className="text-sm text-muted">Size: M · Qty: 1</p>
          <p className="mt-1 text-sm font-medium text-clay">Nova&apos;s Pick ✦</p>
        </div>
        <p className="text-lg font-semibold text-ink">$45.00</p>
      </div>

      <div className="rounded-2xl border border-line bg-sand/30 p-4 space-y-2 text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Subtotal</span><span>$45.00</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Shipping</span><span className="text-clay font-medium">Free</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Estimated tax</span><span>$3.60</span>
        </div>
        <div className="h-px bg-line" />
        <div className="flex justify-between font-semibold text-ink text-base">
          <span>Total</span><span>$48.60</span>
        </div>
      </div>

      <button
        onClick={onNext}
        className="btn-shimmer inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-semibold transition-transform hover:scale-105 active:scale-95"
      >
        Continue to details
      </button>
    </div>
  );
}

// ── Details step ──────────────────────────────────────────────────────────────
function DetailsStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-ink">Your details</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">First name</label>
          <input defaultValue="Alex" className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Last name</label>
          <input defaultValue="Johnson" className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
        <input defaultValue="alex@outfitted.ai" className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Shipping address</label>
        <input defaultValue="1 Microsoft Way, Redmond, WA 98052" className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Card number</label>
        <input defaultValue="4242 4242 4242 4242" className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Expiry</label>
          <input defaultValue="12/27" className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">CVV</label>
          <input defaultValue="123" className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none" />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="btn-shimmer inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
        >
          <Lock className="h-4 w-4" />
          Place order — $48.60
        </button>
      </div>
    </div>
  );
}

// ── Order summary sidebar ─────────────────────────────────────────────────────
function OrderSummary() {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 space-y-5 h-fit">
      <h3 className="font-display text-lg font-semibold text-ink">Order summary</h3>

      <div className="flex items-center gap-3">
        <div className="flex h-14 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: "#fff7cc" }}>🌟</div>
        <div>
          <p className="font-medium text-ink text-sm">Vibrant Yellow Hoodie</p>
          <p className="text-xs text-muted">Size M · Nova&apos;s Pick</p>
        </div>
        <p className="ml-auto font-semibold text-ink">$45.00</p>
      </div>

      <div className="h-px bg-line" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-ink-soft"><span>Subtotal</span><span>$45.00</span></div>
        <div className="flex justify-between text-ink-soft"><span>Shipping</span><span className="text-clay font-medium">Free</span></div>
        <div className="flex justify-between text-ink-soft"><span>Tax</span><span>$3.60</span></div>
        <div className="h-px bg-line" />
        <div className="flex justify-between font-semibold text-ink text-base"><span>Total</span><span>$48.60</span></div>
      </div>

      <div className="rounded-xl bg-sand/50 p-3 flex items-center gap-2">
        <Lock className="h-4 w-4 text-clay shrink-0" />
        <p className="text-xs text-muted">Secured by <strong className="text-ink">Microsoft OutFitted</strong>. Demo only — no real charge.</p>
      </div>
    </div>
  );
}

// ── Order confirmed ───────────────────────────────────────────────────────────
function OrderConfirmed() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-clay-soft text-clay">
        <CheckCircle className="h-10 w-10" />
      </div>

      <h1 className="mt-6 font-display text-4xl font-semibold text-ink">
        Order placed! 🎉
      </h1>
      <p className="mt-3 text-lg text-ink-soft">
        Your Vibrant Yellow Hoodie is on its way. Your stylist will remember
        this purchase to refine your future recommendations.
      </p>

      <div className="mt-8 w-full rounded-3xl border border-line bg-white p-6 text-left space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted">Order details</p>
        <div className="flex justify-between text-sm"><span className="text-muted">Order #</span><span className="font-medium text-ink">OFT-2026-00142</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Item</span><span className="font-medium text-ink">Vibrant Yellow Hoodie</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Total</span><span className="font-medium text-ink">$48.60</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Delivery</span><span className="font-medium text-clay">3–5 business days</span></div>
      </div>

      <div className="mt-8 flex flex-col gap-3 w-full">
        <Link
          href="/upload"
          className="btn-shimmer inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-base font-semibold"
        >
          Analyze another outfit
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line py-3.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
