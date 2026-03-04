import { NextResponse } from "next/server"
import { toolsData } from "@/lib/tools-data"

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "获取成功",
    data: toolsData,
  })
}
