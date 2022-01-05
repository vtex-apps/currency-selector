import { IOClients } from '@vtex/api'

import { Channel } from './channel'

export class Clients extends IOClients {
  public get Channel() {
    return this.getOrSet('SalesChannel', Channel)
  }
}
