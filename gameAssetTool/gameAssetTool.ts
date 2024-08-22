interface HsbColor {
  h: number; //Hue
  s: number; //Saturation
  b: number; //Brightness
}
interface ColorShiftCollection {
  match: string; //Which property name to match the value with the shift name. If match="skin" amd character = {skin:"tan"} will use the shift named "tan"
  shifts: Record<string, HsbColor>; //List of color shifts keyed by name
}
interface CharacterPose {
  paintOrder: string[]; //Determine in which order sprites will be painted in this pose by module type
  baseCache: string; //Up to which module can be painted to generate a base cache image of the character's naked body
  offscreenCache: string; //Up to which module can be painted to generate a cache image of the dressed character
  animationCache: string; //Up to which module can be painted to generate a cache image of the non changing parts on this pose animation
}
interface Sprite {
  pixels: Uint8ClampedArray; //The pixels in bytes
  x: number; //Horizontal coordinates, where in the canvas should this sprite be painted
  y: number; //Vertical coordinates
  width: number;
  height: number;
  colorShift?: string; //Name of the color shift to apply to this specific sprite (overrides the ones in the collection and module)
}
interface SpritePoseCollection {
  sprites: Record<string, Sprite>; //Sprites per pose
  match: object; //One of the sprites in this collection will be drawn only if these properties match the current character properties
  colorShift?: string; //Name of the color shift to apply to all the sprites in the collections (overrides the one specified in the module)
}
interface CharacterGraphicLayer {
  colorShift?: string; //Name of the color shift to apply to all the sprites in this layer
  spriteCollections: SpritePoseCollection[]; //Sprite collections that might or might not apply to the current character
}
let FileType = {
  unknown: 0,
  zip: 1,
  image: 2,
};
let characterPoses: Record<string, CharacterPose> = {
  idle: {
    paintOrder: [
      "body",
      "hairBack",
      "genitals",
      "belly",
      "tits",
      "hairBackOrnament",
      "bodyUnderwear",
      "socks",
      "shoes",
      "topUnderwear",
      "handWear",
      "topDress",
      "bottomUnderwear",
      "bottomDress",
      "dress",
      "face",
      "nose",
      "mouth",
      "hair",
      "eyes",
      "brows",
      "headWear",
    ],
    baseCache: "tits",
    offscreenCache: "dress",
    animationCache: "mouth",
  },
};
let colorShifts: Record<string, ColorShiftCollection> = {
  brunette: {
    match: "hairColor",
    shifts: {
      black: { h: 0.66, s: -0.44, b: -0.44 },
      "light brown": { h: -0.02, s: -0.37, b: 0.06 },
      "dark brown": { h: -0.04, s: -0.18, b: -0.38 },
      "dirty blonde": { h: 0.02, s: -0.48, b: 0.04 },
      blonde: { h: 0.02, s: 0.05, b: 0.31 },
      red: { h: -0.07, s: 0.13, b: 0.11 },
      auburn: { h: -0.11, s: 0.03, b: -0.04 },
      "midnight blue": { h: 0.56, s: 0.06, b: -0.14 },
      "pale pink": { h: 0.88, s: -0.59, b: 0.3 },
      "hot pink": { h: 0.81, s: -0.13, b: 0.32 },
      burgundy: { h: 0.86, s: 0.28, b: -0.18 },
      "royal purple": { h: 0.64, s: -0.19, b: -0.02 },
      violet: { h: 0.65, s: 0.28, b: 0.32 },
      indigo: { h: 0.46, s: 0.28, b: -0.15 },
      blue: { h: 0.55, s: -0.18, b: 0.19 },
    },
  },
  blonde: {
    match: "hairColor",
    shifts: {
      black: { h: 0.64, s: -0.49, b: -0.73 },
      "light brown": { h: -0.04, s: -0.41, b: -0.26 },
      brown: { h: -0.02, s: -0.05, b: -0.31 },
      "dark brown": { h: -0.06, s: -0.22, b: -0.66 },
      "dirty blonde": { h: 0, s: -0.52, b: -0.21 },
      red: { h: -0.08, s: 0.09, b: -0.16 },
      auburn: { h: -0.12, s: -0.02, b: -0.35 },
      "midnight blue": { h: 0.54, s: 0.01, b: -0.37 },
      "pale pink": { h: 0.86, s: -0.64, b: -0.02 },
      "hot pink": { h: 0.8, s: -0.18, b: 0 },
      burgundy: { h: 0.84, s: 0.24, b: -0.49 },
      "royal purple": { h: 0.62, s: -0.24, b: -0.33 },
      violet: { h: 0.63, s: 0.24, b: 0 },
      indigo: { h: 0.44, s: 0.24, b: -0.52 },
      blue: { h: 0.53, s: -0.22, b: -0.13 },
    },
  },
  skin: {
    match: "skin",
    shifts: {
      black: { h: -0.05, s: 0.27, b: -0.56 },
      //white: { h: -0.07, s: 0.11, b: 0 },
      pale: { h: -0.03, s: -0.08, b: 0 },
      tan: { h: -0.3, s: 0.35, b: -0.25 },
      brown: { h: -0.05, s: 0.45, b: -0.26 },
      olive: { h: -0.04, s: 0.27, b: -0.17 },
    },
  },
  eyes: {
    match: "eyeColor",
    shifts: {
      //Sprite has teal color
      brown: { h: -0.38, s: 0, b: 0 },
      green: { h: -0.29, s: -0.63, b: -0.05 },
      blue: { h: 0.18, s: -0.73, b: 0.14 },
      hazel: { h: -0.37, s: 0, b: 0.19 },
    },
  },
};
let AssetPack = {
  scenery: <Record<string, Uint8Array>>{},
  item: <Record<string, Uint8Array>>{},
  movie: <Record<string, Uint8Array>>{},
  character: <Record<string, CharacterGraphicLayer>>{},
};
let geId = (id: string): HTMLElement => document.getElementById(id);
let $fileDrop = <HTMLInputElement>geId("fileDrop");
let $hiddenUpload = <HTMLInputElement>geId("hiddenUpload");
let $assetType = <HTMLInputElement>geId("assetType");
let $status = <HTMLSpanElement>geId("status");
let previewControls = {
  base: <HTMLDivElement>geId("previewControls"),
  age: <HTMLInputElement>geId("age"),
  hairLength: <HTMLInputElement>geId("hairLength"),
  hairStyle: <HTMLInputElement>geId("hairStyle"),
  pregnant: <HTMLInputElement>geId("pregnant"),
  tits: <HTMLInputElement>geId("tits"),
};
let $preview = <HTMLCanvasElement>geId("preview");
let previewContext = $preview.getContext("2d");
let previewPosition = { x: $preview.offsetLeft, y: $preview.offsetTop };
let $hueInput = <HTMLInputElement>geId("hueInput"),
  $saturationInput = <HTMLInputElement>geId("saturationInput"),
  $brightnessInput = <HTMLInputElement>geId("brightnessInput"),
  $colorShiftLayer = <HTMLSelectElement>geId("colorShiftLayer");
