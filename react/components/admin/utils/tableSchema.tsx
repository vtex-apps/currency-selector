import React from 'react'
import { FormattedMessage } from 'react-intl'

export const tableSchema = {
  properties: {
    salesChannel: {
      title: (
        <FormattedMessage id="admin/currency-selector.table-schema-sales-channel" />
      ),
    },
    currencySymbol: {
      title: (
        <FormattedMessage id="admin/currency-selector.table-schema-currency-symbol" />
      ),
    },
    currencyCode: {
      title: (
        <FormattedMessage id="admin/currency-selector.table-schema-currency-code" />
      ),
    },
    customLabel: {
      title: (
        <FormattedMessage id="admin/currency-selector.table-schema-custom-label" />
      ),
    },
  },
}
