import { useMemo, useState, useEffect, Fragment } from 'react'
import type { ExecutionResult } from 'react-apollo'
import { Button, Collapsible, ModalDialog, Table } from 'vtex.styleguide'
import { defineMessages, useIntl, FormattedMessage } from 'react-intl'

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

const messages = defineMessages({
  successCustomLabelEdit: {
    id: 'admin/currency-selector.edit.custom-label.success-message',
  },
  successAddSalesChannel: {
    id: 'admin/currency-selector.add.sales-channel.success-message',
  },
  error: {
    id: 'admin/currency-selector.error',
  },
  successDeleteSalesChannel: {
    id: 'admin/currency-selector.delete.sales-channel.success-message',
  },
})

const BindingInfo = ({
  bindingId,
  canonicalBaseAddress,
  salesChannelList,
  defaultSalesChannel,
  initialSalesChannelState,
  onMutation,
}: BindingInfoProps) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
  const intl = useIntl()
  const [isModalOpen, setIsModalOpen] = useState<
    'add' | 'edit' | 'delete' | null
  >(null)

  const [salesChannelIdToDelete, setSalesChannelIdToDelete] = useState('')
  const [salesChannelIdToEdit, setSalesChannelIdToEdit] = useState('')
  /**
   * This state is a temp state to hold all the sales channel info and builds the
   * list of sales channel to be added in the add new sales channel modal
   */
  const [salesChannelAdded, setSalesChannelAdded] = useState<
    SalesChannelBlock[]
  >([])

  /**
   * This state builds the list of sales channel in the main page.
   */
  const [salesChannelPerBinding, setSalesChannelPerBinding] = useState<
    SalesChannelPerBinding[]
  >([])

  const { openAlert } = useAlert()

  useEffect(() => {
    if (initialSalesChannelState) {
      setSalesChannelPerBinding(initialSalesChannelState)
    }
  }, [initialSalesChannelState])

  const handleCloseModal = () => {
    if (isModalOpen === 'add') setSalesChannelAdded([])
    if (isModalOpen === 'edit') setSalesChannelIdToEdit('')
    if (isModalOpen === 'delete') setSalesChannelIdToDelete('')
    setIsModalOpen(null)
  }

  const handleAddSalesChannel = (selectedSalesChanel: SalesChannelBlock) => {
    setSalesChannelAdded([...salesChannelAdded, selectedSalesChanel])
  }

  /**
   * This handler is responsible for updating the custom label when user is adding
   * a new sales channel.
   */
  const handleCustomLabel = (updatedList: SalesChannelBlock[]): void => {
    setSalesChannelAdded(updatedList)
  }

  /**
   * This handler is responsible for updating the custom label on a sales channel
   * already saved.
   */
  const handleEditLabel = (updatedList: SalesChannelPerBinding[]): void => {
    setSalesChannelPerBinding(updatedList)
  }

  const saveSalesChannelList = async () => {
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

      openAlert('success', intl.formatMessage(messages.successAddSalesChannel))
    } catch (error) {
      console.error(error)
      openAlert('error', intl.formatMessage(messages.error))
    } finally {
      handleCloseModal()
    }
  }

  const editCustomLabel = async () => {
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

      openAlert('success', intl.formatMessage(messages.successCustomLabelEdit))
    } catch (error) {
      console.error(error)
      openAlert('error', intl.formatMessage(messages.error))
    } finally {
      setIsModalOpen(null)
    }
  }

  const deleteSalesChannel = async () => {
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

      openAlert(
        'success',
        intl.formatMessage(messages.successDeleteSalesChannel)
      )
    } catch (error) {
      console.error(error)
      openAlert('error', intl.formatMessage(messages.error))
    } finally {
      setIsModalOpen(null)
    }
  }

  const { currencySymbol } =
    salesChannelList.find(item => {
      return Number(item.id) === defaultSalesChannel
    }) ?? {}

  const availableSalesChannels = useMemo(
    () =>
      filterAvailableSalesChannels(salesChannelList, salesChannelPerBinding),
    [salesChannelPerBinding]
  )

  const dropdownOptions = createDropdownList(
    availableSalesChannels,
    salesChannelAdded,
    defaultSalesChannel
  )

  const lineActions = [
    {
      label: () => <FormattedMessage id="admin/currency-selector.edit" />,
      onClick: ({ rowData }: { rowData: SalesChannelCustomInfo }) => {
        setSalesChannelIdToEdit(String(rowData.salesChannel))
        setIsModalOpen('edit')
      },
    },
    {
      label: () => <FormattedMessage id="admin/currency-selector.delete" />,
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
              <span className="c-muted-2 mr3">
                <FormattedMessage id="admin/currency-selector.canonical-address" />
              </span>{' '}
              {canonicalBaseAddress}
            </p>
          </div>
        </div>
        <div className="mv4">
          <Collapsible
            header={
              <FormattedMessage id="admin/currency-selector.sales-channel" />
            }
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
        confirmation={{ label: 'Save', onClick: saveSalesChannelList }}
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
        confirmation={{ label: 'Save', onClick: editCustomLabel }}
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
          onClick: deleteSalesChannel,
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
