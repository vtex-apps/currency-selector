type AppSettings = BindingInformation[]

interface BindingInformation {
  bindingId: string
  canonicalBaseAddress: string
  salesChannelInfo: SalesChannelInfo[]
}

interface SalesChannelInfo {
  salesChannel: number
  customLabel?: string
}
