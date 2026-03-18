/**
 * GET /api/cron/refresh-stats
 *
 * Runs every 15 minutes (configured in vercel.json or via external cron).
 * Refreshes cached analytics, payment stats, and status snapshots.
 *
 * Auth: Bearer token via CRON_SECRET env var.
 * Vercel Cron: add to vercel.json → { "crons": [{ "path": "/api/cron/refresh-stats", "schedule": "0,15,30,45 * * * *" }] }
 * External cron (VPS): `*/15 * * * *` curl -H "Authorization: Bearer $CRON_SECRET" https://example.com/api/cron/refresh-stats
 */

import { NextRequest, NextResponse } from "next/server";
import { loadBrandConfig } from "@/lib/brand";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface StatSnapshot {
  brandId:         string;
  domain:          string;
  snapshotAt:      string;
  nowpaymentsOk:   boolean;
  dnsOk:           boolean;
  responseMs:      number;
  ga: {
    configured:    boolean;
    measurementId: string | null;
  };
  cf: {
    beaconConfigured: boolean;
    dnsResolved:      boolean;
    resolvedTo:       string[];
  };
}

// Simple in-memory cache (replace with KV / DB in production)
let lastSnapshot: StatSnapshot | null = null;
let lastRun: Date | null = null;

export async function GET(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const start = Date.now();
  const brand = await loadBrandConfig();

  // ── NOWPayments health ───────────────────────────────────────────────────────
  let nowpaymentsOk = false;
  try {
    const res = await fetch("https://api.nowpayments.io/v1/status", {
      signal: AbortSignal.timeout(5000),
    });
    nowpaymentsOk = res.ok;
  } catch { /* ignore */ }

  // ── DNS check ───────────────────────────────────────────────────────────────
  let dnsOk = false;
  let resolvedTo: string[] = [];
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${brand.domain}&type=A`,
      { headers: { Accept: "application/dns-json" }, signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const data = await res.json();
      resolvedTo = (data?.Answer ?? []).map((a: { data: string }) => a.data);
      dnsOk = resolvedTo.length > 0;
    }
  } catch { /* ignore */ }

  const snapshot: StatSnapshot = {
    brandId:       brand.id,
    domain:        brand.domain,
    snapshotAt:    new Date().toISOString(),
    nowpaymentsOk,
    dnsOk,
    responseMs:    Date.now() - start,
    ga: {
      configured:    !!process.env.NEXT_PUBLIC_GA_ID,
      measurementId: process.env.NEXT_PUBLIC_GA_ID ?? null,
    },
    cf: {
      beaconConfigured: !!process.env.NEXT_PUBLIC_CF_BEACON,
      dnsResolved:      dnsOk,
      resolvedTo,
    },
  };

  // Cache the snapshot
  lastSnapshot = snapshot;
  lastRun = new Date();

  // In production: persist to Vercel KV / Upstash / your DB here
  // await kv.set(`status:${brand.id}`, JSON.stringify(snapshot), { ex: 1800 });

  return NextResponse.json({
    ok:       true,
    snapshot,
    nextRunIn: "15 minutes",
    cachedAt:  lastRun.toISOString(),
  });
}

/** GET /api/cron/refresh-stats?cached=1 — return last cached snapshot without re-running */
export async function POST() {
  if (!lastSnapshot) {
    return NextResponse.json({ ok: false, message: "No snapshot yet. Call GET first." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, snapshot: lastSnapshot, cachedAt: lastRun?.toISOString() });
}
