import React from 'react'
import { defineMessages } from 'react-intl'

import { useCurrencySelector } from './hooks/useCurrencySelector'
import CurrencySelectorDropdown from '../views/CurrencySelectorDropdown'

const messages = defineMessages({
  title: { id: 'admin/currency-selector.title' },
  default: {
    id: 'store/currency-selector.label-format.default',
  },
  description: {
    id: 'store/currency-selector.label-format.description',
  },
})

interface Props {
  labelFormat: string
}

const CurrencySelectorBlock = ({
  labelFormat = messages.default.id,
}: Props) => {
  const { currentSalesChannel, salesChannelList } = useCurrencySelector()

  if (!currentSalesChannel) {
    return null
  }

  return (
    <CurrencySelectorDropdown
      currentSalesChannel={currentSalesChannel}
      labelFormat={labelFormat}
      salesChannelList={salesChannelList}
    />
  )
}

CurrencySelectorBlock.schema = {
  title: messages.title.id,
}

export default CurrencySelectorBlock
