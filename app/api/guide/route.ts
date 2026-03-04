import { NextResponse } from "next/server"
import { guideSections } from "@/lib/guide-data"

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "获取成功",
    data: guideSections,
  })
}
