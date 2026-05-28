<<<<<<< HEAD
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const loadEnvFile = (filePath) => {
  if (!existsSync(filePath)) return

  const envFile = readFileSync(filePath, "utf8")

  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith("#")) continue

    const separatorIndex = trimmedLine.indexOf("=")
    if (separatorIndex === -1) continue

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^["']|["']$/g, "")

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

for (const envFile of [".env", ".env.production", ".env.local", "app/.env.local"]) {
  loadEnvFile(resolve(process.cwd(), envFile))
}

/** @type {import('next').NextConfig} */
const nextConfig = {
=======
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  images: {
    unoptimized: true,
  },
}

export default nextConfig
