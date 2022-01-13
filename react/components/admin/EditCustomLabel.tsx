import React, { Fragment } from 'react'
import { Input } from 'vtex.styleguide'

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
  return (
    <div>
      <div className="mb5 flex items-center">
        {salesChannelPerBinding
          .filter(({ id }) => String(id) === salesChannelIdToEdit)
          .map(({ id, name, currencyCode, currencySymbol, customLabel }) => {
            return (
              <Fragment key={id}>
                <div className="w-40 mr5">
                  <p>Sales Channel: {id}</p>
                  <p>Name: {name}</p>
                  <p>Currency Code: {currencyCode}</p>
                  <p>Currency Symbol: {currencySymbol}</p>
                </div>
                <div className="w-60 mr15">
                  <Input
                    label="Custom label"
                    value={customLabel ?? ''}
                    onChange={onLabelChange}
                    name={id}
                  />
                </div>
              </Fragment>
            )
          })}
      </div>
    </div>
  )
}

export { EditCustomLabel }
