import { ref } from 'vue'

export type EventType = 'input' | 'submit' | 'response'

export interface EventItem {
  id: string
  type: EventType
  time: string
  title: string
  payload?: any
}

function currentTime() {
  return new Date().toLocaleTimeString()
}
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function useEventLog() {
  const events = ref<EventItem[]>([])

  function logEvent(type: EventType, title: string, payload?: any) {
    events.value.unshift({
      id: makeId(),
      type,
      time: currentTime(),
      title,
      payload,
    })
  }

  return {
    events,
    logEvent,
  }
}
