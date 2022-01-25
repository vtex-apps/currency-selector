import type { IntlShape } from 'react-intl'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  default: {
    id: 'admin/currency-selector.dropdown-default-sales-channel',
  },
})

const sortDropdownOptions = (
  dropdownOptions: DropdownOptions[],
  defaultSalesChannel?: number
): DropdownOptions[] => {
  const defaultOption = dropdownOptions.find(
    ({ value }) => value === defaultSalesChannel?.toString()
  )

  const otherOptions = dropdownOptions.filter(
    ({ value }) => value !== defaultSalesChannel?.toString()
  )

  return defaultOption ? [defaultOption, ...otherOptions] : otherOptions
}

export const createDropdownList = ({
  availableSalesChannel,
  selectedSalesChannel,
  intl,
  defaultSalesChannel,
}: {
  availableSalesChannel: SalesChannelPerBinding[]
  selectedSalesChannel: SalesChannelBlock[]
  intl: IntlShape
  defaultSalesChannel?: number
}): DropdownOptions[] => {
  const defaultTag = intl.formatMessage(messages.default)

  const activeSalesChannel = availableSalesChannel.filter(
    salesChannel => salesChannel.isActive
  )

  const salesChannelNotSelected = activeSalesChannel.filter(
    ({ id }) =>
      !selectedSalesChannel.some(({ id: selectedId }) => selectedId === id)
  )

  const dropdownOptions = salesChannelNotSelected.map(
    ({ id, name, currencyCode, currencySymbol }) => ({
      value: id,
      label: `${id} - ${name} - ${currencyCode} - ${currencySymbol}${
        id === defaultSalesChannel?.toString() ? defaultTag : ''
      }`,
    })
  )

  return sortDropdownOptions(dropdownOptions, defaultSalesChannel)
}
