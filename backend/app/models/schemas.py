"""
Pydantic 数据模型
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class ToolCategory(str, Enum):
    """工具分类"""
    EDITOR = "editor"
    CLI = "cli"
    WEBAPP = "webapp"
    AGENT = "agent"
    HELPER = "helper"


class ResourceType(str, Enum):
    """资源类型"""
    ARTICLE = "article"
    VIDEO = "video"
    TUTORIAL = "tutorial"
    DOCUMENTATION = "documentation"
    COURSE = "course"


# ============ 基础模型 ============

class Tool(BaseModel):
    """工具信息"""
    id: str = Field(..., description="工具唯一标识")
    name: str = Field(..., description="工具名称")
    name_en: Optional[str] = Field(None, description="英文名称")
    description: str = Field(..., description="工具描述")
    url: str = Field(..., description="官网链接")
    category: ToolCategory = Field(..., description="工具分类")
    is_free: bool = Field(True, description="是否免费")
    tags: List[str] = Field(default_factory=list, description="标签")


class Resource(BaseModel):
    """学习资源"""
    id: str = Field(..., description="资源唯一标识")
    title: str = Field(..., description="资源标题")
    title_en: Optional[str] = Field(None, description="英文标题")
    description: str = Field(..., description="资源描述")
    url: str = Field(..., description="资源链接")
    type: ResourceType = Field(..., description="资源类型")
    author: Optional[str] = Field(None, description="作者")
    tags: List[str] = Field(default_factory=list, description="标签")


class GuideSubSection(BaseModel):
    """指南子章节"""
    id: str = Field(..., description="子章节标识")
    title: str = Field(..., description="子章节标题")
    content: str = Field(..., description="内容（Markdown）")


class GuideSection(BaseModel):
    """指南章节"""
    id: str = Field(..., description="章节唯一标识")
    title: str = Field(..., description="章节标题")
    emoji: Optional[str] = Field(None, description="章节图标")
    summary: str = Field(..., description="章节概要")
    content: str = Field(..., description="主要内容（Markdown）")
    subsections: List[GuideSubSection] = Field(default_factory=list, description="子章节列表")
    order: int = Field(0, description="排序顺序")


# ============ 响应模型 ============

class ApiResponse(BaseModel):
    """API 通用响应"""
    success: bool = Field(True, description="是否成功")
    message: str = Field("操作成功", description="响应消息")
    data: Optional[dict | list] = Field(None, description="响应数据")


class GuideListResponse(BaseModel):
    """指南列表响应"""
    success: bool = True
    message: str = "获取成功"
    data: List[GuideSection]


class ToolListResponse(BaseModel):
    """工具列表响应"""
    success: bool = True
    message: str = "获取成功"
    data: List[Tool]


class ResourceListResponse(BaseModel):
    """资源列表响应"""
    success: bool = True
    message: str = "获取成功"
    data: List[Resource]


class SearchResult(BaseModel):
    """搜索结果"""
    type: str = Field(..., description="结果类型：guide/tool/resource")
    id: str = Field(..., description="结果 ID")
    title: str = Field(..., description="标题")
    snippet: str = Field(..., description="内容片段")
    url: Optional[str] = Field(None, description="链接（如有）")


class SearchResponse(BaseModel):
    """搜索响应"""
    success: bool = True
    message: str = "搜索成功"
    data: List[SearchResult]
    query: str = Field(..., description="搜索关键词")
    total: int = Field(..., description="结果总数")
