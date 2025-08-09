/* eslint-env node */

const { withGradleProperties } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const app_path = "./android/app";

const modifyGradleProperties = (config, props) => {
  return withGradleProperties(config, (config) => {
    Object.entries(props).forEach(([prop, { key, value }]) => {
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

const modifyBuildGradle = (config, props) => {
  const filePath = path.resolve(app_path, "build.gradle");

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
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

const copyKeystoreFile = (config, props) => {
  const source = path.resolve(props.keystorePath, props.store_file.value);
  const destination = path.resolve(app_path, props.store_file.value);

  if (fs.existsSync(source) && fs.existsSync(path.dirname(destination))) {
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

  return copyKeystoreFile(
    modifyBuildGradle(modifyGradleProperties(config, props), props),
    props
  );
};

module.exports = { withAndroidSigning: withSigned };
