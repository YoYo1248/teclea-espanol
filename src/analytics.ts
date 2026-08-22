type AnalyticsPrimitive = string | number | boolean | null

export type AnalyticsConsent = 'pending' | 'granted' | 'denied'

type PracticeBase = {
  level: string
  mode: 'copy' | 'recall' | 'listen'
  track: 'main' | 'verbs'
  onboarding: boolean
  mistake_review: boolean
  review_kind: 'none' | 'recovery' | 'maintenance'
  queue_size: number
}

type AnalyticsEventMap = {
  app_opened: {
    has_learning_history: boolean
    has_active_session: boolean
    domain_kind: 'primary' | 'legacy' | 'other'
  }
  practice_started: PracticeBase & {
    start_kind: 'new' | 'resume'
    introduction: boolean
    progress_index: number
  }
  practice_input_started: PracticeBase & {
    progress_index: number
  }
  onboarding_checkpoint_completed: PracticeBase & {
    completed_items: number
    mistakes: number
    elapsed_seconds: number
  }
  practice_round_completed: PracticeBase & {
    completion_kind: 'round' | 'introduction'
    completed_items: number
    mistakes: number
    elapsed_seconds: number
    used_hint: boolean
    independent_correct: number
    independent_rate: number | null
  }
  practice_exited: PracticeBase & {
    completed_items: number
    mistakes: number
    elapsed_seconds: number
    progress_percent: number
  }
  challenge_saved: {
    level: string
    duration_days: number
    dictation_repetitions: number
    is_update: boolean
  }
  install_result: {
    outcome: 'accepted' | 'dismissed' | 'manual_instructions'
  }
  sync_enabled: {
    method: 'created' | 'connected'
  }
}

type AnalyticsEventName = keyof AnalyticsEventMap
type QueuedEvent = {
  [Name in AnalyticsEventName]: {
    name: Name
    properties: AnalyticsEventMap[Name]
  }
}[AnalyticsEventName]
type PostHogClient = (typeof import('posthog-js'))['default']

const ANALYTICS_CONSENT_KEY = 'teclea-analytics-consent-v1'
const ANALYTICS_SCHEMA_VERSION = 1
const MAX_PENDING_EVENTS = 40
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY?.trim() ?? ''
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST?.trim() || 'https://eu.i.posthog.com'
const PRIVATE_AUTO_PROPERTIES = [
  '$current_url',
  '$pathname',
  '$host',
  '$referrer',
  '$referring_domain',
  '$initial_current_url',
  '$initial_pathname',
  '$initial_referrer',
  '$initial_referring_domain',
  '$session_entry_url',
  '$session_entry_pathname',
  '$search_engine',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
]

let posthogClient: PostHogClient | null = null
let loadingClient: Promise<PostHogClient | null> | null = null
let pendingEvents: QueuedEvent[] = []

export function isAnalyticsConfigured() {
  return Boolean(POSTHOG_KEY)
}

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return 'pending'
  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY)
    return stored === 'granted' || stored === 'denied' ? stored : 'pending'
  } catch {
    return 'pending'
  }
}

function saveAnalyticsConsent(consent: Exclude<AnalyticsConsent, 'pending'>) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent)
  } catch {
    // The in-memory choice still applies for the current page.
  }
}

function captureQueuedEvent(event: QueuedEvent) {
  posthogClient?.capture(event.name, {
    ...event.properties,
    analytics_schema_version: ANALYTICS_SCHEMA_VERSION,
  })
}

function flushPendingEvents() {
  if (!posthogClient || readAnalyticsConsent() !== 'granted') return
  const events = pendingEvents
  pendingEvents = []
  events.forEach(captureQueuedEvent)
}

async function loadPostHog(): Promise<PostHogClient | null> {
  if (!isAnalyticsConfigured() || typeof window === 'undefined') return null
  if (posthogClient) return posthogClient
  if (loadingClient) return loadingClient

  loadingClient = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        ui_host: 'https://eu.posthog.com',
        persistence: 'localStorage',
        person_profiles: 'never',
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_performance: false,
        capture_exceptions: false,
        disable_session_recording: true,
        disable_surveys: true,
        disable_external_dependency_loading: true,
        advanced_disable_flags: true,
        respect_dnt: true,
        property_denylist: PRIVATE_AUTO_PROPERTIES,
      })
      posthogClient = posthog
      return posthog
    })
    .catch(() => null)
    .finally(() => {
      loadingClient = null
    })

  return loadingClient
}

export async function initializeAnalytics() {
  if (readAnalyticsConsent() !== 'granted') return
  const client = await loadPostHog()
  if (!client) return
  client.opt_in_capturing({ captureEventName: false })
  flushPendingEvents()
}

export async function updateAnalyticsConsent(consent: Exclude<AnalyticsConsent, 'pending'>) {
  saveAnalyticsConsent(consent)
  if (consent === 'denied') {
    pendingEvents = []
    posthogClient?.opt_out_capturing()
    return
  }

  const client = await loadPostHog()
  if (!client) return
  client.reset(true)
  client.opt_in_capturing({ captureEventName: false })
  flushPendingEvents()
}

export function trackAnalytics<Name extends AnalyticsEventName>(name: Name, properties: AnalyticsEventMap[Name]) {
  if (!isAnalyticsConfigured()) return
  const event = { name, properties } as QueuedEvent
  const consent = readAnalyticsConsent()
  if (consent === 'denied') return
  if (consent !== 'granted' || !posthogClient) {
    pendingEvents = [...pendingEvents.slice(-(MAX_PENDING_EVENTS - 1)), event]
    if (consent === 'granted') void initializeAnalytics()
    return
  }
  captureQueuedEvent(event)
}

export type AnalyticsProperties = Record<string, AnalyticsPrimitive>
