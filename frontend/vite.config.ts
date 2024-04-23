import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const REACT_APP_BACKEND_URL = process.env.VITE_REACT_APP_BACKEND_URL;
  return defineConfig({
    plugins: [react()],

    server: {
      proxy: {
        "/backend": {
          target: REACT_APP_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend/, ""),
        },
      },
    },
  });
};
