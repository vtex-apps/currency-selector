import { IOClients } from '@vtex/api'

import { SalesChannel } from './salesChannel'
import { Checkout } from './checkout'

export class Clients extends IOClients {
  public get salesChannel() {
    return this.getOrSet('salesChannel', SalesChannel)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }
}
