import React, { useEffect, useState } from 'react'
import { EXPERIMENTAL_Select as Select } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { canUseDOM } from 'vtex.render-runtime'

import CustomLabel from '../CustomLabel'

const CSS_HANDLES = ['selectContainer', 'relativeContainer'] as const

interface SelectOption {
  value: string
  label: JSX.Element
  isFirstSelected: boolean
  cultureInfo: string
}

const CurrencySelectorSelect = ({
  isLoading,
  salesChannelList,
  labelFormat,
  onSalesChannelSelection,
}: ComponentViewProps) => {
  const [currentSelected, setCurrentSelected] = useState<SelectOption | null>(
    null
  )

  const [selectionOptions, setSelectionOption] = useState<SelectOption[]>([])

  const { handles } = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    const formattedSelectionOptions = salesChannelList.map(salesChannel => ({
      value: salesChannel.id,
      label: <CustomLabel labelFormat={labelFormat} {...salesChannel} />,
      isFirstSelected: Boolean(salesChannel.isCurrent),
      cultureInfo: salesChannel.cultureInfo,
    }))

    const initialSelected = formattedSelectionOptions.find(
      ({ isFirstSelected }) => isFirstSelected
    )

    if (initialSelected) {
      setCurrentSelected(initialSelected)
      setSelectionOption(formattedSelectionOptions)
    }
  }, [labelFormat, salesChannelList])

  const handleChange = (optionSelected: SelectOption) => {
    setCurrentSelected(optionSelected)
    onSalesChannelSelection(optionSelected.value, optionSelected.cultureInfo)
  }

  return (
    <div
      className={`flex items-center justify-center relative ${handles.selectContainer}`}
    >
      {/* Added canUseDom here since the Select component doesn't render nice on
        server side. There is a blink with a broken style when loading from it.
      */}
      {canUseDOM ? (
        <span className={`min-w-140 ${handles.relativeContainer}`}>
          <Select
            size="small"
            options={selectionOptions}
            value={currentSelected}
            loading={!currentSelected || isLoading}
            multi={false}
            clearable={false}
            searchable={false}
            onChange={handleChange}
          />
        </span>
      ) : null}
    </div>
  )
}

export default CurrencySelectorSelect
