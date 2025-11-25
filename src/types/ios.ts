import type { ConfigPlugin } from "@expo/config-plugins";

export interface IosBuildOptions {
  CODE_SIGN_STYLE?: string;
  CODE_SIGN_IDENTITY?: string;
  DEVELOPMENT_TEAM?: string;
  PROVISIONING_PROFILE_SPECIFIER?: string;
}

export type IosConfig = ConfigPlugin<IosBuildOptions>;

export interface XCBuildConfiguration {
  isa?: string;
  buildSettings?: Record<string, string>;
}

export interface XCBuildConfigurationSection {
  [key: string]: XCBuildConfiguration;
}

export interface XCNativeTarget {
  isa?: string;
  buildConfigurationList?: string;
}

export interface XCNativeTargetSection {
  [key: string]: XCNativeTarget;
}

export interface XCConfigurationListEntry {
  isa?: string;
  buildConfigurations?: { value: string }[];
}

export interface XCConfigurationList {
  [key: string]: XCConfigurationListEntry;
}
