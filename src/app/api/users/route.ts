// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@shared/services";
import { createUserSchema } from "@shared/schemas";

export async function GET() {
  try {
    const users = await UserService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod — returns structured field errors on failure
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const user = await UserService.createUser(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/users]", error);

    // Handle unique-constraint violation (duplicate email)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "23505"
    ) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
