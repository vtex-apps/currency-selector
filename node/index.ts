import type { ParamsContext, RecorderState, ServiceContext } from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { resolvers, queries } from './resolvers'

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
        timeout: 2 * 60000,
      },
    },
  },
  graphql: {
    resolvers: {
      ...resolvers,
      Query: {
        ...queries,
      },
    },
  },
})
