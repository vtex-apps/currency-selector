import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Layout, PageBlock, PageHeader, Toggle } from 'vtex.styleguide'

import { BindingInfo } from './BindingInfo'
import { tenantInfo } from './tenants'

const AdminPanel: FC = () => {
  const [tenant] = useState(tenantInfo)
  const [settings, setSettings] = useState<any[]>([])
  const [isBindingBounded, setIsBindingBounded] = useState(true)

  const handleChangeBindingBounded = () => {
    setIsBindingBounded(!isBindingBounded)
  }

  useEffect(() => {
    const config = tenant.bindings
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
  }, [])

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
