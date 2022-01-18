import React from 'react'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  title: { id: 'admin/current-currency.title' },
})

const CurrentCurrencyBlock = () => {
  return <div>Current currency</div>
}

CurrentCurrencyBlock.schema = {
  title: messages.title.id,
}

export default CurrentCurrencyBlock
