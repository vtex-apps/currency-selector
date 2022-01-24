export const convertSalesChannelToMutationArgs = (
  salesChannel: SalesChannelPerBinding | SalesChannelBlock
): SalesChannelCustomInfo => ({
  salesChannel: Number(salesChannel.id),
  customLabel: salesChannel.customLabel,
})
