/**
 * Unit tests for onboarding.js module (Issue #352 B2)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  isOnboardingDismissed,
  dismissOnboarding,
  isSegmentDemoDismissed,
  dismissSegmentDemo,
  shouldShowSegmentDemo,
} from '../../js/modules/onboarding.js';

describe('Onboarding Module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isOnboardingDismissed / dismissOnboarding', () => {
    it('is not dismissed by default', () => {
      expect(isOnboardingDismissed()).toBe(false);
    });

    it('becomes dismissed after dismissOnboarding()', () => {
      dismissOnboarding();
      expect(isOnboardingDismissed()).toBe(true);
    });
  });

  describe('isSegmentDemoDismissed / dismissSegmentDemo', () => {
    it('is not dismissed by default', () => {
      expect(isSegmentDemoDismissed(1)).toBe(false);
    });

    it('dismisses only the given segment', () => {
      dismissSegmentDemo(1);
      expect(isSegmentDemoDismissed(1)).toBe(true);
      expect(isSegmentDemoDismissed(2)).toBe(false);
    });

    it('dismisses onboarding entirely once all demo segments are dismissed', () => {
      dismissSegmentDemo(1);
      dismissSegmentDemo(2);
      dismissSegmentDemo(3);
      expect(isOnboardingDismissed()).toBe(false);
      dismissSegmentDemo(4);
      expect(isOnboardingDismissed()).toBe(true);
    });

    it('tolerates corrupt localStorage content', () => {
      localStorage.setItem('onboardingDemoDismissed', 'not-json');
      expect(isSegmentDemoDismissed(1)).toBe(false);
      expect(() => dismissSegmentDemo(1)).not.toThrow();
      expect(isSegmentDemoDismissed(1)).toBe(true);
    });
  });

  describe('shouldShowSegmentDemo', () => {
    it('shows the demo for an untouched segment 1-4', () => {
      expect(shouldShowSegmentDemo(1)).toBe(true);
    });

    it('never shows a demo for segment 5 (Done)', () => {
      expect(shouldShowSegmentDemo(5)).toBe(false);
    });

    it('hides the demo once onboarding is dismissed', () => {
      dismissOnboarding();
      expect(shouldShowSegmentDemo(1)).toBe(false);
    });

    it('hides the demo once that segment was individually dismissed', () => {
      dismissSegmentDemo(2);
      expect(shouldShowSegmentDemo(2)).toBe(false);
      expect(shouldShowSegmentDemo(1)).toBe(true);
    });
  });
});
