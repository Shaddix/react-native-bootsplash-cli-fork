import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import sharp from "sharp";

const lightLogoFileName = "bootsplash_logo";
const darkLogoFileName = "bootsplash_logo_dark";
const logoAssetName = "BootSplashLogo";
const colorAssetName = "SplashColor";
const androidColorName = "bootsplash_background";
const androidColorRegex = /<color name="bootsplash_background">#\w+<\/color>/g;

const toFullHexadecimal = (hex: string) => {
  const prefixed = hex[0] === "#" ? hex : `#${hex}`;
  const up = prefixed.toUpperCase();

  return up.length === 4
    ? "#" + up[1] + up[1] + up[2] + up[2] + up[3] + up[3]
    : up;
};

const colorToRGB = (hex: string) => {
  const fullHexColor = toFullHexadecimal(hex);

  return {
    r: (parseInt(fullHexColor[1] + fullHexColor[2], 16) / 255).toPrecision(15),
    g: (parseInt(fullHexColor[3] + fullHexColor[4], 16) / 255).toPrecision(15),
    b: (parseInt(fullHexColor[5] + fullHexColor[6], 16) / 255).toPrecision(15),
  };
};

const getLogoContentsJson = (includeDarkLogo: boolean) => `{
  "images": [
    {
      "idiom": "universal",
      "filename": "${lightLogoFileName}.png",
      "scale": "1x"
    },
    {
      "idiom": "universal",
      "filename": "${lightLogoFileName}@2x.png",
      "scale": "2x"
    },
    {
      "idiom": "universal",
      "filename": "${lightLogoFileName}@3x.png",
      "scale": "3x"
    }${includeDarkLogo ? DarkImagesContentsJson : ""}
  ],
  "info": {
    "version": 1,
    "author": "xcode"
  }
}
`;
const DarkImagesContentsJson = `,
    {
      "appearances" : [
        {
          "appearance" : "luminosity",
          "value" : "dark"
        }
      ],
      "idiom": "universal",
      "filename": "${darkLogoFileName}.png",
      "scale": "1x"
    },
    {
      "appearances" : [
        {
          "appearance" : "luminosity",
          "value" : "dark"
        }
      ],
      "idiom": "universal",
      "filename": "${darkLogoFileName}@2x.png",
      "scale": "2x"
    },
    {
      "appearances" : [
        {
          "appearance" : "luminosity",
          "value" : "dark"
        }
      ],
      "idiom": "universal",
      "filename": "${darkLogoFileName}@3x.png",
      "scale": "3x"
    }
`;

const getDarkColorsContentsJson = (darkColor: string) => {
  const rgb = colorToRGB(darkColor);
  return `,
    {
      "appearances" : [
        {
          "appearance" : "luminosity",
          "value" : "dark"
        }
      ],
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "${rgb.b}",
          "green" : "${rgb.g}",
          "red" : "${rgb.r}"
        }
      },
      "idiom" : "universal"
    }
`;
};

const getColorsContentsJson = (lightColor: string, darkColor?: string) => {
  const rgb = colorToRGB(lightColor);
  return `{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "${rgb.b}",
          "green" : "${rgb.g}",
          "red" : "${rgb.r}"
        }
      },
      "idiom" : "universal"
    }${darkColor ? getDarkColorsContentsJson(darkColor) : ""}
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}`;
};

