export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0e1a",
        color: "#00d4ff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          {"代码指南 - Code Guide"}
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#8892b0" }}>
          {"入行 365 出品 - AI 编程学习平台"}
        </p>
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem 2rem",
            border: "1px solid #00d4ff",
            borderRadius: "8px",
            display: "inline-block",
          }}
        >
          <p style={{ color: "#00d4ff", fontSize: "0.875rem" }}>
            {"页面加载成功 - Page Loaded"}
          </p>
        </div>
      </div>
    </div>
  )
}
