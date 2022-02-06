# react-native-bootsplash-cli-fork

This is a fork of [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash) CLI.
Fork allows generating dark mode splash screens.

Note: this is not a replacement of react-native-bootsplash! You still need to install and configure react-native-bootsplash according to instructions.
But you could use this library to generate assets (that will be used by react-native-bootsplash).

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

![](https://raw.githubusercontent.com/zoontek/react-native-bootsplash/master/docs/cli_tool.png?raw=true)

This tool relies on the naming conventions that are used in the `/example` project and will therefore create the following files:

```bash
# Only if --assets-path was specified
assets/bootsplash_logo.png
assets/bootsplash_logo@1,5x.png
assets/bootsplash_logo@2x.png
assets/bootsplash_logo@3x.png
assets/bootsplash_logo@4x.png

android/app/src/main/res/values/colors.xml (creation and edition)
android/app/src/main/res/mipmap-hdpi/bootsplash_logo.png
android/app/src/main/res/mipmap-mdpi/bootsplash_logo.png
android/app/src/main/res/mipmap-xhdpi/bootsplash_logo.png
android/app/src/main/res/mipmap-xxhdpi/bootsplash_logo.png
android/app/src/main/res/mipmap-xxxhdpi/bootsplash_logo.png

ios/YourProjectName/BootSplash.storyboard
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo.png
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo@2x.png
ios/YourProjectName/Images.xcassets/BootSplashLogo.imageset/bootsplash_logo@3x.png
```

### iOS

_⚠️ Only `.storyboard` files are supported ([Apple has deprecated other methods in April 2020](https://developer.apple.com/news/?id=01132020b))._

Edit the `ios/YourProjectName/AppDelegate.m` file:

```obj-c
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "RNBootSplash.h" // <- add the header import

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // …
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView]; // <- initialization using the storyboard file name

  return YES;
}
```

Set the `BootSplash.storyboard` as launch screen file:

| Drag and drop the file                                                                                  | Create folder reference                                                                                 | Set as Launch Screen File                                                                               |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![](https://raw.githubusercontent.com/zoontek/react-native-bootsplash/master/docs/xcode-1.png?raw=true) | ![](https://raw.githubusercontent.com/zoontek/react-native-bootsplash/master/docs/xcode-2.png?raw=true) | ![](https://raw.githubusercontent.com/zoontek/react-native-bootsplash/master/docs/xcode-3.png?raw=true) |

### Android

1. As this library only support Android 6+, you probably have to edit your `android/build.gradle` file:

```gradle
buildscript {
  ext {
    buildToolsVersion = "30.0.2"
    minSdkVersion = 23 // <- AndroidX splashscreen has basic support for 21 (only the background color), so 23 is best
    compileSdkVersion = 31 // <- set at least 31
    targetSdkVersion = 31 // <- set at least 31

    // …
```

2. Then edit your `android/app/build.gradle` file:

```gradle
dependencies {
  implementation fileTree(dir: "libs", include: ["*.jar"])
  //noinspection GradleDynamicVersion
  implementation "com.facebook.react:react-native:+"  // From node_modules

  implementation "androidx.core:core-splashscreen:1.0.0-beta01" // Add this line

  // …
```

3. Edit your `android/app/src/main/res/values/styles.xml` file:

```xml
<resources>

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
      <!-- Your base theme customization -->
  </style>

  <!-- BootTheme should inherit from Theme.SplashScreen -->
  <style name="BootTheme" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/bootsplash_background</item>
    <item name="windowSplashScreenAnimatedIcon">@mipmap/bootsplash_logo</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
  </style>

</resources>
```

4. Edit your `android/app/src/main/AndroidManifest.xml` file:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.rnbootsplashexample">

  <!-- … -->

  <application
    android:name=".MainApplication"
    android:label="@string/app_name"
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:allowBackup="false"
    android:theme="@style/BootTheme"> <!-- Replace @style/AppTheme with @style/BootTheme -->
    <activity
    android:name=".MainActivity"
    android:label="@string/app_name"
    android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
    android:launchMode="singleTask"
    android:windowSoftInputMode="adjustResize"
    android:exported="true"> <!-- Add android:exported="true" -->
    <intent-filter>
      <action android:name="android.intent.action.MAIN" />
      <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    </activity>
  </application>
</manifest>

```