const getStoryboard = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="17147" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="01J-lp-oVM">
    <device id="retina4_7" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="17120"/>
        <capability name="Named colors" minToolsVersion="9.0"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="EHf-IW-A2E">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <view key="view" autoresizesSubviews="NO" userInteractionEnabled="NO" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <rect key="frame" x="0.0" y="0.0" width="375" height="667"/>
                        <autoresizingMask key="autoresizingMask"/>
                        <subviews>
                            <imageView autoresizesSubviews="NO" clipsSubviews="YES" userInteractionEnabled="NO" contentMode="scaleAspectFit" image="BootSplashLogo" translatesAutoresizingMaskIntoConstraints="NO" id="3lX-Ut-9ad">
                                <rect key="frame" x="${(375 - width) / 2}" y="${
    (667 - height) / 2
  }" width="${width}" height="${height}"/>
                                <accessibility key="accessibilityConfiguration">
                                    <accessibilityTraits key="traits" image="YES" notEnabled="YES"/>
                                </accessibility>
                            </imageView>
                        </subviews>
                        <viewLayoutGuide key="safeArea" id="Bcu-3y-fUS"/>
                        <color key="backgroundColor" name="SplashColor"/>
                        <accessibility key="accessibilityConfiguration">
                            <accessibilityTraits key="traits" notEnabled="YES"/>
                        </accessibility>
                        <constraints>
                            <constraint firstItem="3lX-Ut-9ad" firstAttribute="centerX" secondItem="Ze5-6b-2t3" secondAttribute="centerX" id="Fh9-Fy-1nT"/>
                            <constraint firstItem="3lX-Ut-9ad" firstAttribute="centerY" secondItem="Ze5-6b-2t3" secondAttribute="centerY" id="nvB-Ic-PnI"/>
                        </constraints>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="0.0" y="0.0"/>
        </scene>
    </scenes>
    <resources>
        <image name="${logoAssetName}" width="${width}" height="${height}"/>
        <namedColor name="SplashColor" />
    </resources>
</document>
`;
};

const log = {
  error: (text: string) => console.log(pc.red(text)),
  text: (text: string) => console.log(text),
  warn: (text: string) => console.log(pc.yellow(text)),
};

const logWriteGlobal = (
  emoji: string,
  filePath: string,
  workingPath: string,
  dimensions?: { width: number; height: number },
) =>
  log.text(
    `${emoji}  ${path.relative(workingPath, filePath)}` +
      (dimensions != null ? ` (${dimensions.width}x${dimensions.height})` : ""),
  );

const isValidHexadecimal = (value: string) =>
  /^#?([0-9A-F]{3}){1,2}$/i.test(value);

export const generate = async ({
  android,
  ios,

  workingPath,
  logoPath,
  darkLogoPath,
  backgroundColor,
  darkBackgroundColor,
  logoWidth,
  flavor,
  assetsPath,
}: {
  android: {
    sourceDir: string;
    appName: string;
  } | null;
  ios: {
    projectPath: string;
  } | null;

  workingPath: string;
  logoPath: string;
  darkLogoPath?: string;
  assetsPath?: string;

  backgroundColor: string;
  darkBackgroundColor?: string;
  flavor: string;
  logoWidth: number;
}) => {

  await generateSingle({
    android,
    ios,

    workingPath,
    logoPath,
    backgroundColor,
    logoWidth,
    flavor,
    assetsPath,
    theme: "light",
  });

  if (darkLogoPath && darkBackgroundColor) {
    await generateSingle({
      android,
      ios,

      workingPath,
      logoPath: darkLogoPath,
      backgroundColor: darkBackgroundColor,
      logoWidth,
      flavor,
      assetsPath,
      theme: "dark",
    });
  }

  if (ios) {
    createIosAssets({
      projectPath: ios.projectPath,
      workingPath,
      includeDarkLogo: !!darkLogoPath,
      lightBackgroundColor: backgroundColor,
      darkBackgroundColor: darkBackgroundColor,
    });
  }

  log.text(`
 ${chalk.blue("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓")}
 ${chalk.blue("┃")}  💖  ${chalk.bold(
    "Love this library? Consider sponsoring!",
  )}  ${chalk.blue("┃")}
 ${chalk.blue("┃")}  One-time amounts are available.              ${chalk.blue(
    "┃",
  )}
 ${chalk.blue("┃")}  ${chalk.underline(
    "https://github.com/sponsors/zoontek",
  )}          ${chalk.blue("┃")}
 ${chalk.blue("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛")}
