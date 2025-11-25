import type { AndroidConfig, AndroidSigningOptions } from "@/types/android";
import { withGradleProperties } from "@expo/config-plugins";
import fs from "fs";
import path from "path";

const modifyGradleProperties: AndroidConfig = (config, android) => {
  return withGradleProperties(config, (config) => {
    Object.entries(android).forEach(([_, { key, value }]) => {
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

const modifyBuildGradle: AndroidConfig = (config, android) => {
  const filePath = path.resolve(android.app_path!, "build.gradle");

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
            if (project.hasProperty('${android.store_file.key}')) {
                storeFile file(${android.store_file.key})
                storePassword ${android.store_password.key}
                keyAlias ${android.key_alias.key}
                keyPassword ${android.key_password.key}
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

const copyKeystoreFile: AndroidConfig = (config, props) => {
  const source = path.resolve(props.keystorePath!, props.store_file.value);
  const destination = path.resolve(props.app_path!, props.store_file.value);

  if (!fs.existsSync(source)) {
    throw new Error(`❌ Keystore file not found at: ${source}`);
  }

  if (fs.existsSync(path.dirname(destination))) {
    fs.copyFileSync(source, destination);
  }

  return config;
};

const withAndroidSigning: AndroidConfig = (config, android) => {
  const required: (keyof AndroidSigningOptions)[] = [
    "store_file",
    "key_alias",
    "store_password",
    "key_password",
    "keystorePath",
    "app_path",
  ];

  required.forEach((k) => {
    if (!android[k]) throw new Error(`Missing required: ${k}`);
  });

  const keystoreFullPath = path.resolve(
    android.keystorePath!,
    android.store_file.value
  );
  if (!fs.existsSync(keystoreFullPath)) {
    throw new Error(`❌ Keystore missing: ${keystoreFullPath}`);
  }

  const result = copyKeystoreFile(
    modifyBuildGradle(modifyGradleProperties(config, android), android),
    android
  );
  return result;
};

export default withAndroidSigning;
