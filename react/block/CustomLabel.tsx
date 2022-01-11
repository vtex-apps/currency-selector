import React from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'

interface Props {
  currencySymbol: string
  currencyCode: string
  customLabel?: string
  labelFormat: string
}

const CustomLabel = ({
  currencySymbol,
  currencyCode,
  customLabel,
  labelFormat,
}: Props) => {
  return (
    <span>
      <IOMessageWithMarkers
        message={labelFormat}
        markers={[]}
        handleBase="currency-label"
        values={{
          CurrencySymbol: <span key="CurrencySymbol">{currencySymbol}</span>,
          CurrencyCode: <span key="CurrencyCode">{currencyCode}</span>,
          CustomLabel: <span key="CustomLabel">{customLabel}</span>,
        }}
      />
    </span>
  )
}

export default CustomLabel
