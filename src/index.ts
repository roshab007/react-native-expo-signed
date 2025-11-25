import withAndroidSigning from "@/android/withAndroidSigning";
import withIosBuildSettings from "@/ios/withIosBuildSettings";
import type { ExpoSignedPlugin } from "@/types";

const withExpoSigned: ExpoSignedPlugin = (config, { android, ios } = {}) => {
  let updatedConfig = config;

  if (android) {
    updatedConfig = withAndroidSigning(updatedConfig, {
      ...android,
      app_path: android?.app_path ?? "./android/app",
      keystorePath: android?.keystorePath ?? "./",
    });
  }

  if (ios) {
    updatedConfig = withIosBuildSettings(updatedConfig, ios);
  }

  return updatedConfig;
};

export default withExpoSigned;
