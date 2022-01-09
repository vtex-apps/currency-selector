type AppSettings = BindingInformation[]

interface BindingInformation {
  bindingId: string
  canonicalBaseAddress: string
  salesChannelInfo: SalesChannelInfo[]
  salesChannelList: SalesChannel[]
}

interface SalesChannelInfo {
  salesChannel: number
  customLabel?: string
}
