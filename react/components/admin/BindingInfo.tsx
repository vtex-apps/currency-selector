import { useMemo, useState, useEffect, Fragment } from 'react'
import type { ExecutionResult } from 'react-apollo'
import { Button, Collapsible, ModalDialog, Table } from 'vtex.styleguide'

import { useAlert } from '../../providers/AlertProvider'
import { EditSalesChannel } from './EditSalesChannels'
import { EditCustomLabel } from './EditCustomLabel'
import { createDropdownList } from './utils/createDropdownList'
import { tableSchema } from './utils/tableSchema'
import { filterAvailableSalesChannels } from './utils/availableSalesChannels'

interface BindingInfoProps extends Settings {
  salesChannelList: SalesChannel[]
  initialSalesChannelState: SalesChannelPerBinding[]
  onMutation: (
    bindingId: string,
    salesChannelInfo: SalesChannelCustomInfo[]
  ) => Promise<
    ExecutionResult<{
      updateSalesChannelCustom: CurrencySelectorAdminConfig
    }>
  >
}

const BindingInfo = ({
  bindingId,
  canonicalBaseAddress,
  salesChannelList,
  defaultSalesChannel,
  initialSalesChannelState,
  onMutation,
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
      const { errors } = await onMutation(bindingId, [
        ...filterSalesChannelProps,
        ...salesChannelAdmin,
      ])

      if (errors) {
        console.error({ errors })
        throw new Error('Error saving sales channels information')
      }

      openAlert('success', 'Sales Channel has been added successfully')
    } catch (error) {
      console.error(error)
      openAlert('error', 'Something went wrong. Please try again.')
    } finally {
      handleCloseModal()
    }
  }

  const handleEditLabelSave = async () => {
    try {
      const editedCustomLabel = salesChannelPerBinding
        .filter(({ id }) => id === salesChannelIdToEdit)
        .map(({ id, customLabel }) => ({
          salesChannel: Number(id),
          customLabel,
        }))

      const filterSalesChannelProps = salesChannelPerBinding.map(item => {
        if (item.id === salesChannelIdToEdit) {
          return editedCustomLabel[0]
        }

        return {
          salesChannel: item.salesChannel,
          customLabel: item.customLabel,
        }
      })

      const { errors } = await onMutation(bindingId, filterSalesChannelProps)

      if (errors) {
        console.error({ errors })
        throw new Error('Error updating custom label')
      }

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

  const deleteSalesChannelBinding = async () => {
    try {
      const salesChannelToChange = salesChannelPerBinding.filter(
        ({ id }) => String(id) !== salesChannelIdToDelete
      )

      const filterSalesChannelProps = salesChannelToChange.map(item => ({
        salesChannel: item.salesChannel,
        customLabel: item.customLabel,
      }))

      const { errors } = await onMutation(bindingId, filterSalesChannelProps)

      if (errors) {
        console.error({ errors })
        throw new Error('Error deleting sales channel')
      }

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
