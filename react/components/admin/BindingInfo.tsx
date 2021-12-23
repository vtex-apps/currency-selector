import type { FC } from 'react'
import { useState, Fragment } from 'react'
import { Button, Collapsible, Divider, Input, Modal } from 'vtex.styleguide'

import { EditSalesChannel } from './EditSalesChannels'
import { salesChannelList } from './salesChannelList'

const BindingInfo: FC<BindingInformation> = ({
  bindingId,
  canonicalBaseAddress,
  salesChannelInfo,
}) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [{ salesChannel }] = salesChannelInfo
  const [{ customLabel }] = salesChannelInfo

  const { CurrencyCode, CurrencySymbol } = salesChannelList.find(
    item => item.Id === salesChannelInfo[0].salesChannel
  )

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <Fragment>
      <Divider />
      <div className="flex flex-column mv2">
        <div className="flex items-center mv2">
          <div className="w-10 c-muted-1 pa4 mr6 ba br2 b--light-gray tc">
            {CurrencySymbol}
          </div>
          <div className="w-90">
            <p>
              <span className="c-muted-2 mr3">BindingId:</span> {bindingId}
            </p>
            <p>
              <span className="c-muted-2 mr3">Canonical address:</span>{' '}
              {canonicalBaseAddress}
            </p>
          </div>
        </div>
        <div className="mv4">
          <Collapsible
            header={<span>Sales Channel</span>}
            onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
            isOpen={isCollapsibleOpen}
            caretColor="primary"
          >
            <div className="flex mv5">
              <div className="w-30 mr5">
                <Input label="Sales channel" value={salesChannel} />
              </div>
              <div className="w-30 mr5">
                <Input label="Currency" value={CurrencyCode} />
              </div>
              <div className="w-40 mr5">
                <Input label="Custom label" value={customLabel} />
              </div>
            </div>
            <Button
              variation="tertiary"
              size="small"
              block
              onClick={handleModalToggle}
            >
              Edit
            </Button>
          </Collapsible>
        </div>
      </div>
      <Modal centered isOpen={isModalOpen} onClose={handleModalToggle}>
        <h2>Available Sales Channels</h2>
        <EditSalesChannel />
      </Modal>
    </Fragment>
  )
}

export { BindingInfo }
