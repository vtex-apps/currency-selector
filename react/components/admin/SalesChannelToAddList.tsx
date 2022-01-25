import React, { useState } from 'react'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import { Button, Input, Dropdown, Table } from 'vtex.styleguide'

interface SalesChannelToAddListProps {
  dropdownOptions: DropdownOptions[]
  onSalesChannelAdded: (salesChannel: SalesChannelBlock) => void
  addedSalesChannel: SalesChannelBlock[]
  onLabelChange: (updatedList: SalesChannelBlock[]) => void
  availableSalesChannels: SalesChannelPerBinding[]
}

const messages = defineMessages({
  dropdownPlaceholder: {
    id: 'admin/currency-selector.dropdown-placeholder',
  },
  dropdownDefault: {
    id: 'admin/currency-selector.dropdown-default-sales-channel',
  },
})

const SalesChannelToAddList = ({
  dropdownOptions,
  onSalesChannelAdded,
  addedSalesChannel,
  onLabelChange,
  availableSalesChannels,
}: SalesChannelToAddListProps) => {
  const [selected, setSelected] = useState<string>('')
  const [customLabelValue, setCustomLabelValue] = useState<
    Record<string, string>
  >({})

  const intl = useIntl()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setCustomLabelValue(prevState => {
      return { ...prevState, [name]: value }
    })

    const updatedList = addedSalesChannel.map(item => {
      if (String(item.id) === name) {
        return { ...item, customLabel: value }
      }

      return item
    })

    onLabelChange(updatedList)
  }

  const tableSchema = {
    properties: {
      salesChannel: {
        title: (
          <FormattedMessage id="admin/currency-selector.table-schema-sales-channel" />
        ),
      },
      currencySymbol: {
        title: (
          <FormattedMessage id="admin/currency-selector.table-schema-currency-symbol" />
        ),
      },
      currencyCode: {
        title: (
          <FormattedMessage id="admin/currency-selector.table-schema-currency-code" />
        ),
      },
      customLabel: {
        title: (
          <FormattedMessage id="admin/currency-selector.table-schema-custom-label" />
        ),
        cellRenderer: (cellData: CellData) => {
          return (
            <Input
              onChange={handleChange}
              name={cellData.rowData.id}
              value={
                customLabelValue[cellData.rowData.id] ??
                cellData.rowData.customLabel
              }
            />
          )
        },
      },
    },
  }

  const handleSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget

    setSelected(value)
  }

  const addSelectedChannel = (): void => {
    const salesChannelSelected = availableSalesChannels.find(
      obj => Number(obj.id) === Number(selected)
    )

    if (!salesChannelSelected) {
      return
    }

    onSalesChannelAdded(salesChannelSelected)

    setSelected('')
  }

  return (
    <div>
      <div className="mb5 flex items-center">
        <div className="mr5 w-80">
          <Dropdown
            placeholder={intl.formatMessage(messages.dropdownPlaceholder)}
            options={dropdownOptions}
            onChange={handleSelected}
            value={selected}
          />
        </div>
        <div className="w-20">
          <Button onClick={addSelectedChannel} block>
            <FormattedMessage id="admin/currency-selector.add" />
          </Button>
        </div>
      </div>
      {addedSalesChannel.length ? (
        <Table
          fullWidth
          schema={tableSchema}
          items={addedSalesChannel}
          indexColumnLabel="Index"
        />
      ) : null}
    </div>
  )
}

export { SalesChannelToAddList }
