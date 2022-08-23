interface BodyOverlay {
  sex: Gender;
  imageData: string;
}
type BodyState = "normal" | "pregnant";
interface Position {
  x: number;
  y: number;
}
interface BodyGraphic {
  sex?: Gender;
  overlay?: BodyOverlay;
  state?: BodyState;
  data: string;
  position: Position;
}
interface FaceExpressions {
  neutral: string;
  scared: string;
  mildSmile: string;
}
interface HairGraphic {
  back: string;
  front: string;
}
type ClothingType =
  | "head"
  | "neck"
  | "top"
  | "hand"
  | "bottom"
  | "socks"
  | "shoes"
  | "underwear";
interface ClothesGraphics {
  types: ClothingType[];
  set: string;
  data: string;
  position: Position;
  name: string;
  colorized: boolean;
}
interface GrowthStageGraphics {
  body: BodyGraphic[];
  hair: Record<string, Record<string, HairGraphic> | HairGraphic>; //Style and optional style variant (i.e. length)
  clothes: Record<string, ClothesGraphics>;
}
interface GraphicPose {
  stages: Record<PersonGrowthStage, GrowthStageGraphics>;
  faceExpressions: FaceExpressions;
  blush: string;
  expressionPosition: Position;
  blushPosition: Position;
}
