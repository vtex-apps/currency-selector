import type { FC } from 'react'
import { useState, Fragment } from 'react'
import {
  Button,
  Collapsible,
  Divider,
  Input,
  ModalDialog,
} from 'vtex.styleguide'

import { EditSalesChannel } from './EditSalesChannels'
// import { salesChannelList } from './salesChannelList'
import { createDropdownList } from './utils/createDropdownList'

const BindingInfo: FC<BindingInformation> = ({
  bindingId,
  canonicalBaseAddress,
  salesChannelInfo,
  salesChannelList,
}) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [salesChannelAdded, setSalesChannelAdded] = useState<
    SalesChannelBlock[]
  >([])

  const [{ salesChannel }] = salesChannelInfo
  // const [{ customLabel }] = salesChannelInfo

  const { currencySymbol } =
    salesChannelList.find(item => {
      return Number(item.id) === salesChannelInfo[0].salesChannel
    }) ?? {}

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleAddSalesChannel = (selectedSalesChanel: SalesChannelBlock) => {
    setSalesChannelAdded(
      [...salesChannelAdded, selectedSalesChanel].sort((a, b) => a.id - b.id)
    )
  }

  const handleSave = (): void => {
    const salesChannelAdmin = salesChannelAdded.map(({ id, customLabel }) => ({
      salesChannel: id,
      customLabel,
    }))

    handleModalToggle()
    // eslint-disable-next-line no-console
    console.log({
      bindingId,
      salesChannel: salesChannelAdmin,
    })
  }

  const handleCustomLabel = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget
    const salesChannelToChange = salesChannelAdded.find(
      ({ id }) => id.toString() === name
    )

    if (!salesChannelToChange) {
      return
    }

    const salesChannelNewCustomLabel = {
      ...salesChannelToChange,
      customLabel: value,
    }

    setSalesChannelAdded(
      [
        ...salesChannelAdded.filter(({ id }) => id.toString() !== name),
        salesChannelNewCustomLabel,
      ].sort((a, b) => a.id - b.id)
    )
  }

  const dropdownOptions = createDropdownList(
    salesChannelList,
    salesChannelAdded,
    salesChannel
  )

  const handleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  return (
    <Fragment>
      <Divider />
      <div className="flex flex-column mv2">
        <div className="flex items-center mv2">
          <div className="w-10 c-muted-1 pa4 mr6 ba br2 b--light-gray tc">
            {currencySymbol}
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
            {salesChannelList.length
              ? salesChannelList.map(item => {
                  return (
                    <div className="flex mv6">
                      <div className="w-30 mr5">
                        <Input label="Sales channel" value={item.id} disabled />
                      </div>
                      <div className="w-30 mr5">
                        <Input
                          label="Currency"
                          value={item.currencyCode}
                          disabled
                        />
                      </div>
                      <div className="w-30 mr8">
                        <Input
                          label="Custom label"
                          value="Custom Label"
                          disabled
                        />
                      </div>
                      <div className="w-10 flex items-end mb2">
                        <Button
                          variation="danger"
                          size="small"
                          block
                          onClick={handleDeleteModal}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )
                })
              : null}
            <Button
              variation="tertiary"
              size="small"
              block
              onClick={handleModalToggle}
            >
              {salesChannelInfo.length ? 'Edit' : 'Add'}
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
          salesChannelList={salesChannelList}
        />
      </ModalDialog>
      <ModalDialog
        centered
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModal}
        confirmation={{
          label: 'Yes',
          // eslint-disable-next-line no-console
          onClick: console.log('confirmation'),
          isDangerous: true,
        }}
        // eslint-disable-next-line no-console
        cancelation={{ label: 'Cancel', onClick: console.log('cancelation') }}
      >
        <div>
          <p className="f3 fw3 f3-ns">
            Are you sure you want to delete this information?
          </p>
        </div>
      </ModalDialog>
    </Fragment>
  )
}

export { BindingInfo }
