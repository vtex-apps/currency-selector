import type { FC } from 'react'
import { Fragment } from 'react'
import { Button, Divider, Input } from 'vtex.styleguide'

import { salesChannelList } from './salesChannelList'

const EditSalesChannel: FC = () => {
  return (
    <div>
      {salesChannelList.map(({ Id, Name, CurrencyCode, CurrencySymbol }) => {
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
              <div className="w-40 mr5">
                <Input label="Custom label" />
              </div>
              <div className="w-20">
                <Button block>Add</Button>
              </div>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

export { EditSalesChannel }
