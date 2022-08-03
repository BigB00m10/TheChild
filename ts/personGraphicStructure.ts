type PersonGrowthStage =
  | "baby"
  | "toddler"
  | "junior"
  | "elementary"
  | "pubescent"
  | "postPubescent";
interface PersonGrowthStageRange {
  from: number;
  to: number;
}
const GrowthStageAge: Record<PersonGrowthStage, PersonGrowthStageRange> = {
  baby: {
    from: 0,
    to: 0,
  },
  toddler: {
    from: 1,
    to: 4,
  },
  junior: {
    from: 5,
    to: 7,
  },
  elementary: {
    from: 8,
    to: 11,
  },
  pubescent: {
    from: 12,
    to: 15,
  },
  postPubescent: {
    from: 16,
    to: 25,
  },
};
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
