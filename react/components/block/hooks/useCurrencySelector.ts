import { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import type { SessionSuccess } from 'vtex.session-client'
import { useFullSession } from 'vtex.session-client'
import { useQuery } from 'react-apollo'

import { createSalesChannelBlockInfo } from '../utils/setSalesChannelBlockInfo'
import SALES_CHANNEL_INFO from '../graphql/salesChannelInfo.gql'
import SALES_CHANNEL_CUSTOM from '../graphql/salesChannelCustom.gql'

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

  const {
    data: salesChannelData,
    loading: loadingSalesChannel,
    error: salesChannelError,
  } = useQuery<{ salesChannel: SalesChannel[] }>(SALES_CHANNEL_INFO)

  const { binding } = useRuntime()
  const {
    data: dataSession,
    loading: loadingSession,
    error: sessionError,
  } = useFullSession({
    variables: {
      items: ['store.channel'],
    },
  })

  const session = dataSession?.session

  const { id: currentBindingId } = binding ?? {}

  const {
    data: salesChannelCustomData,
    loading: salesChannelCustomLoading,
    error: salesChannelCustomError,
  } = useQuery<
    { salesChannelCustom: CurrencySelectorAdminConfig | null },
    { bindingId: string }
  >(SALES_CHANNEL_CUSTOM, {
    variables: {
      bindingId: currentBindingId as string,
    },
    skip: !currentBindingId,
    ssr: false,
  })

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

    if (!currentBindingId || !salesChannelData || !salesChannelCustomData) {
      return
    }

    if (hasLoaded) return

    const salesChannelBlockInfo = createSalesChannelBlockInfo({
      currentBindingId,
      currentSalesChannel: String(channel),
      salesChannelAPIInfoList: salesChannelData.salesChannel,
      currentBindingAdminConfig: salesChannelCustomData.salesChannelCustom,
    })

    if (!salesChannelBlockInfo) return

    setSalesChannelList(salesChannelBlockInfo)
    setCurrentSalesChannel(
      salesChannelBlockInfo.find(({ isCurrent }) => isCurrent)
    )
    setHasLoaded(true)
  }, [
    currentBindingId,
    salesChannelData,
    hasLoaded,
    session,
    salesChannelCustomData,
  ])

  const isLoading =
    loadingSession || loadingSalesChannel || salesChannelCustomLoading

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasError =
    sessionError ||
    hasLocalError ||
    salesChannelError ||
    salesChannelCustomError

  if (hasError) {
    console.error(`There was a error loading the currency selector app.`)
    console.error({
      sessionError,
      hasLocalError,
      salesChannelError,
      salesChannelCustomError,
    })
  }

  return {
    currentSalesChannel,
    salesChannelList,
    isLoading,
    hasError,
  }
}
