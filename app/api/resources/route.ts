import { NextResponse } from "next/server"
import { resourcesData } from "@/lib/resources-data"

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "获取成功",
    data: resourcesData,
  })
}