let $hueValue = <HTMLSpanElement>geId("hueValue"),
  $saturationValue = <HTMLSpanElement>geId("saturationValue"),
  $brightnessValue = <HTMLSpanElement>geId("brightnessValue");
let $fromColor = <HTMLInputElement>geId("fromColor"),
  $toColor = <HTMLInputElement>geId("toColor");
$fileDrop.ondragover = (event) => {
  event.preventDefault();
  $fileDrop.style.borderColor = "yellow";
};
$fileDrop.ondragleave = () => ($fileDrop.style.borderColor = "#ff4d4d");
let previewControlOnChange = function () {
  window.testPerson.age = parseInt(previewControls.age.value);
  window.testPerson.sex = <Sex>(
    (<HTMLInputElement>document.querySelector("input[name=sex]:checked"))
      .labels[0].innerText
  );
  window.testPerson.hairLength = (<HTMLDataListElement>(
    previewControls.hairLength.list
  )).options[previewControls.hairLength.value].label;
  window.testPerson.hairStyle = (<HTMLDataListElement>(
    previewControls.hairStyle.list
  )).options[previewControls.hairStyle.value].label;
  window.testPerson.pregnantDays = parseInt(previewControls.pregnant.value);
  window.testPerson.titSize = (<HTMLDataListElement>(
    previewControls.tits.list
  )).options[previewControls.tits.value].label;
  redrawPreview();
};
document
  .querySelectorAll("#previewControls input")
  .forEach(
    (input: Element) =>
      ((<HTMLInputElement>input).oninput = previewControlOnChange)
  );
