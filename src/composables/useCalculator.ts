import { ref } from 'vue'

export type Field = 'price' | 'qty' | 'amount'

function checkCornerCase(a: number, b: number): number {
  return b === 0 ? 0 : a / b
}

export function useCalculator() {
  const price = ref<number>(0)
  const qty = ref<number>(0)
  const amount = ref<number>(0)

  const firstEdited = ref<Field | null>(null)

  const recalculate = (changedField: Field) => {
    if (!firstEdited.value) return

    const firstField = firstEdited.value

    switch (firstField) {
      case 'price':
        switch (changedField) {
          case 'qty':
            amount.value = Number((price.value * qty.value).toFixed(2))
            break
          case 'amount':
            qty.value = Number(checkCornerCase(amount.value, price.value).toFixed(2))
            break
        }
        break
      case 'qty':
        switch (changedField) {
          case 'price':
            amount.value = Number((price.value * qty.value).toFixed(2))
            break
          case 'amount':
            price.value = Number(checkCornerCase(amount.value, qty.value).toFixed(2))
            break
        }
        break
      case 'amount':
        switch (changedField) {
          case 'price':
            qty.value = Number(checkCornerCase(amount.value, price.value).toFixed(2))
            break
          case 'qty':
            price.value = Number(checkCornerCase(amount.value, qty.value).toFixed(2))
            break
        }
        break
    }
  }
  const onFieldChange = (field: Field, value: number) => {
    if (!firstEdited.value) {
      firstEdited.value = field
      return
    }

    if (field === 'price') {
      price.value = value
    } else if (field === 'qty') {
      qty.value = value
    } else amount.value = value

    if (field === firstEdited.value) return

    recalculate(field)
  }

  return {
    price,
    qty,
    amount,
    firstEdited,
    onFieldChange,
  }
}
