import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { ButtonGroup, Button } from 'vtex.styleguide'

import CustomLabel from '../block/CustomLabel'
import Spinner from '../block/Spinner'

const CSS_HANDLES = ['listContainer'] as const

const CurrencySelectorList = ({
  labelFormat,
  salesChannelList,
  onSalesChannelSelection,
  isLoading,
}: ComponentViewProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const [buttonLoading, setButtonLoading] = React.useState('')

  const mappedSalesChannelList = salesChannelList.map(salesChannel => {
    const isNext = buttonLoading === salesChannel.id

    return (
      <Button
        key={salesChannel.id}
        disabled={salesChannel.isCurrent}
        onClick={() => {
          setButtonLoading(salesChannel.id)
          onSalesChannelSelection(salesChannel.id, salesChannel.cultureInfo)
        }}
        isLoading={isNext && buttonLoading}
      >
        <CustomLabel {...salesChannel} labelFormat={labelFormat} />
      </Button>
    )
  })

  return (
    <div className={handles.listContainer}>
      {isLoading && !buttonLoading ? (
        <Spinner />
      ) : (
        <ButtonGroup buttons={mappedSalesChannelList} />
      )}
    </div>
  )
}

export default CurrencySelectorList
