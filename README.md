# react-native-bootsplash-cli-fork

This is a fork of [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash) CLI.
Fork allows generating dark mode splash screens.

Note: this is NOT a fork/replacement of react-native-bootsplash! You still need to install and configure [react-native-bootsplash according to instructions](https://github.com/zoontek/react-native-bootsplash#ios-1).
This library could be used as a replacement of [Assets generation
](https://github.com/zoontek/react-native-bootsplash#assets-generation) step.

## Installation

```bash
$ npm install --save react-native-bootsplash-cli-fork
# --- or ---
$ yarn add react-native-bootsplash-cli-fork
```

## Usage

**CLI** could generate assets, create the Android Drawable XML file and the iOS Storyboard file automatically ✨.

```bash
$ npx react-native generate-bootsplash-fork --help
# --- or ---
$ yarn react-native generate-bootsplash-fork --help
```

The command can take multiple arguments:

```bash
yarn react-native generate-bootsplash-fork <logoPath>

Generate a launch screen using an original logo file

Options:
  --background-color <color>       color used as launch screen background (in hexadecimal format) (default: "#fff")
  --logo-width <width>             logo width at @1x (in dp - we recommend approximately ~100) (default: 100)
  --assets-path [path]             path to your static assets directory (useful to require the logo file in JS)
  --flavor <flavor>                [android only] flavor build variant (outputs in an android resource directory other than "main")
  --dark-logo-path [path]          [optional] if specified, will be used for splashscreen that is shown when phone is in dark mode
  --dark-background-color <color>  [optional] color used as launch screen background when phone is in dark mode (in hexadecimal format) (default: "#000"). Only used if --dark-logo-path is set!
  -h, --help                  output usage information
```

#### Full command usage example

```bash
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png \
  --background-color=F5FCFF \
  --logo-width=100 \
  --assets-path=assets \
  --flavor=main
```

This tool generates assets that could later be used by react-native-bootsplash:
```bash
# Only if --assets-path was specified
assets/bootsplash_logo.png
assets/bootsplash_logo@1,5x.png
assets/bootsplash_logo@2x.png
assets/bootsplash_logo@3x.png
assets/bootsplash_logo@4x.png
# if dark logo is specified
assets/bootsplash_logo_dark.png
assets/bootsplash_logo_dark@1,5x.png
assets/bootsplash_logo_dark@2x.png
assets/bootsplash_logo_dark@3x.png
assets/bootsplash_logo_dark@4x.png

android/app/src/main/res/values/colors.xml (creation and edition)
android/app/src/main/res/mipmap-hdpi/bootsplash_logo.png
android/app/src/main/res/mipmap-mdpi/bootsplash_logo.png
android/app/src/main/res/mipmap-xhdpi/bootsplash_logo.png
android/app/src/main/res/mipmap-xxhdpi/bootsplash_logo.png
android/app/src/main/res/mipmap-xxxhdpi/bootsplash_logo.png
# if dark logo is specified
android/app/src/main/res/mipmap-hdpi/bootsplash_logo_dark.png
android/app/src/main/res/mipmap-mdpi/bootsplash_logo_dark.png
android/app/src/main/res/mipmap-xhdpi/bootsplash_logo_dark.png
android/app/src/main/res/mipmap-xxhdpi/bootsplash_logo_dark.png
android/app/src/main/res/mipmap-xxxhdpi/bootsplash_logo_dark.png


ios/YourProjectName/BootSplash.storyboard
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo.png
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo@2x.png
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo@3x.png
# if dark logo is specified
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo_dark.png
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo_dark@2x.png
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo_dark@3x.png
```

If you want to have different splashscreen in Dark Mode, also create/edit the `android/app/src/main/res/values-night/styles.xml`:

```xml
<resources>
  <!-- BootTheme should inherit from Theme.SplashScreen -->
  <style name="BootTheme" parent="Theme.SplashScreen">
    <item name="windowSplashScreenAnimatedIcon">@mipmap/bootsplash_logo_dark</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
  </style>

</resources>
```
