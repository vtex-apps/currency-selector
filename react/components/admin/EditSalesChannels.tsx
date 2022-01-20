import type { FC } from 'react'
import { useState } from 'react'
import { Button, Input, Dropdown, Table } from 'vtex.styleguide'

interface EditSalesChannelInterface {
  dropdownOptions: DropdownOptions[]
  onSalesChannelAdded: (salesChannel: SalesChannelBlock) => void
  addedSalesChannel: SalesChannelBlock[]
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  availableSalesChannels: SalesChannelPerBinding[]
}

const EditSalesChannel: FC<EditSalesChannelInterface> = ({
  dropdownOptions,
  onSalesChannelAdded,
  addedSalesChannel,
  onLabelChange,
  availableSalesChannels,
}) => {
  const [selected, setSelected] = useState<string>('')
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
            placeholder={'Add a sales channel'}
            options={dropdownOptions}
            onChange={handleSelected}
            value={selected}
          />
        </div>
        <div className="w-20">
          <Button onClick={addSelectedChannel} block>
            Add
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

export { EditSalesChannel }