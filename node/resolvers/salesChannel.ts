export const SalesChannel = {
  id: (root: SalesChannelResponse) => root.Id,
  name: (root: SalesChannelResponse) => root.Name,
  currencyCode: (root: SalesChannelResponse) => root.CurrencyCode,
  currencySymbol: (root: SalesChannelResponse) => root.CurrencySymbol,
  isActive: (root: SalesChannelResponse) => root.IsActive,
}

const salesChannel = async (_root: unknown, _: unknown, ctx: Context) => {
  const {
    clients: { Channel },
  } = ctx

  const salesChannelResponse = await Channel.getSalesChannel()

  return salesChannelResponse
}

export const queries = {
  salesChannel,
}
