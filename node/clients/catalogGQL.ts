import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

const CATALOG_GRAPHQL_APP = 'vtex.catalog-graphql@1.x'

export class CatalogGQL extends AppGraphQLClient {
  // constructor(ctx: IOContext, opts?: InstanceOptions) {
  //   super(CATALOG_GRAPHQL_APP, ctx, opts)
  // }

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(CATALOG_GRAPHQL_APP, ctx, {
      ...options,
      baseURL: 'https://powerplanet.vtexcommercestable.com.br',
      headers: {
        ...options?.headers,
      },
    })
  }

  public getSalesChannel = async (ctx: Context) => {
    try {
      // console.log(`ctx`, ctx)
      const headers = {
        'Content-Type': 'application/json',
        Cookie: `vtex_segment=${ctx.cookies.get(
          'vtex_segment'
        )}; vtex_session=${ctx.cookies.get('vtex_session')}`,
        // VtexIdclientAutCookie:  this.context.authToken,
      }

      // console.log(`headers`, headers)
      const res = await this.http.get(
        '/api/catalog_system/pvt/saleschannel/list',
        { headers }
      )

      return res
    } catch (error) {
      return error
    }
  }
}
