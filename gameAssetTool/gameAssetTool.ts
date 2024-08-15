interface HsbColor {
  h: number; //Hue
  s: number; //Saturation
  b: number; //Brightness
}
interface ColorShift {
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
let colorShifts: Record<string, ColorShift> = {
  brunette: {
    match: "hairColor",
    shifts: {
      blonde: { h: 0, s: 0, b: 0 },
      black: { h: 0, s: 0, b: 0 },
    },
  },
  skin: {
    match: "skin",
    shifts: {
      pale: { h: 0, s: 0, b: 0 },
      tan: { h: 0, s: 0, b: 0 },
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
$fileDrop.ondragover = (event) => {
  event.preventDefault();
  $fileDrop.style.borderColor = "yellow";
};
$fileDrop.ondragleave = () => ($fileDrop.style.borderColor = "#ff4d4d");
let previewControlOnChange = function () {
  window.testPerson.age = parseInt(previewControls.age.value);
  window.testPerson.sex = <Sex>(<HTMLInputElement>document.querySelector("input[name=sex]:checked")).labels[0].innerText;
  window.testPerson.hairLength = (<HTMLDataListElement>previewControls.hairLength.list).options[previewControls.hairLength.value].label;
  window.testPerson.hairStyle = (<HTMLDataListElement>previewControls.hairStyle.list).options[previewControls.hairStyle.value].label;
  window.testPerson.pregnantDays = parseInt(previewControls.pregnant.value);
  window.testPerson.titSize = (<HTMLDataListElement>previewControls.tits.list).options[previewControls.tits.value].label;
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
function redrawPreview(pose: string = "idle") {
  let $c = window.testPerson;
  let middle = $preview.width / 2;
  let bottom = $preview.height;
  previewContext.clearRect(0, 0, $preview.width, $preview.height);
  characterPoses[pose].paintOrder.forEach((layerName) => {
    if (!AssetPack.character[layerName]) return;
    let spriteCollection: SpritePoseCollection = AssetPack.character[
      layerName
    ].spriteCollections.firstOrDefault((collection: SpritePoseCollection) => {
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
        } else if (typeof matchValue == "string" && matchValue.indexOf("|") > 0)
          for (let value of matchValue.split("|")) result ||= $v == value;
        else if (typeof matchValue == "boolean") result = !!$v == matchValue;
        else result = $v == matchValue;
        if (!result) return false;
      }
      return true;
    });
    if (!spriteCollection) return;
    let sprite = spriteCollection.sprites[pose];
    var spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = spriteCollection.sprites[pose].width;
    spriteCanvas.height = spriteCollection.sprites[pose].height;
    //TODO: replace colors if necessary;
    var spriteContext = spriteCanvas.getContext("2d");
    spriteContext.putImageData(
      new ImageData(sprite.pixels, sprite.width, sprite.height, {
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
  sandels_gladiator: "gladiator sandals",
  catears: "cat ears",
  "short heart": "heart t-shirt",
  full_latex: "full latex suit",
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
  for (let type in AssetPack.character)
    AssetPack.character[type].spriteCollections.forEach((poseCollection) => {
      let sprite = poseCollection.sprites.idle;
      previewSize.width = Math.max(
        previewSize.width,
        Math.max(Math.abs(sprite.x), Math.abs(sprite.x + sprite.width)) * 2
      );
      previewSize.height = Math.max(previewSize.height, Math.abs(sprite.y));
    });
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
