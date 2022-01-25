/**
 * This interface mixes the Sales Channel info from the API with
 * the custom data added via admin panel.
 *
 * @interface SalesChannelBlock
 * @extends {SalesChannel}
 */
interface SalesChannelBlock extends SalesChannel {
  customLabel?: string
  isCurrent?: boolean
}

/**
 * This interface mirrors the information on the SalesChannel API:
 * /api/catalog_system/pvt/saleschannel/list
 *
 * @interface SalesChannel
 */
interface SalesChannel {
  id: string
  name: string
  isActive: boolean
  currencyCode: string
  currencySymbol: string
  cultureInfo: string
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

interface ComponentViewProps {
  currentSalesChannel?: SalesChannelBlock
  labelFormat: string
  salesChannelList: SalesChannelBlock[]
  onSalesChannelSelection: (
    salesChannel: string,
    cultureInfo: string,
    callBack?: () => void
  ) => void
  isLoading: boolean
}

interface SalesChannelPerBinding extends SalesChannel, SalesChannelCustomInfo {}
