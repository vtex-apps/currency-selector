import type { FC } from 'react'
import { useState, Fragment } from 'react'
import {
  Button,
  Collapsible,
  Divider,
  Input,
  ModalDialog,
  Table,
} from 'vtex.styleguide'

import { EditSalesChannel } from './EditSalesChannels'
import { createDropdownList } from './utils/createDropdownList'
import { salesChannelWithLabel } from './salesChannelWithLabel'

const BindingInfo: FC<BindingInformation> = ({
  bindingId,
  canonicalBaseAddress,
  salesChannelInfo,
  salesChannelList,
}) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [salesChannelIdToDelete, setSalesChannelIdToDelete] = useState('')
  const [salesChannelAdded, setSalesChannelAdded] = useState<
    SalesChannelBlock[]
  >([])

  const [{ salesChannel }] = salesChannelInfo
  // const [{ customLabel }] = salesChannelInfo

  const { currencySymbol } =
    salesChannelList.find(item => {
      return Number(item.id) === salesChannelInfo[0].salesChannel
    }) ?? {}

  const filteredChannelsPerBind =
    salesChannelWithLabel
      .filter(obj => obj.bindingId === bindingId)[0]
      .salesChannelLabel.map(itm => ({
        ...salesChannelList.find(
          item => String(item.id) === itm.salesChannelId
        ),
        ...itm,
      })) ?? []

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleAddSalesChannel = (selectedSalesChanel: SalesChannelBlock) => {
    setSalesChannelAdded([...salesChannelAdded, selectedSalesChanel])
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
    const updatedList = salesChannelAdded.map(item => {
      if (String(item.id) === name) {
        return { ...item, customLabel: value }
      }

      return item
    })

    setSalesChannelAdded(updatedList)
  }

  const dropdownOptions = createDropdownList(
    salesChannelList,
    salesChannelAdded,
    salesChannel
  )

  const handleDeleteModal = (id: string) => {
    setSalesChannelIdToDelete(id)
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  const deleteSalesChannelBinding = () => {
    const salesChannelToChange = salesChannelList.filter(
      ({ id }) => String(id) !== salesChannelIdToDelete
    )

    // eslint-disable-next-line no-console
    console.log(salesChannelToChange, 'after deleted sales channel')
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  // Import table content
  const defaultSchema = {
    properties: {
      salesChannelId: {
        title: 'Sales Channel',
      },
      customLabel: {
        title: 'Custom label',
      },
      currencySymbol: {
        title: 'Currency symbol',
      },
      currencyCode: {
        title: 'Currency code',
      },
    },
  }

  const lineActions = [
    {
      label: () => 'Edit',
      onClick: () => alert(`Executed action for`),
    },
    {
      label: () => 'Delete',
      isDangerous: true,
      onClick: (rowData: SalesChannelCustomInfo) =>
        handleDeleteModal(String(rowData.salesChannelId)),
    },
  ]

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
            {salesChannelWithLabel && (
              <div className="mb5">
                <Table
                  fullWidth
                  schema={defaultSchema}
                  items={filteredChannelsPerBind}
                  lineActions={lineActions}
                />
              </div>
            )}
            <Button
              variation="tertiary"
              size="small"
              block
              onClick={handleModalToggle}
            >
              Add
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
          onClick: deleteSalesChannelBinding,
          isDangerous: true,
        }}
        // eslint-disable-next-line no-console
        cancelation={{ label: 'Cancel', onClick: handleDeleteModal }}
      >
        <p className="f3 fw3 f3-ns">
          Are you sure you want to delete this information?
        </p>
      </ModalDialog>
    </Fragment>
  )
}

export { BindingInfo }
