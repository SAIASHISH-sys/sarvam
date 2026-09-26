/**
 * Shared mapping from compliance status keys to labels and badge tones.
 * Used by every view that renders a compliance status.
 */
export const COMPLIANCE_STATUS_META = {
  compliant: { label: 'Compliant', tone: 'success' },
  attention: { label: 'Attention', tone: 'warning' },
  noncompliant: { label: 'Not compliant', tone: 'danger' },
  info: { label: 'Info', tone: 'neutral' },
}
