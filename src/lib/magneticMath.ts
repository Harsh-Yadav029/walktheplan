export interface MagneticOffsetParams {
  clientX: number;
  clientY: number;
  rectLeft: number;
  rectTop: number;
  rectWidth: number;
  rectHeight: number;
  currentX?: number;
  currentY?: number;
  strength?: number;
  maxOffset?: number;
}

export interface MagneticOffsetResult {
  x: number;
  y: number;
}

export function computeMagneticOffset({
  clientX,
  clientY,
  rectLeft,
  rectTop,
  rectWidth,
  rectHeight,
  currentX = 0,
  currentY = 0,
  strength = 0.28,
  maxOffset = 14,
}: MagneticOffsetParams): MagneticOffsetResult {
  const restingCenterX = rectLeft + rectWidth / 2 - currentX;
  const restingCenterY = rectTop + rectHeight / 2 - currentY;

  const rawX = (clientX - restingCenterX) * strength;
  const rawY = (clientY - restingCenterY) * strength;

  const x = Math.max(-maxOffset, Math.min(maxOffset, rawX));
  const y = Math.max(-maxOffset, Math.min(maxOffset, rawY));

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  };
}
