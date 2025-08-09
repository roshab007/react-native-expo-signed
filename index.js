const { withIosBuildSettings } = require("./ios");
const { withAndroidSigning } = require("./android");

module.exports = function withExpoSigned(config, options = {}) {
  if (options.ios) {
    config = withIosBuildSettings(config, options.ios);
  }
  if (options.android) {
    config = withAndroidSigning(config, options.android);
  }
  return config;
};
