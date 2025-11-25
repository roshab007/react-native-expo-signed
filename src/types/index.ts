import type { AndroidSigningOptions } from "@/types/android";
import type { IosBuildOptions } from "@/types/ios";
import type { ConfigPlugin } from "@expo/config-plugins";

export interface ExpoSignedOptions {
  android?: AndroidSigningOptions;
  ios?: IosBuildOptions;
}

export type ExpoSignedPlugin = ConfigPlugin<ExpoSignedOptions>;
