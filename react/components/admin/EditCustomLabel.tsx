import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Input, Table } from 'vtex.styleguide'

interface EditSalesChannelInterface {
  onLabelChange: (updatedList: SalesChannelPerBinding[]) => void
  salesChannelPerBinding: SalesChannelPerBinding[]
  salesChannelIdToEdit: string
}

const EditCustomLabel = ({
  onLabelChange,
  salesChannelPerBinding,
  salesChannelIdToEdit,
}: EditSalesChannelInterface) => {
  const [customLabelValue, setCustomLabelValue] = useState<
    Record<string, string>
  >({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setCustomLabelValue(prevState => {
      return { ...prevState, [name]: value }
    })

    const updatedList = salesChannelPerBinding.map(item => {
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

  return (
    <div className="mb5">
      <Table
        fullWidth
        schema={tableSchema}
        items={salesChannelPerBinding.filter(
          ({ id }) => String(id) === salesChannelIdToEdit
        )}
        indexColumnLabel="Index"
      />
    </div>
  )
}

export { EditCustomLabel }