function blob2img(blob: Blob): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve) => {
    let image = new Image();
    image.onload = () => resolve(image);
    image.src = URL.createObjectURL(blob);
  });
}
function rgb2hsb(
  red: number,
  green: number,
  blue: number
): [number, number, number] {
  let max = Math.max(red, green, blue),
    min = Math.min(red, green, blue),
    d = max - min,
    hue: number;
  switch (max) {
    case min:
      hue = 0;
      break;
    case red:
      hue = green - blue + d * (green < blue ? 6 : 0);
      hue /= 6 * d;
      break;
    case green:
      hue = blue - red + d * 2;
      hue /= 6 * d;
      break;
    case blue:
      hue = red - green + d * 4;
      hue /= 6 * d;
      break;
  }
  return [hue, max === 0 ? 0 : d / max, max / 255];
}
function hsb2rgb(
  hue: number,
  saturation: number,
  brightness: number,
  destination: Uint8ClampedArray,
  index: number
): void {
  let i = Math.floor(hue * 6),
    f = hue * 6 - i,
    p = brightness * (1 - saturation),
    q = brightness * (1 - f * saturation),
    t = brightness * (1 - (1 - f) * saturation),
    red: number,
    green: number,
    blue: number;
  switch (i % 6) {
    case 0:
      (red = brightness), (green = t), (blue = p);
      break;
    case 1:
      (red = q), (green = brightness), (blue = p);
      break;
    case 2:
      (red = p), (green = brightness), (blue = t);
      break;
    case 3:
      (red = p), (green = q), (blue = brightness);
      break;
    case 4:
      (red = t), (green = p), (blue = brightness);
      break;
    case 5:
      (red = brightness), (green = p), (blue = q);
      break;
  }
  destination[index] = Math.round(red * 255);
  destination[index + 1] = Math.round(green * 255);
  destination[index + 2] = Math.round(blue * 255);
}
function redrawPreview(pose: string = "idle") {
  let $c = window.testPerson;
  let middle = $preview.width / 2;
  let bottom = $preview.height; //Middle-bottom is the point of origin. The sprites are drawn relative to this point.
  previewContext.clearRect(0, 0, $preview.width, $preview.height);
  characterPoses[pose].paintOrder.forEach((layerName) => {
    let layer = AssetPack.character[layerName];
    if (!layer) return;
    let spriteCollection: SpritePoseCollection =
      layer.spriteCollections.firstOrDefault(
        (collection: SpritePoseCollection) => {
          for (let key in collection.match) {
            let result = false;
            let matchValue = collection.match[key];
            let $v: any = key.includes("$c")
              ? eval(key)
              : key.includes(".")
              ? eval(`${key}($c)`)
              : $c[key];
            if (typeof matchValue == "string" && matchValue.includes("$v"))
              result = eval(matchValue);
            else if (
              typeof $v == "number" &&
              typeof matchValue == "string" &&
              matchValue.indexOf("-") > 0
            ) {
              let range = matchValue.split("-").map(parseFloat);
              result = $v >= range[0] && $v <= range[1];
            } else if (
              typeof matchValue == "string" &&
              matchValue.indexOf("|") > 0
            )
              for (let value of matchValue.split("|")) result ||= $v == value;
            else if (typeof matchValue == "boolean")
              result = !!$v == matchValue;
            else result = $v == matchValue;
            if (!result) return false;
          }
          return true;
        }
      );
    if (!spriteCollection) return;
    let sprite = spriteCollection.sprites[pose];
    let spriteCanvas = document.createElement("canvas"); //Canvas used to convert the pixel values into an image ready to draw
    spriteCanvas.width = sprite.width;
    spriteCanvas.height = sprite.height;
    let pixels = sprite.pixels;
    //#region color shift
    let colorShiftName =
      sprite.colorShift || spriteCollection.colorShift || layer.colorShift;
    let colorShift: HsbColor;
    if (layerName == $colorShiftLayer.value)
      colorShift = {
        h: +$hueValue.innerText,
        s: +$saturationValue.innerText,
        b: +$brightnessValue.innerText,
      };
    else if (colorShiftName) {
      let collection = colorShifts[colorShiftName];
      colorShift = collection.shifts[$c[collection.match]];
    }
    if (colorShift) {
      //Array to hold the shifted colors without altering the original array
      pixels = new Uint8ClampedArray(sprite.pixels.length);
      for (
        let colorByteIndex = 0;
        colorByteIndex < pixels.length;
        colorByteIndex += 4 //4 bytes per pixel red, green, blue and transparency
      ) {
        if (sprite.pixels[colorByteIndex + 3] == 0) continue; //Completely transparent pixel, so no need to shift or copy any color (Array is already initialized to 0)
        pixels[colorByteIndex + 3] = sprite.pixels[colorByteIndex + 3]; //Copy the transparency value as it is
        let [hue, saturation, brightness] = rgb2hsb(
          sprite.pixels[colorByteIndex],
          sprite.pixels[colorByteIndex + 1],
          sprite.pixels[colorByteIndex + 2]
        );
        //rgb values are converted to normalized hsb so now the actual color shift can be done
        hue = Math.min(1, Math.max(0, hue + colorShift.h));
        saturation = Math.min(1, Math.max(0, saturation + colorShift.s));
        brightness = Math.min(1, Math.max(0, brightness + colorShift.b));
        //Color shift done, time to convert back to rgb
        hsb2rgb(hue, saturation, brightness, pixels, colorByteIndex);
      }
    }
    //#endregion
    let spriteContext = spriteCanvas.getContext("2d");
    spriteContext.putImageData(
      new ImageData(pixels, sprite.width, sprite.height, {
        colorSpace: "display-p3",
      }),
      0,
      0
    );
    previewContext.drawImage(
      spriteCanvas,
      middle + sprite.x,
      bottom + sprite.y
    );
  });
}
let keywordToName = {
  sandels: "sandals",
  "sandels gladiator": "gladiator sandals",
  catears: "cat ears",
  "short heart": "heart t-shirt",
  "full latex": "full latex suit",
  summer: "summer dress",
  twintails: "twin tails",
  //Set to use in the parsing in a specific set
};
async function processImage(
  data: Uint8Array,
  fileNameNoExt: string,
  assetType: string
) {
  if (assetType != "character") {
    if (!AssetPack[assetType]) AssetPack[assetType] = {};
    AssetPack[assetType][fileNameNoExt] = data;
  } else {
    let image = await blob2img(new Blob([data]));
    let regexMatch = fileNameNoExt
      //.replace(/2$/, "")
      .match(/(\d+-\d+)_([^_.]+)(?:_([^. ]+))?/);
    if (!regexMatch) {
      console.error(fileNameNoExt + " ignored, does not match the format");
      return;
    }
    let characterMatch: any = {};
    let layerName: string;
    let spriteColorShiftName: string;
    //#region code to parse a specific asset pack
    characterMatch.age = regexMatch[1];
    if (regexMatch[3] == "tri") {
      //[,12-15,2nd,tri]
      characterMatch["LivingCharacter.getPregnancyMonth"] =
        "Math.floor($v/3)==" + regexMatch[2][0];
      layerName = "belly";
    } else {
      let assetName = regexMatch[3] || regexMatch[2]; //[,12-15, hair, b_s_straight]
      let splitName = assetName.split("_");
      switch (splitName[0]) {
        case "bl":
          spriteColorShiftName = "blonde";
          assetName = splitName.splice(1).join("_");
          break;
        default:
          let endColor = splitName[splitName.length - 1];
          switch (endColor) {
            case "black":
            case "blonde":
            case "white":
              spriteColorShiftName = endColor;
              splitName.pop();
              assetName = splitName.join("_");
              break;
          }
          break;
      }
      assetName = assetName.replace(/_/g, " ").replace(/-/g, " ");
      if (Object.keys(keywordToName).includes(assetName))
        assetName = keywordToName[assetName];
      layerName = regexMatch[2];
      switch (layerName) {
        case "boobs":
          characterMatch.titSize = assetName;
          layerName = "tits";
          break;
        case "bottom":
          characterMatch[`window.Person.wearing('${assetName}',$c)`] = true;
          layerName = "bottomDress";
          break;
        case "dress":
          characterMatch[`window.Person.wearing('${assetName}',$c)`] = true;
          break;
        case "eyes":
          characterMatch.eyesClosed = assetName == "closed";
          break;
        case "hair":
          if (assetName.indexOf("b ") === 0) {
            assetName = assetName.slice(2);
            layerName = "hairBack";
          } else assetName = assetName.replace(/^f /, ""); //[,12-15,hair,f_straight]
          if (assetName.indexOf("s ") === 0) {
            assetName = assetName.slice(2);
            characterMatch.hairLength = "short";
          }
          if (assetName.indexOf("m ") === 0) {
            assetName = assetName.slice(2);
            characterMatch.hairLength = "medium";
          }
          if (assetName.indexOf("l ") === 0) {
            assetName = assetName.slice(2);
            characterMatch.hairLength = "long";
          }
          characterMatch.hairStyle = assetName;
          break;
        case "hands":
          layerName = "handWear";
          characterMatch[`window.Person.wearing('${assetName}',$c)`] = true;
          break;
        case "hat":
          layerName = "headWear";
          if (assetName == "twintail bow")
            characterMatch.hairStyle = "twin tails";
          else
            characterMatch[`window.Person.wearing('${assetName}',$c)`] = true;
          break;
        case "mouth":
          characterMatch.expression = assetName;
          break;
        case "penis":
          layerName = "genitals";
          characterMatch.sex = "male|herm";
          characterMatch.aroused = assetName == "erect";
          break;
        case "shoes":
          characterMatch[`window.Person.wearing('${assetName}',$c)`] = true;
          break;
        case "top":
          layerName = "topDress";
          characterMatch[`window.Person.wearing('${assetName}',$c)`] = true;
          break;
        case "underwear":
          layerName = "bodyUnderwear";
          characterMatch[`window.Person.wearing('${assetName}',$c)`] = true;
          break;
      }
    }
    //#endregion code to parse a specific asset pack
    if (Object.keys(characterMatch).length == 0) characterMatch = null;
    let layer: CharacterGraphicLayer = AssetPack.character[layerName] || {
      spriteCollections: [],
    };
    let spriteCollection: SpritePoseCollection = layer.spriteCollections.find(
      (c) => _.isEqual(c.match, characterMatch)
    );
    if (!spriteCollection) {
      spriteCollection = { match: characterMatch, sprites: {} };
      layer.spriteCollections.push(spriteCollection);
    }
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d", {
      colorSpace: "display-p3",
      willReadFrequently: true,
    });
    context.drawImage(image, 0, 0);
    let colorBytes = context.getImageData(0, 0, image.width, image.height).data;
    let visibleArea = {
      left: image.width,
      top: image.height,
      right: 0,
      bottom: 0,
    };
    let foundImageOpaque = false,
      mightFoundBottom = false;
    for (let rowIndex = 0; rowIndex < image.height; rowIndex++) {
      let foundRowOpaque = false,
        mightFoundRight = false;
      for (let columnIndex = 0; columnIndex < image.width; columnIndex++) {
        let isTransparent =
          colorBytes[image.width * 4 * rowIndex + columnIndex * 4 + 3] == 0;
        if (!foundRowOpaque) {
          foundRowOpaque = !isTransparent;
          if (foundRowOpaque && columnIndex < visibleArea.left)
            visibleArea.left = columnIndex;
        } else if (mightFoundRight) {
          if (!isTransparent) mightFoundRight = false;
        } else if (isTransparent) {
          mightFoundRight = true;
          if (columnIndex > visibleArea.right) visibleArea.right = columnIndex;
        }
      }
      if (!foundImageOpaque) {
        if ((foundImageOpaque = foundRowOpaque)) visibleArea.top = rowIndex;
      } else if (mightFoundBottom) {
        if (foundRowOpaque) mightFoundBottom = false;
      } else if (!foundRowOpaque) {
        visibleArea.bottom = rowIndex;
        mightFoundBottom = true;
      }
    }
    let croppedImageData = context.getImageData(
      visibleArea.left,
      visibleArea.top,
      visibleArea.right - visibleArea.left,
      visibleArea.bottom - visibleArea.top
    );
    spriteCollection.sprites.idle = {
      pixels: croppedImageData.data,
      x: visibleArea.left - Math.floor(image.width / 2),
      y: visibleArea.top - image.height,
      width: croppedImageData.width,
      height: croppedImageData.height,
    };
    if (spriteColorShiftName)
      spriteCollection.sprites.idle.colorShift = spriteColorShiftName;
    AssetPack.character[layerName] = layer;
    URL.revokeObjectURL(image.src);
  }
}
let readZip = (blobReader: zip.BlobReader) =>
  new Promise<void>((resolve) => {
    new zip.ZipReader(blobReader).getEntries().then((entries) => {
      let promises: Array<Promise<void>> = [];
      entries.forEach((entry) => {
        if (!entry.directory)
          promises.push(
            entry.getData(new zip.Uint8ArrayWriter()).then(async (data) => {
              let routeElements = entry.filename.split("/");
              await processImage(
                data,
                routeElements[routeElements.length - 1].replace(
                  /\.[^/.]+$/,
                  ""
                ),
                routeElements.length > 1 ? routeElements[0] : $assetType.value
              );
            })
          );
      });
      Promise.all(promises).then(() => resolve());
    });
  });
