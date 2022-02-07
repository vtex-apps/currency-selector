import type {
  ParamsContext,
  RecorderState,
  ServiceContext,
  Cached,
} from '@vtex/api'
import { Service, LRUCache } from '@vtex/api'

import { Clients } from './clients'
import { resolvers, queries, mutations } from './resolvers'

const TWO_SECONDS_MS = 2 * 1000
const SIX_SECONDS_MS = 6 * 1000

const vbaseCacheStorage = new LRUCache<string, Cached>({
  max: 1000,
})

const salesChannelCacheStorage = new LRUCache<string, Cached>({
  max: 1000,
})

metrics.trackCache('vbase', vbaseCacheStorage)
metrics.trackCache('salesChannel', salesChannelCacheStorage)

declare global {
  type Context = ServiceContext<Clients, State>

  type State = RecorderState
}

export default new Service<Clients, State, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 2,
        timeout: SIX_SECONDS_MS,
      },
      vbase: {
        memoryCache: vbaseCacheStorage,
        retries: 2,
        timeout: TWO_SECONDS_MS,
      },
      salesChannel: {
        memoryCache: salesChannelCacheStorage,
        retries: 2,
        timeout: TWO_SECONDS_MS,
      },
    },
  },
  graphql: {
    resolvers: {
      ...resolvers,
      Query: {
        ...queries,
      },
      Mutation: {
        ...mutations,
      },
    },
  },
})
