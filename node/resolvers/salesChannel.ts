import type { OrderForm as CheckoutOrderForm } from 'vtex.checkout-graphql'
import { UserInputError } from '@vtex/api'

export const SalesChannel = {
  id: (root: SalesChannelResponse) => root.Id,
  name: (root: SalesChannelResponse) => root.Name,
  currencyCode: (root: SalesChannelResponse) => root.CurrencyCode,
  currencySymbol: (root: SalesChannelResponse) => root.CurrencySymbol,
  isActive: (root: SalesChannelResponse) => root.IsActive,
  cultureInfo: (root: SalesChannelResponse) => root.CultureInfo,
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

  const salesChannelInfoSet: Set<number> = new Set(
    salesChannelInfo.map(
      ({ salesChannel: salesChannelValue }) => salesChannelValue
    )
  )

  const isSalesChannelDuplicated: boolean =
    salesChannelInfoSet.size < salesChannelInfo.length

  if (isSalesChannelDuplicated) {
    throw new UserInputError(
      'Response not successful: salesChannel keys Cannot be duplicated'
    )
  }

  const getSalesChannelInfo = await vbase.getJSON<
    CurrencySelectorConfig[] | null
  >(BUCKET, CONFIG_PATH, true)

  if (!getSalesChannelInfo) {
    await vbase.saveJSON(BUCKET, CONFIG_PATH, [{ bindingId, salesChannelInfo }])

    return args
  }

  const duplicatedIndexes: number[] = getSalesChannelInfo.reduce(
    (accu: number[], element: CurrencySelectorConfig, index: number) => {
      if (element.bindingId === bindingId) {
        accu.push(index)
      }

      return accu
    },
    []
  )

  if (duplicatedIndexes.length) {
    /**
     * @description: here we update duplicateIndexs with the new value that comes from args.
     * Then we save the updated values in vbase.
     */
    duplicatedIndexes.forEach((index: number) => {
      getSalesChannelInfo[index] = { bindingId, salesChannelInfo }
    })
    await vbase.saveJSON(BUCKET, CONFIG_PATH, getSalesChannelInfo)

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

const salesChannelCustom = async (
  _root: unknown,
  { bindingId }: Pick<CurrencySelectorConfig, 'bindingId'>,
  ctx: Context
) => {
  const { clients } = ctx
  const { vbase } = clients

  const savedSalesChannelInfo = await vbase.getJSON<
    CurrencySelectorConfig[] | null
  >(BUCKET, CONFIG_PATH, true)

  return savedSalesChannelInfo?.find(
    (e: CurrencySelectorConfig) => e.bindingId === bindingId
  )
}

export const updateSalesChannel = async (
  _: unknown,
  args: {
    orderFormId: string
    salesChannel: string
  },
  ctx: Context
): Promise<CheckoutOrderForm> => {
  const { clients } = ctx
  const { orderFormId } = args
  const { checkout } = clients
  const orderForm = await checkout.getOrderForm(orderFormId)

  if (!orderForm.items.length) {
    return orderForm
  }

  return checkout.addItems(orderFormId, orderForm.items, args.salesChannel)
}

export const queries = {
  salesChannel,
  salesChannelCustomData,
  salesChannelCustom,
}

export const mutations = {
  updateSalesChannelCustom,
  updateSalesChannel,
}
