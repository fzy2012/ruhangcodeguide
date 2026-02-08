"""
资源推荐路由
"""
from fastapi import APIRouter, HTTPException
from app.services.content import content_service

router = APIRouter()


@router.get("/resources")
async def get_resources(type: str = None):
    """获取所有资源，可按类型筛选"""
    resources = content_service.get_all_resources(type)
    return {
        "success": True,
        "message": "获取成功",
        "data": resources
    }


@router.get("/resources/types")
async def get_resource_types():
    """获取所有资源类型"""
    types = [
        {"id": "article", "name": "文章", "emoji": "📄"},
        {"id": "video", "name": "视频", "emoji": "📺"},
        {"id": "tutorial", "name": "教程", "emoji": "📚"},
        {"id": "documentation", "name": "文档", "emoji": "📖"},
        {"id": "course", "name": "课程", "emoji": "🎓"},
    ]
    return {
        "success": True,
        "message": "获取成功",
        "data": types
    }


@router.get("/resources/{resource_id}")
async def get_resource(resource_id: str):
    """获取指定资源详情"""
    resource = content_service.get_resource(resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail=f"资源 {resource_id} 不存在")
    return {
        "success": True,
        "message": "获取成功",
        "data": resource
    }
