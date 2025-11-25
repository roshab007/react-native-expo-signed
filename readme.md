# 📦 React Native Expo Signed

**`react-native-expo-signed`** is a custom [Expo Config Plugin](https://docs.expo.dev/config-plugins/introduction/) that automatically injects **code signing settings** into your native projects for both **Android** and **iOS** during the prebuild stage.

- **Android:** Copies your keystore file into the project, sets up `gradle.properties`, and updates `build.gradle` for release signing.
- **iOS:** Updates the Xcode project signing settings (manual or automatic), development team, code sign identity, and provisioning profile **only if values are provided**.

---

## ✨ Features

- ✅ Single plugin handles **both Android and iOS**
- ✅ One clean `"plugins"` entry in `app.json`/`app.config.js`
- ✅ iOS values are only set if provided (won’t overwrite existing Xcode settings)
- ✅ Android keystore setup is automated
- ✅ **Customizable `app_path`** for Android projects in non-standard directories

---

## 📦 Installation

Install using **npm**:

```sh
npm install react-native-expo-signed --save-dev
```

Or using **Yarn**:

```sh
yarn add -D react-native-expo-signed
```

---

## ⚙️ Usage

In your **`app.json`** or **`app.config.js`**, add to the `plugins` array:

### Example

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-expo-signed",
        {
          "android": {
            "app_path": "./android/app", // optional, defaults to ./android/app
            "store_file": {
              "key": "MY_UPLOAD_STORE_FILE",
              "value": "my-upload-key.keystore"
            },
            "key_alias": {
              "key": "MY_UPLOAD_KEY_ALIAS",
              "value": "my-key-alias"
            },
            "store_password": {
              "key": "MY_UPLOAD_STORE_PASSWORD",
              "value": "************"
            },
            "key_password": {
              "key": "MY_UPLOAD_KEY_PASSWORD",
              "value": "************"
            },
            "keystorePath": "./src/assets"
          },
          "ios": {
            "CODE_SIGN_STYLE": "Manual",
            "CODE_SIGN_IDENTITY": "\"iPhone Distribution\"",
            "DEVELOPMENT_TEAM": "Team_ID",
            "PROVISIONING_PROFILE_SPECIFIER": "Profile Name"
          }
        }
      ]
    ]
  }
}
```

---

## 📱 iOS Options

| Key                              | Description                             | Example                 |
| -------------------------------- | --------------------------------------- | ----------------------- |
| `CODE_SIGN_STYLE`                | Signing style (`Manual` or `Automatic`) | `"Manual"`              |
| `CODE_SIGN_IDENTITY`             | Code signing identity                   | `"iPhone Distribution"` |
| `DEVELOPMENT_TEAM`               | Apple Developer Team ID                 | `"Team_ID"`             |
| `PROVISIONING_PROFILE_SPECIFIER` | Provisioning profile name               | `"Profile Name"`        |

**Behavior:**
If any of the above keys are **missing** from `ios` config, the plugin will **not change** that setting in your Xcode project.

---

## 🤖 Android Options

| Key                    | Description                                        | Example                       |
| ---------------------- | -------------------------------------------------- | ----------------------------- |
| `app_path`             | Path to the Android app directory (optional)       | `"./android/app"` _(default)_ |
| `store_file.key`       | Keystore path property name in `gradle.properties` | `"MY_UPLOAD_STORE_FILE"`      |
| `store_file.value`     | Keystore filename                                  | `"my-upload-key.keystore"`    |
| `key_alias.key`        | Key alias property name                            | `"MY_UPLOAD_KEY_ALIAS"`       |
| `key_alias.value`      | Alias name                                         | `"my-key-alias"`              |
| `store_password.key`   | Store password property name                       | `"MY_UPLOAD_STORE_PASSWORD"`  |
| `store_password.value` | Store password value                               | `"password123"`               |
| `key_password.key`     | Key password property name                         | `"MY_UPLOAD_KEY_PASSWORD"`    |
| `key_password.value`   | Key password value                                 | `"password123"`               |
| `keystorePath`         | Folder path containing keystore file               | `"./"` _(default)_            |

---

## 🛠 How It Works

1. **Android:**

   - Adds required signing properties to `gradle.properties`
   - Copies keystore file from `keystorePath` to `app_path`
   - Updates `build.gradle` to use `release` signing config

2. **iOS:**

   - Opens `.xcodeproj` during prebuild
   - Updates `buildSettings` keys **only if a value is provided**
   - Leaves untouched settings alone

---

## 📄 License

MIT License

---
