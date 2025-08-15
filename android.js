/* eslint-env node */

const { withGradleProperties } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const modifyGradleProperties = (config, props) => {
  return withGradleProperties(config, (config) => {
    Object.entries(props).forEach(([_, { key, value }]) => {
      if (key && value) {
        const exists = config.modResults.find(
          (item) => item.type === "property" && item.key === key
        );
        if (!exists) {
          config.modResults.push({ key, type: "property", value });
        }
      }
    });

    return config;
  });
};

const modifyBuildGradle = (config, props, appPath) => {
  const filePath = path.resolve(appPath, "build.gradle");

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(/\r\n/g, "\n"); // normalize line endings

    const release =
      /signingConfigs\s*\{(?:[^{}]*\{[^}]*\}|[^}])*release\s*\{[^}]*\}[^}]*\}/;

    let updatedContent = content.replace(
      /(release\s*{[^}]*signingConfig\s+signingConfigs\.)debug/,
      "$1release"
    );

    if (!release.test(updatedContent)) {
      updatedContent = updatedContent.replace(
        /(signingConfigs\s*{[^}]*debug\s*{[^}]*})/,
        `$1
        release {
            if (project.hasProperty('${props.store_file.key}')) {
                storeFile file(${props.store_file.key})
                storePassword ${props.store_password.key}
                keyAlias ${props.key_alias.key}
                keyPassword ${props.key_password.key}
            }
        }`
      );
    }

    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, "utf8");
    }
  }

  return config;
};

const copyKeystoreFile = (config, props, appPath) => {
  const source = path.resolve(props.keystorePath, props.store_file.value);
  const destination = path.resolve(appPath, props.store_file.value);

  if (!fs.existsSync(source)) {
    throw new Error(`❌ Keystore file not found at: ${source}`);
  }

  if (fs.existsSync(path.dirname(destination))) {
    fs.copyFileSync(source, destination);
  }

  return config;
};

const withSigned = (config, props) => {
  const requiredProps = [
    "store_file",
    "key_alias",
    "store_password",
    "key_password",
    "keystorePath",
  ];

  requiredProps.forEach((prop) => {
    if (!props[prop]) {
      throw new Error(`Missing required property: ${prop}`);
    }
  });

  const appPath = props.app_path || "./android/app"; // default if not provided

  const keystoreFullPath = path.resolve(
    props.keystorePath,
    props.store_file.value
  );
  if (!fs.existsSync(keystoreFullPath)) {
    throw new Error(`❌ Keystore missing: ${keystoreFullPath}`);
  }

  return copyKeystoreFile(
    modifyBuildGradle(modifyGradleProperties(config, props), props, appPath),
    props,
    appPath
  );
};

module.exports = { withAndroidSigning: withSigned };
