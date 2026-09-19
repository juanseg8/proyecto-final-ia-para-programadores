import { tool } from "@opencode-ai/plugin"
import fs from "fs/promises"
import path from "path"

const ALLOWED_ROOTS = ["backend/", "mobile/"]
const ALLOWED_FILES = new Set([
  "NIGHT_REPORT.md",
  "README.md",
  "night-agent-rewrite-probe.txt",
])

function normalizeRelative(input: string): string {
  return input.replace(/\\/g, "/").replace(/^\.\//, "")
}

function isAllowed(relative: string): boolean {
  if (ALLOWED_FILES.has(relative)) return true
  if (relative.includes("/__tests__/")) return false
  if (/\.spec\.ts$/i.test(relative)) return false
  if (relative.startsWith("backend/test/")) return false
  return ALLOWED_ROOTS.some((root) => relative.startsWith(root))
}

export default tool({
  description:
    "Create or completely replace one allowed Agro production file. Use this instead of built-in edit/write. Arguments are only path and full content.",
  args: {
    path: tool.schema
      .string()
      .describe("Repository-relative path, for example mobile/src/components/SearchableSelect.tsx"),
    content: tool.schema
      .string()
      .describe("Complete final UTF-8 contents of the file"),
  },
  async execute(args, context) {
    const relative = normalizeRelative(args.path)

    if (!isAllowed(relative)) {
      throw new Error(`rewrite_file blocked path: ${relative}`)
    }

    const root = path.resolve(context.worktree)
    const target = path.resolve(root, relative)
    const inside = path.relative(root, target)

    if (inside.startsWith("..") || path.isAbsolute(inside)) {
      throw new Error("rewrite_file refuses paths outside the repository worktree")
    }

    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, args.content, { encoding: "utf8" })

    const persisted = await fs.readFile(target, { encoding: "utf8" })
    if (persisted !== args.content) {
      throw new Error(`rewrite_file verification failed for ${relative}`)
    }

    return `REWRITE_OK ${relative} (${persisted.length} chars)`
  },
})
