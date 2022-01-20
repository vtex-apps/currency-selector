import React, { useState } from 'react'
import { Input, Table } from 'vtex.styleguide'

interface EditSalesChannelInterface {
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  salesChannelPerBinding: SalesChannelBlock[]
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

    onLabelChange(e)
    setCustomLabelValue(prevState => {
      return { ...prevState, [name]: value }
    })
  }

  const tableSchema = {
    properties: {
      salesChannel: {
        title: 'Sales Channel',
      },
      currencySymbol: {
        title: 'Currency symbol',
      },
      currencyCode: {
        title: 'Currency code',
      },
      customLabel: {
        title: 'Custom label',
        cellRenderer: (cellData: any) => {
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