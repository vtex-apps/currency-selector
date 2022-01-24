export const filterAvailableSalesChannels = (
  salesChannelList: SalesChannel[],
  salesChannelPerBinding: SalesChannelPerBinding[]
) => {
  const salesChannelToDisplay = salesChannelList.filter(
    ({ id }) =>
      !salesChannelPerBinding.some(salesChannel => salesChannel.id === id)
  )

  return salesChannelToDisplay.map(salesChannel => ({
    ...salesChannel,
    salesChannel: Number(salesChannel.id),
    customLabel: '',
  }))
}
