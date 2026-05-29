/**
 * Stage plan axes (world space, Y = up):
 * - store.width  → X (stage left +X, stage right −X)
 * - store.length → Z (downstage +Z, upstage −Z)
 */
export function getStageHalfExtents(length, width) {
  return { halfX: width / 2, halfZ: length / 2 };
}