async function readFile(file: File) {
  let blobReader = new zip.BlobReader(file);
  let fileBytes = await blobReader.readUint8Array(0, file.size);
  let fileType = FileType.unknown;
  switch (fileBytes[0]) {
    case 0x47: //gif
      if (
        fileBytes[1] == 0x49 &&
        fileBytes[2] == 0x46 &&
        fileBytes[3] == 0x38 &&
        fileBytes[4] >> 4 == 3 &&
        fileBytes[5] == 0x61
      )
        fileType = FileType.image;
      break;
    case 255: //jpg
      if (fileBytes[1] == 0xd8 && fileBytes[2] == 255)
        fileType = FileType.image;
      break;
    case 0x50: //zip
      if (fileBytes[1] == 0x4b && fileBytes[2] >> 4 == 0)
        fileType = FileType.zip;
      break;
    case 0x89: //png
      if (
        fileBytes[1] == 0x50 &&
        fileBytes[2] == 0x4e &&
        fileBytes[3] == 0x47 &&
        fileBytes[4] == 0x0d &&
        fileBytes[5] == 0x0a &&
        fileBytes[6] == 0x1a &&
        fileBytes[7] == 0x0a
      )
        fileType = FileType.image;
      break;
    case 0x52: //webp
      if (
        fileBytes[1] == 0x49 &&
        fileBytes[2] == 0x46 &&
        fileBytes[3] == 0x46 &&
        fileBytes[8] == 0x57 &&
        fileBytes[9] == 0x45 &&
        fileBytes[10] == 0x42 &&
        fileBytes[11] == 0x50
      )
        fileType = FileType.image;
      break;
  }
  switch (fileType) {
    case FileType.zip:
      return await readZip(blobReader);
    case FileType.image:
      return await processImage(
        fileBytes,
        file.name.replace(/\.[^/.]+$/, ""),
        $assetType.value
      );
    default:
      throw new Error("Unknown file type");
  }
}
async function filesUpload(files: File[]) {
  if (!files.length) return;
  $status.innerText = "Processing files";
  let promises = [];
  files.forEach((f) => promises.push(readFile(f)));
  $hiddenUpload.value = null;
  await Promise.all(promises);
  let previewSize = { width: 0, height: 0 };
  for (let layerName in AssetPack.character)
    AssetPack.character[layerName].spriteCollections.forEach(
      (poseCollection) => {
        let sprite = poseCollection.sprites.idle;
        previewSize.width = Math.max(
          previewSize.width,
          Math.max(Math.abs(sprite.x), Math.abs(sprite.x + sprite.width)) * 2
        );
        previewSize.height = Math.max(previewSize.height, Math.abs(sprite.y));
      }
    );
  //#region specific character set code
  ["body", "genitals", "belly", "tits"].forEach((layerName) => {
    AssetPack.character[layerName].colorShift = "skin";
  });
  ["hairBack", "hair"].forEach((layerName) => {
    AssetPack.character[layerName].colorShift = "brunette";
  });
  AssetPack.character["eyes"].colorShift = "eyes";
  //#endregion
  $preview.width = previewSize.width;
  $preview.height = previewSize.height;
  $status.innerText = "Done. Waiting for more files, if any.";
  previewControlOnChange();
}
function getSpriteUrl(sprite: Sprite) {
  let canvas = document.createElement("canvas");
  canvas.width = sprite.width;
  canvas.height = sprite.height;
  let context = canvas.getContext("2d");
  context.putImageData(
    new ImageData(sprite.pixels, sprite.width, sprite.height, {
      colorSpace: "display-p3",
    }),
    0,
    0
  );
  canvas.toBlob((b) => console.log(URL.createObjectURL(b)));
}
$fileDrop.ondrop = (event) => {
  event.preventDefault();
  $fileDrop.style.borderColor = "#ff4d4d";
  let files = [];
  if (event.dataTransfer.items)
    [...event.dataTransfer.items].forEach((item) => {
      if (item.kind === "file") files.push(item.getAsFile());
    });
  filesUpload(files);
};
$fileDrop.onclick = () => $hiddenUpload.click();
$hiddenUpload.onchange = () => filesUpload([...$hiddenUpload.files]);
window.PersonGeneration.females.fromAge =
  window.PersonGeneration.males.fromAge = 12;
