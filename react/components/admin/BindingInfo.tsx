import { useMemo, useState, useEffect, Fragment } from 'react'
import { useMutation } from 'react-apollo'
import { Button, Collapsible, ModalDialog, Table } from 'vtex.styleguide'

import UPDATE_SALES_CHANNEL from '../../graphql/updateSalesChannelCustom.gql'
import SALES_CHANNELS_CUSTOM from '../../graphql/salesChannelCustomData.gql'
import { useAlert } from '../../providers/AlertProvider'
import { EditSalesChannel } from './EditSalesChannels'
import { EditCustomLabel } from './EditCustomLabel'
import { createDropdownList } from './utils/createDropdownList'
import { mergeCacheWithMutationResult } from './utils/mergeCacheWithMutationResult'
import { tableSchema } from './utils/tableSchema'
import { filterAvailableSalesChannels } from './utils/availableSalesChannels'

interface BindingInfoProps extends Settings {
  salesChannelList: SalesChannel[]
  initialSalesChannelState: SalesChannelPerBinding[]
}

const BindingInfo = ({
  bindingId,
  canonicalBaseAddress,
  salesChannelList,
  defaultSalesChannel,
  initialSalesChannelState,
}: BindingInfoProps) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState<
    'add' | 'edit' | 'delete' | null
  >(null)

  const [salesChannelIdToDelete, setSalesChannelIdToDelete] = useState('')
  const [salesChannelIdToEdit, setSalesChannelIdToEdit] = useState('')
  const [salesChannelAdded, setSalesChannelAdded] = useState<
    SalesChannelBlock[]
  >([])

  const [salesChannelPerBinding, setSalesChannelPerBinding] = useState<
    SalesChannelPerBinding[]
  >([])

  const { openAlert } = useAlert()

  const [updateSalesChannel] = useMutation<
    {
      updateSalesChannelCustom: CurrencySelectorAdminConfig
    },
    { bindingId: string; salesChannelInfo: SalesChannelCustomInfo[] }
  >(UPDATE_SALES_CHANNEL, {
    update(cache, { data: returnMutationData }) {
      const cacheData = cache.readQuery<{
        salesChannelCustomData: CurrencySelectorAdminConfig[]
      }>({
        query: SALES_CHANNELS_CUSTOM,
      })

      if (!returnMutationData || !cacheData) return
      const { updateSalesChannelCustom } = returnMutationData

      const hasBindingInfo = cacheData.salesChannelCustomData.some(
        item => item.bindingId === updateSalesChannelCustom.bindingId
      )

      const salesChannelCustomData = hasBindingInfo
        ? cacheData.salesChannelCustomData.map(salesChannelDetails =>
            mergeCacheWithMutationResult(
              salesChannelDetails,
              updateSalesChannelCustom
            )
          )
        : [updateSalesChannelCustom, ...cacheData.salesChannelCustomData]

      cache.writeQuery({
        query: SALES_CHANNELS_CUSTOM,
        data: {
          salesChannelCustomData,
        },
      })
    },
  })

  const { currencySymbol } =
    salesChannelList.find(item => {
      return Number(item.id) === defaultSalesChannel
    }) ?? {}

  useEffect(() => {
    if (initialSalesChannelState.length) {
      setSalesChannelPerBinding(initialSalesChannelState)
    }
  }, [initialSalesChannelState])

  const availableSalesChannels = useMemo(
    () =>
      filterAvailableSalesChannels(salesChannelList, salesChannelPerBinding),
    [salesChannelPerBinding]
  )

  const handleCloseModal = () => {
    if (isModalOpen === 'add') setSalesChannelAdded([])
    if (isModalOpen === 'edit') setSalesChannelIdToEdit('')
    if (isModalOpen === 'delete') setSalesChannelIdToDelete('')
    setIsModalOpen(null)
  }

  const handleAddSalesChannel = (selectedSalesChanel: SalesChannelBlock) => {
    setSalesChannelAdded([...salesChannelAdded, selectedSalesChanel])
  }

  const handleSave = async () => {
    const salesChannelAdmin = salesChannelAdded.map(({ id, customLabel }) => ({
      salesChannel: Number(id),
      customLabel,
    }))

    const filterSalesChannelProps = salesChannelPerBinding.map(item => {
      return {
        salesChannel: item.salesChannel,
        customLabel: item.customLabel,
      }
    })

    try {
      const { errors } = await updateSalesChannel({
        variables: {
          bindingId,
          salesChannelInfo: [...filterSalesChannelProps, ...salesChannelAdmin],
        },
      })

      if (errors) {
        throw errors
      }

      openAlert('success', 'Sales Channel has been added successfully')
    } catch (error) {
      console.error(error)
      openAlert('error', 'Something went wrong. Please try again.')
    } finally {
      handleCloseModal()
    }
  }

  const handleEditLabelSave = (): void => {
    try {
      const editedCustomLabel = salesChannelPerBinding
        .filter(({ id }) => Number(id) === Number(salesChannelIdToEdit))
        .map(({ id, customLabel }) => ({
          salesChannel: Number(id),
          customLabel,
        }))

      const filterSalesChannelProps = salesChannelPerBinding.map(item => {
        if (item.id === Number(salesChannelIdToEdit)) {
          return editedCustomLabel[0]
        }

        return {
          salesChannel: item.salesChannel,
          customLabel: item.customLabel,
        }
      })

      updateSalesChannel({
        variables: {
          bindingId,
          salesChannelInfo: filterSalesChannelProps,
        },
      })
      openAlert('success', 'Custom Label has been edited successfully')
    } catch (error) {
      console.error(error)
      openAlert('error', 'Something went wrong. Please try again.')
    } finally {
      setIsModalOpen(null)
    }
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
    defaultSalesChannel
  )

  const deleteSalesChannelBinding = () => {
    try {
      const salesChannelToChange = salesChannelPerBinding.filter(
        ({ id }) => String(id) !== salesChannelIdToDelete
      )

      const filterSalesChannelProps = salesChannelToChange.map(item => ({
        salesChannel: item.salesChannel,
        customLabel: item.customLabel,
      }))

      updateSalesChannel({
        variables: {
          bindingId,
          salesChannelInfo: filterSalesChannelProps,
        },
      })
      setSalesChannelPerBinding(salesChannelToChange)
      openAlert('success', 'Sales Channel has been deleted successfully')
    } catch (error) {
      console.error(error)
      openAlert('error', 'Something went wrong. Please try again.')
    } finally {
      setIsModalOpen(null)
    }
  }

  const lineActions = [
    {
      label: () => 'Edit',
      onClick: ({ rowData }: { rowData: SalesChannelCustomInfo }) => {
        setSalesChannelIdToEdit(String(rowData.salesChannel))
        setIsModalOpen('edit')
      },
    },
    {
      label: () => 'Delete',
      isDangerous: true,
      onClick: ({ rowData }: { rowData: SalesChannelCustomInfo }) => {
        setSalesChannelIdToDelete(String(rowData.salesChannel))
        setIsModalOpen('delete')
      },
    },
  ]

  return (
    <Fragment>
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
            <div className="mb5">
              <Table
                fullWidth
                schema={tableSchema}
                items={salesChannelPerBinding}
                lineActions={lineActions}
              />
            </div>
            <Button
              variation="tertiary"
              size="small"
              block
              onClick={() => setIsModalOpen('add')}
            >
              Add
            </Button>
          </Collapsible>
        </div>
      </div>
      <ModalDialog
        centered
        isOpen={isModalOpen === 'add'}
        onClose={handleCloseModal}
        confirmation={{ label: 'Save', onClick: handleSave }}
        cancelation={{ label: 'Cancel', onClick: handleCloseModal }}
      >
        <h2>Available Sales Channels</h2>
        <EditSalesChannel
          dropdownOptions={dropdownOptions}
          onSalesChannelAdded={handleAddSalesChannel}
          addedSalesChannel={salesChannelAdded}
          onLabelChange={handleCustomLabel}
          availableSalesChannels={availableSalesChannels}
        />
      </ModalDialog>
      <ModalDialog
        centered
        isOpen={isModalOpen === 'edit'}
        onClose={handleCloseModal}
        confirmation={{ label: 'Save', onClick: handleEditLabelSave }}
        cancelation={{ label: 'Cancel', onClick: handleCloseModal }}
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
        isOpen={isModalOpen === 'delete'}
        onClose={handleCloseModal}
        confirmation={{
          label: 'Yes',
          onClick: deleteSalesChannelBinding,
          isDangerous: true,
        }}
        cancelation={{ label: 'Cancel', onClick: handleCloseModal }}
      >
        <p className="f3 fw3 f3-ns">
          Are you sure you want to delete this information?
        </p>
      </ModalDialog>
    </Fragment>
  )
}

export { BindingInfo }
