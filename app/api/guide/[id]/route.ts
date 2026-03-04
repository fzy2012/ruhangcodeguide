import { NextResponse } from "next/server"
import { guideData } from "@/lib/guide-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const section = guideData.find((s) => s.id === id)

  if (!section) {
    return NextResponse.json(
      { success: false, message: `章节 ${id} 不存在`, data: null },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: "获取成功",
    data: section,
  })
}
