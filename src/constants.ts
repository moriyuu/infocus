export type Storage = {
  ACTIVATED: boolean;
  BLOCK_URLS: string[];
  REDIRECT_URL: string;
};

// storage keys
export const KEYS = {
  ACTIVATED: "activated",
  BLOCK_URLS: "blockUrls",
  REDIRECT_URL: "redirectUrl",
} as const;

export const DEFAULT_REDIRECT_URL = "https://example.com/";
