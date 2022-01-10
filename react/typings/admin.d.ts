type AppSettings = BindingInformation[]

interface BindingInformation extends Settings {
  salesChannelList: SalesChannel[]
}

interface SalesChannelInfo {
  salesChannel: number
  customLabel?: string
}

interface Settings {
  bindingId: string
  canonicalBaseAddress: string
  salesChannelInfo: SalesChannelInfo[]
}
