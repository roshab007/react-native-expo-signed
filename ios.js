const { withXcodeProject } = require("@expo/config-plugins");

const withIosBuildSettings = (config, settings = {}) => {
  return withXcodeProject(config, (config) => {
    const { modResults: xcodeProject } = config;
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    const nativeTargets = xcodeProject.pbxNativeTargetSection();
    const configLists = xcodeProject.pbxXCConfigurationList();

    for (const targetKey in nativeTargets) {
      const target = nativeTargets[targetKey];
      if (typeof target !== "object") continue;

      const buildConfigListUUID = target.buildConfigurationList?.replace(
        /"/g,
        ""
      );
      const configList = configLists[buildConfigListUUID];
      if (!configList || !configList.buildConfigurations) continue;

      const targetBuildConfigUUIDs = configList.buildConfigurations.map(
        (item) => item.value
      );

      for (const configKey in configurations) {
        if (!targetBuildConfigUUIDs.includes(configKey)) continue;

        const buildConfig = configurations[configKey];
        if (typeof buildConfig !== "object") continue;

        const s = buildConfig.buildSettings ?? {};

        // Only set if present in `settings`
        if (settings.CODE_SIGN_STYLE) {
          s.CODE_SIGN_STYLE = settings.CODE_SIGN_STYLE;
        }
        if (settings.CODE_SIGN_IDENTITY) {
          s.CODE_SIGN_IDENTITY = settings.CODE_SIGN_IDENTITY;
        }
        if (settings.DEVELOPMENT_TEAM) {
          s.DEVELOPMENT_TEAM = settings.DEVELOPMENT_TEAM;
        }
        if (settings.PROVISIONING_PROFILE_SPECIFIER) {
          s.PROVISIONING_PROFILE_SPECIFIER =
            settings.PROVISIONING_PROFILE_SPECIFIER;
        }

        buildConfig.buildSettings = s;
      }
    }

    return config;
  });
};

module.exports = { withIosBuildSettings };
