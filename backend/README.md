# 入行 365 代码指南 - 后端服务

面向中国开发者的 AI 编程学习指南 API 服务。

## 技术栈

- **框架**: FastAPI
- **数据存储**: YAML 文件
- **Python**: 3.9+

## 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 启动服务

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. 访问 API 文档

打开浏览器访问: http://localhost:8000/docs

## API 端点

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/guide` | 获取完整指南 |
| GET | `/api/guide/{section_id}` | 获取指定章节 |
| GET | `/api/tools` | 获取所有工具 |
| GET | `/api/tools/{category}` | 按分类获取工具 |
| GET | `/api/resources` | 获取所有资源 |
| GET | `/api/search?q={query}` | 搜索内容 |

## 项目结构

```
backend/
├── app/
│   ├── main.py           # 应用入口
│   ├── config.py         # 配置管理
│   ├── models/           # 数据模型
│   ├── routers/          # API 路由
│   ├── services/         # 业务逻辑
│   └── data/             # 数据文件
├── tests/                # 测试
└── requirements.txt
```

## 开发

### 运行测试

```bash
pytest tests/ -v
```

## 许可证

MIT License
