import type { FC } from 'react'
import { Fragment, useState } from 'react'
import { Button, Divider, Input, Dropdown } from 'vtex.styleguide'

import { salesChannelList } from './salesChannelList'

interface EditSalesChannelInterface {
  dropdownOptions: DropdownOptions[]
  onSalesChannelAdded: (salesChannel: SalesChannel) => void
  addedSalesChannel: SalesChannel[]
}

const EditSalesChannel: FC<EditSalesChannelInterface> = ({
  dropdownOptions,
  onSalesChannelAdded,
  addedSalesChannel,
}) => {
  const [selected, setSelected] = useState<string>('')

  const handleSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget

    setSelected(value)
  }

  const addSelectedChannel = (): void => {
    const salesChannelSelected = salesChannelList.find(
      obj => obj.Id === Number(selected)
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
      {addedSalesChannel.map(({ Id, Name, CurrencyCode, CurrencySymbol }) => {
        return (
          <Fragment>
            <Divider />
            <div className="flex items-center">
              <div className="w-40 mr5">
                <p>Sales Channel: {Id}</p>
                <p>Name: {Name}</p>
                <p>Currency Code: {CurrencyCode}</p>
                <p>Currency Symbol: {CurrencySymbol}</p>
              </div>
              <div className="w-60 flex items-end">
                <div className="w-60 mr5">
                  <Input label="Custom label" />
                </div>
              </div>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

export { EditSalesChannel }
