<script setup lang="ts">
import { onMounted } from 'vue'
import { Field, useCalculator } from '@/composables/useCalculator'
import { useDebounce } from '@/utils/debounce'
import { useLocalStorage } from '@/composables/useLocalStorage'
import LSDataComponent from '../shared/LSDataComponent.vue'
import { useEventLog } from '@/composables/useEventLog'
import EventsLog from './EventsLog.vue'
import InputField from '../shared/InputField.vue'

const { price, qty, amount, firstEdited, onFieldChange } = useCalculator()
const { events, logEvent } = useEventLog()

const { isSubmitting, localData, submitResult, getData, getLSData, submitData, infoAfterClick } =
  useLocalStorage()

function inputLog(field: Field, value: number) {
  onFieldChange(field, value)
  logEvent('input', `Поле ${field} изменено на ${value}`, {
    field,
    value,
    state: {
      price: price.value,
      qty: qty.value,
      amount: amount.value,
    },
  })
}

async function handleSubmit() {
  const LSDataBeforeSubmit = getLSData()

  logEvent('submit', 'Форма отправлена', {
    sent_data: {
      price: price.value,
      qty: qty.value,
      amount: amount.value,
    },
    localStorageBeforeSubmit: LSDataBeforeSubmit,
  })

  const result = await submitData(price.value, qty.value, amount.value)

  logEvent(
    'response',
    result.success ? 'Данные успешно сохранены' : 'Ошибка при сохранении данных',
    {
      isSuccessOperation: { success: result.success },
      responseData: result.payload,
      localStorageAfterSubmit: infoAfterClick.value,
    }
  )
}

const debouncedChange = useDebounce(inputLog, 300)

const onInput = (field: Field, value: number) => {
  debouncedChange(field, value)
}

onMounted(() => {
  getData()
})
</script>

<template>
  <form class="calculator-form" @submit.prevent="handleSubmit">
    <div class="calculator-form__inputs">
      <InputField
        field="price"
        v-model:value="price"
        :is-first-edited="firstEdited === 'price'"
        placeholder="Введите цену"
        label="Цена"
        @update:value="onInput('price', $event)"
      />
      <InputField
        field="qty"
        v-model:value="qty"
        :is-first-edited="firstEdited === 'qty'"
        placeholder="Введите количество"
        label="Количество"
        @update:value="onInput('qty', $event)"
      />
      <InputField
        field="amount"
        v-model:value="amount"
        :is-first-edited="firstEdited === 'amount'"
        placeholder="Введите сумму"
        label="Сумма"
        @update:value="onInput('amount', $event)"
      />
      <button type="submit" class="calculator-form__button">
        {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
      </button>
    </div>

    <div
      v-if="submitResult"
      :class="
        submitResult.success ? 'calculator-form__result--success' : 'calculator-form__result--error'
      "
    >
      {{ submitResult.success ? 'Успешно сохранено' : 'Ошибка сохранения' }}
    </div>
    <LSDataComponent :local-data="localData" />
    <EventsLog :events="events" />
  </form>
</template>

<style scoped>
.calculator-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  max-width: 1000px;
  margin: 20px auto;
}

.calculator-form__inputs {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}

.calculator-form__button {
  align-self: flex-start;
  padding: 0.6em 1.2em;
  font-size: 1em;
  background-color: #2bc459;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.calculator-form__button:hover {
  background-color: #26a74d;
}
.calculator-form__result--success {
  font-weight: bold;
  color: green;
}
.calculator-form__result--error {
  font-weight: bold;
  color: red;
}
</style>
