interface Settings {
  bindingId: string
  canonicalBaseAddress: string
  defaultSalesChannel?: number
}

interface CellData {
  rowData: {
    id: string
    customLabel: string
  }
}
