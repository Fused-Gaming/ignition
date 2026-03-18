import { NextRequest, NextResponse } from "next/server";
import { loadBrandConfig } from "@/lib/brand";

interface PaymentRequestBody {
  packageId: string;
  packageName: string;
  price: number;
  credits: number;
  telegram: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentRequestBody = await req.json();

    // Validate telegram username
    const telegramRegex = /^@[a-zA-Z0-9_]{4,31}$/;
    if (!telegramRegex.test(body.telegram)) {
      return NextResponse.json({ message: "Invalid Telegram username" }, { status: 400 });
    }

    // Load brand config and validate package
    const brand = await loadBrandConfig();
    const validPackage = brand.creditPackages.find((pkg) => pkg.id === body.packageId);

    if (!validPackage) {
      return NextResponse.json({ message: "Invalid package" }, { status: 400 });
    }

    // Validate that submitted package details match the configured package
    if (
      validPackage.name !== body.packageName ||
      validPackage.price !== body.price ||
      validPackage.credits !== body.credits
    ) {
      return NextResponse.json({ message: "Invalid package" }, { status: 400 });
    }

    const nowpaymentsApiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!nowpaymentsApiKey) {
      return NextResponse.json({ message: "Payment system not configured" }, { status: 503 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${process.env.NEXT_PUBLIC_BRAND ?? "stakereloadxs"}.com`;

    // Create NOWPayments invoice using validated package data
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": nowpaymentsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: validPackage.price,
        price_currency: "usd",
        order_id: `${validPackage.id}-${Date.now()}`,
        order_description: `${validPackage.name} — ${body.telegram}`,
        success_url: `${baseUrl}/payment-success`,
        cancel_url: `${baseUrl}/payment-cancel`,
        is_fixed_rate: true,
        is_fee_paid_by_user: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("NOWPayments error:", err);
      return NextResponse.json({ message: "Payment provider error" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ paymentUrl: data.invoice_url });
  } catch (err) {
    console.error("Payment route error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
