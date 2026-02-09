import { execSync } from "child_process";

try {
  // Check if node_modules is tracked by git
  const result = execSync("git ls-files node_modules", { cwd: "/vercel/share/v0-project", encoding: "utf-8" });
  console.log("[v0] git ls-files node_modules result:", JSON.stringify(result));
  
  if (result.trim()) {
    console.log("[v0] node_modules is tracked by git! Removing...");
    execSync("git rm -r --cached node_modules", { cwd: "/vercel/share/v0-project", encoding: "utf-8" });
    console.log("[v0] Successfully removed node_modules from git tracking");
  } else {
    console.log("[v0] node_modules is NOT tracked by git");
  }

  // Also check what node_modules actually is
  const lsResult = execSync("ls -la /vercel/share/v0-project/ | grep node_modules || echo 'not found'", { encoding: "utf-8" });
  console.log("[v0] ls -la node_modules:", lsResult.trim());

  // Check git status
  const status = execSync("git status --short node_modules || echo 'no status'", { cwd: "/vercel/share/v0-project", encoding: "utf-8" });
  console.log("[v0] git status node_modules:", status.trim());

} catch (e) {
  console.log("[v0] Error:", e.message);
}
