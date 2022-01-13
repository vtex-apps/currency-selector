import type { FC } from 'react'
import { useState, useEffect, Fragment } from 'react'
import {
  Button,
  Collapsible,
  Divider,
  ModalDialog,
  Table,
  Alert,
} from 'vtex.styleguide'

import { EditSalesChannel } from './EditSalesChannels'
import { EditCustomLabel } from './EditCustomLabel'
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [salesChannelIdToDelete, setSalesChannelIdToDelete] = useState('')
  const [salesChannelIdToEdit, setSalesChannelIdToEdit] = useState('')
  const [salesChannelAdded, setSalesChannelAdded] = useState<
    SalesChannelBlock[]
  >([])

  const [isAlert, setIsAlert] = useState(false)

  const [salesChannelPerBinding, setSalesChannelPerBinding] = useState<
    SalesChannelPerBinding[]
  >([])

  const [{ salesChannel }] = salesChannelInfo
  // const [{ customLabel }] = salesChannelInfo

  const { currencySymbol } =
    salesChannelList.find(item => {
      return Number(item.id) === salesChannelInfo[0].salesChannel
    }) ?? {}

  useEffect(() => {
    const filteredChannelsPerBind =
      salesChannelWithLabel
        .filter(obj => obj.bindingId === bindingId)[0]
        .salesChannelLabel.map(itm => ({
          ...(salesChannelList.find(
            (item: SalesChannel) => String(item.id) === itm.salesChannelId
          ) as SalesChannel),
          ...itm,
        })) ?? []

    setSalesChannelPerBinding(filteredChannelsPerBind)
  }, [salesChannelList])

  // const filterSalesChannelProps = salesChannelPerBinding.map(
  //   ({ customLabel, salesChannelId, ...keepAttrs }) => keepAttrs
  // )

  const availableSalesChannels =
    salesChannelList.filter(
      ({ id: id1 }) =>
        !salesChannelPerBinding.some(({ id: id2 }) => id2 === id1) ?? []
    ) ?? []

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

  const handleEditLabelSave = (): void => {
    // const salesChannelAdmin = salesChannelPerBinding.map(
    //   ({ id, customLabel }) => ({
    //     salesChannel: id,
    //     customLabel,
    //   })
    // )

    setIsAlert(true)

    setIsEditModalOpen(!isEditModalOpen)

    // eslint-disable-next-line no-console
    // setSalesChannelPerBinding(salesChannelAdmin)
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

  const handleEditLabel = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget

    const updatedList = salesChannelPerBinding.map(item => {
      if (String(item.id) === name) {
        return { ...item, customLabel: value }
      }

      return item
    })

    setSalesChannelPerBinding(updatedList)
  }

  const dropdownOptions = createDropdownList(
    availableSalesChannels,
    salesChannelAdded,
    salesChannel
  )

  const handleDeleteModal = (id: string) => {
    setSalesChannelIdToDelete(id)
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  const handleEditModal = (id: string) => {
    setSalesChannelIdToEdit(id)
    setIsEditModalOpen(!isEditModalOpen)
  }

  const deleteSalesChannelBinding = () => {
    const salesChannelToChange = salesChannelPerBinding.filter(
      ({ id }) => String(id) !== salesChannelIdToDelete
    )

    setSalesChannelPerBinding(salesChannelToChange)
    // eslint-disable-next-line no-console
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
      onClick: ({ rowData }: { rowData: SalesChannelCustomInfo }) =>
        handleEditModal(String(rowData.salesChannelId)),
    },
    {
      label: () => 'Delete',
      isDangerous: true,
      onClick: ({ rowData }: { rowData: SalesChannelCustomInfo }) =>
        handleDeleteModal(String(rowData.salesChannelId)),
    },
  ]

  return (
    <Fragment>
      <Divider />
      {isAlert ? (
        <Alert type="success" onClose={() => setIsAlert(false)}>
          You changed your custom label with success.
        </Alert>
      ) : null}
      <div className="flex flex-column mv2">
        <div className="flex items-center mv2">
          <div className="w-10 c-muted-1 pa4 mr6 ba br2 b--light-gray tc">
            {currencySymbol}
          </div>
          <div className="w-90">
            {/* <p>
              <span className="c-muted-2 mr3">BindingId:</span> {bindingId}
            </p> */}
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
                  items={salesChannelPerBinding}
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
        isOpen={isEditModalOpen}
        onClose={handleEditModal}
        // eslint-disable-next-line no-console
        confirmation={{ label: 'Save', onClick: handleEditLabelSave }}
        // eslint-disable-next-line no-console
        cancelation={{ label: 'Cancel', onClick: handleEditModal }}
      >
        <h2>Edit Custom Label</h2>
        <EditCustomLabel
          onLabelChange={handleEditLabel}
          salesChannelPerBinding={salesChannelPerBinding}
          salesChannelIdToEdit={salesChannelIdToEdit}
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
