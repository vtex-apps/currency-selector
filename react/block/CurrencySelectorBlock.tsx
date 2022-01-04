import React from 'react'

import { useCurrencySelector } from './hooks/useCurrencySelector'

const CurrencySelectorBlock = () => {
  const { currentSalesChannel, salesChannelList } = useCurrencySelector()

  // eslint-disable-next-line no-console
  console.log({ currentSalesChannel, salesChannelList })

  return (
    <div>
      <h1>CurrencySelectorBlock</h1>
    </div>
  )
}

export default CurrencySelectorBlock
