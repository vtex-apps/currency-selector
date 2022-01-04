export const Category = {
  id: (root: CategorySalesChannelResponse) => root.Id,
  name: (root: CategorySalesChannelResponse) => root.Name,
  currencyCode: (root: CategorySalesChannelResponse) => root.CurrencyCode,
  currencySymbol: (root: CategorySalesChannelResponse) => root.CurrencySymbol,
}

const salesChannel = async (_root: unknown, _: unknown, ctx: Context) => {
  const {
    clients: { Catalog },
  } = ctx

  const salesChannelResponse = await Catalog.getSalesChannel()

  return salesChannelResponse
}

export const queries = {
  salesChannel,
}
