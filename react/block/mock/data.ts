export const salesChannelInfo = () => ({
  salesChannel: [
    {
      id: 1,
      name: 'España B2C',
      isActive: true,
      currencyCode: 'EUR - ESP',
      currencySymbol: '€',
    },
    {
      id: 2,
      name: 'B2B',
      isActive: true,
      currencyCode: 'EUR',
      currencySymbol: '€',
    },
    {
      id: 3,
      name: 'Global',
      isActive: true,
      currencyCode: 'EUR - GB',
      currencySymbol: '€',
    },
    {
      id: 4,
      name: 'South Africa',
      isActive: true,
      currencyCode: 'ZAR',
      currencySymbol: 'R',
    },
    {
      id: 5,
      name: 'Portugal',
      isActive: true,
      currencyCode: 'EUR - PT',
      currencySymbol: '€',
    },
    {
      id: 6,
      name: 'canarias',
      isActive: true,
      currencyCode: 'EUR',
      currencySymbol: '€',
    },
    {
      id: 7,
      name: 'Backup 1',
      isActive: false,
      currencyCode: 'BRL',
      currencySymbol: 'R$',
    },
    {
      id: 8,
      name: 'Backup 2',
      isActive: false,
      currencyCode: 'EUR',
      currencySymbol: '€',
    },
  ],
})

export const currencySelectorAdmin = () => ({
  currencySelectorAdminConfig: [
    {
      bindingId: '7cf38d3b-efa0-4d47-8201-d8b58cd4d3fd',
      salesChannelInfo: [
        {
          salesChannel: 1,
        },
        {
          salesChannel: 3,
        },
        {
          salesChannel: 5,
        },
      ],
    },
    {
      bindingId: 'e84d830f-8e31-4b38-97e4-87e2c3801929',
      salesChannelInfo: [
        {
          salesChannel: 4,
        },
      ],
    },
    {
      bindingId: 'bb2b7747-30d9-466e-9abe-2f90caf7150f',
      salesChannelInfo: [
        {
          salesChannel: 3,
        },
      ],
    },
    {
      bindingId: 'a9c6542d-f8a6-4f80-9465-e2de705d5e27',
      salesChannelInfo: [
        {
          salesChannel: 1,
        },
        {
          salesChannel: 3,
        },
        {
          salesChannel: 5,
        },
      ],
    },
  ],
})
