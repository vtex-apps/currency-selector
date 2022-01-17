import {
  SalesChannel,
  queries as salesChannelQueries,
  mutations as salesChannelMutations,
} from './salesChannel'

export const queries = {
  ...salesChannelQueries,
}

export const resolvers = {
  SalesChannel,
}

export const mutations = {
  ...salesChannelMutations,
}
