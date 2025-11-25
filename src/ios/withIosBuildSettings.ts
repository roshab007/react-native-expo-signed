import type {
  IosConfig,
  XCBuildConfiguration,
  XCBuildConfigurationSection,
  XCConfigurationList,
  XCConfigurationListEntry,
  XCNativeTargetSection,
} from "@/types/ios";
import { withXcodeProject } from "@expo/config-plugins";

const withIosBuildSettings: IosConfig = (config, settings = {}) => {
  return withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;

    const configurations =
      xcodeProject.pbxXCBuildConfigurationSection() as XCBuildConfigurationSection;
    const nativeTargets =
      xcodeProject.pbxNativeTargetSection() as XCNativeTargetSection;
    const configLists =
      xcodeProject.pbxXCConfigurationList() as XCConfigurationList;

    for (const targetKey in nativeTargets) {
      const target = nativeTargets[targetKey];
      if (typeof target !== "object" || !target) continue;

      const buildConfigListUUID = target.buildConfigurationList?.replace(
        /"/g,
        ""
      );

      if (!buildConfigListUUID) continue;

      const configList = configLists[buildConfigListUUID] as
        | XCConfigurationListEntry
        | undefined;

      if (!configList?.buildConfigurations) continue;

      const targetBuildConfigUUIDs = configList.buildConfigurations.map(
        (item) => item.value
      );

      for (const configKey in configurations) {
        if (!targetBuildConfigUUIDs.includes(configKey)) continue;

        const buildConfig = configurations[configKey] as XCBuildConfiguration;
        if (typeof buildConfig !== "object" || !buildConfig) continue;

        const buildSettings = buildConfig.buildSettings ?? {};

        if (settings.CODE_SIGN_STYLE) {
          buildSettings.CODE_SIGN_STYLE = settings.CODE_SIGN_STYLE;
        }
        if (settings.CODE_SIGN_IDENTITY) {
          buildSettings.CODE_SIGN_IDENTITY = settings.CODE_SIGN_IDENTITY;
        }
        if (settings.DEVELOPMENT_TEAM) {
          buildSettings.DEVELOPMENT_TEAM = settings.DEVELOPMENT_TEAM;
        }
        if (settings.PROVISIONING_PROFILE_SPECIFIER) {
          buildSettings.PROVISIONING_PROFILE_SPECIFIER =
            settings.PROVISIONING_PROFILE_SPECIFIER;
        }

        buildConfig.buildSettings = buildSettings;
      }
    }

    return config;
  });
};

export default withIosBuildSettings;
