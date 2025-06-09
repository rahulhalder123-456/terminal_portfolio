// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Terminal-Portfolio/', // ← updated this line
  plugins: [react()],
});
