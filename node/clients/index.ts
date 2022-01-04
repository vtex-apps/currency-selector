import { IOClients } from '@vtex/api'

import { Catalog } from './catalog'

export class Clients extends IOClients {
  public get Catalog() {
    return this.getOrSet('Catalog', Catalog)
  }
}
