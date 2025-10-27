/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_EC2_START_ENDPOINT: string;
  readonly VITE_EC2_STOP_ENDPOINT: string;
  readonly VITE_EC2_SECRET_KEY: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_API_RETRY_COUNT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
