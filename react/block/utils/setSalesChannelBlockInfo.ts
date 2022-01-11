interface MergeSalesChannelInfo {
  salesChannelCustomInfo: SalesChannelCustomInfo[]
  salesChannelAPIInfoList: SalesChannel[]
}

/**
 * Merges the sales channel info from the API with the custom data added via admin panel.
 * Removes from the custom list the ones not available in the API or not active.
 */
const mergeSalesChannelInfo = ({
  salesChannelAPIInfoList,
  salesChannelCustomInfo,
}: MergeSalesChannelInfo): SalesChannelBlock[] => {
  const salesChannelsAvailable = salesChannelCustomInfo.filter(
    ({ salesChannel }) => {
      const isAvailable = salesChannelAPIInfoList.some(
        ({ id, isActive }) => isActive && id === salesChannel
      )

      // The sales channel might have been deleted from the API. The admin configuration for
      // the app should be updated accordingly.
      if (!isAvailable) {
        console.error(
          `Sales Channel ${salesChannel} not found in the Sales Channel API or is not active. Check /api/catalog_system/pvt/saleschannel/list`
        )
      }

      return isAvailable
    }
  )

  return salesChannelsAvailable.map(info => {
    // We can safe enforce the type here because we are filtering out the unavailable sales channels above
    const salesChannelInfo = salesChannelAPIInfoList.find(
      salesChannelAPIInfo => salesChannelAPIInfo.id === info.salesChannel
    ) as SalesChannel

    return {
      ...salesChannelInfo,
      ...(info.customLabel ? { customLabel: info.customLabel } : {}),
    }
  })
}

/**
 * Makes the current sales channel info the first one in the array
 *
 */
const sortSalesChannelBlockInfo = ({
  salesChannelBlock,
  currentSalesChannel,
}: {
  salesChannelBlock: SalesChannelBlock[]
  currentSalesChannel: string
}): SalesChannelBlock[] => {
  const active = salesChannelBlock.find(
    ({ id }) => id === Number(currentSalesChannel)
  ) as SalesChannelBlock

  const otherSalesChannels = salesChannelBlock.filter(
    ({ id }) => id !== Number(currentSalesChannel)
  )

  return [active, ...otherSalesChannels]
}

interface CreateSalesChannelBlockInfo {
  currentBindingId: string
  currentSalesChannel: string
  salesChannelAPIInfoList: SalesChannel[]
  currencySelectorAdminConfig: CurrencySelectorAdminConfig[]
}

/**
 * Returns the sales channel information needed to build the
 * currency selector block. The first element in the array is the one
 * for the current sales channel being visited.
 *
 * Returns undefined when there is an error in the admin configuration.
 *
 * @returns SalesChannelBlock[] | undefined
 */
export const createSalesChannelBlockInfo = ({
  currentBindingId,
  currentSalesChannel,
  salesChannelAPIInfoList,
  currencySelectorAdminConfig,
}: CreateSalesChannelBlockInfo): SalesChannelBlock[] | undefined => {
  const currentBindingConfig = currencySelectorAdminConfig.find(
    ({ bindingId }) => bindingId === currentBindingId
  )

  if (!currentBindingConfig || !currentBindingConfig.salesChannelInfo.length) {
    console.error(
      `There is no Sales Channel configuration for binding ${currentBindingId} in vtex.currency-selector admin.`
    )

    return
  }

  const { salesChannelInfo: salesChannelCustomInfo } = currentBindingConfig

  const hasConfigForCurrentSalesChannel = salesChannelCustomInfo.some(
    ({ salesChannel }) => salesChannel === Number(currentSalesChannel)
  )

  if (!hasConfigForCurrentSalesChannel) {
    console.error(
      `There is no Sales Channel configuration for Sales Channel ${currentSalesChannel} in binding ${currentBindingId} in vtex.currency-selector admin.`
    )

    return
  }

  const mergedSalesChannelInfo = mergeSalesChannelInfo({
    salesChannelCustomInfo,
    salesChannelAPIInfoList,
  })

  return sortSalesChannelBlockInfo({
    salesChannelBlock: mergedSalesChannelInfo,
    currentSalesChannel,
  })
}
