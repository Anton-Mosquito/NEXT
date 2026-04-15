// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@shared/services";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Validates that the id param is a non-empty string (UUID or legacy numeric string). */
function isValidId(id: string): boolean {
  return id.trim().length > 0;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await UserService.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(`[GET /api/users/${id}]`, error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const deleted = await UserService.deleteUser(id);
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE /api/users/${id}]`, error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
