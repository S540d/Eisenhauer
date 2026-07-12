/**
 * Onboarding Module (Issue #352 B2)
 * Empty-matrix quadrant explanations + dismissible demo tasks for new users
 */

const ONBOARDING_DISMISSED_KEY = 'onboardingDismissed';
const ONBOARDING_DEMO_DISMISSED_KEY = 'onboardingDemoDismissed';
const DEMO_SEGMENTS = [1, 2, 3, 4];

/**
 * Whether onboarding (quadrant explanation + demo tasks) has been fully dismissed
 * @returns {boolean}
 */
export function isOnboardingDismissed() {
  return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === 'true';
}

/**
 * Permanently dismiss onboarding, e.g. once the user has added a real task
 */
export function dismissOnboarding() {
  localStorage.setItem(ONBOARDING_DISMISSED_KEY, 'true');
}

function readDismissedDemoSegments() {
  try {
    const raw = localStorage.getItem(ONBOARDING_DEMO_DISMISSED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Whether the demo task for a specific segment has been dismissed by the user
 * @param {number} segmentId
 * @returns {boolean}
 */
export function isSegmentDemoDismissed(segmentId) {
  return readDismissedDemoSegments().includes(segmentId);
}

/**
 * Dismiss the demo task for a single segment. Once all demo segments are
 * dismissed, onboarding is considered fully dismissed.
 * @param {number} segmentId
 */
export function dismissSegmentDemo(segmentId) {
  const dismissed = new Set(readDismissedDemoSegments());
  dismissed.add(segmentId);
  localStorage.setItem(ONBOARDING_DEMO_DISMISSED_KEY, JSON.stringify([...dismissed]));

  if (DEMO_SEGMENTS.every((id) => dismissed.has(id))) {
    dismissOnboarding();
  }
}

/**
 * Whether the demo task + explanation should be shown for a given empty segment
 * @param {number} segmentId
 * @returns {boolean}
 */
export function shouldShowSegmentDemo(segmentId) {
  return (
    DEMO_SEGMENTS.includes(segmentId) &&
    !isOnboardingDismissed() &&
    !isSegmentDemoDismissed(segmentId)
  );
}
