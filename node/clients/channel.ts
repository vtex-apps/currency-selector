import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export class Channel extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdClientAutCookie: context.authToken,
      },
    })
  }

  public getSalesChannel = async () => {
    try {
      const res = await this.http.get<SalesChannelResponse>(
        '/api/catalog_system/pvt/saleschannel/list'
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
