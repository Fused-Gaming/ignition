import { NextRequest, NextResponse } from "next/server";

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

    if (!body.price || body.price <= 0) {
      return NextResponse.json({ message: "Invalid package" }, { status: 400 });
    }

    const nowpaymentsApiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!nowpaymentsApiKey) {
      return NextResponse.json({ message: "Payment system not configured" }, { status: 503 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${process.env.NEXT_PUBLIC_BRAND ?? "stakereloadxs"}.com`;

    // Create NOWPayments invoice
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": nowpaymentsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: body.price,
        price_currency: "usd",
        order_id: `${body.packageId}-${Date.now()}`,
        order_description: `${body.packageName} — ${body.telegram}`,
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
