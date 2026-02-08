"""
FastAPI 应用入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import guide, tools, resources


def create_app() -> FastAPI:
    """创建 FastAPI 应用实例"""
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=settings.app_description,
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # 配置 CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # 注册路由
    app.include_router(guide.router, prefix=settings.api_prefix, tags=["指南"])
    app.include_router(tools.router, prefix=settings.api_prefix, tags=["工具"])
    app.include_router(resources.router, prefix=settings.api_prefix, tags=["资源"])
    
    @app.get("/api/health", tags=["健康检查"])
    async def health_check():
        """健康检查端点"""
        return {
            "success": True,
            "message": "服务运行正常",
            "data": {
                "name": settings.app_name,
                "version": settings.app_version
            }
        }
    
    @app.get("/api/search", tags=["搜索"])
    async def search(q: str = ""):
        """搜索内容"""
        from app.services.content import content_service
        results = content_service.search(q)
        return {
            "success": True,
            "message": "搜索成功",
            "data": results
        }
    
    return app


app = create_app()
