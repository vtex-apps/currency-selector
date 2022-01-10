interface SalesChannelResponse {
  Id: string
  Name: string
  CurrencyCode: string
  CurrencySymbol: string
  IsActive: boolean
}

interface CurrencySelectorConfig {
  bindingId: string
  salesChannelInfo: SalesChannelCustomInfo
}

interface SalesChannelCustomInfo {
  salesChannel: number
  customLabel?: string
}
