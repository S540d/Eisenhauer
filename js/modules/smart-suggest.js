/**
 * Smart Suggest Module
 * Keyword-based quadrant suggestion for new tasks
 */

// Keywords that hint at each quadrant
const KEYWORDS = {
  1: [
    // Q1: Important & Urgent
    'dringend',
    'sofort',
    'urgent',
    'asap',
    'immediately',
    'now',
    'heute',
    'today',
    'deadline',
    'critical',
    'kritisch',
    'notfall',
    'emergency',
    'morgen',
    'tomorrow',
    'overdue',
    'überfällig',
    'blocker',
    'fällig',
    'frist',
    'eskalation',
    'escalat',
    'krise',
    'crisis',
    'alarm',
    'priorisier',
    'prioritize',
  ],
  2: [
    // Q2: Important, not urgent
    'plan',
    'planen',
    'wichtig',
    'important',
    'lernen',
    'learn',
    'studie',
    'study',
    'projekt',
    'project',
    'strategi',
    'entwickl',
    'develop',
    'ziel',
    'goal',
    'langfristig',
    'long-term',
    'vorbereitung',
    'prepare',
    'verbessern',
    'improve',
    'review',
    'analyse',
    'analyze',
    'recherche',
    'research',
    'gesundheit',
    'health',
    'ausbildung',
    'training',
    'kurs',
    'course',
    'investition',
    'invest',
    'routin',
    'wöchentlich',
    'monthly',
    'regelmäßig',
    'regular',
  ],
  3: [
    // Q3: Urgent, not important
    'anrufen',
    'anruf',
    'call',
    'email',
    'mail',
    'meeting',
    'termin',
    'appointment',
    'kollege',
    'colleague',
    'team',
    'besprechung',
    'conference',
    'weiterleiten',
    'forward',
    'fragen',
    'anfrage',
    'request',
    'koordinier',
    'coordinat',
    'delegier',
    'delegat',
    'organisier',
    'organiz',
    'buchen',
    'book',
    'reservier',
    'reserv',
    'einladen',
    'invite',
  ],
  4: [
    // Q4: Neither urgent nor important
    'vielleicht',
    'maybe',
    'someday',
    'irgendwann',
    'optional',
    'nice-to-have',
    'später',
    'later',
    'idee',
    'idea',
    'erkunden',
    'explore',
    'überlegen',
    'consider',
    'evtl',
    'möglicherweise',
    'possibly',
    'gelegenheit',
    'opportunity',
    'freizeit',
    'leisure',
    'hobby',
    'spaß',
    'fun',
    'wäre schön',
    'would be nice',
  ],
};

/**
 * Suggest a quadrant based on task text keywords
 * @param {string} text - Task input text
 * @returns {number|null} Segment ID (1-4) or null if no confident match
 */
export function suggestSegment(text) {
  if (!text || text.trim().length < 3) return null;

  const lower = text.toLowerCase();
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (const [seg, keywords] of Object.entries(KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        scores[seg] += 1;
      }
    }
  }

  const best = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a));
  return best[1] > 0 ? parseInt(best[0]) : null;
}

export const SEGMENT_SUGGEST_LABELS = {
  de: {
    1: 'Sofort! (Q1)',
    2: 'Planen! (Q2)',
    3: 'Abgeben! (Q3)',
    4: 'Später! (Q4)',
  },
  en: {
    1: 'Do! (Q1)',
    2: 'Schedule! (Q2)',
    3: 'Delegate! (Q3)',
    4: 'Ignore! (Q4)',
  },
};
