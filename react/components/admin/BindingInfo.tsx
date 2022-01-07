import type { FC } from 'react'
import { useState, Fragment } from 'react'
import {
  Button,
  Collapsible,
  Divider,
  // Input,
  ModalDialog,
} from 'vtex.styleguide'

import { EditSalesChannel } from './EditSalesChannels'
import { salesChannelList } from './salesChannelList'
import { createDropdownList } from './utils/createDropdownList'

const BindingInfo: FC<BindingInformation> = ({
  bindingId,
  canonicalBaseAddress,
  salesChannelInfo,
}) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [salesChannelAdded, setSalesChannelAdded] = useState<
    SalesChannelBlock[]
  >([])

  const [{ salesChannel }] = salesChannelInfo
  // const [{ customLabel }] = salesChannelInfo

  const { CurrencySymbol /** CurrencyCode */ } =
    salesChannelList.find(
      item => item.Id === salesChannelInfo[0].salesChannel
    ) ?? {}

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleAddSalesChannel = (selectedSalesChanel: SalesChannelBlock) => {
    setSalesChannelAdded([...salesChannelAdded, selectedSalesChanel])
  }

  const handleSave = (): void => {
    const salesChannelAdmin = salesChannelAdded.map(({ Id, customLabel }) => ({
      salesChannel: Id,
      customLabel,
    }))

    // eslint-disable-next-line no-console
    console.log({
      bindingId,
      salesChannel: salesChannelAdmin,
    })
  }

  const handleCustomLabel = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget
    const salesChannelToChange = salesChannelAdded.find(
      ({ Id }) => Id.toString() === name
    )

    if (!salesChannelToChange) {
      return
    }

    const salesChannelNewCustomLabel = {
      ...salesChannelToChange,
      customLabel: value,
    }

    setSalesChannelAdded([
      ...salesChannelAdded.filter(({ Id }) => Id.toString() !== name),
      salesChannelNewCustomLabel,
    ])
  }

  const dropdownOptions = createDropdownList(
    salesChannelList,
    salesChannelAdded,
    salesChannel
  )

  return (
    <Fragment>
      <Divider />
      <div className="flex flex-column mv2">
        <div className="flex items-center mv2">
          <div className="w-10 c-muted-1 pa4 mr6 ba br2 b--light-gray tc">
            {CurrencySymbol}
          </div>
          <div className="w-90">
            <p>
              <span className="c-muted-2 mr3">BindingId:</span> {bindingId}
            </p>
            <p>
              <span className="c-muted-2 mr3">Canonical address:</span>{' '}
              {canonicalBaseAddress}
            </p>
          </div>
        </div>
        <div className="mv4">
          <Collapsible
            header={<span>Sales Channel</span>}
            onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
            isOpen={isCollapsibleOpen}
            caretColor="primary"
          >
            {/* {!salesChannelInfo.length ? (
              <div className="flex mv5">
                <div className="w-30 mr5">
                  <Input label="Sales channel" value={salesChannel} />
                </div>
                <div className="w-30 mr5">
                  <Input label="Currency" value={CurrencyCode} />
                </div>
                <div className="w-40 mr5">
                  <Input label="Custom label" value={customLabel} />
                </div>
              </div>
            ) : null} */}
            <Button
              variation="tertiary"
              size="small"
              block
              onClick={handleModalToggle}
            >
              {!salesChannelInfo.length ? 'Edit' : 'Add'}
            </Button>
          </Collapsible>
        </div>
      </div>
      <ModalDialog
        centered
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        // eslint-disable-next-line no-console
        confirmation={{ label: 'Save', onClick: handleSave }}
        cancelation={{ label: 'Cancel', onClick: handleModalToggle }}
      >
        <h2>Available Sales Channels</h2>
        <EditSalesChannel
          dropdownOptions={dropdownOptions}
          onSalesChannelAdded={handleAddSalesChannel}
          addedSalesChannel={salesChannelAdded}
          onLabelChange={handleCustomLabel}
        />
      </ModalDialog>
    </Fragment>
  )
}

export { BindingInfo }
