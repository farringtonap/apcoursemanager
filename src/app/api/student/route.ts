import { NextResponse } from "next/server";
// adjust to your actual path to prisma.ts:
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { interests, previousCourses, GPA, gradeLevel } = await request.json();

    if (!Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json({ error: "Interests required" }, { status: 400 });
    }
    if (typeof GPA !== "number") {
      return NextResponse.json({ error: "GPA must be a number" }, { status: 400 });
    }

    const profile = await prisma.studentProfile.create({
      data: { interests, previousCourses, GPA, gradeLevel },
    });
    return NextResponse.json(profile, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/student error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const profiles = await prisma.studentProfile.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(profiles);
  } catch (err: any) {
    console.error("GET /api/student error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
