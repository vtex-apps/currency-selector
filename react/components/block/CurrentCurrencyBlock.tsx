import React from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useCurrencySelector } from './hooks/useCurrencySelector'
import Spinner from './Spinner'
import CustomLabel from './CustomLabel'

const messages = defineMessages({
  title: { id: 'admin/current-currency.title' },
  default: {
    id: 'store/currency-selector.label-format.default',
  },
})

const CSS_HANDLES = ['container'] as const

interface Props {
  labelFormat: string
}

const CurrentCurrencyBlock = ({ labelFormat = messages.default.id }: Props) => {
  const { currentSalesChannel, isLoading, hasError } = useCurrencySelector()

  const { handles } = useCssHandles(CSS_HANDLES)

  return hasError ? null : (
    <div
      className={`flex items-center justify-center relative h-100 pointer mh4 ${handles.container}`}
    >
      {isLoading ? (
        <Spinner />
      ) : !currentSalesChannel ? null : (
        <CustomLabel {...currentSalesChannel} labelFormat={labelFormat} />
      )}
    </div>
  )
}

CurrentCurrencyBlock.schema = {
  title: messages.title.id,
}

export default CurrentCurrencyBlock
