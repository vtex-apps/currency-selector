export const filterAvailableSalesChannels = (
  salesChannelList: SalesChannel[],
  salesChannelPerBinding: SalesChannelPerBinding[]
) =>
  salesChannelList
    .filter(
      ({ id: id1 }) =>
        !salesChannelPerBinding.some(({ id: id2 }) => id2 === id1) ?? []
    )
    .map(item => {
      return {
        ...item,
        salesChannel: item.id,
        customLabel: '',
      }
    }) ?? []
