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
let personPoses: Record<string, CharacterPose> = {
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
    animationCache: "eyes",
  },
};
type ImageCacheType = "base" | "offscreen" | "animation";
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
function url2img(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve) => {
    let image = new Image();
    image.onload = () => resolve(image);
    image.src = url;
  });
}
let blob2img = (blob: Blob): Promise<HTMLImageElement> =>
  url2img(URL.createObjectURL(blob));
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
interface Window {
  personImage: (
    person: Person,
    cache?: ImageCacheType,
    pose?: string
  ) => Promise<string>;
}
window.personImage = async (
  person: Person,
  cache?: ImageCacheType,
  pose: string = "idle"
): Promise<string> => {
  let fullCanvas = document.createElement("canvas");
  fullCanvas.width = <number>(<unknown>window.Assets.character.neededWidth);
  fullCanvas.height = <number>(<unknown>window.Assets.character.neededHeight);
  let fullCanvasContext = fullCanvas.getContext("2d");
  let $c = person;
  let middle = fullCanvas.width / 2;
  let bottom = fullCanvas.height; //Middle-bottom is the point of origin. The sprites are drawn relative to this point.
  //fullCanvasContext.clearRect(0, 0, fullCanvas.width, fullCanvas.height);
  let charPose = personPoses[pose];
  let afterBaseIndex = charPose.paintOrder.indexOf(charPose.baseCache) + 1;
  let afterOffscreenIndex =
    charPose.paintOrder.indexOf(charPose.offscreenCache) + 1;
  let afterAnimationIndex =
    charPose.paintOrder.indexOf(charPose.animationCache) + 1;
  let sliceStart: number, sliceEnd: number;
  switch (cache) {
    case "base":
      sliceStart = 0;
      sliceEnd = afterBaseIndex;
      break;
    case "offscreen":
      if ($c.baseImageCache) {
        fullCanvasContext.drawImage(await url2img($c.baseImageCache), 0, 0);
        sliceStart = afterBaseIndex;
      } else sliceStart = 0;
      sliceEnd = afterOffscreenIndex;
      break;
    default:
      if ($c.offscreenImageCache) {
        fullCanvasContext.drawImage(
          await url2img($c.offscreenImageCache),
          0,
          0
        );
        sliceStart = afterOffscreenIndex;
      } else if ($c.baseImageCache) {
        fullCanvasContext.drawImage(await url2img($c.baseImageCache), 0, 0);
        sliceStart = afterBaseIndex;
      } else sliceStart = 0;
      sliceEnd = afterAnimationIndex;
      break;
    case "animation":
      sliceStart = afterAnimationIndex;
      break;
  }
  charPose.paintOrder.slice(sliceStart, sliceEnd).forEach((layerName) => {
    let layer = window.Assets.character[layerName];
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
    if (colorShiftName) {
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
    fullCanvasContext.drawImage(
      spriteCanvas,
      middle + sprite.x,
      bottom + sprite.y
    );
  });
  return URL.createObjectURL(
    await new Promise<Blob>((resolve) =>
      fullCanvas.toBlob((blob) => resolve(blob))
    )
  );
};
