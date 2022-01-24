export const mapSalesChannelPerBinding = (
  currencySelectorAdminConfig: CurrencySelectorAdminConfig[],
  salesChannelList: SalesChannel[]
): Record<string, SalesChannelPerBinding[]> => {
  /**
   * Creates a map of sales channel to avoid looping over salesChannelList
   * inside the salesChannelPerBinding reduce
   */
  const salesChannelMapped = salesChannelList.reduce<
    Record<string, SalesChannel>
  >((salesChannelMap, salesChannel) => {
    salesChannelMap[salesChannel.id] = salesChannel

    return salesChannelMap
  }, {})

  /**
   * For every binding on admin, this reduce merges the custom sales channel info
   * with the sales channel info from the API
   */
  const salesChannelPerBinding = currencySelectorAdminConfig.reduce<
    Record<string, SalesChannelPerBinding[]>
  >((bindingMap, config) => {
    const salesChannelMerged = config.salesChannelInfo.map(
      salesChannelCustom => {
        return {
          ...salesChannelCustom,
          ...salesChannelMapped[salesChannelCustom.salesChannel],
        }
      }
    )

    bindingMap[config.bindingId] = salesChannelMerged

    return bindingMap
  }, {})

  return salesChannelPerBinding
}
