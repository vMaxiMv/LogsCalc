<script setup lang="ts">
import { computed } from 'vue'
import { Field } from '@/composables/useCalculator'

const props = defineProps<{
  field: Field
  value: number
  isFirstEdited: boolean
  placeholder: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

const inputId = computed(() => `input-${Date.now()}-${Math.random().toString(36).slice(2)}`)

const displayValue = computed(() => (props.value === 0 ? '' : props.value))

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? 0 : Number(target.value)
  emit('update:value', value)
}
</script>

<template>
  <div class="input-field">
    <input
      :id="inputId"
      :name="field"
      v-model="displayValue"
      type="number"
      class="input-field__input"
      :class="{ 'input-field__input--focus': isFirstEdited }"
      :placeholder="placeholder"
      @input="onInput"
    />
    <label :for="inputId" class="input-field__label">
      {{ label }}: <b>{{ value }}</b>
    </label>
  </div>
</template>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 140px;
}

.input-field__input {
  padding: 0.5em;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.input-field__input--focus {
  border: 2px solid #2bc459;
}

.input-field__label {
  margin-top: 0.5em;
  font-size: 0.9em;
  margin-bottom: 0.25rem;
}
</style>
