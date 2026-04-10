// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@shared/services";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const userId = parseInt(id, 10);

  if (isNaN(userId) || userId <= 0) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await UserService.getUserById(userId);
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
  const userId = parseInt(id, 10);

  if (isNaN(userId) || userId <= 0) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const deleted = await UserService.deleteUser(userId);
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE /api/users/${id}]`, error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
