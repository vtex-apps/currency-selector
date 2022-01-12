export const SalesChannel = {
  id: (root: SalesChannelResponse) => root.Id,
  name: (root: SalesChannelResponse) => root.Name,
  currencyCode: (root: SalesChannelResponse) => root.CurrencyCode,
  currencySymbol: (root: SalesChannelResponse) => root.CurrencySymbol,
  isActive: (root: SalesChannelResponse) => root.IsActive,
}
const BUCKET = 'currency_selector'
const CONFIG_PATH = 'configs'

const salesChannel = async (_root: unknown, _: unknown, ctx: Context) => {
  const {
    clients: { Channel },
  } = ctx

  const salesChannelResponse = await Channel.getSalesChannel()

  return salesChannelResponse
}

const updateSalesChannelCustom = async (
  _root: unknown,
  args: CurrencySelectorConfig,
  ctx: Context
) => {
  const { clients } = ctx
  const { bindingId, salesChannelInfo } = args
  const { vbase } = clients

  const getSalesChannelInfo = await vbase.getJSON<
    CurrencySelectorConfig[] | null
  >(BUCKET, CONFIG_PATH, true)

  if (!getSalesChannelInfo) {
    await vbase.saveJSON(BUCKET, CONFIG_PATH, [{ bindingId, salesChannelInfo }])

    return args
  }

  await vbase.saveJSON(BUCKET, CONFIG_PATH, [
    ...getSalesChannelInfo,
    { bindingId, salesChannelInfo },
  ])

  return args
}

const salesChannelCustomData = async (
  _root: unknown,
  _: unknown,
  ctx: Context
) => {
  const { clients } = ctx
  const { vbase } = clients

  const savedSalesChannelInfo = await vbase.getJSON<
    CurrencySelectorConfig[] | null
  >(BUCKET, CONFIG_PATH, true)

  if (!savedSalesChannelInfo) return []

  return savedSalesChannelInfo
}

export const queries = {
  salesChannel,
  salesChannelCustomData,
}

export const mutations = {
  updateSalesChannelCustom,
}
