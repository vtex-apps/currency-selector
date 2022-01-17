import type { FC } from 'react'
import { useState, useEffect, Fragment } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import {
  Button,
  Collapsible,
  Divider,
  ModalDialog,
  Table,
} from 'vtex.styleguide'

import UPDATE_SALES_CHANNEL from '../../graphql/updateSalesChannelCustom.gql'
import SALES_CHANNELS_CUSTOM from '../../graphql/salesChannelCustomData.gql'
import { useAlert } from '../../providers/AlertProvider'
import { EditSalesChannel } from './EditSalesChannels'
import { EditCustomLabel } from './EditCustomLabel'
import { createDropdownList } from './utils/createDropdownList'
import { salesChannelWithLabel } from './salesChannelWithLabel'
import { tableSchema } from './utils/tableSchema'

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

  const [salesChannelPerBinding, setSalesChannelPerBinding] = useState<
    SalesChannelPerBinding[]
  >([])

  const [updateSalesChannelCustom, { loading, error }] =
    useMutation<CurrencySelectorAdminConfig[]>(UPDATE_SALES_CHANNEL)

  const {
    data,
    loading: l,
    error: err,
  } = useQuery<{ salesChannelCustomData: CurrencySelectorAdminConfig[] }>(
    SALES_CHANNELS_CUSTOM
  )

  // eslint-disable-next-line no-console
  console.log(err, l, loading, error)

  const [{ salesChannel }] = salesChannelInfo
  const { openAlert } = useAlert()

  const { currencySymbol } =
    salesChannelList.find(item => {
      return Number(item.id) === salesChannelInfo[0].salesChannel
    }) ?? {}

  useEffect(() => {
    if (data) {
      const filteredChannelsPerBind =
        data.salesChannelCustomData
          .filter(obj => obj.bindingId === bindingId)
          .flatMap(x => x.salesChannelInfo)
          .map(itm => ({
            ...(salesChannelList.find(
              (item: SalesChannel) =>
                Number(item.id) === Number(itm.salesChannel)
            ) as SalesChannel),
            ...itm,
          })) ?? []

      setSalesChannelPerBinding(filteredChannelsPerBind)
    }
  }, [salesChannelList, data])

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
      salesChannel: Number(id),
      customLabel,
    }))

    updateSalesChannelCustom({
      variables: {
        bindingId,
        salesChannelInfo: salesChannelAdmin[0],
      },
    })
    openAlert('success', 'sales channel was added')
    handleModalToggle()
    // eslint-disable-next-line no-console
    console.log({
      bindingId,
      salesChannel: salesChannelAdmin,
    })
  }

  const handleEditLabelSave = (): void => {
    openAlert('success', 'Custom Label was edited')

    setIsEditModalOpen(!isEditModalOpen)
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

  const lineActions = [
    {
      label: () => 'Edit',
      onClick: ({ rowData }: { rowData: SalesChannelCustomInfo }) =>
        handleEditModal(String(rowData.salesChannel)),
    },
    {
      label: () => 'Delete',
      isDangerous: true,
      onClick: ({ rowData }: { rowData: SalesChannelCustomInfo }) =>
        handleDeleteModal(String(rowData.salesChannel)),
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
                  schema={tableSchema}
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
        confirmation={{ label: 'Save', onClick: handleEditLabelSave }}
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
          onClick: deleteSalesChannelBinding,
          isDangerous: true,
        }}
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
