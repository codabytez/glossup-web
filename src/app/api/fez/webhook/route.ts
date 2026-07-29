import { createHmac, timingSafeEqual } from "crypto";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

function verifySignature(
  orderNo: string,
  status: string,
  timestamp: string,
  signature: string,
): boolean {
  const expected = createHmac("sha256", env.FEZ_WEBHOOK_SECRET)
    .update(orderNo + status + timestamp)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const timestamp = req.headers.get("x-timestamp") ?? "";
  const signature = req.headers.get("x-signature") ?? "";

  let payload: FezWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { orderNumber, status } = payload;

  if (!verifySignature(orderNumber, status, timestamp, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // TODO: handle each status — update Shopify fulfillment accordingly
  // "Pending Pick-Up" | "Picked-Up" | "Dispatched" | "Delivered" | "Returned"
  console.log(`[fez-webhook] order=${orderNumber} status=${status}`);

  return NextResponse.json({ received: true });
}
