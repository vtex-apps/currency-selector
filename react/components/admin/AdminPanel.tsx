import React, { useEffect, useState } from 'react'
import {
  Layout,
  PageBlock,
  PageHeader,
  Spinner,
  Alert,
  Divider,
} from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import type { Tenant } from 'vtex.tenant-graphql'

import { AlertProvider } from '../../providers/AlertProvider'
import { BindingInfo } from './BindingInfo'
import TENANT_INFO from '../../graphql/tenantInfo.gql'
import SALES_CHANNELS from '../../graphql/salesChannel.gql'
import SALES_CHANNELS_CUSTOM from '../../graphql/salesChannelCustomData.gql'

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

  const isLoading =
    loadingTenant || loadingSalesChannelsData || salesChannelCustomLoading

  const isError =
    errorTenant || errorSalesChannelsData || salesChannelCustomError

  if (isError) {
    console.error({ error: isError })
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

  return (
    <AlertProvider>
      <Layout pageHeader={<PageHeader title="Currency Selector"></PageHeader>}>
        <PageBlock>
          {isError ? (
            <Alert type="error">Something went wrong, Please try again.</Alert>
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
                      salesChannelCustomList={
                        salesChannelCustomData?.salesChannelCustomData
                      }
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
