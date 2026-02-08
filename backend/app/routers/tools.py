"""
工具列表路由
"""
from fastapi import APIRouter, HTTPException
from app.services.content import content_service
from app.models.schemas import ToolCategory

router = APIRouter()


@router.get("/tools")
async def get_tools(category: str = None):
    """获取所有工具，可按分类筛选"""
    tools = content_service.get_all_tools(category)
    return {
        "success": True,
        "message": "获取成功",
        "data": tools
    }


@router.get("/tools/categories")
async def get_tool_categories():
    """获取所有工具分类"""
    categories = [
        {"id": "editor", "name": "编辑器 / IDE", "emoji": "📝"},
        {"id": "cli", "name": "命令行工具", "emoji": "⌨️"},
        {"id": "webapp", "name": "Web 应用", "emoji": "🌐"},
        {"id": "agent", "name": "后台代理", "emoji": "🤖"},
        {"id": "helper", "name": "辅助工具", "emoji": "🛠️"},
    ]
    return {
        "success": True,
        "message": "获取成功",
        "data": categories
    }


@router.get("/tools/{tool_id}")
async def get_tool(tool_id: str):
    """获取指定工具详情"""
    tool = content_service.get_tool(tool_id)
    if not tool:
        raise HTTPException(status_code=404, detail=f"工具 {tool_id} 不存在")
    return {
        "success": True,
        "message": "获取成功",
        "data": tool
    }
