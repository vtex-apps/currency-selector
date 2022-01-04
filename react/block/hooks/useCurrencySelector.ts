import { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { salesChannelInfo, currencySelectorAdmin } from '../mock/data'
import { createSalesChannelBlockInfo } from '../utils/setSalesChannelBlockInfo'

export const useCurrencySelector = () => {
  const [currentSalesChannel, setCurrentSalesChannel] = useState<
    SalesChannelBlock | undefined
  >(undefined)

  const [salesChannelList, setSalesChannelList] = useState<SalesChannelBlock[]>(
    []
  )

  const [hasLoaded, setHasLoaded] = useState(false)

  const { binding } = useRuntime()
  const { id: currentBindingId } = binding ?? {}

  // mock data. Fetch it from GraphQL
  const { salesChannel } = salesChannelInfo()
  const { currencySelectorAdminConfig } = currencySelectorAdmin()

  useEffect(() => {
    const { channel } = JSON.parse(atob(window.__RUNTIME__.segmentToken))

    if (!currentBindingId || !currentBindingId || !salesChannel) return

    if (hasLoaded) return

    const salesChannelBlockInfo = createSalesChannelBlockInfo({
      currentBindingId,
      currentSalesChannel: channel,
      salesChannelAPIInfoList: salesChannel,
      currencySelectorAdminConfig,
    })

    if (!salesChannelBlockInfo) return

    setSalesChannelList(salesChannelBlockInfo)
    setCurrentSalesChannel(salesChannelBlockInfo[0])
    setHasLoaded(true)
  }, [currencySelectorAdminConfig, currentBindingId, salesChannel, hasLoaded])

  return { currentSalesChannel, salesChannelList }
}
