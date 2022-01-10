export const salesChannelInfo = () => ({
  salesChannel: [
    {
      Id: 1,
      Name: 'España B2C',
      IsActive: true,
      CurrencyCode: 'EUR - ESP',
      CurrencySymbol: '€',
    },
    {
      Id: 2,
      Name: 'B2B',
      IsActive: true,
      CurrencyCode: 'EUR',
      CurrencySymbol: '€',
    },
    {
      Id: 3,
      Name: 'Global',
      IsActive: true,
      CurrencyCode: 'EUR - GB',
      CurrencySymbol: '€',
    },
    {
      Id: 4,
      Name: 'South Africa',
      IsActive: true,
      CurrencyCode: 'ZAR',
      CurrencySymbol: 'R',
    },
    {
      Id: 5,
      Name: 'Portugal',
      IsActive: true,
      CurrencyCode: 'EUR - PT',
      CurrencySymbol: '€',
    },
    {
      Id: 6,
      Name: 'canarias',
      IsActive: true,
      CurrencyCode: 'EUR',
      CurrencySymbol: '€',
    },
    {
      Id: 7,
      Name: 'Backup 1',
      IsActive: false,
      CurrencyCode: 'BRL',
      CurrencySymbol: 'R$',
    },
    {
      Id: 8,
      Name: 'Backup 2',
      IsActive: false,
      CurrencyCode: 'EUR',
      CurrencySymbol: '€',
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
