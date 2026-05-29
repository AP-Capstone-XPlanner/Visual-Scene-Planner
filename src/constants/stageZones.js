/**
 * @file Stage zone labels.
 */

export const STAGE_ZONE_LINE_OPACITY = 0.88;
export const STAGE_ZONE_LINE_WIDTH = 1.35;

export const STAGE_NINE_ZONE_LABELS = Object.freeze([
  { text: 'Upstage Right', alongZ: 0, alongX: 0 },
  { text: 'Upstage', alongZ: 0, alongX: 1 },
  { text: 'Upstage Left', alongZ: 0, alongX: 2 },
  { text: 'Stage Right', alongZ: 1, alongX: 0 },
  { text: 'Center Stage', alongZ: 1, alongX: 1 },
  { text: 'Stage Left', alongZ: 1, alongX: 2 },
  { text: 'Downstage Right', alongZ: 2, alongX: 0 },
  { text: 'Downstage', alongZ: 2, alongX: 1 },
  { text: 'Downstage Left', alongZ: 2, alongX: 2 },
]);

export const STAGE_AUDIENCE_LABEL = 'AUDIENCE';
