"""
指南内容路由
"""
from fastapi import APIRouter, HTTPException
from app.services.content import content_service

router = APIRouter()


@router.get("/guide")
async def get_guide():
    """获取完整指南内容"""
    sections = content_service.get_all_guide_sections()
    return {
        "success": True,
        "message": "获取成功",
        "data": sections
    }


@router.get("/guide/{section_id}")
async def get_guide_section(section_id: str):
    """获取指定章节"""
    section = content_service.get_guide_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail=f"章节 {section_id} 不存在")
    return {
        "success": True,
        "message": "获取成功",
        "data": section
    }
