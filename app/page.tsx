export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0e1a", color: "#00d4ff" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>
          {"代码指南"}
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#8892b0" }}>
          {"入行 365 出品 - AI 编程学习指南"}
        </p>
        <p style={{ fontSize: "0.9rem", color: "#4a5568", marginTop: "2rem" }}>
          {"v0 debug: page loaded successfully"}
        </p>
      </div>
    </div>
  )
}
