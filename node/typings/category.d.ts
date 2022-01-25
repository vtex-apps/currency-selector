interface SalesChannelResponse {
  Id: string
  Name: string
  CurrencyCode: string
  CurrencySymbol: string
  IsActive: boolean
  CultureInfo: string
}

interface CurrencySelectorConfig {
  bindingId: string
  salesChannelInfo: SalesChannelCustomInfo[]
}

interface SalesChannelCustomInfo {
  salesChannel: number
  customLabel?: string
}
