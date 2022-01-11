import { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import type { SessionSuccess } from 'vtex.session-client'
import { useFullSession } from 'vtex.session-client'

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
  const [hasLocalError, setHasLocalError] = useState(false)
  const [orderFormId, setOrderFormId] = useState('')

  const { binding } = useRuntime()
  const {
    data: dataSession,
    loading: loadingSession,
    error: sessionError,
  } = useFullSession({
    variables: {
      items: ['store.channel', 'checkout.orderFormId'],
    },
  })

  const session = dataSession?.session

  const { id: currentBindingId } = binding ?? {}

  // mock data. Fetch it from GraphQL
  const { salesChannel } = salesChannelInfo()
  const { currencySelectorAdminConfig } = currencySelectorAdmin()

  /**
   * This effect handles the formatting of the sales channel block info, using data from
   * sales channel information, custom data saved in the admin and the sales channel in the
   * session.
   */
  useEffect(() => {
    let channel

    if (isSessionSuccess(session)) {
      channel = session.namespaces?.store?.channel?.value

      if (!channel) {
        console.error("Session doesn't have channel configure")
        setHasLocalError(true)
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

  /**
   * This effect gets the order form id from the session. This information is used to
   * update the cart when changing the sales channel.
   */
  useEffect(() => {
    if (!isSessionSuccess(session)) {
      return
    }

    const sessionOrderFormId = session.namespaces?.checkout?.orderFormId?.value

    setOrderFormId(sessionOrderFormId)
    if (!sessionOrderFormId) {
      console.error("Session doesn't have orderFormId information")
      setHasLocalError(true)
    }
  }, [session])

  const isLoading = loadingSession
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasError = sessionError || hasLocalError

  if (hasError) {
    console.error(`There was a error loading the currency selector app.`)
  }

  return {
    currentSalesChannel,
    salesChannelList,
    isLoading,
    hasError,
    orderFormId,
  }
}
