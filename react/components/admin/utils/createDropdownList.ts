const sortDropdownOptions = (
  dropdownOptions: DropdownOptions[],
  defaultSalesChannel: number
): DropdownOptions[] => {
  const defaultOption = dropdownOptions.find(
    ({ value }) => value === defaultSalesChannel.toString()
  )

  const otherOptions = dropdownOptions.filter(
    ({ value }) => value !== defaultSalesChannel.toString()
  )

  return defaultOption ? [defaultOption, ...otherOptions] : otherOptions
}

export const createDropdownList = (
  availableSalesChannel: SalesChannel[],
  selectedSalesChannel: SalesChannel[],
  defaultSalesChannel: number
): DropdownOptions[] => {
  const activeSalesChannel = availableSalesChannel.filter(
    salesChannel => salesChannel.isActive
  )

  const salesChannelNotSelected = activeSalesChannel.filter(
    ({ id }) =>
      !selectedSalesChannel.some(({ id: selectedId }) => selectedId === id)
  )

  const dropdownOptions = salesChannelNotSelected.map(
    ({ id, name, currencyCode, currencySymbol }) => ({
      value: id.toString(),
      label: `${name} - ${currencyCode} - ${currencySymbol}${
        id === defaultSalesChannel ? ' - Default' : ''
      }`,
    })
  )

  return sortDropdownOptions(dropdownOptions, defaultSalesChannel)
}
