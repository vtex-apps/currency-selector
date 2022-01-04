/**
 * This interface mixes the Sales Channel info from the API with
 * the custom data added via admin panel.
 *
 * @interface SalesChannelBlock
 * @extends {SalesChannel}
 */
interface SalesChannelBlock extends SalesChannel {
  customLabel?: string
}

/**
 * This interface mirrors the information on the SalesChannel API:
 * /api/catalog_system/pvt/saleschannel/list
 *
 * @interface SalesChannel
 */
interface SalesChannel {
  Id: number
  Name: string
  IsActive: boolean
  CurrencyCode: string
  CurrencySymbol: string
}

interface CurrencySelectorAdminConfig {
  bindingId: string
  salesChannelInfo: SalesChannelCustomInfo[]
}
/**
 * This interface is for the custom sales channel info
 * added via admin panel.
 *
 * @interface SalesChannelCustomInfo
 */
interface SalesChannelCustomInfo {
  salesChannel: number
  customLabel?: string
}
