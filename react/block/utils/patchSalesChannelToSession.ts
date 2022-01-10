export const patchSalesChannelToSession = async (salesChannel: string) => {
  const myHeaders = new Headers()

  myHeaders.append('Content-Type', 'application/json')

  const sessionBody = JSON.stringify({
    public: {
      sc: {
        value: salesChannel,
      },
    },
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: sessionBody,
  }

  return fetch('/api/sessions', requestOptions)
}
