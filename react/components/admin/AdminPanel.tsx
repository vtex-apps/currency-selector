import React, { useEffect, useState, useMemo } from 'react'
import {
  Layout,
  PageBlock,
  PageHeader,
  Spinner,
  Alert,
  Divider,
} from 'vtex.styleguide'
import { useQuery, useMutation } from 'react-apollo'
import type { Tenant } from 'vtex.tenant-graphql'
import { FormattedMessage } from 'react-intl'

import TENANT_INFO from '../../graphql/tenantInfo.gql'
import SALES_CHANNELS from '../../graphql/salesChannel.gql'
import SALES_CHANNELS_CUSTOM from '../../graphql/salesChannelCustomData.gql'
import UPDATE_SALES_CHANNEL from '../../graphql/updateSalesChannelCustom.gql'
import { AlertProvider } from '../../providers/AlertProvider'
import { BindingInfo } from './BindingInfo'
import { mapSalesChannelPerBinding } from './utils/mapSalesChannelPerBinding'
import { mergeCacheWithMutationResult } from './utils/mergeCacheWithMutationResult'

const AdminPanel = () => {
  const [settings, setSettings] = useState<Settings[]>([])
  const [salesChannelList, setSalesChannelList] = useState<SalesChannel[]>([])

  const {
    data: tenantData,
    loading: loadingTenant,
    error: errorTenant,
  } = useQuery<{ tenantInfo: Tenant }>(TENANT_INFO)

  const {
    data: salesChannelsData,
    loading: loadingSalesChannelsData,
    error: errorSalesChannelsData,
  } = useQuery<{ salesChannel: SalesChannel[] }>(SALES_CHANNELS)

  const {
    data: salesChannelCustomData,
    loading: salesChannelCustomLoading,
    error: salesChannelCustomError,
  } = useQuery<{ salesChannelCustomData: CurrencySelectorAdminConfig[] }>(
    SALES_CHANNELS_CUSTOM
  )

  const [updateSalesChannel] = useMutation<
    {
      updateSalesChannelCustom: CurrencySelectorAdminConfig
    },
    { bindingId: string; salesChannelInfo: SalesChannelCustomInfo[] }
  >(UPDATE_SALES_CHANNEL, {
    update(cache, { data: returnMutationData }) {
      const cacheData = cache.readQuery<{
        salesChannelCustomData: CurrencySelectorAdminConfig[]
      }>({
        query: SALES_CHANNELS_CUSTOM,
      })

      if (!returnMutationData || !cacheData) return
      const { updateSalesChannelCustom } = returnMutationData

      const hasBindingInfo = cacheData.salesChannelCustomData.some(
        item => item.bindingId === updateSalesChannelCustom.bindingId
      )

      const updatedSalesChannelCustomData = hasBindingInfo
        ? cacheData.salesChannelCustomData.map(salesChannelDetails =>
            mergeCacheWithMutationResult(
              salesChannelDetails,
              updateSalesChannelCustom
            )
          )
        : [updateSalesChannelCustom, ...cacheData.salesChannelCustomData]

      cache.writeQuery({
        query: SALES_CHANNELS_CUSTOM,
        data: {
          salesChannelCustomData: updatedSalesChannelCustomData,
        },
      })
    },
  })

  const handleSalesChannelInfoMutation = async (
    bindingId: string,
    salesChannelInfo: SalesChannelCustomInfo[]
  ) => {
    return updateSalesChannel({
      variables: {
        bindingId,
        salesChannelInfo,
      },
    })
  }

  useEffect(() => {
    if (tenantData) {
      const appSettings = tenantData.tenantInfo.bindings
        .filter(binding => binding.targetProduct === 'vtex-storefront')
        .map(({ id, canonicalBaseAddress, extraContext }) => {
          return {
            bindingId: id,
            canonicalBaseAddress,
            defaultSalesChannel: Number(extraContext?.portal?.salesChannel),
          }
        })

      setSettings(appSettings)
    }
  }, [tenantData])

  useEffect(() => {
    if (salesChannelsData) {
      const currentSalesChannelsData = salesChannelsData.salesChannel.map(
        ({ id, name, currencyCode, currencySymbol, isActive }) => {
          return {
            id,
            name,
            currencyCode,
            currencySymbol,
            isActive,
          }
        }
      )

      setSalesChannelList(currentSalesChannelsData)
    }
  }, [salesChannelsData])

  const mappedSalesChannelPerBinding = useMemo(() => {
    if (
      salesChannelCustomData?.salesChannelCustomData &&
      salesChannelList.length
    ) {
      return mapSalesChannelPerBinding(
        salesChannelCustomData.salesChannelCustomData ?? [],
        salesChannelList
      )
    }
  }, [salesChannelCustomData, salesChannelList])

  const isLoading =
    loadingTenant ||
    loadingSalesChannelsData ||
    salesChannelCustomLoading ||
    !mappedSalesChannelPerBinding

  const isError =
    errorTenant ?? errorSalesChannelsData ?? salesChannelCustomError

  if (isError) {
    console.error({ error: isError })
  }

  return (
    <AlertProvider>
      <Layout
        pageHeader={
          <PageHeader
            title={<FormattedMessage id="admin/currency-selector.title" />}
          ></PageHeader>
        }
      >
        <PageBlock>
          {isError ? (
            <Alert type="error">
              <FormattedMessage id="admin/currency-selector.error" />
            </Alert>
          ) : isLoading ? (
            <Spinner />
          ) : (
            settings.map(
              ({ bindingId, canonicalBaseAddress, defaultSalesChannel }, i) => {
                return (
                  <div key={bindingId}>
                    {i === 0 ? null : <Divider />}
                    <BindingInfo
                      bindingId={bindingId}
                      canonicalBaseAddress={canonicalBaseAddress}
                      defaultSalesChannel={defaultSalesChannel}
                      salesChannelList={salesChannelList}
                      initialSalesChannelState={
                        mappedSalesChannelPerBinding?.[bindingId] ?? []
                      }
                      onMutation={handleSalesChannelInfoMutation}
                    />
                  </div>
                )
              }
            )
          )}
        </PageBlock>
      </Layout>
    </AlertProvider>
  )
}

export { AdminPanel }
