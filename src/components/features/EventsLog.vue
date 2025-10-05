<script setup lang="ts">
import type { EventItem } from '@/composables/useEventLog'

defineProps<{ events: EventItem[] }>()

function dataBody(data: any) {
  try {
    return JSON.stringify(data)
  } catch {
    return String(data)
  }
}
</script>

<template>
  <section class="events-log">
    <h3>История событий</h3>
    <ul>
      <li v-for="event in events" :key="event.id" class="events-log__item">
        <div>
          <strong>[{{ event.time }}]</strong>
          <span> ({{ event.type }}) </span>
          <span>{{ event.title }}</span>
        </div>
        <p v-if="event.payload">{{ dataBody(event.payload) }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.events-log__item {
  margin-bottom: 0.75em;
  padding: 0.5em;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fafafa;
}
</style>
