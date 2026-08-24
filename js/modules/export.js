/**
 * Export Module
 * Handles CSV and Markdown export of tasks
 */

const SEGMENT_LABELS = {
  de: { 1: 'Q1 – Sofort!', 2: 'Q2 – Planen!', 3: 'Q3 – Abgeben!', 4: 'Q4 – Später!', 5: 'Fertig!' },
  en: { 1: 'Q1 – Do!', 2: 'Q2 – Schedule!', 3: 'Q3 – Delegate!', 4: 'Q4 – Ignore!', 5: 'Done!' },
};

/**
 * Export all tasks as a CSV file download
 * @param {Object} tasks - Tasks grouped by segment ID
 * @param {string} [lang='en'] - Language for labels ('de' or 'en')
 */
export function exportCsv(tasks, lang = 'en') {
  const labels = SEGMENT_LABELS[lang] || SEGMENT_LABELS.en;
  const headers =
    lang === 'de'
      ? ['Quadrant', 'Aufgabe', 'Kategorie', 'Fällig am', 'Status']
      : ['Quadrant', 'Task', 'Category', 'Due Date', 'Status'];

  const doneLabel = lang === 'de' ? 'Erledigt' : 'Done';
  const openLabel = lang === 'de' ? 'Offen' : 'Open';
  const locale = lang === 'de' ? 'de-DE' : 'en-US';

  const rows = [headers.join(',')];

  for (const [segId, segTasks] of Object.entries(tasks)) {
    const quadrant = labels[segId] || `Q${segId}`;
    for (const task of segTasks) {
      const status = task.checked ? doneLabel : openLabel;
      const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString(locale) : '';
      const category = task.category || '';
      const text = task.text.replace(/"/g, '""');
      rows.push(`"${quadrant}","${text}","${category}","${due}","${status}"`);
    }
  }

  const dateStr = new Date().toISOString().split('T')[0];
  _download(rows.join('\n'), `eisenhauer-export-${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export all tasks as a Markdown file download, grouped by segment
 * @param {Object} tasks - Tasks grouped by segment ID
 * @param {string} [lang='en'] - Language for labels ('de' or 'en')
 */
export function exportMarkdown(tasks, lang = 'en') {
  const labels = SEGMENT_LABELS[lang] || SEGMENT_LABELS.en;
  const locale = lang === 'de' ? 'de-DE' : 'en-US';
  const dateLabel = lang === 'de' ? 'Exportiert am' : 'Exported on';
  const dueLabel = lang === 'de' ? 'Fällig' : 'Due';

  let md = `# Eisenhauer Matrix\n*${dateLabel}: ${new Date().toLocaleDateString(locale)}*\n\n`;

  for (const segId of [1, 2, 3, 4, 5]) {
    const segTasks = tasks[segId] || [];
    if (segTasks.length === 0) continue;

    md += `## ${labels[segId]}\n\n`;
    for (const task of segTasks) {
      const cb = task.checked ? '[x]' : '[ ]';
      const due = task.dueDate
        ? ` _(${dueLabel}: ${new Date(task.dueDate).toLocaleDateString(locale)})_`
        : '';
      const cat = task.category ? ` \`${task.category}\`` : '';
      md += `- ${cb} ${task.text}${due}${cat}\n`;
    }
    md += '\n';
  }

  const dateStr = new Date().toISOString().split('T')[0];
  _download(md, `eisenhauer-export-${dateStr}.md`, 'text/markdown;charset=utf-8;');
}

function _download(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
