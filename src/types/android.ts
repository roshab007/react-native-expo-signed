import type { ConfigPlugin } from "@expo/config-plugins";

export interface AndroidEnvPair {
  key: string;
  value: string;
}

export interface AndroidSigningOptions {
  app_path?: string;
  store_file: AndroidEnvPair;
  key_alias: AndroidEnvPair;
  store_password: AndroidEnvPair;
  key_password: AndroidEnvPair;
  keystorePath?: string;
}

export type AndroidConfig = ConfigPlugin<AndroidSigningOptions>;
