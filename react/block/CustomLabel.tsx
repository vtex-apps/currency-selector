import React from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'

interface Props {
  CurrencySymbol: string
  CurrencyCode: string
  customLabel?: string
  labelFormat: string
}

const CustomLabel = ({
  CurrencySymbol,
  CurrencyCode,
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
          CurrencySymbol: <span key="CurrencySymbol">{CurrencySymbol}</span>,
          CurrencyCode: <span key="CurrencyCode">{CurrencyCode}</span>,
          customLabel: <span key="customLabel">{customLabel}</span>,
        }}
      />
    </span>
  )
}

export default CustomLabel
