import { PufferblowMark } from "./PufferblowBrand";

/** The brand mark at rail size, as the app draws it (the v2 face; the name is from the old gold mark). */
export default function GoldPuffer({ size }: { size: number }) {
  return <PufferblowMark size={size} />;
}
