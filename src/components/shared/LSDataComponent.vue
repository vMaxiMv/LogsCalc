<script setup lang="ts">
import { computed } from 'vue'

const localDataProps = defineProps<{
  localData: string
}>()

const parsedData = computed(() => {
  if (!localDataProps.localData) return null

  try {
    return JSON.parse(localDataProps.localData)
  } catch (error) {
    return localDataProps.localData
  }
})

const displayData = computed(() => {
  if (!parsedData.value) return 'Данных еще нет'
  if (typeof parsedData.value === 'object') {
    return JSON.stringify(parsedData.value)
  }
  return parsedData.value
})
</script>

<template>
  <div>
    <h4>Ответ от "Сервера":</h4>
    <p>{{ displayData || 'Данных еще нет' }}</p>
  </div>
</template>
