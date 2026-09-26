/**
 * Site-agent configuration and a sample call log for the Stage-2 preview.
 * The real agent runs on Sarvam Voice Agents; these constants model what the
 * Agent page will read from the Sarvam Deployments API once wired up.
 */

export const SITE_AGENT = {
  name: 'Site Saathi',
  number: '+91 80 4718 2200',
  languages: [
    'Hindi', 'Odia', 'Bengali', 'Tamil', 'Telugu',
    'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'English',
  ],
  nightlyCallTime: '21:00 IST',
  status: 'live',
}

export const CALL_LOG = [
  {
    id: 'call_006',
    date: '2026-09-25T21:04:00',
    direction: 'outbound',
    participant: 'Sai Ashish Mishra (manager)',
    language: 'Hindi',
    topic: 'Nightly progress check-in — Ashray Residences',
    durationSec: 272,
    outcome: 'report received',
  },
  {
    id: 'call_005',
    date: '2026-09-25T15:41:00',
    direction: 'inbound',
    participant: 'Ramesh (mason)',
    language: 'Odia',
    topic: 'Slab curing days before shuttering removal',
    durationSec: 96,
    outcome: 'answered',
  },
  {
    id: 'call_004',
    date: '2026-09-25T11:02:00',
    direction: 'inbound',
    participant: 'Suresh (bar bender)',
    language: 'Hindi',
    topic: 'Column cover blocks spacing on ground floor',
    durationSec: 84,
    outcome: 'answered',
  },
  {
    id: 'call_003',
    date: '2026-09-24T21:02:00',
    direction: 'outbound',
    participant: 'Sai Ashish Mishra (manager)',
    language: 'Hindi',
    topic: 'Nightly progress check-in — Ashray Residences',
    durationSec: 305,
    outcome: 'report received',
  },
  {
    id: 'call_002',
    date: '2026-09-24T16:20:00',
    direction: 'inbound',
    participant: 'Anil (supervisor)',
    language: 'Odia',
    topic: 'Beam reinforcement details — first floor',
    durationSec: 190,
    outcome: 'answered',
  },
  {
    id: 'call_001',
    date: '2026-09-24T09:12:00',
    direction: 'inbound',
    participant: 'Unknown caller',
    language: 'Bengali',
    topic: 'Wrong number — cement delivery',
    durationSec: 23,
    outcome: 'not related',
  },
]
