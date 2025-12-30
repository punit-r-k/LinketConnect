import { NextRequest, NextResponse } from "next/server";
import { setActiveProfileForUser } from "@/lib/profile-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "profile id is required" },
        { status: 400 }
      );
    }

    const profile = await setActiveProfileForUser(userId, id);

    return NextResponse.json(profile, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Linket profiles activate API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to activate profile",
      },
      { status: 500 }
    );
  }
}

