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

const updateSalesChannelInfo = async (
  _root: unknown,
  { bindingId, salesChannelInfo }: CurrencySelectorConfig,
  ctx: Context
) => {
  const { clients } = ctx
  const args = { bindingId, salesChannelInfo }
  const { vbase } = clients

  await vbase.saveJSON(BUCKET, CONFIG_PATH, {
    ...args,
  })

  return args
}

const SCSwitcherConfiguration = async (
  _root: unknown,
  _: unknown,
  ctx: Context
) => {
  const { clients } = ctx
  const { vbase } = clients

  const savedSalesChannelInfo =
    await vbase.getJSON<CurrencySelectorConfig | null>(
      BUCKET,
      CONFIG_PATH,
      true
    )

  return savedSalesChannelInfo
}

export const queries = {
  salesChannel,
  SCSwitcherConfiguration,
}

export const mutations = {
  updateSalesChannelInfo,
}
