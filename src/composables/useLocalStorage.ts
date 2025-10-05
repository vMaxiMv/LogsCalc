import { ref } from 'vue'

export interface ICalculatorData {
  counter: number
  price: number
  qty: number
  amount: number
}

export function useLocalStorage() {
  const counter = ref<number>(0)
  const isSubmitting = ref<boolean>(false)
  const localData = ref<string>('')
  const submitResult = ref<null | { success: boolean }>(null)

  const infoOnClick = ref<ICalculatorData | null>(null)
  const infoAfterClick = ref<ICalculatorData | null>(null)

  function getData() {
    const savedData = localStorage.getItem('calculatorData')
    if (savedData) {
      localData.value = savedData
    } else {
      localData.value = ''
    }
  }

  function getLSData() {
    const raw = localStorage.getItem('calculatorData')
    try {
      return raw ? JSON.parse(raw) : null
    } catch {
      return raw ?? null
    }
  }

  async function submitData(price: number, qty: number, amount: number) {
    isSubmitting.value = true
    submitResult.value = null
    counter.value++

    const payload = {
      counter: counter.value,
      price,
      qty,
      amount,
    }
    const isSuccess = amount % 2 === 0
    if (isSuccess) localStorage.setItem('calculatorData', JSON.stringify(payload))

    infoOnClick.value = getLSData()

    await new Promise(resolve => setTimeout(resolve, 1000))

    submitResult.value = { success: isSuccess }
    isSubmitting.value = false

    getData()

    infoAfterClick.value = getLSData()

    return {
      payload,
      success: isSuccess,
      infoOnClick: infoOnClick.value,
      infoAfterClick: infoAfterClick.value,
    }
  }

  return {
    counter,
    isSubmitting,
    localData,
    submitResult,
    getData,
    submitData,
    getLSData,
    infoOnClick,
    infoAfterClick,
  }
}
