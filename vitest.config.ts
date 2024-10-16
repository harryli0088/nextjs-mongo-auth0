import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://nextjs.org/docs/basic-features/environment-variables#test-environment-variables
//@ts-ignore
process.env.NODE_ENV = "test" 
import { loadEnvConfig } from '@next/env'
const projectDir = process.cwd()
loadEnvConfig(projectDir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globalSetup: ["./setup/mongodb-memory-server.ts"],
    exclude: ["**/node_modules"],
  },
})