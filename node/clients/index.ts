import { IOClients } from '@vtex/api'

import { Channel } from './channel'
import { Checkout } from './checkout'

export class Clients extends IOClients {
  public get Channel() {
    return this.getOrSet('SalesChannel', Channel)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }
}
