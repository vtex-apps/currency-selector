import React, { useState } from 'react'
import { defineMessages } from 'react-intl'

import { useCurrencySelector } from './hooks/useCurrencySelector'
import CurrencySelectorDropdown from '../views/CurrencySelectorDropdown'
import { patchSalesChannelToSession } from './utils/patchSalesChannelToSession'

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
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { currentSalesChannel, salesChannelList } = useCurrencySelector()

  if (!currentSalesChannel) {
    return null
  }

  const handleSalesChannelSelection = async (
    salesChannel: string,
    callBack?: () => void
  ) => {
    setIsRedirecting(true)
    await patchSalesChannelToSession(salesChannel)

    if (callBack) {
      callBack()
    }

    window.location.reload()
  }

  const isLoading = isRedirecting

  return (
    <CurrencySelectorDropdown
      currentSalesChannel={currentSalesChannel}
      labelFormat={labelFormat}
      salesChannelList={salesChannelList}
      onSalesChannelSelection={handleSalesChannelSelection}
      isLoading={isLoading}
    />
  )
}

CurrencySelectorBlock.schema = {
  title: messages.title.id,
}

export default CurrencySelectorBlock
