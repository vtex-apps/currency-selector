import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Layout, PageBlock, PageHeader, Toggle } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import type { Tenant } from 'vtex.tenant-graphql'

import { BindingInfo } from './BindingInfo'
import TENANT_INFO from '../../graphql/tenantInfo.gql'

const AdminPanel: FC = () => {
  const [settings, setSettings] = useState<any[]>([])
  const [isBindingBounded, setIsBindingBounded] = useState(true)

  const {
    data: tenantData,
    loading,
    error,
  } = useQuery<{ tenantInfo: Tenant }>(TENANT_INFO)

  // eslint-disable-next-line no-console
  console.log({ loading, error })

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
