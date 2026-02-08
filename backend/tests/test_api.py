"""
API 端点测试
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


class TestHealthCheck:
    """健康检查测试"""
    
    def test_health_check(self):
        """测试健康检查端点"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "name" in data["data"]
        assert "version" in data["data"]


class TestGuideAPI:
    """指南 API 测试"""
    
    def test_get_all_guide_sections(self):
        """测试获取所有指南章节"""
        response = client.get("/api/guide")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
        assert len(data["data"]) > 0
    
    def test_get_guide_section(self):
        """测试获取指定章节"""
        response = client.get("/api/guide/introduction")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["id"] == "introduction"
    
    def test_get_invalid_section(self):
        """测试获取不存在的章节"""
        response = client.get("/api/guide/nonexistent")
        assert response.status_code == 404


class TestToolsAPI:
    """工具 API 测试"""
    
    def test_get_all_tools(self):
        """测试获取所有工具"""
        response = client.get("/api/tools")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
        assert len(data["data"]) > 0
    
    def test_get_tools_by_category(self):
        """测试按分类获取工具"""
        response = client.get("/api/tools?category=editor")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        for tool in data["data"]:
            assert tool["category"] == "editor"
    
    def test_get_tool_categories(self):
        """测试获取工具分类"""
        response = client.get("/api/tools/categories")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 5


class TestResourcesAPI:
    """资源 API 测试"""
    
    def test_get_all_resources(self):
        """测试获取所有资源"""
        response = client.get("/api/resources")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
        assert len(data["data"]) > 0
    
    def test_get_resource_types(self):
        """测试获取资源类型"""
        response = client.get("/api/resources/types")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 5


class TestSearchAPI:
    """搜索 API 测试"""
    
    def test_search(self):
        """测试搜索功能"""
        response = client.get("/api/search?q=AI")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "results" in data["data"]
    
    def test_search_empty_query(self):
        """测试空搜索"""
        response = client.get("/api/search?q=")
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["total"] == 0
