interface ImportMetaEnv {
  readonly SMOVIES_API_KEY: string;
  readonly SMOVIES_API_URL: string;
  readonly PUBLIC_MOVIES_API_URL: string;
  readonly PUBLIC_MOVIES_API_KEY: string;
  readonly PUBLIC_AI_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
