import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface SetCookieGetRequestBody {
  name: string;
  value: string;
}

export const GET = async (req: NextRequest) => {
  const name = req.nextUrl.searchParams.get("name");
  const value = req.nextUrl.searchParams.get("value");
  if (!name || !value) {
    return NextResponse.json(
      { message: "name and value are required" },
      { status: 400 }
    );
  }
  const cookieStore = cookies();
  cookieStore.set(name, value, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return NextResponse.json({ message: "ok" });
};
