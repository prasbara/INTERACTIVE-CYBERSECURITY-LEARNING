import { store } from '../../app/state.js';

const MAX_LOGGED_EVENTS = 500;

export function logEvent(type, payload = {}, meetingId = null, activityId = null) {
  if (!type || typeof type !== 'string') return null;

  const event = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    type,
    meetingId,
    activityId,
    timestamp: new Date().toISOString(),
    payload: typeof payload === 'object' && payload !== null ? payload : { value: String(payload) }
  };

  store.setState(prev => {
    const existingEvents = prev.analytics?.events || [];
    // Keep within MAX_LOGGED_EVENTS limit
    const nextEvents = existingEvents.length >= MAX_LOGGED_EVENTS 
      ? [...existingEvents.slice(-MAX_LOGGED_EVENTS + 1), event]
      : [...existingEvents, event];

    return {
      analytics: {
        ...prev.analytics,
        events: nextEvents
      }
    };
  });

  return event;
}

export function getEvents() {
  return store.getState().analytics?.events || [];
}
