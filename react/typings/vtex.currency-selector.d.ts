interface SalesChannelBlock extends SalesChannel {
  customLabel?: string
}

interface SalesChannel {
  Id: number
  Name: string
  IsActive: boolean
  CurrencyCode: string
  CurrencySymbol: string
}

interface SalesChannelConfig {
  bindingId: string
  salesChannelInfo: SalesChannelInfo[]
}

interface SalesChannelInfo {
  salesChannel: number
  customLabel?: string
}
