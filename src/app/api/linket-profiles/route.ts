import { NextRequest, NextResponse } from "next/server";
import {
  getProfilesForUser,
  saveProfileForUser,
  type ProfilePayload,
} from "@/lib/profile-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    const profiles = await getProfilesForUser(userId);

    return NextResponse.json(profiles, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Linket profiles API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch profiles",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, profile } = body as {
      userId?: string;
      profile?: ProfilePayload;
    };

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "profile payload is required" },
        { status: 400 }
      );
    }

    const saved = await saveProfileForUser(userId, profile);

    return NextResponse.json(saved, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Linket profiles API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save profile",
      },
      { status: 500 }
    );
  }
}

