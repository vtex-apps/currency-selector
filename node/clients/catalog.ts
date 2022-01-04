import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

// const CATALOG_GRAPHQL_APP = 'vtex.catalog-graphql@1.x'

export class Catalog extends JanusClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super(ctx, {
      ...opts,
      headers: {
        ...opts?.headers,
        ...(ctx.adminUserAuthToken
          ? { VtexIdclientAutCookie: ctx.adminUserAuthToken }
          : null),
      },
    })
  }

  public getSalesChannel = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        VtexIdclientAutCookie: this.context.authToken,
      }

      const res = await this.http.get<CategorySalesChannelResponse>(
        '/api/catalog_system/pvt/saleschannel/list',
        { headers }
      )

      return res
    } catch (error) {
      if (error instanceof Error) {
        throw error.message
      }

      throw error
    }
  }
}
