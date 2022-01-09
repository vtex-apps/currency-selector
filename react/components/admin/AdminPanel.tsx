import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Layout, PageBlock, PageHeader, Toggle } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import type { Tenant } from 'vtex.tenant-graphql'

import { BindingInfo } from './BindingInfo'
import TENANT_INFO from '../../graphql/tenantInfo.gql'
import SALES_CHANNELS from '../../graphql/salesChannel.gql'

const AdminPanel: FC = () => {
  const [settings, setSettings] = useState<any[]>([])
  const [salesChannelList, setSalesChannelList] = useState<SalesChannel[]>([])
  const [isBindingBounded, setIsBindingBounded] = useState(true)

  const {
    data: tenantData,
    loading,
    error,
  } = useQuery<{ tenantInfo: Tenant }>(TENANT_INFO)

  const {
    data: salesChannelsData,
    loading: loadingSalesChannelsData,
    error: errorSalesChannelsData,
  } = useQuery<{ salesChannel: SalesChannel[] }>(SALES_CHANNELS)

  // eslint-disable-next-line no-console
  console.log({
    loading,
    error,
    loadingSalesChannelsData,
    errorSalesChannelsData,
  })

  const handleChangeBindingBounded = () => {
    setIsBindingBounded(!isBindingBounded)
  }

  useEffect(() => {
    if (tenantData) {
      const config = tenantData.tenantInfo.bindings
        .filter(binding => binding.targetProduct === 'vtex-storefront')
        .map(({ id, canonicalBaseAddress, extraContext }) => {
          return {
            bindingId: id,
            canonicalBaseAddress,
            salesChannelInfo: [
              {
                salesChannel: extraContext?.portal?.salesChannel,
              },
            ],
          }
        })

      setSettings(config)
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
    <Layout pageHeader={<PageHeader title="Currency Selector"></PageHeader>}>
      <PageBlock>
        <div className="mb5">
          <Toggle
            label="Binding bounded"
            helpText="Check to use different configuration per sales channel"
            checked={isBindingBounded}
            onChange={handleChangeBindingBounded}
          />
        </div>
        {settings
          ? settings.map(
              ({ bindingId, canonicalBaseAddress, salesChannelInfo }) => {
                return (
                  <BindingInfo
                    bindingId={bindingId}
                    canonicalBaseAddress={canonicalBaseAddress}
                    salesChannelInfo={salesChannelInfo}
                    salesChannelList={salesChannelList}
                  />
                )
              }
            )
          : null}
      </PageBlock>
    </Layout>
  )
}

export { AdminPanel }
