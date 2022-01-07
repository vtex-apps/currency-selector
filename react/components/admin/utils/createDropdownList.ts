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
    salesChannel => salesChannel.IsActive
  )

  const salesChannelNotSelected = activeSalesChannel.filter(
    ({ Id }) =>
      !selectedSalesChannel.some(({ Id: selectedId }) => selectedId === Id)
  )

  const dropdownOptions = salesChannelNotSelected.map(
    ({ Id, Name, CurrencyCode, CurrencySymbol }) => ({
      value: Id.toString(),
      label: `${Name} - ${CurrencyCode} - ${CurrencySymbol}${
        Id === defaultSalesChannel ? ' - Default' : ''
      }`,
    })
  )

  return sortDropdownOptions(dropdownOptions, defaultSalesChannel)
}
