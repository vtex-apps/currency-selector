import type { FC } from 'react'
import { Fragment, useEffect, useState } from 'react'
import { Button, Divider, Input, Dropdown } from 'vtex.styleguide'

import { salesChannelList } from './salesChannelList'

interface Options {
  value: string
  label: string
}

const EditSalesChannel: FC<EditSalesChannelInterface> = ({ id }) => {
  const [options, setOptions] = useState<Options[]>([])
  const [selected, setSelected] = useState<string>('')
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([])

  useEffect(() => {
    const activesSalesChannel = salesChannelList
      .filter(salesChannel => salesChannel.IsActive)
      .map(({ Id, Name, CurrencyCode, CurrencySymbol }) => {
        if (id === Number(Id)) {
          return {
            value: String(Id),
            label: `${Name} - ${CurrencyCode} - ${CurrencySymbol} - (default)`,
          }
        }

        return {
          value: String(Id),
          label: `${Name} - ${CurrencyCode} - ${CurrencySymbol}`,
        }
      })

    const sortedByDefault = activesSalesChannel.sort(obj1 => {
      const isDefault = obj1.label.includes('default')

      return isDefault ? -1 : 1
    })

    setOptions(sortedByDefault)
  }, [])

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

    const { Id, Name, CurrencyCode, CurrencySymbol } = salesChannelSelected

    setSalesChannels([
      ...salesChannels,
      { Id, Name, CurrencyCode, CurrencySymbol },
    ])

    const removeOption = options.filter(
      el => Number(el.value) !== Number(selected)
    )

    setOptions(removeOption)

    setSelected('')
  }

  return (
    <div>
      <div className="mb5 flex items-center">
        <div className="mr5 w-80">
          <Dropdown
            placeholder={'Add a sales channel'}
            options={options}
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
      {salesChannels.map(({ Id, Name, CurrencyCode, CurrencySymbol }) => {
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