window.testPerson = window.Person.generate(window.PersonGeneration);
characterPoses.idle.paintOrder.forEach((layerName) => {
  let option = document.createElement("option");
  option.innerText = layerName;
  $colorShiftLayer.add(option);
});
const hsbPrecision = 1000;
$hueInput.oninput = () => {
  $hueValue.innerText =
    "" + Math.round((+$hueInput.value / 255) * hsbPrecision) / hsbPrecision;
  previewControlOnChange();
};
$saturationInput.oninput = () => {
  $saturationValue.innerText =
    "" +
    Math.round((+$saturationInput.value / 255) * hsbPrecision) / hsbPrecision;
  previewControlOnChange();
};
$brightnessInput.oninput = () => {
  $brightnessValue.innerText =
    "" +
    Math.round((+$brightnessInput.value / 255) * hsbPrecision) / hsbPrecision;
  previewControlOnChange();
};
$hueInput.ondragstart =
  $saturationInput.ondragstart =
  $brightnessInput.ondragstart =
    function (ev) {
      ev.preventDefault();
    };
let updateHsb = () => {
  $hueInput.oninput(null);
  $saturationInput.oninput(null);
  $brightnessInput.oninput(null);
};
let resetHsb = () => {
  $hueInput.value = $saturationInput.value = $brightnessInput.value = "0";
  updateHsb();
};
resetHsb();
geId("btnReset").onclick = resetHsb;
$preview.onclick = (mouseEvent: MouseEvent) => {
  let pixelBytes = previewContext.getImageData(
    mouseEvent.pageX - $preview.offsetLeft,
    mouseEvent.pageY - $preview.offsetTop,
    1,
    1
  ).data;
  $fromColor.value = (
    (pixelBytes[0] << 16) |
    (pixelBytes[1] << 8) |
    pixelBytes[2]
  )
    .toString(16)
    .toUpperCase()
    .padStart(6, "0");
};
let rgb = (input: HTMLInputElement) => <[number, number, number]>input.value
    .slice(-6)
    .padStart(6, "0")
    .match(/../g)
    .map((h) => parseInt(h, 16));
geId("colorShiftApply").onclick = () => {
  let fromHsb = rgb2hsb(...rgb($fromColor));
  let toHsb = rgb2hsb(...rgb($toColor));
  $hueInput.value = "" + (toHsb[0] - fromHsb[0]) * 255;
  $saturationInput.value = "" + (toHsb[1] - fromHsb[1]) * 255;
  $brightnessInput.value = "" + (toHsb[2] - fromHsb[2]) * 255;
  updateHsb();
};
