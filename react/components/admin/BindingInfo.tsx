import { useMemo, useState, useEffect, Fragment } from 'react'
import type { ExecutionResult } from 'react-apollo'
import { Button, Collapsible, ModalDialog, Table } from 'vtex.styleguide'
import { defineMessages, useIntl, FormattedMessage } from 'react-intl'

import { useAlert } from '../../providers/AlertProvider'
import { SalesChannelToAddList } from './SalesChannelToAddList'
import { EditCustomLabel } from './EditCustomLabel'
import { createDropdownList } from './utils/createDropdownList'
import { tableSchema } from './utils/tableSchema'
import { filterAvailableSalesChannels } from './utils/availableSalesChannels'
import { convertSalesChannelToMutationArgs } from './utils/convertSalesChannelToMutationArgs'

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
  const [isMutating, setIsMutating] = useState(false)
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

  const dispatchMutation = async (
    updatedSalesChannelInfo: SalesChannelCustomInfo[],
    successMessage: { id: string }
  ) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      const { errors } = await onMutation(bindingId, updatedSalesChannelInfo)

      if (errors) {
        console.error({ errors })
        throw new Error('Error sending sales channel mutation')
      }

      openAlert('success', intl.formatMessage(successMessage))
    } catch (error) {
      console.error(error)
      openAlert('error', intl.formatMessage(messages.error))
    } finally {
      setIsMutating(false)
      handleCloseModal()
    }
  }

  const saveSalesChannelList = async () => {
    convertSalesChannelToMutationArgs
    const salesChannelAdmin = salesChannelAdded.map(salesChannel =>
      convertSalesChannelToMutationArgs(salesChannel)
    )

    const filterSalesChannelProps = salesChannelPerBinding.map(salesChannel =>
      convertSalesChannelToMutationArgs(salesChannel)
    )

    dispatchMutation(
      [...filterSalesChannelProps, ...salesChannelAdmin],
      messages.successAddSalesChannel
    )
  }

  const editCustomLabel = async () => {
    const filterSalesChannelProps = salesChannelPerBinding.map(salesChannel =>
      convertSalesChannelToMutationArgs(salesChannel)
    )

    dispatchMutation(filterSalesChannelProps, messages.successCustomLabelEdit)
  }

  const deleteSalesChannel = async () => {
    const salesChannelToChange = salesChannelPerBinding.filter(
      ({ id }) => String(id) !== salesChannelIdToDelete
    )

    const filterSalesChannelProps = salesChannelToChange.map(salesChannel =>
      convertSalesChannelToMutationArgs(salesChannel)
    )

    dispatchMutation(
      filterSalesChannelProps,
      messages.successDeleteSalesChannel
    )
  }

  const { currencySymbol } =
    salesChannelList.find(item => {
      return Number(item.id) === defaultSalesChannel
    }) ?? {}

  const availableSalesChannel = useMemo(
    () =>
      filterAvailableSalesChannels(salesChannelList, salesChannelPerBinding),
    [salesChannelPerBinding]
  )

  const dropdownOptions = createDropdownList({
    availableSalesChannel,
    selectedSalesChannel: salesChannelAdded,
    intl,
    defaultSalesChannel,
  })

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
                emptyStateLabel={
                  <FormattedMessage id="admin/currency-selector.table-empty-state" />
                }
              />
            </div>
            <Button
              variation="tertiary"
              size="small"
              block
              onClick={() => setIsModalOpen('add')}
            >
              <FormattedMessage id="admin/currency-selector.add" />
            </Button>
          </Collapsible>
        </div>
      </div>
      <ModalDialog
        centered
        isOpen={isModalOpen === 'add'}
        loading={isMutating}
        onClose={handleCloseModal}
        confirmation={{
          label: <FormattedMessage id="admin/currency-selector.save" />,
          onClick: saveSalesChannelList,
        }}
        cancelation={{
          label: <FormattedMessage id="admin/currency-selector.cancel" />,
          onClick: handleCloseModal,
        }}
      >
        <h2>
          <FormattedMessage id="admin/currency-selector.available-sales-channels" />
        </h2>
        <SalesChannelToAddList
          dropdownOptions={dropdownOptions}
          onSalesChannelAdded={handleAddSalesChannel}
          addedSalesChannel={salesChannelAdded}
          onLabelChange={handleCustomLabel}
          availableSalesChannels={availableSalesChannel}
        />
      </ModalDialog>
      <ModalDialog
        centered
        isOpen={isModalOpen === 'edit'}
        loading={isMutating}
        onClose={handleCloseModal}
        confirmation={{
          label: <FormattedMessage id="admin/currency-selector.save" />,
          onClick: editCustomLabel,
        }}
        cancelation={{
          label: <FormattedMessage id="admin/currency-selector.cancel" />,
          onClick: handleCloseModal,
        }}
      >
        <h2>
          <FormattedMessage id="admin/currency-selector.edit-custom-label" />
        </h2>
        <EditCustomLabel
          onLabelChange={handleEditLabel}
          salesChannelPerBinding={salesChannelPerBinding}
          salesChannelIdToEdit={salesChannelIdToEdit}
        />
      </ModalDialog>
      <ModalDialog
        centered
        isOpen={isModalOpen === 'delete'}
        loading={isMutating}
        onClose={handleCloseModal}
        confirmation={{
          label: (
            <FormattedMessage id="admin/currency-selector.delete-confirmation" />
          ),
          onClick: deleteSalesChannel,
          isDangerous: true,
        }}
        cancelation={{
          label: <FormattedMessage id="admin/currency-selector.cancel" />,
          onClick: handleCloseModal,
        }}
      >
        <p className="f3 fw3 f3-ns">
          <FormattedMessage id="admin/currency-selector.delete-confirmation-paragraph" />
        </p>
      </ModalDialog>
    </Fragment>
  )
}

export { BindingInfo }
