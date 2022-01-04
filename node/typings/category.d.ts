interface CategoryResponse {
  categories: {
    items: Array<{ id: string; name: string }>
    paging: {
      pages: number
    }
  }
}

interface CategorySalesChannelResponse {
  Id: string
  Name: string
  CurrencyCode: string
  CurrencySymbol: string
}

interface ResolvedPromise<Response> {
  data: Response
}
