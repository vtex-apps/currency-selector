import { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import type { SessionSuccess } from 'vtex.session-client'
import { useRenderSession } from 'vtex.session-client'

import { salesChannelInfo, currencySelectorAdmin } from '../mock/data'
import { createSalesChannelBlockInfo } from '../utils/setSalesChannelBlockInfo'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSessionSuccess(session: any): session is SessionSuccess {
  if (!session) return false

  return session.id !== undefined
}

export const useCurrencySelector = () => {
  const [currentSalesChannel, setCurrentSalesChannel] = useState<
    SalesChannelBlock | undefined
  >(undefined)

  const [salesChannelList, setSalesChannelList] = useState<SalesChannelBlock[]>(
    []
  )

  const [hasLoaded, setHasLoaded] = useState(false)

  const { binding } = useRuntime()
  const {
    session,
    loading: loadingSession,
    error: sessionError,
  } = useRenderSession()

  const { id: currentBindingId } = binding ?? {}

  // mock data. Fetch it from GraphQL
  const { salesChannel } = salesChannelInfo()
  const { currencySelectorAdminConfig } = currencySelectorAdmin()

  useEffect(() => {
    let channel

    if (isSessionSuccess(session)) {
      channel = session.namespaces?.store?.channel?.value

      if (!channel) {
        console.error("Session doesn't have channel configure")
      }
    } else {
      return
    }

    if (!currentBindingId || !currentBindingId || !salesChannel) return

    if (hasLoaded) return

    const salesChannelBlockInfo = createSalesChannelBlockInfo({
      currentBindingId,
      currentSalesChannel: String(channel),
      salesChannelAPIInfoList: salesChannel,
      currencySelectorAdminConfig,
    })

    if (!salesChannelBlockInfo) return

    setSalesChannelList(salesChannelBlockInfo)
    setCurrentSalesChannel(salesChannelBlockInfo[0])
    setHasLoaded(true)
  }, [
    currencySelectorAdminConfig,
    currentBindingId,
    salesChannel,
    hasLoaded,
    session,
  ])

  const isLoading = loadingSession
  const hasError = sessionError

  if (hasError) {
    console.error(`There was a error loading ${sessionError ? 'session' : ''}.`)
  }

  return { currentSalesChannel, salesChannelList, isLoading }
}
