import React from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { defineMessages } from 'react-intl'

import { useCurrencySelector } from './hooks/useCurrencySelector'

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

  // eslint-disable-next-line no-console
  console.log({ currentSalesChannel, salesChannelList, labelFormat })

  if (!currentSalesChannel) {
    return null
  }

  const { CurrencyCode, CurrencySymbol, customLabel } = currentSalesChannel

  return (
    <span>
      <IOMessageWithMarkers
        message={labelFormat}
        markers={[]}
        handleBase="currency-label"
        values={{
          CurrencySymbol: <span key="CurrencySymbol">{CurrencySymbol}</span>,
          CurrencyCode: <span key="CurrencyCode">{CurrencyCode}</span>,
          customLabel: <span key="customLabel">{customLabel}</span>,
        }}
      />
    </span>
  )
}

CurrencySelectorBlock.schema = {
  title: messages.title.id,
}

export default CurrencySelectorBlock
