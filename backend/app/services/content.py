"""
内容管理服务
"""
import os
import yaml
from typing import List, Optional, Dict, Any
from pathlib import Path


class ContentService:
    """内容管理服务，负责从 YAML 文件加载和管理内容"""
    
    def __init__(self):
        self._guide_data: List[Dict] = []
        self._tools_data: List[Dict] = []
        self._resources_data: List[Dict] = []
        self._data_dir = Path(__file__).parent.parent / "data"
        self._load_data()
    
    def _load_data(self):
        """加载所有数据文件"""
        self._guide_data = self._load_yaml("guide.yaml")
        self._tools_data = self._load_yaml("tools.yaml")
        self._resources_data = self._load_yaml("resources.yaml")
    
    def _load_yaml(self, filename: str) -> List[Dict]:
        """加载 YAML 文件"""
        filepath = self._data_dir / filename
        if not filepath.exists():
            return []
        with open(filepath, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data if data else []
    
    def reload_data(self):
        """重新加载所有数据"""
        self._load_data()
    
    # ============ 指南相关方法 ============
    
    def get_all_guide_sections(self) -> List[Dict]:
        """获取所有指南章节"""
        return sorted(self._guide_data, key=lambda x: x.get("order", 0))
    
    def get_guide_section(self, section_id: str) -> Optional[Dict]:
        """获取指定章节"""
        for section in self._guide_data:
            if section.get("id") == section_id:
                return section
        return None
    
    # ============ 工具相关方法 ============
    
    def get_all_tools(self, category: str = None) -> List[Dict]:
        """获取所有工具，可按分类筛选"""
        if category:
            return [t for t in self._tools_data if t.get("category") == category]
        return self._tools_data
    
    def get_tool(self, tool_id: str) -> Optional[Dict]:
        """获取指定工具"""
        for tool in self._tools_data:
            if tool.get("id") == tool_id:
                return tool
        return None
    
    # ============ 资源相关方法 ============
    
    def get_all_resources(self, resource_type: str = None) -> List[Dict]:
        """获取所有资源，可按类型筛选"""
        if resource_type:
            return [r for r in self._resources_data if r.get("type") == resource_type]
        return self._resources_data
    
    def get_resource(self, resource_id: str) -> Optional[Dict]:
        """获取指定资源"""
        for resource in self._resources_data:
            if resource.get("id") == resource_id:
                return resource
        return None
    
    # ============ 搜索方法 ============
    
    def search(self, query: str) -> Dict[str, Any]:
        """搜索内容"""
        if not query or len(query.strip()) == 0:
            return {"results": [], "query": query, "total": 0}
        
        query_lower = query.lower()
        results = []
        
        # 搜索指南
        for section in self._guide_data:
            if self._match_query(section, query_lower, ["title", "summary", "content"]):
                results.append({
                    "type": "guide",
                    "id": section.get("id"),
                    "title": section.get("title"),
                    "snippet": self._get_snippet(section.get("summary", ""), query_lower),
                })
        
        # 搜索工具
        for tool in self._tools_data:
            if self._match_query(tool, query_lower, ["name", "description"]):
                results.append({
                    "type": "tool",
                    "id": tool.get("id"),
                    "title": tool.get("name"),
                    "snippet": self._get_snippet(tool.get("description", ""), query_lower),
                    "url": tool.get("url"),
                })
        
        # 搜索资源
        for resource in self._resources_data:
            if self._match_query(resource, query_lower, ["title", "description"]):
                results.append({
                    "type": "resource",
                    "id": resource.get("id"),
                    "title": resource.get("title"),
                    "snippet": self._get_snippet(resource.get("description", ""), query_lower),
                    "url": resource.get("url"),
                })
        
        return {
            "results": results,
            "query": query,
            "total": len(results)
        }
    
    def _match_query(self, item: Dict, query: str, fields: List[str]) -> bool:
        """检查项目是否匹配查询"""
        for field in fields:
            value = item.get(field, "")
            if value and query in value.lower():
                return True
        return False
    
    def _get_snippet(self, text: str, query: str, max_length: int = 100) -> str:
        """获取包含查询词的文本片段"""
        if not text:
            return ""
        
        text_lower = text.lower()
        pos = text_lower.find(query)
        
        if pos == -1:
            return text[:max_length] + "..." if len(text) > max_length else text
        
        start = max(0, pos - 30)
        end = min(len(text), pos + len(query) + 70)
        
        snippet = text[start:end]
        if start > 0:
            snippet = "..." + snippet
        if end < len(text):
            snippet = snippet + "..."
        
        return snippet


# 创建全局服务实例
content_service = ContentService()
