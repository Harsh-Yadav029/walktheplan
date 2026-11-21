export type CursorMode = 'default' | 'Explore' | 'View' | 'muted';

export function lerpValue(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha;
}

export function computeFrameAlpha(baseAlpha: number, deltaRatio = 1): number {
  const safeRatio = Math.max(0.1, Math.min(4, deltaRatio));
  return 1 - Math.pow(1 - baseAlpha, safeRatio);
}

export interface ResolveCursorTargetInput {
  explicitCursor?: string | null;
  tagName?: string | null;
  role?: string | null;
}

export function resolveCursorMode({
  explicitCursor,
  tagName,
  role,
}: ResolveCursorTargetInput): CursorMode {
  if (explicitCursor === 'View') return 'View';
  if (explicitCursor === 'Explore') return 'Explore';
  if (explicitCursor === 'muted') return 'muted';

  const normalizedTag = (tagName ?? '').toUpperCase();
  if (normalizedTag === 'INPUT' || normalizedTag === 'SELECT' || normalizedTag === 'TEXTAREA') {
    return 'muted';
  }

  if (
    normalizedTag === 'BUTTON' ||
    normalizedTag === 'A' ||
    role === 'tab' ||
    role === 'button'
  ) {
    return 'Explore';
  }

  return 'default';
}
