import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In a real application, you would integrate with a payment gateway here (e.g., Midtrans, Xendit).
    // For now, this is a stub that returns a dummy payment URL.

    const { amount } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Dummy payment URL
    const paymentUrl = `https://dummy-payment-gateway.com/pay?amount=${amount}&user_id=${user.id}`;

    return NextResponse.json({ payment_url: paymentUrl });
  } catch (error) {
    console.error("Unhandled error in topup initiate API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
