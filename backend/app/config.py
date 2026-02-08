"""
应用配置模块
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """应用配置"""
    
    # 应用信息
    app_name: str = "入行 365 代码指南 API"
    app_version: str = "1.0.0"
    app_description: str = "面向中国开发者的 AI 编程学习指南"
    
    # API 配置
    api_prefix: str = "/api"
    
    # CORS 配置
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://ruhang365.cn",
        "https://*.ruhang365.cn",
    ]
    
    # 数据配置
    data_dir: str = "app/data"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
