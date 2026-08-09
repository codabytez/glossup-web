import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

import { fezApi } from "@/lib/fez/client";

type Params = { path: string[] };

async function handler(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { path } = await params;
  const endpoint = "/" + path.join("/");
  const { searchParams } = new URL(req.url);

  try {
    let res;
    const method = req.method.toLowerCase();

    if (method === "get") {
      res = await fezApi.get(endpoint, { params: Object.fromEntries(searchParams) });
    } else if (method === "post") {
      const body = await req.json().catch(() => ({}));
      res = await fezApi.post(endpoint, body);
    } else if (method === "put" || method === "patch") {
      const body = await req.json().catch(() => ({}));
      res = await fezApi.put(endpoint, body);
    } else if (method === "delete") {
      const body = await req.json().catch(() => undefined);
      res = await fezApi.delete(endpoint, { data: body });
    } else {
      return NextResponse.json(
        { status: "Error", description: "Method not allowed" },
        { status: 405 },
      );
    }

    return NextResponse.json(res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json(
      { status: "Error", description: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