`);

  log.text(
    `✅  Done! Thanks for using ${chalk.underline("react-native-bootsplash")}.`,
  );
};

const generateSingle = async ({
  android,
  ios,

  workingPath,
  logoPath,
  backgroundColor,
  logoWidth,
  flavor,
  assetsPath,
  theme,
}: {
  android: {
    sourceDir: string;
    appName: string;
  } | null;
  ios: {
    projectPath: string;
  } | null;

  workingPath: string;
  logoPath: string;
  assetsPath?: string;

  backgroundColor: string;
  flavor: string;
  logoWidth: number;
  theme: "light" | "dark";
}) => {
  if (!isValidHexadecimal(backgroundColor)) {
    log.error("--background-color value is not a valid hexadecimal color.");
    process.exit(1);
  }

  const logoFileName = theme === "light" ? lightLogoFileName : darkLogoFileName;
  
  const image = sharp(logoPath);
  const backgroundColorHex = toFullHexadecimal(backgroundColor);
  const { format } = await image.metadata();

  if (format !== "png" && format !== "svg") {
    log.error("Input file is an unsupported image format");
    process.exit(1);
  }

  const logoHeight = await image
    .clone()
    .resize(logoWidth)
    .toBuffer()
    .then((buffer) => sharp(buffer).metadata())
    .then(({ height = 0 }) => height);

  const shouldSkipAndroid = logoWidth > 288 || logoHeight > 288;

  const logAbove288 = (dimension: "height" | "width") => {
    const message = `⚠️   Logo ${dimension} exceed 288dp. As it will be cropped by Android, we skip generation for this platform.`;
    log.warn(message);
  };

  const logAbove192 = (dimension: "height" | "width") => {
    const message = `⚠️   Logo ${dimension} exceed 192dp. It might be cropped by Android.`;
    log.warn(message);
  };

  if (logoWidth > 288) {
    logAbove288("width");
  } else if (logoHeight > 288) {
    logAbove288("height");
  } else if (logoWidth > 192) {
    logAbove192("width");
  } else if (logoHeight > 192) {
    logAbove192("height");
  }

  const logWrite = (
    emoji: string,
    filePath: string,
    dimensions?: { width: number; height: number },
  ) => logWriteGlobal(emoji, filePath, workingPath, dimensions);

  if (assetsPath && fs.existsSync(assetsPath)) {
    log.text(`\n    ${chalk.underline("Assets")}`);

    await Promise.all(
      [
        { ratio: 1, suffix: "" },
        { ratio: 1.5, suffix: "@1,5x" },
        { ratio: 2, suffix: "@2x" },
        { ratio: 3, suffix: "@3x" },
        { ratio: 4, suffix: "@4x" },
      ].map(({ ratio, suffix }) => {
        const fileName = `${logoFileName}${suffix}.png`;
        const filePath = path.resolve(assetsPath, fileName);

        return image
          .clone()
          .resize(logoWidth * ratio)
          .png({ quality: 100 })
          .toFile(filePath)
          .then(({ width, height }) => {
            logWrite("✨", filePath, { width, height });
          });
      }),
    );
  }

  if (android && !shouldSkipAndroid) {
    log.text(`\n    ${pc.underline("Android")}`);


    const appPath = android.appName
      ? path.resolve(android.sourceDir, android.appName)
      : path.resolve(android.sourceDir); // @react-native-community/cli 2.x & 3.x support

    const resPath = path.resolve(appPath, "src", flavor, "res");
    const valuesPath = path.resolve(
      resPath,
      theme === "light" ? "values" : "values-night",
    );

    fs.ensureDirSync(valuesPath);

    const colorsXmlPath = path.resolve(valuesPath, "colors.xml");
    const colorsXmlEntry = `<color name="${androidColorName}">${backgroundColorHex}</color>`;

    if (fs.existsSync(colorsXmlPath)) {
      const colorsXml = fs.readFileSync(colorsXmlPath, "utf-8");

      if (colorsXml.match(androidColorRegex)) {
        fs.writeFileSync(
          colorsXmlPath,
          colorsXml.replace(androidColorRegex, colorsXmlEntry),
          "utf-8",
        );
      } else {
        fs.writeFileSync(
          colorsXmlPath,
          colorsXml.replace(
            /<\/resources>/g,
            `    ${colorsXmlEntry}\n</resources>`,
          ),
          "utf-8",
        );
      }

      logWrite("✏️ ", colorsXmlPath);
    } else {
      fs.writeFileSync(
        colorsXmlPath,
        `<resources>\n    ${colorsXmlEntry}\n</resources>\n`,
        "utf-8",
      );

      logWrite("✨", colorsXmlPath);
    }

    await Promise.all(
      [
        { ratio: 1, directory: "mipmap-mdpi" },
        { ratio: 1.5, directory: "mipmap-hdpi" },
        { ratio: 2, directory: "mipmap-xhdpi" },
        { ratio: 3, directory: "mipmap-xxhdpi" },
        { ratio: 4, directory: "mipmap-xxxhdpi" },
      ].map(({ ratio, directory }) => {
        const fileName = `${logoFileName}.png`;
        const filePath = path.resolve(resPath, directory, fileName);
        // https://github.com/androidx/androidx/blob/androidx-main/core/core-splashscreen/src/main/res/values/dimens.xml#L22
        const canvasSize = 288 * ratio;

        // https://sharp.pixelplumbing.com/api-constructor
        const canvas = sharp({
          create: {
            width: canvasSize,
            height: canvasSize,
            channels: 4,
            background: {
              r: 255,
              g: 255,
              b: 255,
              alpha: 0,
            },
          },
        });

        return image
          .clone()
          .resize(logoWidth * ratio)
          .toBuffer()
          .then((input) =>
            canvas
              .composite([{ input }])
              .png({ quality: 100 })
              .toFile(filePath),
          )
          .then(() => {
            logWrite("✨", filePath, { width: canvasSize, height: canvasSize });
          });
      }),
    );
  }

  if (ios) {
    log.text(`\n    ${chalk.underline("iOS")}`);
    const projectPath = ios.projectPath;
    const imagesPath = path.resolve(projectPath, "Images.xcassets");

    if (fs.existsSync(projectPath)) {
      const storyboardPath = path.resolve(projectPath, "BootSplash.storyboard");

      fs.writeFileSync(
        storyboardPath,
        getStoryboard({
          height: logoHeight,
          width: logoWidth,
        }),
        "utf-8",
      );

      logWrite("✨", storyboardPath);
    } else {
      log.text(
        `No "${projectPath}" directory found. Skipping iOS storyboard generation…`,
      );
    }

    if (fs.existsSync(imagesPath)) {
      const imageSetPath = path.resolve(
        imagesPath,
        logoAssetName + ".imageset",
      );
      fs.ensureDirSync(imageSetPath);

      await Promise.all(
        [
          { ratio: 1, suffix: "" },
          { ratio: 2, suffix: "@2x" },
          { ratio: 3, suffix: "@3x" },
        ].map(({ ratio, suffix }) => {
          const fileName = `${logoFileName}${suffix}.png`;
          const filePath = path.resolve(imageSetPath, fileName);

          return image
            .clone()
            .resize(logoWidth * ratio)
            .png({ quality: 100 })
            .toFile(filePath)
            .then(({ width, height }) => {
              logWrite("✨", filePath, { width, height });
            });
        }),
      );
    } else {
      log.text(
        `No "${imagesPath}" directory found. Skipping iOS images generation…`,
      );
    }
  }
};

const createIosAssets = ({
  projectPath,
  workingPath,

  includeDarkLogo,
  lightBackgroundColor,
  darkBackgroundColor,
}: {
  projectPath: string;
  workingPath: string;

  includeDarkLogo: boolean;
  lightBackgroundColor: string;
  darkBackgroundColor?: string;
}) => {
  const logWrite = (
    emoji: string,
    filePath: string,
    dimensions?: { width: number; height: number },
  ) => logWriteGlobal(emoji, filePath, workingPath, dimensions);

  const imagesPath = path.resolve(projectPath, "Images.xcassets");
  if (fs.existsSync(imagesPath)) {
    const imageSetPath = path.resolve(imagesPath, logoAssetName + ".imageset");
    fs.ensureDirSync(imageSetPath);

    fs.writeFileSync(
      path.resolve(imageSetPath, "Contents.json"),
      getLogoContentsJson(includeDarkLogo),
      "utf-8",
    );
    logWrite("✨", path.resolve(imageSetPath, "Contents.json"));

    const colorSetPath = path.resolve(imagesPath, colorAssetName + ".colorset");
    fs.ensureDirSync(colorSetPath);

    fs.writeFileSync(
      path.resolve(colorSetPath, "Contents.json"),
      getColorsContentsJson(lightBackgroundColor, darkBackgroundColor),
      "utf-8",
    );
    logWrite("✨", path.resolve(colorSetPath, "Contents.json"));
  }
};
