import fs from 'node:fs'

const analytics = fs.readFileSync(new URL('../src/analytics.ts', import.meta.url), 'utf8')
const app = fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
const privacy = fs.readFileSync(new URL('../public/privacy.html', import.meta.url), 'utf8')
const docs = fs.readFileSync(new URL('../docs/ANALYTICS.md', import.meta.url), 'utf8')

const requiredEvents = [
  'app_opened',
  'practice_started',
  'practice_input_started',
  'onboarding_checkpoint_completed',
  'practice_round_completed',
  'practice_exited',
  'challenge_saved',
  'install_result',
  'sync_enabled',
]

const requiredPrivacyControls = [
  "autocapture: false",
  "capture_pageview: false",
  "capture_pageleave: false",
  "capture_dead_clicks: false",
  "capture_heatmaps: false",
  "capture_performance: false",
  "capture_exceptions: false",
  "disable_session_recording: true",
  "person_profiles: 'never'",
]

for (const event of requiredEvents) {
  if (!analytics.includes(`${event}:`)) throw new Error(`Missing typed analytics event: ${event}`)
  if (!app.includes(`trackAnalytics('${event}'`)) throw new Error(`Missing analytics trigger: ${event}`)
  if (!docs.includes(`\`${event}\``)) throw new Error(`Missing analytics documentation: ${event}`)
}

for (const control of requiredPrivacyControls) {
  if (!analytics.includes(control)) throw new Error(`Missing analytics privacy control: ${control}`)
}

for (const forbidden of ['spanish:', 'chinese:', 'typed:', 'sync_code:', 'lesson_id:', 'word:']) {
  if (analytics.includes(forbidden)) throw new Error(`Sensitive analytics property is forbidden: ${forbidden}`)
}

if (!analytics.includes("readAnalyticsConsent() !== 'granted'")) throw new Error('Analytics must remain consent-gated')
if (!privacy.includes('PostHog Cloud EU')) throw new Error('Privacy page must disclose PostHog Cloud EU')
if (!privacy.includes('不发送用户输入的文字')) throw new Error('Privacy page must disclose excluded input content')
for (const consentCopy of ['不提供使用数据', '同意匿名统计', '无论选择哪项，都可以正常使用网站。']) {
  if (!app.includes(consentCopy)) throw new Error(`Consent dialog is missing clear choice copy: ${consentCopy}`)
}
if (!privacy.includes('选择“不提供使用数据”后不会发送使用事件，且网站仍可正常使用')) {
  throw new Error('Privacy page must match the declined consent choice')
}

console.log(`Analytics validation passed (${requiredEvents.length} events, explicit consent, privacy controls).`)
